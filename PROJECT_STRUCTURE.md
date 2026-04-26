# GesturAI Project Structure

## 📁 Complete File Tree

```
GesturAI/
├── 📄 package.json                 ← Root monorepo config
├── 📄 README.md                    ← Project overview
├── 📄 CHANGELOG.md                 ← Version history
├── 📄 QUICK_REFERENCE.md           ← Developer quick reference
├── 📄 UPGRADE_GUIDE.md             ← New features documentation
├── 📄 CONTRIBUTING.md              ← Contribution guidelines
├── 📄 PROJECT_UPGRADE_SUMMARY.md   ← Complete upgrade summary
├── 📄 .gitignore                   ← Git ignore rules
├── 🔧 setup.sh                     ← macOS/Linux setup script
├── 🔧 setup.bat                    ← Windows setup script
│
├── 📦 server/
│   ├── 📄 package.json
│   ├── 📄 index.js                 ← Main server file (ENHANCED)
│   ├── 📄 .env.example             ← Environment template
│   │
│   ├── 📁 config/                  ← NEW: Configuration
│   │   └── environment.js          ← Environment validation
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js       ← Authentication (ENHANCED)
│   │   ├── signAdminController.js
│   │   └── translateController.js
│   │
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── rateLimiter.js          ← NEW: Rate limiting
│   │   └── errorHandler.js         ← NEW: Global error handler
│   │
│   ├── 📁 models/
│   │   ├── User.js
│   │   ├── Sign.js
│   │   └── SignVideo.js
│   │
│   ├── 📁 routes/
│   │   ├── authRoute.js
│   │   ├── signAdminRoute.js
│   │   └── translateRoute.js
│   │
│   ├── 📁 services/
│   │   ├── grammarService.js
│   │   ├── mappingService.js
│   │   └── translationService.js
│   │
│   ├── 📁 utils/
│   │   ├── authToken.js
│   │   ├── cleanText.js
│   │   ├── fallbackAlphabet.js
│   │   ├── normalizeText.js
│   │   ├── passwords.js
│   │   ├── validation.js           ← NEW: Input validation
│   │   ├── response.js             ← NEW: API responses
│   │   ├── logger.js               ← NEW: Structured logging
│   │
│   ├── 📁 logs/                    ← NEW: Logs directory
│   │   └── .gitkeep
│   │   └── app.log                 ← Generated at runtime
│   │
│   └── 📁 videos/                  ← Sign language videos
│       └── .gitkeep
│
├── 📦 client/
│   ├── 📄 package.json
│   ├── 📄 index.html
│   ├── 📄 vite.config.js
│   ├── 📄 eslint.config.js
│   │
│   ├── 📁 src/
│   │   ├── 📄 App.jsx              ← Main app component
│   │   ├── 📄 App.css
│   │   ├── 📄 main.jsx             ← Entry point
│   │   ├── 📄 index.css
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── Landing.jsx
│   │   │   ├── Landing.css
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.css
│   │   │   ├── Translator.jsx
│   │   │   ├── Translator.css
│   │   │   └── VideoSignPlayer.jsx
│   │   │
│   │   ├── 📁 utils/               ← NEW: Client utilities
│   │   │   ├── errorHandler.js     ← Error handling
│   │   │   ├── apiClient.js        ← Axios configuration
│   │   │   ├── storage.js          ← Session management
│   │   │   └── hooks.js            ← Custom React hooks
│   │   │
│   │   └── 📁 assets/
│   │       └── (images, etc.)
│   │
│   └── 📁 public/
│       └── (static files)
│
└── 📄 CON (possibly .gitignore or hidden file)
```

## 🔑 Key Directories

### Server Core
- **`/server`** - Node.js/Express backend
  - Entry point: `index.js`
  - Config: `config/environment.js`
  - Business logic: `controllers/`, `services/`
  - Data layer: `models/`
  - Utilities: `utils/`
  - Logging: `logs/` (created at runtime)

### Server Infrastructure
- **`/server/middleware`** - Express middleware
  - Authentication, file uploads, rate limiting, error handling
- **`/server/routes`** - API route definitions
- **`/server/utils`** - Helper functions (NEW utilities included)

### Client Application
- **`/client/src`** - React source code
  - Components: UI components with styling
  - Utils: API client, error handling, storage, hooks (NEW)
  - Assets: Images and static files
- **`/client/public`** - Static files served as-is

## 📊 Utility Modules

### New Server Utilities
```
server/
├── config/
│   └── environment.js           ← ENV validation
├── utils/
│   ├── validation.js            ← Input validators
│   ├── response.js              ← API responses
│   ├── logger.js                ← Structured logging
│   └── ... (existing utilities)
└── middleware/
    ├── rateLimiter.js           ← Rate limiting
    └── errorHandler.js          ← Error handling
```

