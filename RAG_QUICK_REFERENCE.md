# RAG Quick Reference Card

## 🚀 Get Started in 30 Seconds

### 1. Get Your Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -d '{"email":"your@email.com","password":"pass"}'
```

### 2. Test RAG Translation
```bash
curl -X POST http://localhost:5000/api/translate/rag \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, I am very happy!"}'
```

### 3. Check Stats
```bash
curl http://localhost:5000/api/translate/rag/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/translate/rag` | 🎯 RAG-powered translation |
| GET | `/api/translate/rag/stats` | 📊 View system statistics |
| POST | `/api/translate/rag/clear-cache` | 🔄 Refresh cache |
| POST | `/api/translate/compare` | 🔄 Compare standard vs RAG |

---

## 🎨 How RAG Works (Simple)

```
Text Input
    ↓
Detect Context (emotions, questions, food, family)
    ↓
Apply Grammar Rules (based on context)
    ↓
Filter Words (context-aware)
    ↓
Match with Sign Videos
    ↓
Return Results + Metadata
```

---

## 💡 Key Concepts

### **Confidence Score**
- 0.0-0.3: Low (fallback to standard)
- 0.3-0.6: Medium (helpful context)
- 0.6-1.0: High (very useful)

### **Match Rate**
- Percentage of words matched to videos
- Target: >60% is good

### **Detected Contexts**
- Food and Dining
- Family Relationships
- Questions
- Emotions

---

## 📝 Request/Response

### Request
```json
{
  "text": "Hello, what is your name?",
  "includeMetadata": true
}
```

### Response Keys
- `videos`: Array of matched sign videos
- `unmatchedWords`: Words without translations
- `ragMetadata.confidence`: How confident the system is (0-1)
- `ragMetadata.detectedContexts`: What the system understood
- `ragMetadata.matchRate`: % of words matched

---

## 🛠️ Common Tasks

### Add New Grammar Rule
Edit `server/rag/ragKnowledgeBase.js`:
```javascript
{
  id: "my-rule",
  rule: "Description",
  context: "When it applies",
  removableWords: ["word1"],
  keyWords: ["keyword"],
}
```

### Add New Sign Mapping
Edit `server/rag/ragKnowledgeBase.js`:
```javascript
{
  english: ["word"],
  sign: "SIGN_NAME",
  category: "category",
  priority: 1,
}
```

### Clear Cache
```bash
curl -X POST http://localhost:5000/api/translate/rag/clear-cache \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚠️ Common Issues

### Low Match Rate
→ Add more signs to database  
→ Add sign mappings  
→ Check for unusual words

### Low Confidence
→ Text may be out-of-domain  
→ Add contextual rules  
→ Check detected contexts

### Slow Performance
→ Clear cache: `POST /rag/clear-cache`  
→ Restart server  
→ Check memory usage

---

## 🔐 Authentication

All RAG endpoints need a JWT token:
```
Authorization: Bearer eyJhbGc...
```

Get token from `/api/auth/login`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| RAG_README.md | Complete guide |
| API_ENDPOINTS.md | Detailed API reference |
| IMPLEMENTATION_SUMMARY.md | What was added |
| This file | Quick reference |

---

## 🧪 Test It Now

**Emotion Example**:
```bash
curl -X POST http://localhost:5000/api/translate/rag \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I am very happy today!"}'
```

**Question Example**:
```bash
curl -X POST http://localhost:5000/api/translate/rag \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"What is your name?"}'
```

**Compare Examples**:
```bash
curl -X POST http://localhost:5000/api/translate/compare \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?"}'
```

---

## 🎯 Next Steps

1. Run test script: `server/rag/test-rag-endpoints.bat` (Windows)
2. Review documentation: `RAG_README.md`
3. Test endpoints with examples above
4. Integrate into frontend

---

**Bookmark this file!** 📌

---

**Files**: 5 new files + 2 modified  
**Status**: Ready to use ✅  
**Last Updated**: 2024
