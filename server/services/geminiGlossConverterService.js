/**
 * Gemini Gloss Converter Service
 * Converts semantic parse into ASL-appropriate gloss order
 * Gloss represents the sign sequence in ASL
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getEnv } = require("../config/environment");
const logger = require("../utils/logger");

const apiKey = getEnv("GEMINI_API_KEY", "");
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Model fallback chain: Try newer models first, fallback to gemini-pro
const MODEL_NAMES = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

let MODEL_NAME = "gemini-2.5-flash"; // Start with the latest

/**
 * Convert semantic parse to ASL gloss order
 * Returns array of sign tokens in proper ASL order
 */
async function convertToGloss(semanticParse) {
  if (!genAI || !apiKey) {
    logger.warn("Gemini API not configured, gloss conversion disabled");
    return null;
  }

  if (!semanticParse || !semanticParse.verb) {
    return null;
  }

  try {
    // Try to use the best available model
    let model;
    try {
      model = genAI.getGenerativeModel({ model: MODEL_NAME });
    } catch (error) {
      logger.warn(`Model ${MODEL_NAME} not available, trying fallback models`);
      // Try fallback models
      for (const fallbackModel of MODEL_NAMES) {
        try {
          model = genAI.getGenerativeModel({ model: fallbackModel });
          MODEL_NAME = fallbackModel;
          logger.info(`Using fallback model: ${fallbackModel}`);
          break;
        } catch (e) {
          continue;
        }
      }
      if (!model) {
        logger.error("No compatible Gemini models found");
        return null;
      }
    }

    // Build context from semantic parse
    const context = `
Semantic Analysis:
- Subject: ${semanticParse.subject || "(none)"}
- Verb: ${semanticParse.verb}
- Object: ${semanticParse.object || "(none)"}
- Tense: ${semanticParse.tense || "PRESENT"}
- Negation: ${semanticParse.negation ? "YES" : "NO"}
- Spatial Info: ${semanticParse.prepositionalPhrase || "(none)"}
    `.trim();

    const prompt = `You are an ASL (American Sign Language) linguistic expert.
Convert the following semantic analysis into an ASL gloss sequence.

${context}

Return ONLY a JSON object (no markdown, no extra text):
{
  "glossTokens": ["SIGN1", "SIGN2", "SIGN3", ...],
  "notes": "Brief explanation of ordering choices",
  "confidence": 0.0-1.0
}

ASL Grammar Principles to follow:
- Topic-Comment structure: important context/topics come early
- Subject can be dropped if understood from context
- Verb comes earlier than in English
- Object positioning may depend on spatial agreement
- Tense/aspect markers (PAST, FUTURE, CONTINUOUS) often come near the verb
- Negation typically follows the negated element
- Spatial information affects word order
- Use uppercase for sign names
- Only return glosses for ACTUAL SIGNS that exist in ASL (no invented signs)`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Try to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn(`Gemini gloss conversion did not return JSON: ${responseText.substring(0, 100)}`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed.glossTokens) || parsed.glossTokens.length === 0) {
      logger.warn("Gemini gloss conversion returned empty or invalid gloss");
      return null;
    }

    return {
      glossTokens: parsed.glossTokens.filter(Boolean),
      notes: parsed.notes || "",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5,
    };
  } catch (error) {
    logger.error(`Gemini gloss conversion error: ${error.message}`);
    return null;
  }
}

/**
 * Filter gloss tokens to keep only those that are reasonable
 */
function filterGlossTokens(glossTokens, maxLength = 20) {
  if (!Array.isArray(glossTokens)) {
    return [];
  }

  return glossTokens
    .filter((token) => {
      // Only keep reasonable-length tokens (actual sign names)
      const trimmed = String(token).trim();
      return trimmed.length > 0 && trimmed.length < 30;
    })
    .map((token) => String(token).toUpperCase())
    .slice(0, maxLength); // Prevent unreasonably long sequences
}

module.exports = {
  convertToGloss,
  filterGlossTokens,
};
