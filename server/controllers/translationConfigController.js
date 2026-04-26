/**
 * Translation Configuration Controller
 * Endpoints for managing translation service settings
 */

const {
  getConfig,
  updateConfig,
  setGeminiEnabled,
  isGeminiEnabled,
} = require("../services/translationConfig");
const logger = require("../utils/logger");

/**
 * Get current translation configuration
 */
async function getTranslationConfig(req, res) {
  try {
    const config = getConfig();
    res.json({
      success: true,
      config,
    });
  } catch (error) {
    logger.error(`Failed to get translation config: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve configuration",
    });
  }
}

/**
 * Update translation configuration
 */
async function updateTranslationConfig(req, res) {
  try {
    const updates = req.body || {};

    // Only allow updating specific fields
    const allowedFields = [
      "useGemini",
      "semanticParseMinConfidence",
      "glossConversionMinConfidence",
      "maxGlossLength",
      "fallbackOnLowConfidence",
      "logGeminiResponses",
    ];

    const filteredUpdates = {};
    for (const field of allowedFields) {
      if (field in updates) {
        filteredUpdates[field] = updates[field];
      }
    }

    updateConfig(filteredUpdates);

    logger.info(`Translation config updated: ${JSON.stringify(filteredUpdates)}`);

    res.json({
      success: true,
      message: "Configuration updated",
      config: getConfig(),
    });
  } catch (error) {
    logger.error(`Failed to update translation config: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to update configuration",
    });
  }
}

/**
 * Enable Gemini translation
 */
async function enableGemini(req, res) {
  try {
    setGeminiEnabled(true);
    logger.info("Gemini translation enabled");

    res.json({
      success: true,
      message: "Gemini translation enabled",
      geminiEnabled: isGeminiEnabled(),
    });
  } catch (error) {
    logger.error(`Failed to enable Gemini: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to enable Gemini",
    });
  }
}

/**
 * Disable Gemini translation
 */
async function disableGemini(req, res) {
  try {
    setGeminiEnabled(false);
    logger.info("Gemini translation disabled");

    res.json({
      success: true,
      message: "Gemini translation disabled",
      geminiEnabled: isGeminiEnabled(),
    });
  } catch (error) {
    logger.error(`Failed to disable Gemini: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to disable Gemini",
    });
  }
}

/**
 * Get Gemini translation status
 */
async function getGeminiStatus(req, res) {
  try {
    res.json({
      success: true,
      geminiEnabled: isGeminiEnabled(),
      config: getConfig(),
    });
  } catch (error) {
    logger.error(`Failed to get Gemini status: ${error.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve status",
    });
  }
}

module.exports = {
  getTranslationConfig,
  updateTranslationConfig,
  enableGemini,
  disableGemini,
  getGeminiStatus,
};
