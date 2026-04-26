/**
 * RAG Translation Controller
 * Handles RAG-powered translation requests with enhanced context awareness
 */

const { translateToSignVideosWithRAG, getRAGStats, clearRAGCache } = require("../rag/ragTranslationService");
const { sendSuccess, sendValidationError, sendError } = require("../utils/response");
const logger = require("../utils/logger");

/**
 * Translate text using RAG-enhanced service
 * POST /api/translate/rag
 */
async function ragTranslateText(req, res) {
  try {
    const { text, sentence, includeMetadata = true } = req.body;
    const inputText = text || sentence || "";

    if (!inputText || inputText.trim().length === 0) {
      return sendValidationError(res, "Text is required");
    }

    const payload = await translateToSignVideosWithRAG(inputText, includeMetadata);
    sendSuccess(res, payload, "RAG translation completed successfully");
  } catch (error) {
    logger.error("RAG translation endpoint error", { error: error.message });
    sendError(res, "RAG translation failed", 500, "RAG_ERROR");
  }
}

/**
 * Get RAG service statistics and status
 * GET /api/translate/rag/stats
 */
function getRAGServiceStats(req, res) {
  try {
    const stats = getRAGStats();
    sendSuccess(res, stats, "RAG service statistics retrieved successfully");
  } catch (error) {
    logger.error("Error getting RAG stats", { error: error.message });
    sendError(res, "Failed to retrieve RAG statistics", 500, "RAG_STATS_ERROR");
  }
}

/**
 * Clear RAG cache and refresh knowledge base
 * POST /api/translate/rag/clear-cache
 * Requires authentication
 */
function clearRAGCacheEndpoint(req, res) {
  try {
    // Check if user is admin (optional, depends on your auth setup)
    clearRAGCache();
    logger.info("RAG cache cleared by user", { userId: req.user?.id });
    sendSuccess(res, { cleared: true }, "RAG cache cleared successfully");
  } catch (error) {
    logger.error("Error clearing RAG cache", { error: error.message });
    sendError(res, "Failed to clear RAG cache", 500, "CACHE_CLEAR_ERROR");
  }
}

/**
 * Compare standard vs RAG translation
 * POST /api/translate/compare
 */
async function compareTranslations(req, res) {
  try {
    const { text, sentence } = req.body;
    const inputText = text || sentence || "";

    if (!inputText || inputText.trim().length === 0) {
      return sendValidationError(res, "Text is required");
    }

    // Import standard translation service
    const standardTranslate = require("../services/translationService");

    // Get both translations
    const [standardResult, ragResult] = await Promise.all([
      standardTranslate(inputText),
      translateToSignVideosWithRAG(inputText, true),
    ]);

    const comparison = {
      inputText,
      standard: {
        videoCount: standardResult.videos?.length || 0,
        unmatchedWords: standardResult.unmatchedWords?.length || 0,
        matchRate: standardResult.videos?.length / (standardResult.videos?.length + standardResult.unmatchedWords?.length) || 0,
      },
      rag: {
        videoCount: ragResult.videos?.length || 0,
        unmatchedWords: ragResult.unmatchedWords?.length || 0,
        matchRate: ragResult.ragMetadata?.matchRate || 0,
        confidence: ragResult.ragMetadata?.confidence || 0,
        detectedContexts: ragResult.ragMetadata?.contextualGuidance?.detectedContexts || [],
      },
      improvement: {
        additionalVideos: Math.max(0, ragResult.videos?.length - (standardResult.videos?.length || 0)),
        reducedUnmatched: Math.max(0, (standardResult.unmatchedWords?.length || 0) - ragResult.unmatchedWords?.length),
      },
    };

    sendSuccess(res, comparison, "Translation comparison completed");
  } catch (error) {
    logger.error("Error comparing translations", { error: error.message });
    sendError(res, "Failed to compare translations", 500, "COMPARE_ERROR");
  }
}

module.exports = {
  ragTranslateText,
  getRAGServiceStats,
  clearRAGCacheEndpoint,
  compareTranslations,
};
