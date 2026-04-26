# GesturAI Quick Reference

## 🚀 Quick Start (Windows)
```bash
# One-time setup
setup.bat

# Then run in terminal:
cd GesturAI
npm run dev
```

## 🚀 Quick Start (macOS/Linux)
```bash
# One-time setup
chmod +x setup.sh
./setup.sh

# Then run in terminal:
cd GesturAI
npm run dev
```

## 📁 Project Structure Quick Guide

### Server (`/server`)
```
controllers/     ← Business logic (auth, translations, admin)
middleware/      ← Express middleware (auth, errors, rate limit)
models/          ← MongoDB schemas (User, Sign, SignVideo)
routes/          ← API endpoints
services/        ← Complex operations (translation, grammar)
utils/           ← Helper functions (validation, response, logging)
config/          ← Configuration (environment variables)
```

**Key Files:**
- `index.js` - Main server file
- `controllers/authController.js` - Authentication logic
- `middleware/authMiddleware.js` - Token verification
- `utils/logger.js` - Application logging

### Client (`/client`)
```
components/      ← React components (Landing, Login, Translator)
utils/           ← Client utilities (API, errors, hooks)
App.jsx          ← Main component
main.jsx         ← Entry point
```

**Key Files:**
- `utils/apiClient.js` - Axios setup with interceptors
- `utils/errorHandler.js` - Error handling utilities
- `utils/storage.js` - Session management
- `utils/hooks.js` - Custom React hooks

## 📝 Common Commands

### Development
```bash
npm run dev              # Run server + client
npm run dev:server       # Run server only
npm run dev:client       # Run client only
npm run build            # Build client for production
npm run start            # Start production server
npm run lint             # Check for linting errors
```

### Installation
```bash
npm install:all          # Install all dependencies
cd server && npm install # Install server deps
cd client && npm install # Install client deps
```

## 🔌 API Quick Reference

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Sign in
GET    /api/auth/me           - Get current user
```

**Example Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Search & Translation
```
POST   /api/search           - Translate text to sign videos
```

**Example Search:**
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sentence": "Hello world"}'
```

### Admin
```
GET    /api/admin/summary    - Get admin dashboard info
```

## 🔑 Environment Variables (server/.env)

```env
MONGO_URI=mongodb://localhost:27017/gestuai      # MongoDB connection
PORT=5000                                         # Server port
NODE_ENV=development                              # Environment
ADMIN_EMAILS=your@email.com                       # Admin emails (comma-separated)
GOOGLE_API_KEY=your_api_key                       # Google Generative AI key
```

## 🧪 Testing API Locally

### Using curl:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/me
```

### Using Postman:
1. Set base URL: `http://localhost:5000`
2. Create request → POST → `/api/auth/register`
3. Add JSON body with name, email, password
4. Send and save token from response
5. Use token in Authorization header for protected routes

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { /* response data */ }
}
```

### Error Response:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Error description"
}
```

## 🐛 Debugging Tips

### Check Server Logs
```bash
# View real-time logs
tail -f server/logs/app.log

# Check for errors
grep "ERROR" server/logs/app.log
```

### Browser DevTools
- **Network tab** - Check API requests and responses
- **Console** - Look for JavaScript errors
- **Application** - View localStorage/sessionStorage for tokens
- **Redux DevTools** - (if Redux is added later)

### Common Issues

| Issue | Solution |
|-------|----------|
| Cannot connect to MongoDB | Check MONGO_URI, ensure MongoDB is running |
| Port already in use | Change PORT in .env or kill process |
| Authentication errors | Clear localStorage, check token format |
| CORS errors | Verify client origin in CORS config |
| Rate limit (429) | Wait 15 minutes or restart server |

## 📚 File Organization Best Practices

### Adding a New API Endpoint
1. Create route in `routes/` (e.g., `routes/newRoute.js`)
2. Create controller in `controllers/` (e.g., `controllers/newController.js`)
3. Add middleware if needed in `middleware/`
4. Use `sendSuccess()` and `sendError()` from `utils/response.js`
5. Log important events using `logger` from `utils/logger.js`
6. Validate inputs using `utils/validation.js`
7. Mount route in `index.js`

### Adding a New React Component
1. Create file in `components/` (e.g., `NewComponent.jsx`)
2. Create corresponding CSS (e.g., `NewComponent.css`)
3. Use `useErrorHandler()` and `useNotification()` hooks for feedback
4. Use `apiClient` from `utils/apiClient.js` for API calls
5. Handle errors with `parseApiError()` from `utils/errorHandler.js`

## 🔒 Security Checklist

- [ ] `.env` file exists and is in `.gitignore`
- [ ] Passwords validated (minimum 8 characters)
- [ ] Emails validated before use
- [ ] Rate limiting enabled
- [ ] Auth tokens in secure headers
- [ ] No sensitive data in error messages
- [ ] CORS properly configured
- [ ] Input sanitization on all endpoints
- [ ] Logs don't contain sensitive information

## 📞 Getting Help

1. Check [README.md](./README.md) for project overview
2. Check [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) for new features
3. Review error logs: `server/logs/app.log`
4. Check browser console for client-side errors
5. Review relevant source files for context

---
**Version:** 1.0.0 (April 2026)
