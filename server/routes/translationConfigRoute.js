/**
 * Translation Configuration Routes
 * Routes for managing translation service settings
 */

const express = require("express");
const {
  getTranslationConfig,
  updateTranslationConfig,
  enableGemini,
  disableGemini,
  getGeminiStatus,
} = require("../controllers/translationConfigController");

const router = express.Router();

/**
 * GET /api/translation/config
 * Get current translation configuration
 */
router.get("/config", getTranslationConfig);

/**
 * PUT /api/translation/config
 * Update translation configuration
 * Body: { useGemini, semanticParseMinConfidence, glossConversionMinConfidence, etc. }
 */
router.put("/config", updateTranslationConfig);

/**
 * POST /api/translation/gemini/enable
 * Enable Gemini translation
 */
router.post("/gemini/enable", enableGemini);

/**
 * POST /api/translation/gemini/disable
 * Disable Gemini translation
 */
router.post("/gemini/disable", disableGemini);

/**
 * GET /api/translation/gemini/status
 * Get Gemini translation status and configuration
 */
router.get("/gemini/status", getGeminiStatus);

module.exports = router;
