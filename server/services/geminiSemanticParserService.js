/**
 * Gemini Semantic Parser Service
 * Uses Gemini LLM to parse English text into structured semantic components
 * Returns: { subject, verb, object, tense, negation, gloss, confidence }
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
 * Parse English text into semantic components using Gemini
 */
async function parseSemantics(text) {
  if (!genAI || !apiKey) {
    logger.warn("Gemini API not configured, semantic parsing disabled");
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

    const prompt = `You are a linguistic expert specializing in American Sign Language (ASL) translation.
Parse the following English sentence into its semantic components for ASL translation.

Return ONLY a valid JSON object (no markdown, no extra text) with these exact fields:
{
  "subject": "the subject/agent (null if imperative or absent)",
  "verb": "the main action/state verb",
  "object": "the direct object (null if intransitive)",
  "tense": "PRESENT|PAST|FUTURE|HABITUAL|CONDITIONAL|null",
  "negation": true/false,
  "prepositionalPhrase": "any important spatial/prepositional info (null if none)",
  "gloss": ["word1", "word2", ...],
  "confidence": 0.0-1.0
}

English sentence: "${text}"

Important guidelines:
- For ASL, preserve word order that makes sense for signing
- Include spatial information if present
- Gloss should be in uppercase for signs, but your gloss here can be normal case
- If negation is present, mark it true
- Confidence reflects how certain you are about the parse`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn(`Gemini did not return valid JSON: ${responseText.substring(0, 100)}`);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!parsed.verb || !parsed.gloss || !Array.isArray(parsed.gloss)) {
      logger.warn("Gemini parse missing required fields");
      return null;
    }

    return parsed;
  } catch (error) {
    logger.error(`Gemini semantic parsing error: ${error.message}`);
    return null;
  }
}

/**
 * Clean and validate Gemini semantic parse
 */
function validateSemanticParse(parse) {
  if (!parse || typeof parse !== "object") {
    return null;
  }

  return {
    subject: parse.subject || null,
    verb: String(parse.verb).toLowerCase(),
    object: parse.object || null,
    tense: parse.tense || null,
    negation: Boolean(parse.negation),
    prepositionalPhrase: parse.prepositionalPhrase || null,
    gloss: Array.isArray(parse.gloss) ? parse.gloss.filter(Boolean) : [],
    confidence: typeof parse.confidence === "number" ? parse.confidence : 0.5,
  };
}

module.exports = {
  parseSemantics,
  validateSemanticParse,
};
