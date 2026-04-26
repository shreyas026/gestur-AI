/**
 * Enhanced Grammar Service using RAG
 * Improves upon the basic grammar conversion with context-aware word filtering
 */

const { getRagService } = require("./ragService");
const logger = require("../utils/logger");

/**
 * Enhanced grammar conversion using RAG
 * Returns filtered words while maintaining context through RAG guidance
 */
function convertGrammarWithRAG(words, inputText = "") {
  try {
    const ragService = getRagService();

    // Get RAG guidance
    const guidance = ragService.generateTranslationGuidance(inputText || words.join(" "));

    // Get suggested removable words from RAG
    const ragRemovableWords = new Set(guidance.suggestedRemovableWords);

    // Original removable words (fallback)
    const defaultRemovableWords = new Set([
      "a",
      "am",
      "an",
      "are",
      "at",
      "be",
      "for",
      "from",
      "i",
      "is",
      "me",
      "my",
      "of",
      "on",
      "our",
      "please",
      "the",
      "to",
      "was",
      "were",
    ]);

    // Combine RAG-enhanced and default removable words
    const allRemovableWords = new Set([...defaultRemovableWords, ...ragRemovableWords]);

    // Filter words
    const filtered = words.filter((word) => !allRemovableWords.has(word.toLowerCase()));

    logger.debug("Grammar conversion with RAG", {
      inputWords: words.length,
      outputWords: filtered.length,
      removedCount: words.length - filtered.length,
      ragConfidence: guidance.confidence,
      detectedContexts: guidance.contextualGuidance?.detectedContexts || [],
    });

    return filtered;
  } catch (error) {
    logger.error("Error in convertGrammarWithRAG", { error: error.message });
    // Fallback to basic filtering
    return words;
  }
}

/**
 * Get context-aware removable words
 */
function getContextAwareRemovableWords(text) {
  try {
    const ragService = getRagService();
    return ragService.getEnhancedRemovableWords(text);
  } catch (error) {
    logger.error("Error getting context-aware removable words", { error: error.message });
    return [];
  }
}

/**
 * Get translation guidance
 */
function getTranslationGuidance(text) {
  try {
    const ragService = getRagService();
    return ragService.generateTranslationGuidance(text);
  } catch (error) {
    logger.error("Error getting translation guidance", { error: error.message });
    return {
      relevantGrammarRules: [],
      relevantSignMappings: [],
      contextualGuidance: null,
      suggestedRemovableWords: [],
      confidence: 0,
    };
  }
}

/**
 * Get contextual rules for better understanding
 */
function getContextualInformation(text) {
  try {
    const ragService = getRagService();
    return ragService.getContextualGuidance(text);
  } catch (error) {
    logger.error("Error getting contextual information", { error: error.message });
    return null;
  }
}

module.exports = {
  convertGrammarWithRAG,
  getContextAwareRemovableWords,
  getTranslationGuidance,
  getContextualInformation,
};
