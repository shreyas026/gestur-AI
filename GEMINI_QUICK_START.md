# Gemini Translation Quick Start

## Quick Setup

### 1. Ensure GEMINI_API_KEY is set in `.env`

```bash
cd server
cat .env | grep GEMINI_API_KEY
```

If not set:
```bash
echo "GEMINI_API_KEY=your-api-key-here" >> .env
```

### 2. Enable Gemini Translation

Via environment variable (on startup):
```bash
USE_GEMINI=true npm start
```

Or via API after startup:
```bash
curl -X POST http://localhost:5000/api/translation/gemini/enable
```

### 3. Test It Works

```bash
node server/test_gemini_translation.js --test "I like ice cream"
```

Expected output: Shows semantic parse and gloss conversion results.

## How It Works in 3 Steps

```
English Input
    ↓
1. Gemini analyzes grammar/meaning → semantic structure
    ↓
2. Gemini orders words for ASL → gloss sequence
    ↓
3. System matches gloss words to sign videos
    ↓
Sign Videos
```

## API Endpoints

### Check if Gemini is enabled
```bash
curl http://localhost:5000/api/translation/gemini/status
```

### Enable Gemini
```bash
curl -X POST http://localhost:5000/api/translation/gemini/enable
```

### Disable Gemini
```bash
curl -X POST http://localhost:5000/api/translation/gemini/disable
```

### Update configuration
```bash
curl -X PUT http://localhost:5000/api/translation/config \
  -H "Content-Type: application/json" \
  -d '{
    "useGemini": true,
    "semanticParseMinConfidence": 0.6,
    "maxGlossLength": 20
  }'
```

### Translate with Gemini (if enabled)
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"text": "I like ice cream"}'
```

Response will include `"method": "gemini"` if Gemini was used, or `"method": "rule-based"` if it fell back.

## Configuration Options

In `translationConfig.js` or via API:

```javascript
{
  useGemini: true,                          // Enable/disable Gemini
  semanticParseMinConfidence: 0.5,          // Confidence threshold for semantic parse
  glossConversionMinConfidence: 0.5,        // Confidence threshold for gloss
  maxGlossLength: 20,                       // Max number of signs in sequence
  fallbackOnLowConfidence: true,            // Fallback if confidence too low
  logGeminiResponses: false                 // Debug logging
}
```

## What Happens When It Works

Translation response includes extra fields:

```json
{
  "method": "gemini",
  "semanticParse": {
    "subject": "I",
    "verb": "like",
    "object": "ice cream",
    "tense": "PRESENT",
    "negation": false,
    "gloss": ["LIKE", "ICE-CREAM"],
    "confidence": 0.92
  },
  "glossResult": {
    "glossTokens": ["I", "LIKE", "ICE-CREAM"],
    "confidence": 0.85
  },
  "videos": [
    { "word": "I", "videoUrl": "/videos/i.mp4", "source": "gemini-gloss" },
    { "word": "like", "videoUrl": "/videos/like.mp4", "source": "gemini-gloss" },
    { "word": "ice cream", "videoUrl": "/videos/ice-cream.mp4", "source": "gemini-gloss" }
  ]
}
```

## What Happens When It Falls Back

If Gemini fails or is disabled, you get:

```json
{
  "method": "rule-based",
  "videos": [...],
  "unmatchedWords": []
}
```

No `semanticParse` or `glossResult` fields.

## Troubleshooting

### "No API Key found"
```bash
# Check .env has the key
grep GEMINI_API_KEY .env

# If not set:
echo "GEMINI_API_KEY=your-key-here" >> .env
```

### "Gemini: Request failed"
- Check API key is correct
- Verify Google account has generative API enabled
- Check API quota in Google Cloud Console

### "Falling back to rule-based"
- Check logs: `tail -f server/logs/*.log`
- Run test: `node server/test_gemini_translation.js --test "your sentence"`
- Enable debug logging: `LOG_GEMINI=true npm start`

### Disable Gemini if having issues
```bash
curl -X POST http://localhost:5000/api/translation/gemini/disable
```

Translation will continue working with rule-based system.

## Performance Notes

- **First request**: ~1-2 seconds (Gemini API call)
- **Subsequent requests**: Same (~1-2s per request, no caching yet)
- **Rule-based (fallback)**: <100ms

**Cost**: ~0.001-0.002 USD per translation (using Gemini 1.5 Flash pricing)

## Files Added/Modified

### New Files
- `server/services/geminiSemanticParserService.js` - Semantic parsing
- `server/services/geminiGlossConverterService.js` - Gloss conversion
- `server/services/translationConfig.js` - Configuration management
- `server/controllers/translationConfigController.js` - Config endpoints
- `server/routes/translationConfigRoute.js` - Config routes
- `server/test_gemini_translation.js` - Testing script
- `GEMINI_TRANSLATION.md` - Full documentation

### Modified Files
- `server/services/translationService.js` - Integrated Gemini pipeline
- `server/index.js` - Added translation config routes

## Next Steps

1. **Enable and test**: `node server/test_gemini_translation.js`
2. **Monitor performance**: Check response times and API costs
3. **Tune confidence thresholds**: Adjust if seeing too many fallbacks
4. **Add caching**: Cache semantic parses for common phrases
5. **Fine-tune prompts**: Improve Gemini prompts for better ASL output
