/**
 * Translation Configuration
 * Controls behavior of translation services including Gemini features
 */

let config = {
  // Enable/disable Gemini semantic parsing and gloss conversion
  useGemini: process.env.USE_GEMINI === "true" ? true : false,

  // Minimum confidence threshold for Gemini semantic parse (0.0-1.0)
  semanticParseMinConfidence: 0.5,

  // Minimum confidence threshold for Gemini gloss conversion (0.0-1.0)
  glossConversionMinConfidence: 0.5,

  // Maximum length of generated gloss sequence
  maxGlossLength: 20,

  // Fallback to rule-based if Gemini confidence below threshold
  fallbackOnLowConfidence: true,

  // Log Gemini responses for debugging
  logGeminiResponses: process.env.LOG_GEMINI === "true" ? true : false,
};

/**
 * Update translation configuration
 */
function updateConfig(updates) {
  config = { ...config, ...updates };
}

/**
 * Get current configuration
 */
function getConfig() {
  return { ...config };
}

/**
 * Enable or disable Gemini translation
 */
function setGeminiEnabled(enabled) {
  config.useGemini = Boolean(enabled);
}

/**
 * Check if Gemini translation is enabled
 */
function isGeminiEnabled() {
  return config.useGemini;
}

module.exports = {
  updateConfig,
  getConfig,
  setGeminiEnabled,
  isGeminiEnabled,
};
