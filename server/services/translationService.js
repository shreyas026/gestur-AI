const SignVideo = require("../models/SignVideo");
const cleanText = require("../utils/cleanText");
const normalizeText = require("../utils/normalizeText");
const convertGrammar = require("./grammarService");
const { parseSemantics, validateSemanticParse } = require("./geminiSemanticParserService");
const { convertToGloss, filterGlossTokens } = require("./geminiGlossConverterService");
const { isGeminiEnabled, getConfig } = require("./translationConfig");
const logger = require("../utils/logger");

const { buildWordCandidates, buildPhraseCandidates } = convertGrammar;

const cache = {
  expiresAt: 0,
  byNormalizedKey: new Map(),
  maxPhraseLength: 1,
};

const CACHE_TTL_MS = 60 * 1000;

function invalidateSignCatalogCache() {
  cache.expiresAt = 0;
  cache.byNormalizedKey = new Map();
  cache.maxPhraseLength = 1;
}

function createSegment(doc, input, source) {
  return {
    input,
    matchedWord: doc.word,
    source,
    word: doc.word,
    videoUrl: doc.videoUrl,
  };
}

async function loadSignCatalog() {
  const now = Date.now();

  if (cache.expiresAt > now && cache.byNormalizedKey.size > 0) {
    return cache;
  }

  const signs = await SignVideo.find({}, { word: 1, videoUrl: 1, _id: 0 }).lean();
  const byNormalizedKey = new Map();
  let maxPhraseLength = 1;

  for (const sign of signs) {
    const normalizedKey = normalizeText(sign.word);

    if (!normalizedKey || byNormalizedKey.has(normalizedKey)) {
      continue;
    }

    byNormalizedKey.set(normalizedKey, sign);
    maxPhraseLength = Math.max(maxPhraseLength, normalizedKey.split(" ").length);
  }

  cache.byNormalizedKey = byNormalizedKey;
  cache.maxPhraseLength = maxPhraseLength;
  cache.expiresAt = now + CACHE_TTL_MS;

  return cache;
}

function findPhraseMatch(tokens, startIndex, catalog) {
  const longestWindow = Math.min(
    catalog.maxPhraseLength,
    tokens.length - startIndex,
  );

  for (let size = longestWindow; size >= 2; size -= 1) {
    const rawPhrase = tokens.slice(startIndex, startIndex + size).join(" ");

    for (const candidate of buildPhraseCandidates(rawPhrase)) {
      const match = catalog.byNormalizedKey.get(candidate);

      if (match) {
        return {
          doc: match,
          consumed: size,
          input: rawPhrase,
          source: candidate === rawPhrase ? "phrase" : "phrase-alias",
        };
      }
    }
  }

  return null;
}

function findWordMatch(word, catalog) {
  for (const candidate of buildWordCandidates(word)) {
    const match = catalog.byNormalizedKey.get(candidate);

    if (match) {
      return {
        doc: match,
        input: word,
        source: candidate === word ? "word" : "word-alias",
      };
    }
  }

  return null;
}

/**
 * Translate using Gemini semantic parsing + gloss conversion
 * Falls back to rule-based translation if Gemini fails
 */
async function translateWithGemini(text, catalog) {
  try {
    // Step 1: Semantic parsing with Gemini
    const rawParse = await parseSemantics(text);
    if (!rawParse) {
      logger.debug("Gemini semantic parse returned null, using fallback");
      return null;
    }

    const semanticParse = validateSemanticParse(rawParse);
    logger.info(`Semantic parse confidence: ${semanticParse.confidence}`);

    // Step 2: Gloss conversion with Gemini
    const glossResult = await convertToGloss(semanticParse);
    if (!glossResult) {
      logger.debug("Gemini gloss conversion returned null, using fallback");
      return null;
    }

    const gloss = filterGlossTokens(glossResult.glossTokens);
    logger.info(`Generated gloss: ${gloss.join(" ")}`);

    // Step 3: Map gloss tokens to sign videos using catalog
    const segments = [];
    for (const glossToken of gloss) {
      // Try to find exact match in catalog (case-insensitive)
      const normalizedGloss = normalizeText(glossToken);
      const match = catalog.byNormalizedKey.get(normalizedGloss);

      if (match) {
        segments.push({
          input: glossToken,
          matchedWord: match.word,
          source: "gemini-gloss",
          word: match.word,
          videoUrl: match.videoUrl,
        });
      } else {
        // Try word candidates (aliases, variants)
        const candidates = buildWordCandidates(glossToken);
        let found = false;

        for (const candidate of candidates) {
          const candidateMatch = catalog.byNormalizedKey.get(candidate);
          if (candidateMatch) {
            segments.push({
              input: glossToken,
              matchedWord: candidateMatch.word,
              source: "gemini-gloss-alias",
              word: candidateMatch.word,
              videoUrl: candidateMatch.videoUrl,
            });
            found = true;
            break;
          }
        }

        if (!found) {
          logger.debug(`Gloss token "${glossToken}" not found in catalog`);
        }
      }
    }

    if (segments.length === 0) {
      logger.debug("No gloss tokens matched in catalog, using fallback");
      return null;
    }

    return {
      segments,
      semanticParse,
      glossResult,
      method: "gemini",
    };
  } catch (error) {
    logger.error(`Gemini translation error: ${error.message}`);
    return null;
  }
}

async function translateToSignVideos(text) {
  const normalizedText = normalizeText(text);
  const tokens = cleanText(text);

  if (tokens.length === 0) {
    return {
      normalizedText,
      videos: [],
      segments: [],
      unmatchedWords: [],
      method: "empty",
    };
  }

  const catalog = await loadSignCatalog();

  // Try Gemini-based translation first if enabled
  if (isGeminiEnabled()) {
    const geminiResult = await translateWithGemini(text, catalog);
    if (geminiResult && geminiResult.segments.length > 0) {
      return {
        normalizedText,
        videos: geminiResult.segments.map(({ input, source, videoUrl, word }) => ({
          input,
          source,
          videoUrl,
          word,
        })),
        segments: geminiResult.segments,
        unmatchedWords: [],
        method: "gemini",
        semanticParse: geminiResult.semanticParse,
        glossResult: geminiResult.glossResult,
      };
    }
  }

  // Fallback to rule-based translation
  if (isGeminiEnabled()) {
    logger.info("Falling back to rule-based translation");
  }
  const segments = [];
  const unmatchedWords = [];
  let index = 0;

  while (index < tokens.length) {
    const phraseMatch = findPhraseMatch(tokens, index, catalog);

    if (phraseMatch) {
      segments.push(
        createSegment(phraseMatch.doc, phraseMatch.input, phraseMatch.source),
      );
      index += phraseMatch.consumed;
      continue;
    }

    const currentWord = tokens[index];
    const wordMatch = findWordMatch(currentWord, catalog);

    if (wordMatch) {
      segments.push(createSegment(wordMatch.doc, currentWord, wordMatch.source));
    } else {
      const filteredWord = convertGrammar([currentWord])[0];

      if (filteredWord) {
        unmatchedWords.push(currentWord);
      }
    }

    index += 1;
  }

  return {
    normalizedText,
    videos: segments.map(({ input, source, videoUrl, word }) => ({
      input,
      source,
      videoUrl,
      word,
    })),
    segments,
    unmatchedWords,
    method: "rule-based",
  };
}

module.exports = translateToSignVideos;
module.exports.invalidateSignCatalogCache = invalidateSignCatalogCache;
module.exports.translateWithGemini = translateWithGemini;
