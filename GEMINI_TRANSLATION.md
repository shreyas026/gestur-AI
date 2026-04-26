# Gemini Semantic Parsing & Gloss Conversion

This document describes the Gemini LLM integration for semantic parsing and gloss conversion in the GesturAI translation pipeline.

## Overview

The translation pipeline now supports **Gemini-powered semantic analysis** as an enhancement to the existing rule-based translation system:

### Three-Layer Architecture

1. **Semantic Parsing (Gemini)**: Parses English text into structured semantic components
   - Subject, verb, object, tense, negation, spatial info
   - Returns confidence scores for reliability tracking

2. **Gloss Conversion (Gemini)**: Converts semantic parse into ASL-appropriate word order
   - Follows ASL grammar principles (topic-comment structure)
   - Produces gloss tokens in proper signing sequence

3. **Catalog Matching (Deterministic)**: Maps gloss tokens to actual sign videos
   - Ensures only supported signs are used
   - Falls back gracefully if gloss token not in catalog

## How It Works

### Request Flow

```
English Text
    ↓
[Clean & Normalize]
    ↓
[Try Gemini Semantic Parsing]
    ├─→ If fails or low confidence, skip to fallback
    ↓ (success)
[Gemini Gloss Conversion]
    ├─→ If fails, skip to fallback
    ↓ (success)
[Map to Sign Catalog]
    ├─→ If no matches, skip to fallback
    ↓ (success)
[Return Gemini Result]
    
    (fallback)
    ↓
[Rule-Based Translation]
    ↓
[Return Rule-Based Result]
```

### Response Structure

```json
{
  "normalizedText": "the input normalized",
  "videos": [
    {
      "input": "SIGN",
      "source": "gemini-gloss",
      "videoUrl": "/videos/sign.mp4",
      "word": "sign"
    }
  ],
  "segments": [...],
  "unmatchedWords": [],
  "method": "gemini",
  "semanticParse": {
    "subject": "I",
    "verb": "like",
    "object": "you",
    "tense": "PRESENT",
    "negation": false,
    "gloss": ["LIKE", "YOU"],
    "confidence": 0.92
  },
  "glossResult": {
    "glossTokens": ["I", "LIKE", "YOU"],
    "notes": "ASL Topic-Comment: I leads as topic, then comment",
    "confidence": 0.85
  }
}
```

## Configuration

### Environment Variables

```bash
# Enable Gemini translation (default: false)
USE_GEMINI=true

# API Key for Google Generative AI
GEMINI_API_KEY=your-api-key-here

# Enable logging of Gemini responses
LOG_GEMINI=false
```

### Configuration Options

Update translation configuration via API or code:

```javascript
const { updateConfig } = require('./services/translationConfig');

updateConfig({
  useGemini: true,
  semanticParseMinConfidence: 0.6,  // 0.0-1.0
  glossConversionMinConfidence: 0.5, // 0.0-1.0
  maxGlossLength: 20,
  fallbackOnLowConfidence: true,
  logGeminiResponses: false
});
```

## API Endpoints

### Translation Config Management

#### Get Current Configuration
```
GET /api/translation/config
```

Response:
```json
{
  "success": true,
  "config": {
    "useGemini": false,
    "semanticParseMinConfidence": 0.5,
    "glossConversionMinConfidence": 0.5,
    "maxGlossLength": 20,
    "fallbackOnLowConfidence": true,
    "logGeminiResponses": false
  }
}
```

#### Update Configuration
```
PUT /api/translation/config
Content-Type: application/json

{
  "useGemini": true,
  "semanticParseMinConfidence": 0.6
}
```

#### Enable Gemini
```
POST /api/translation/gemini/enable
```

#### Disable Gemini
```
POST /api/translation/gemini/disable
```

#### Get Gemini Status
```
GET /api/translation/gemini/status
```

## Implementation Details

### Service Files

#### `geminiSemanticParserService.js`
- `parseSemantics(text)`: Calls Gemini for semantic analysis
- `validateSemanticParse(parse)`: Validates and cleans Gemini response
- Uses `gemini-1.5-flash` model for fast, cost-effective parsing
- Error handling with detailed logging

