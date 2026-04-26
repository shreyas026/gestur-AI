# RAG API Endpoints Reference

## Base URL
```
http://localhost:5000/api/translate
```

## Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Standard Translation (Existing)

### Endpoint
```
POST /api/translate
```

### Request
```json
{
  "text": "Hello, what is your name?"
}
```

### Response
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "normalizedText": "hello what is your name",
    "videos": [
      {
        "input": "hello",
        "source": "word",
        "url": "/videos/hello.mp4"
      },
      {
        "input": "what",
        "source": "word",
        "url": "/videos/what.mp4"
      },
      {
        "input": "name",
        "source": "word",
        "url": "/videos/name.mp4"
      }
    ],
    "segments": [...],
    "unmatchedWords": ["your"]
  }
}
```

---

## 2. RAG-Enhanced Translation

### Endpoint
```
POST /api/translate/rag
```

### Request
```json
{
  "text": "Hello, what is your name?",
  "includeMetadata": true
}
```

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to translate |
| sentence | string | No | Alternative to `text` |
| includeMetadata | boolean | No | Include RAG metadata in response (default: true) |

### Response
```json
{
  "success": true,
  "message": "RAG translation completed successfully",
  "data": {
    "normalizedText": "hello what is your name",
    "videos": [
      {
        "input": "hello",
        "source": "word",
        "url": "/videos/hello.mp4"
      },
      {
        "input": "what",
        "source": "word",
        "url": "/videos/what.mp4"
      },
      {
        "input": "name",
        "source": "word",
        "url": "/videos/name.mp4"
      }
    ],
    "unmatchedWords": ["your"],
    "ragMetadata": {
      "relevantGrammarRules": [
        {
          "type": "grammar",
          "id": "questions",
          "content": "Questions are indicated through facial expressions..."
        }
      ],
      "relevantSignMappings": [
        {
          "type": "mapping",
          "id": "what",
          "content": "English: what. Sign: WHAT. Category: question"
        }
      ],
      "contextualGuidance": {
        "detectedContexts": ["Questions"],
        "rules": [...],
        "removeWords": ["is", "your"],
        "keepWords": ["what", "name"]
      },
      "suggestedRemovableWords": ["is", "your", "the", "a"],
      "confidence": 0.82,
      "tokenCount": 6,
      "matchedCount": 3,
      "matchRate": 0.5
    }
  }
}
```

---

## 3. Get RAG Statistics

### Endpoint
```
GET /api/translate/rag/stats
```

### Response
```json
{
  "success": true,
  "message": "RAG service statistics retrieved successfully",
  "data": {
    "totalDocuments": 65,
    "grammarRules": 8,
    "signMappings": 23,
    "contextualRules": 4,
    "cachedVectors": 45
  }
}
```

### Statistics Explanation
- **totalDocuments**: All documents in the knowledge base
- **grammarRules**: Grammar rules available
- **signMappings**: Pre-mapped sign translations
- **contextualRules**: Context-specific rules
- **cachedVectors**: Cached embeddings in memory

---

## 4. Clear RAG Cache

### Endpoint
```
POST /api/translate/rag/clear-cache
```

### Response
```json
{
  "success": true,
  "message": "RAG cache cleared successfully",
  "data": {
    "cleared": true
  }
}
```

### When to Use
- After adding new grammar rules
- To reset embeddings cache
- If system is slowing down
- Daily maintenance on production

---

## 5. Compare Translations

### Endpoint
```
POST /api/translate/compare
```

### Request
```json
{
  "text": "I am very happy today!",
  "sentence": "optional alternative field"
}
```

### Response
```json
{
  "success": true,
  "message": "Translation comparison completed",
  "data": {
    "inputText": "I am very happy today!",
    "standard": {
      "videoCount": 2,
      "unmatchedWords": 3,
      "matchRate": 0.4
    },
    "rag": {
      "videoCount": 3,
      "unmatchedWords": 2,
      "matchRate": 0.6,
      "confidence": 0.75,
      "detectedContexts": ["Emotions"]
    },
    "improvement": {
      "additionalVideos": 1,
      "reducedUnmatched": 1
    }
  }
}
```

### What This Shows
- **videoCount**: Number of videos found
- **unmatchedWords**: Words without translations
- **matchRate**: Percentage of successful matches
- **confidence**: RAG system's confidence level
- **detectedContexts**: What RAG understood about the text
- **improvement**: How much RAG improved over standard

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Text is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "No authentication token provided"
}
```

### 500 Server Error
```json
{
  "success": false,
  "code": "ERROR",
  "message": "RAG translation failed",
  "details": "Optional error details"
}
```

---

## cURL Examples

### Standard Translation
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Hello world"}'
```

### RAG Translation
```bash
curl -X POST http://localhost:5000/api/translate/rag \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text":"Hello, I am very happy today!",
    "includeMetadata":true
  }'
```

### Get Stats
```bash
curl -X GET http://localhost:5000/api/translate/rag/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Clear Cache
```bash
curl -X POST http://localhost:5000/api/translate/rag/clear-cache \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Compare
```bash
curl -X POST http://localhost:5000/api/translate/compare \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"What is your name?"}'
```

---

## Rate Limiting

All endpoints are subject to rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Header**: `X-RateLimit-Remaining` shows remaining requests

---

## Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Endpoint not found |
| 500 | Server Error | Internal error |

---

## Integration Example

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/translate';

async function translateWithRAG(text, token) {
  try {
    const response = await axios.post(
      `${API_BASE}/rag`,
      { text, includeMetadata: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Translation error:', error.response?.data);
  }
}

// Usage
const result = await translateWithRAG('Hello, what is your name?', 'YOUR_TOKEN');
console.log('Videos:', result.videos);
console.log('Confidence:', result.ragMetadata.confidence);
```

### React/Frontend
```javascript
// Use with fetch API
const translateText = async (text, token) => {
  const response = await fetch('/api/translate/rag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text, includeMetadata: true })
  });
  return response.json();
};

// In component
const [result, setResult] = useState(null);
const handleTranslate = async () => {
  const data = await translateText(inputText, authToken);
  setResult(data.data);
};
```

---

## Best Practices

1. **Always include `includeMetadata: true`** for debugging and understanding RAG decisions
2. **Check `confidence` score** before displaying results to users
3. **Monitor `unmatchedWords`** to improve knowledge base
4. **Clear cache daily** on production systems
5. **Use comparison endpoint** to validate RAG improvements
6. **Fallback to standard** if RAG confidence < 0.3
7. **Log confidence scores** to track RAG performance over time

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial RAG implementation |

---

**Last Updated**: 2024  
**Maintained by**: GesturAI Team