### New Client Utilities
```
client/src/utils/
├── errorHandler.js              ← Error parsing
├── apiClient.js                 ← Axios setup
├── storage.js                   ← Session management
└── hooks.js                     ← Custom hooks
```

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Project overview and setup | Everyone |
| `QUICK_REFERENCE.md` | Common commands and patterns | Developers |
| `UPGRADE_GUIDE.md` | New features added | Team leads |
| `CHANGELOG.md` | Version history | Maintainers |
| `CONTRIBUTING.md` | Contribution guidelines | Contributors |
| `PROJECT_UPGRADE_SUMMARY.md` | Complete upgrade details | Stakeholders |
| `.env.example` | Environment template | Developers |

## 🔄 Data Flow

### Request Flow (Example: Login)
```
Client Browser
    ↓
React Component (LoginPage.jsx)
    ↓
API Client (utils/apiClient.js)
    ├→ Injects auth token (if exists)
    └→ Handles response/error
    ↓
POST /api/auth/login
    ↓
Express Server (index.js)
    ├→ Rate Limiter middleware
    ├→ CORS middleware
    └→ Body Parser
    ↓
Auth Route (routes/authRoute.js)
    ↓
Auth Controller (controllers/authController.js)
    ├→ Validate input (utils/validation.js)
    ├→ Check database (models/User.js)
    ├→ Hash password (utils/passwords.js)
    └→ Create token (utils/authToken.js)
    ↓
Response Utils (utils/response.js)
    ↓
Logger (utils/logger.js)
    ↓
JSON Response
    ↓
Error Handler (if error occurs)
    ↓
Client receives response
    ↓
Error Handler (utils/errorHandler.js)
    ↓
Notification Hook (hooks.js)
    ↓
UI Update
```

## 🔐 Security Layer

```
┌─────────────────────────────────────┐
│     Browser / Frontend              │
│  ┌───────────────────────────────┐  │
│  │  Error Handler                │  │
│  │  Auth Token Storage           │  │
│  │  Session Management           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────┐
│  API Client with Interceptors       │
│  ├─ Auto-inject tokens              │
│  └─ Parse errors                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Express Server                  │
│  ┌───────────────────────────────┐  │
│  │ CORS                          │  │
│  │ Rate Limiter (100/15min)      │  │
│  │ Body Parser                   │  │
│  └───────────────────────────────┘  │
│           ↓                          │
│  ┌───────────────────────────────┐  │
│  │ Authentication Middleware     │  │
│  │ ├─ Verify JWT token           │  │
│  │ └─ Extract user info          │  │
│  └───────────────────────────────┘  │
│           ↓                          │
│  ┌───────────────────────────────┐  │
│  │ Route Handler                 │  │
│  │ ├─ Validate input             │  │
│  │ ├─ Process request            │  │
│  │ └─ Generate response          │  │
│  └───────────────────────────────┘  │
│           ↓                          │
│  ┌───────────────────────────────┐  │
│  │ Error Handler (if error)      │  │
│  │ ├─ Log error                  │  │
│  │ └─ Return error response      │  │
│  └───────────────────────────────┘  │
│           ↓                          │
│  ┌───────────────────────────────┐  │
│  │ Logger                        │  │
│  │ ├─ File: logs/app.log         │  │
│  │ └─ Console (dev mode)         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        MongoDB                      │
│  ├─ Users                           │
│  ├─ Signs                           │
│  └─ SignVideos                      │
└─────────────────────────────────────┘
```

## 📦 Dependencies

### Server
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin requests
- **multer** - File uploads
- **dotenv** - Environment variables
- **@google/generative-ai** - AI integration
- **nodemon** (dev) - Auto-reload

### Client
- **react** - UI library
- **react-dom** - DOM rendering
- **axios** - HTTP client
- **react-player** - Video player
- **three** - 3D graphics
- **vite** (dev) - Build tool
- **eslint** (dev) - Code linting

## 🎯 Configuration Files

| File | Purpose |
|------|---------|
| `server/.env` | Server environment variables |
| `server/.env.example` | Server config template |
| `server/package.json` | Server dependencies |
| `client/package.json` | Client dependencies |
| `package.json` (root) | Monorepo configuration |
| `.gitignore` | Git ignore rules |
| `vite.config.js` | Client build config |
| `eslint.config.js` | Linting rules |

## 🔗 File Dependencies

```
index.js
├── config/environment.js
├── middleware/authMiddleware.js
├── middleware/rateLimiter.js
├── middleware/errorHandler.js
├── utils/logger.js
├── utils/response.js
├── routes/authRoute.js
├── routes/signAdminRoute.js
└── routes/translateRoute.js

authController.js
├── models/User.js
├── utils/passwords.js
├── utils/authToken.js
├── utils/validation.js
├── utils/response.js
└── utils/logger.js

apiClient.js (client)
├── utils/errorHandler.js
└── axios
```

---

**Project Structure Version:** 1.1.0  
**Last Updated:** April 20, 2026
