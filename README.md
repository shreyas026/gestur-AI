# GesturAI - Sign Language Translation Application

A full-stack application that translates text to sign language videos using AI-powered gesture recognition and translation.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Features](#project-features)
- [API Documentation](#api-documentation)

## 🏗️ Project Structure

```
GesturAI/
├── server/                 # Node.js/Express backend
│   ├── config/            # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── videos/             # Sign language video library
│   ├── index.js            # Server entry point
│   └── package.json
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # Client utilities
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
│
├── package.json           # Root package.json (monorepo)
└── UPGRADE_GUIDE.md      # Upgrade documentation
```

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **AI:** Google Generative AI
- **File Upload:** Multer

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **3D Graphics:** Three.js
- **Video Player:** React Player

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB running locally or remote connection string

### Installation

1. **Clone and navigate to project:**
   ```bash
   cd GesturAI
   ```

2. **Install all dependencies:**
   ```bash
   npm install:all
   ```

3. **Configure environment:**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your settings:
   ```env
   MONGO_URI=mongodb://localhost:27017/gestuai
   PORT=5000
   NODE_ENV=development
   ADMIN_EMAILS=your@email.com
   GOOGLE_API_KEY=your_api_key
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```
   
   This runs both server (port 5000) and client (port 5173) concurrently.

### Alternative: Run Separately

**Terminal 1 - Server:**
```bash
npm run dev:server
```

**Terminal 2 - Client:**
```bash
npm run dev:client
```

## 💻 Development

### Available Scripts

**Root Level:**
- `npm run dev` - Run server and client concurrently
- `npm run dev:server` - Run server only
- `npm run dev:client` - Run client only
- `npm run build` - Build client for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint on client

**Server Only:**
- `npm run start` - Start production server
- `npm run dev` - Start with auto-reload (nodemon)

**Client Only:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project includes:
- ESLint configuration for JavaScript/React
- Input validation utilities
- Structured error handling
- Centralized logging

### File Organization

**Server Utilities:**
- `config/environment.js` - Environment variable management
- `utils/validation.js` - Input validation functions
- `utils/response.js` - Standardized API responses
- `utils/logger.js` - Application logging
- `middleware/rateLimiter.js` - Rate limiting
- `middleware/errorHandler.js` - Global error handling

**Client Utilities:**
- `utils/errorHandler.js` - API error handling
- `utils/apiClient.js` - Axios configuration
- `utils/storage.js` - Session and token management
- `utils/hooks.js` - Custom React hooks

## ✨ Project Features

### Authentication
- User registration with email validation
- Secure password hashing
- JWT token-based authentication
- Admin role support
- Session persistence

### Sign Language Translation
- Text-to-sign translation using AI
- Video search and retrieval
- Sign video database management
- Grammar processing
- Text normalization

### Admin Features
- User management
- Sign video uploads and management
- User analytics
- Admin summary dashboard

### Security
- Rate limiting (100 requests/15 minutes)
- Input sanitization and validation
- CORS enabled
- JWT authentication
- Error message sanitization

## 📡 API Documentation

### Authentication Endpoints

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Get Current User:**
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Translation Endpoints

**Search Signs:**
```bash
POST /api/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "sentence": "Hello, how are you?"
}
```

### Admin Endpoints

**Get Admin Summary:**
```bash
GET /api/admin/summary
Authorization: Bearer <token>
```

## 🔒 Security Notes

- Store sensitive credentials in `.env` file (never commit)
- Change `ADMIN_EMAILS` to your admin email addresses
- Use strong passwords (minimum 8 characters)
- Keep dependencies updated
- Review logs for security issues

## 📝 Logging

Application logs are stored in `server/logs/app.log` with:
- Timestamps
- Log levels (INFO, WARN, ERROR, DEBUG)
- Request context
- Error details

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity

**Port Already in Use:**
- Change `PORT` in `.env` (server)
- For client, Vite will use next available port

**CORS Errors:**
- Ensure client is on allowed origin
- Check CORS configuration in `server/index.js`

**Authentication Errors:**
- Clear browser storage: `localStorage.removeItem('gesturai_auth')`
- Verify token is being sent in Authorization header
- Check token expiration

## 📚 Additional Resources

- See [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) for recent improvements
- MongoDB documentation: https://docs.mongodb.com
- Express.js guide: https://expressjs.com
- React documentation: https://react.dev
- Vite documentation: https://vitejs.dev

## 👤 Development Team

GesturAI Project

## 📄 License

ISC

---

**Last Updated:** April 2026