#### `geminiGlossConverterService.js`
- `convertToGloss(semanticParse)`: Converts parse to ASL gloss order
- `filterGlossTokens(glossTokens)`: Sanitizes gloss output
- Follows ASL grammar principles
- Prevents invented/unsupported signs

#### `translationService.js`
- `translateWithGemini(text, catalog)`: Orchestrates Gemini pipeline
- Integrates with existing sign catalog matching
- Graceful fallback to rule-based system
- Adds `method` field to response indicating translation source

#### `translationConfig.js`
- Configuration management for all translation settings
- `getConfig()`, `updateConfig()`, `setGeminiEnabled()`, `isGeminiEnabled()`

### Error Handling

All Gemini calls include comprehensive error handling:
- Network failures → fallback to rule-based
- Invalid JSON responses → fallback to rule-based
- Low confidence scores → optional fallback
- Missing catalog matches → graceful degradation
- API key not configured → disables Gemini transparently

## Usage Examples

### Enable and Use Gemini

```javascript
const { setGeminiEnabled } = require('./services/translationConfig');
const translateToSignVideos = require('./services/translationService');

// Enable Gemini
setGeminiEnabled(true);

// Use translation (will try Gemini first)
const result = await translateToSignVideos("I like ice cream");
console.log(result.method); // "gemini" or "rule-based"
console.log(result.semanticParse);
console.log(result.glossResult);
```

### API Request with Gemini

```bash
# Enable Gemini
curl -X POST http://localhost:5000/api/translation/gemini/enable

# Check status
curl http://localhost:5000/api/translation/gemini/status

# Translate (will use Gemini if enabled)
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"text": "I like ice cream"}'
```

## Model Information

### Gemini 1.5 Flash
- **Cost**: Significantly cheaper than other models
- **Speed**: Very fast responses
- **Use Cases**: Perfect for semantic parsing and gloss generation
- **Token Limits**: 1 million input, 8k output
- **Latency**: ~500ms-2s per request

## Performance Considerations

### Costs
- Semantic parse + gloss conversion ≈ 1-2 API calls per translation
- Caching semantic parses for identical input can reduce costs
- Rule-based fallback has zero API costs

### Latency
- Gemini adds ~1-2s per request when enabled
- Consider async processing for real-time applications
- Rule-based translation is <100ms for comparison

### Scaling
- Use environment variable or config endpoint to disable Gemini if rate-limited
- Implement caching layer for frequently requested phrases
- Monitor API quotas through Google Cloud Console

## Troubleshooting

### Gemini Not Working

1. **Check API Key**
   ```bash
   echo $GEMINI_API_KEY
   node server/check_models.js
   ```

2. **Enable Logging**
   ```bash
   LOG_GEMINI=true node server/index.js
   ```

3. **Check Logs**
   - Look for "Gemini semantic parsing error" or "Gemini gloss conversion error"
   - Verify API key has generative API enabled

4. **Fallback to Rule-Based**
   ```bash
   # Disable Gemini
   curl -X POST http://localhost:5000/api/translation/gemini/disable
   ```

### Low Confidence Scores

If semantic parses have low confidence (<0.5):
- May indicate ambiguous or complex English
- Enable fallback: `fallbackOnLowConfidence: true`
- Or increase threshold: `semanticParseMinConfidence: 0.7`

### Missing Sign Videos

If gloss tokens don't map to catalog:
- Check sign catalog has all expected signs
- Use `/api/admin/signs?q=SIGN_NAME` to verify
- Add missing signs to database

## Future Enhancements

1. **Caching**: Cache semantic parses and gloss results
2. **Fine-tuning**: Use ASL-specific training data
3. **Confidence-based Ranking**: Provide multiple translation options
4. **User Feedback Loop**: Learn from user corrections
5. **Batch Processing**: Process multiple sentences efficiently

## References

- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [ASL Linguistics](https://en.wikipedia.org/wiki/American_Sign_Language)
