/**
 * RAG-Enhanced Translation Service
 * Extends the base translation service with RAG-powered improvements
 */

const SignVideo = require("../models/SignVideo");
const cleanText = require("../utils/cleanText");
const normalizeText = require("../utils/normalizeText");
const { convertGrammarWithRAG, getTranslationGuidance } = require("./enhancedGrammarService");
const { getRagService } = require("./ragService");
const logger = require("../utils/logger");

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

    // Try to find in catalog
    const normalizedPhrase = normalizeText(rawPhrase);
    const match = catalog.byNormalizedKey.get(normalizedPhrase);

    if (match) {
      return {
        doc: match,
        consumed: size,
        input: rawPhrase,
        source: "phrase",
      };
    }
  }

  return null;
}

function findWordMatch(word, catalog) {
  const normalizedWord = normalizeText(word);
  const match = catalog.byNormalizedKey.get(normalizedWord);

  if (match) {
    return {
      doc: match,
      input: word,
      source: "word",
    };
  }

  return null;
}

/**
 * RAG-powered translation with enhanced grammar and context awareness
 */
async function translateToSignVideosWithRAG(text, includeGuidance = true) {
  try {
    const normalizedText = normalizeText(text);
    let tokens = cleanText(text);

    if (tokens.length === 0) {
      return {
        normalizedText,
        videos: [],
        segments: [],
        unmatchedWords: [],
        ragMetadata: includeGuidance ? getTranslationGuidance(text) : null,
      };
    }

    // Get RAG guidance for grammar enhancement
    const guidance = getTranslationGuidance(text);

    // Apply RAG-enhanced grammar conversion
    tokens = convertGrammarWithRAG(tokens, text);

    if (tokens.length === 0) {
      return {
        normalizedText,
        videos: [],
        segments: [],
        unmatchedWords: [],
        ragMetadata: includeGuidance ? guidance : null,
      };
    }

    const catalog = await loadSignCatalog();
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
        unmatchedWords.push(currentWord);
      }

      index += 1;
    }

    const result = {
      normalizedText,
      videos: segments.map(({ input, source, videoUrl, word }) => ({
        input,
        source,
        url: videoUrl,
      })),
      segments,
      unmatchedWords,
    };

    // Include RAG metadata if requested
    if (includeGuidance) {
      result.ragMetadata = {
        ...guidance,
        tokenCount: tokens.length,
        matchedCount: segments.length,
        matchRate: segments.length / tokens.length,
      };
    }

    logger.info("RAG translation completed", {
      inputLength: text.length,
      tokenCount: tokens.length,
      matchedCount: segments.length,
      ragConfidence: guidance.confidence,
    });

    return result;
  } catch (error) {
    logger.error("Error in RAG translation", { error: error.message });

    // Fallback: return basic error response
    return {
      normalizedText: normalizeText(text),
      videos: [],
      segments: [],
      unmatchedWords: cleanText(text),
      error: "RAG translation failed, returning empty result",
      ragMetadata: null,
    };
  }
}

/**
 * Get RAG service stats
 */
function getRAGStats() {
  const ragService = getRagService();
  return ragService.getStats();
}

/**
 * Clear RAG cache
 */
function clearRAGCache() {
  getRagService().clearCache();
  invalidateSignCatalogCache();
}

module.exports = {
  translateToSignVideosWithRAG,
  getRAGStats,
  clearRAGCache,
  invalidateSignCatalogCache,
};
