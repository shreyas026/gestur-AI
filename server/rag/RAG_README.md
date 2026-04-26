# 🤖 RAG-Powered AI Integration Guide

## Overview

This document explains the RAG (Retrieval-Augmented Generation) system integrated into GesturAI for enhanced sign language translation with better context awareness and grammar conversion.

## 🎯 What is RAG?

**RAG (Retrieval-Augmented Generation)** combines two approaches:
1. **Retrieval**: Fetches relevant knowledge from a knowledge base based on semantic similarity
2. **Augmentation**: Uses retrieved context to improve AI decision-making

In GesturAI, RAG improves translation by:
- Understanding context from sentences (food/dining, emotions, questions, families, etc.)
- Applying context-specific grammar rules
- Better word filtering based on situational awareness
- Suggesting relevant sign mappings

## 📁 Architecture

```
server/
├── rag/                                    # RAG System Module
│   ├── ragKnowledgeBase.js                # Grammar rules & knowledge
│   ├── ragService.js                      # Core RAG engine
│   ├── enhancedGrammarService.js          # RAG-enhanced grammar conversion
│   └── ragTranslationService.js           # RAG-enhanced translation
│
├── controllers/
│   ├── translateController.js             # Standard translation
│   └── ragTranslateController.js          # NEW: RAG translation endpoints
│
├── routes/
│   └── translateRoute.js                  # UPDATED: Added RAG endpoints
│
└── utils/
    └── response.js                        # Standard API responses
```

## 🚀 Quick Start

### 1. Access RAG Endpoints

All RAG endpoints require authentication. Use your JWT token in the `Authorization` header.

#### Translate with RAG
```bash
POST /api/translate/rag
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "text": "Hello, I am very happy today!",
  "includeMetadata": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "RAG translation completed successfully",
  "data": {
    "normalizedText": "hello i am very happy today",
    "videos": [
      {
        "input": "hello",
        "source": "word",
        "url": "/videos/hello.mp4"
      },
      {
        "input": "happy",
        "source": "word",
        "url": "/videos/happy.mp4"
      }
    ],
    "unmatchedWords": ["very"],
    "ragMetadata": {
      "relevantGrammarRules": [...],
      "relevantSignMappings": [...],
      "contextualGuidance": {
        "detectedContexts": ["Emotions"],
        "rules": [...]
      },
      "suggestedRemovableWords": ["am", "very"],
      "confidence": 0.75,
      "tokenCount": 6,
      "matchedCount": 2,
      "matchRate": 0.33
    }
  }
}
```

#### Get RAG Statistics
```bash
GET /api/translate/rag/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDocuments": 65,
    "grammarRules": 8,
    "signMappings": 23,
    "contextualRules": 4,
    "cachedVectors": 45
  }
}
```

#### Clear RAG Cache
```bash
POST /api/translate/rag/clear-cache
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Compare Translations
```bash
POST /api/translate/compare
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "text": "What is your name?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "inputText": "What is your name?",
    "standard": {
      "videoCount": 2,
      "unmatchedWords": 3,
      "matchRate": 0.4
    },
    "rag": {
      "videoCount": 3,
      "unmatchedWords": 2,
      "matchRate": 0.6,
      "confidence": 0.82,
      "detectedContexts": ["Questions"]
    },
    "improvement": {
      "additionalVideos": 1,
      "reducedUnmatched": 1
    }
  }
}
```

## 📚 Knowledge Base

The RAG system includes a comprehensive knowledge base with:

### Grammar Rules (8 rules)
1. **Subject-Verb-Object Order**: Basic sentence structure
2. **Pronouns**: Directional verb pointing
3. **Tense Markers**: Time-based tense indication
4. **Adjectives**: Placement rules
5. **Articles**: Removal guidelines
6. **Prepositions**: Spatial expressions
7. **Questions**: Interrogative structures
8. **Intensifiers**: Emphasis through repetition

### Sign Mappings (23+ entries)
Pre-mapped sign language signs for common words:
- Greetings: hello, goodbye
- Politeness: please, thank you
- Basic concepts: yes, no, what, how, when, where, why

### Contextual Rules (4 contexts)
1. **Food and Dining**: Restaurant, cooking, eating vocabulary
2. **Family Relationships**: Family terms and relationships
3. **Questions**: Question-specific grammar rules
4. **Emotions**: Emotional expressions and intensity

## 🔧 How RAG Works

### Step 1: Text Input
```
Input: "Hello, I am very happy today!"
```

### Step 2: Context Detection
RAG analyzes the text and detects relevant contexts:
```
Detected Contexts: ["Emotions"]
Suggested Removable Words: ["am", "very", "the", "i"]
```

### Step 3: Grammar Enhancement
Enhanced grammar service filters words using RAG-detected context:
```
Original Tokens: ["hello", "i", "am", "very", "happy", "today"]
Filtered Tokens: ["hello", "happy", "today"]
```

### Step 4: Video Matching
Match filtered tokens with sign videos in database:
```
Matched Videos:
  - "hello" → /videos/hello.mp4
  - "happy" → /videos/happy.mp4
  - "today" → /videos/today.mp4 (if exists)
