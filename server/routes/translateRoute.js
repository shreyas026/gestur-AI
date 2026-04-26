const express = require("express");

const router = express.Router();
const translateText = require("../controllers/translateController");
const {
  ragTranslateText,
  getRAGServiceStats,
  clearRAGCacheEndpoint,
  compareTranslations,
} = require("../controllers/ragTranslateController");
const { requireAuth } = require("../middleware/authMiddleware");

// Standard translation endpoint
router.post("/translate", requireAuth, translateText);

// RAG-powered translation endpoints
router.post("/translate/rag", requireAuth, ragTranslateText);
router.get("/translate/rag/stats", requireAuth, getRAGServiceStats);
router.post("/translate/rag/clear-cache", requireAuth, clearRAGCacheEndpoint);

// Comparison endpoint
router.post("/translate/compare", requireAuth, compareTranslations);

module.exports = router;
