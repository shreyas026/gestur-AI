/**
 * RAG Service - Retrieves relevant context from knowledge base
 * Uses vector embeddings to find semantically similar documents
 */

const { getAllDocuments, getContextualRulesFor, getRemovableWordsFromRules } = require("./ragKnowledgeBase");
const logger = require("../utils/logger");

class RAGService {
  constructor() {
    this.documents = getAllDocuments();
    this.vectorCache = new Map();
  }

  /**
   * Simple embedding simulation using word frequency and semantic hashing
   * In production, replace with actual embeddings API (OpenAI, HuggingFace, etc.)
   */
  getSimpleEmbedding(text) {
    const cacheKey = text.toLowerCase();
    if (this.vectorCache.has(cacheKey)) {
      return this.vectorCache.get(cacheKey);
    }

    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(300).fill(0);

    // Create a simple vector based on word hashing
    for (const word of words) {
      const hash = this.hashCode(word);
      const baseIndex = Math.abs(hash) % 300;
      // Distribute hash values across the vector
      for (let i = 0; i < 10; i++) {
        embedding[(baseIndex + i) % 300] += 1 / (i + 1);
      }
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, x) => sum + x * x, 0));
    const normalized = magnitude > 0 ? embedding.map((x) => x / magnitude) : embedding;

    this.vectorCache.set(cacheKey, normalized);
    return normalized;
  }

  /**
   * Simple hash function for word embedding
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < Math.min(vec1.length, vec2.length); i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }

    const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  /**
   * Retrieve relevant documents using semantic similarity
   */
  retrieveRelevantDocuments(query, topK = 5) {
    try {
      const queryVector = this.getSimpleEmbedding(query);

      const docScores = this.documents.map((doc) => ({
        doc,
        score: this.cosineSimilarity(queryVector, this.getSimpleEmbedding(doc.content)),
      }));

      // Also boost score based on exact keyword matches
      const queryWords = query.toLowerCase().split(/\s+/);
      docScores.forEach((item) => {
        const docWords = item.doc.content.toLowerCase();
        const matches = queryWords.filter((word) => docWords.includes(word)).length;
        item.score += matches * 0.1; // Boost for keyword matches
      });

      return docScores
        .sort((a, b) => b.score - a.score)
        .filter((item) => item.score > 0.1) // Filter low relevance
        .slice(0, topK)
        .map((item) => item.doc);
    } catch (error) {
      logger.error("Error retrieving documents", { error: error.message });
      return [];
    }
  }

  /**
   * Get contextual guidance for translation
   */
  getContextualGuidance(text) {
    try {
      // Detect context from text
      const contexts = [
        { keyword: "food|eat|drink|hungry|cook|meal|restaurant", context: "Food and dining" },
        { keyword: "mother|father|sister|brother|family|parent", context: "Family relationships" },
        {
          keyword: "what|when|where|why|how|who|question",
          context: "Questions",
        },
        {
          keyword: "happy|sad|angry|surprised|excited|love|hate",
          context: "Emotions",
        },
      ];

      const detectedContexts = [];
      for (const { keyword, context } of contexts) {
        const regex = new RegExp(keyword, "i");
        if (regex.test(text)) {
          detectedContexts.push(context);
        }
      }

      if (detectedContexts.length === 0) {
        return null;
      }

      // Get rules for detected contexts
      const rules = detectedContexts.flatMap((ctx) => getContextualRulesFor(ctx));

      return {
        detectedContexts,
        rules,
        removeWords: [...new Set(rules.flatMap((r) => r.removeWords))],
        keepWords: [...new Set(rules.flatMap((r) => r.keepWords))],
      };
    } catch (error) {
      logger.error("Error getting contextual guidance", { error: error.message });
      return null;
    }
  }

  /**
   * Get enhanced removable words based on text context
   */
  getEnhancedRemovableWords(text) {
    try {
      const keywords = text.toLowerCase().split(/\s+/);
      const baseRemovableWords = getRemovableWordsFromRules(keywords);

      // Get contextual removable words
      const contextual = this.getContextualGuidance(text);
      if (contextual) {
        return [...new Set([...baseRemovableWords, ...contextual.removeWords])];
      }

      return baseRemovableWords;
    } catch (error) {
      logger.error("Error getting enhanced removable words", { error: error.message });
      return [];
    }
  }

  /**
   * Generate RAG-enhanced translation guidance
   */
  generateTranslationGuidance(text) {
    try {
      const relevantDocs = this.retrieveRelevantDocuments(text, 3);
      const contextualGuidance = this.getContextualGuidance(text);
      const removableWords = this.getEnhancedRemovableWords(text);

      return {
        relevantGrammarRules: relevantDocs.filter((d) => d.type === "grammar"),
        relevantSignMappings: relevantDocs.filter((d) => d.type === "mapping"),
        contextualGuidance,
        suggestedRemovableWords: removableWords,
        confidence: relevantDocs.length > 0 ? Math.min(1, relevantDocs[0].score || 0.5) : 0.3,
      };
    } catch (error) {
      logger.error("Error generating translation guidance", { error: error.message });
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
   * Clear vector cache (useful for memory management)
   */
  clearCache() {
    this.vectorCache.clear();
  }

  /**
   * Get RAG statistics
   */
  getStats() {
    return {
      totalDocuments: this.documents.length,
      grammarRules: this.documents.filter((d) => d.type === "grammar").length,
      signMappings: this.documents.filter((d) => d.type === "mapping").length,
      contextualRules: this.documents.filter((d) => d.type === "contextual").length,
      cachedVectors: this.vectorCache.size,
    };
  }
}

// Singleton instance
let ragServiceInstance = null;

function getRagService() {
  if (!ragServiceInstance) {
    ragServiceInstance = new RAGService();
  }
  return ragServiceInstance;
}

module.exports = {
  RAGService,
  getRagService,
};