```

### Step 5: Return Results
Return matched videos plus RAG metadata showing context and confidence:
```json
{
  "videos": [...],
  "ragMetadata": {
    "confidence": 0.75,
    "detectedContexts": ["Emotions"],
    "matchRate": 0.5
  }
}
```

## 🎨 Extending the Knowledge Base

### Add New Grammar Rules

Edit `server/rag/ragKnowledgeBase.js`:

```javascript
const grammarRules = [
  // ... existing rules
  {
    id: "your-rule-id",
    rule: "Description of the rule",
    context: "When this rule applies",
    removableWords: ["word1", "word2"],
    keyWords: ["keyword1", "keyword2"],
  },
];
```

### Add New Sign Mappings

Edit `server/rag/ragKnowledgeBase.js`:

```javascript
const signMappings = [
  // ... existing mappings
  {
    english: ["word1", "synonym1"],
    sign: "SIGN_NAME",
    category: "category_name",
    priority: 1,
  },
];
```

### Add New Contextual Rules

Edit `server/rag/ragKnowledgeBase.js`:

```javascript
const contextualRules = [
  // ... existing rules
  {
    context: "Context name",
    removeWords: ["word1", "word2"],
    keepWords: ["essential1", "essential2"],
    rules: ["Rule 1", "Rule 2"],
  },
];
```

## 📊 Understanding Metadata

### Confidence Score
- **0.0 - 0.3**: Low confidence, fallback to standard translation
- **0.3 - 0.6**: Moderate confidence, RAG provides helpful context
- **0.6 - 1.0**: High confidence, RAG significantly improves translation

### Match Rate
- **Calculation**: `matchedCount / totalTokens`
- **Interpretation**: Percentage of input words matched to sign videos
- **Target**: Aim for > 60% match rate for good translations

### Detected Contexts
List of contexts identified in the input text. Use this to:
- Understand what context the system detected
- Debug why certain rules were applied
- Verify contextual awareness

## 🔐 Authentication

All RAG endpoints require JWT authentication:

```javascript
// Authorization header format
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

To get a token:
1. Register via `/api/auth/signup`
2. Login via `/api/auth/login`
3. Use returned token in subsequent requests

## 📈 Performance Considerations

### Vector Caching
- RAG service caches computed embeddings
- Reduces computation for repeated queries
- Clear with `POST /api/translate/rag/clear-cache`

### Sign Catalog Caching
- Sign database is cached for 60 seconds
- Cache auto-refreshes when expired
- Manually refresh with `/api/translate/rag/clear-cache`

### Optimization Tips
1. **Batch requests**: Send multiple translations together
2. **Monitor cache stats**: Check `/api/translate/rag/stats`
3. **Clear cache periodically**: If running 24/7, clear daily
4. **Use standard endpoint**: For simple single-word translations

## 🚀 Advanced: Custom Embeddings

The current implementation uses simple hash-based embeddings. For production, integrate real embeddings:

### Option 1: OpenAI Embeddings (Paid)
```javascript
// Future: Replace ragService.js with:
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Option 2: HuggingFace Embeddings (Free)
```javascript
// Future: Replace ragService.js with:
const { HuggingFaceInferenceAPIEmbeddings } = require("langchain/embeddings/hf");

const embeddings = new HuggingFaceInferenceAPIEmbeddings({
  apiKey: process.env.HUGGING_FACE_API_KEY,
});
```

### Option 3: Self-Hosted Vector DB
```javascript
// Future: Integrate with:
// - Pinecone (cloud vector database)
// - Weaviate (self-hosted or cloud)
// - Milvus (self-hosted)
```

## 🐛 Troubleshooting

### Low Match Rate
**Problem**: Video matching rate below 40%

**Solutions**:
1. Add more signs to `SignVideo` database
2. Add more sign mappings to `ragKnowledgeBase.js`
3. Check if input text contains uncommon words
4. Review `unmatchedWords` array in response

### Low Confidence Score
**Problem**: Confidence < 0.3

**Solutions**:
1. Ensure text matches one of detected contexts
2. Add relevant contextual rules
3. Consider the input may be out-of-domain
4. Switch to standard translation for unknown domains

### Memory Issues
**Problem**: "Cannot allocate memory" or slowdown

**Solutions**:
1. Clear RAG cache: `POST /api/translate/rag/clear-cache`
2. Reduce `RAG_RETRIEVAL_TOP_K` in `.env`
3. Restart server: `npm run dev`
4. Monitor cache size in stats endpoint

## 📚 Related Files

- [README.md](../README.md) - Project overview
- [GETTING_STARTED.md](../GETTING_STARTED.md) - Setup guide
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - File organization

## 🤝 Contributing

To contribute improvements to the RAG system:

1. Test changes locally
2. Update knowledge base with new rules
3. Document new endpoints
4. Submit PR with examples

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review RAG service logs in `server/logs/app.log`
3. Test endpoints using provided curl examples
4. Open an issue with detailed error message

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
