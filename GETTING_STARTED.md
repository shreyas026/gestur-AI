# 🚀 GesturAI Getting Started Checklist

## ✅ Installation & Setup

### Step 1: Environment Setup (2 minutes)
- [ ] **Windows Users:** Run `setup.bat` in project root
- [ ] **macOS/Linux Users:** Run `chmod +x setup.sh && ./setup.sh`
- [ ] Wait for installation to complete
- [ ] Confirm all dependencies installed successfully

### Step 2: Configure Environment (3 minutes)
- [ ] Navigate to `server/` directory
- [ ] Copy `.env.example` to `.env` (setup script does this)
- [ ] Edit `server/.env` with your settings:
  - [ ] Set `MONGO_URI` to your MongoDB connection string
  - [ ] Set `ADMIN_EMAILS` to your email (comma-separated for multiple)
  - [ ] (Optional) Add `GOOGLE_API_KEY` for AI features
- [ ] Save the `.env` file

### Step 3: Verify MongoDB (2 minutes)
- [ ] Start MongoDB service (if running locally)
- [ ] Test connection: `mongosh` (if installed)
- [ ] Verify connection string is correct in `.env`

### Step 4: Start Development (1 minute)
- [ ] Open terminal in project root
- [ ] Run: `npm run dev`
- [ ] Wait for both servers to start:
  ```
  Server running on port 5000
  VITE v... ready in ... ms
  ```
- [ ] Open browser: `http://localhost:5173`

### Step 5: Test Application (3 minutes)
- [ ] View landing page
- [ ] Navigate to login
- [ ] Create a test account
- [ ] Login with test account
- [ ] Check browser console for errors
- [ ] Check `server/logs/app.log` for server logs

## 📋 First-Time Developer Tasks

### Understand the Architecture (10 minutes)
- [ ] Read `README.md` - Project overview
- [ ] Read `PROJECT_STRUCTURE.md` - File organization
- [ ] Review `UPGRADE_GUIDE.md` - New features
- [ ] Skim `CHANGELOG.md` - Recent changes

### Explore the Codebase (15 minutes)
- [ ] Server entry: `server/index.js`
- [ ] Client entry: `client/src/main.jsx`
- [ ] API routes: `server/routes/`
- [ ] React components: `client/src/components/`
- [ ] Utilities: `server/utils/` and `client/src/utils/`

### Test an API Endpoint (5 minutes)
- [ ] Open Postman or similar tool
- [ ] Create new request: `POST http://localhost:5000/api/auth/register`
- [ ] Add headers: `Content-Type: application/json`
- [ ] Add body:
    ```json
    {
      "name": "Test User",
      "email": "test@example.com",
      "password": "testPassword123"
    }
    ```
- [ ] Send request
- [ ] Verify response format: `{ success: true, message: "...", data: {...} }`
- [ ] Save token for next requests

### Make Your First Change (10 minutes)
- [ ] Open `client/src/components/Landing.jsx`
- [ ] Make a small text change (e.g., change a heading)
- [ ] Save file
- [ ] Check that hot reload works
- [ ] Verify change in browser
- [ ] Understand the change detection

### Check the Logs (5 minutes)
- [ ] Make an API request
- [ ] Check `server/logs/app.log` for the request log
- [ ] Understand the log format: `[timestamp] [level] message`
- [ ] Check browser console for any client logs

## 🔧 Common Developer Tasks

### Running Services

**Both Server & Client:**
```bash
npm run dev
```

**Server Only:**
```bash
npm run dev:server
```

**Client Only:**
```bash
npm run dev:client
```

**Production Build:**
```bash
npm run build
```

### Checking Code Quality

**Lint Check (Client):**
```bash
npm run lint
```

**View Logs:**
```bash
# Real-time
tail -f server/logs/app.log

# Last 100 lines
tail -100 server/logs/app.log

# Errors only
grep "ERROR" server/logs/app.log
```

### Testing API Endpoints

**Using curl (Terminal):**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**Using Postman:**
1. Set base URL: `http://localhost:5000`
2. Create collection for API endpoints
3. Set up Authorization tab with Bearer token
4. Test each endpoint

## 📚 Documentation Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| `README.md` | Project overview | 10 min |
| `QUICK_REFERENCE.md` | Developer reference | 5 min |
| `PROJECT_STRUCTURE.md` | File organization | 8 min |
| `UPGRADE_GUIDE.md` | New features | 10 min |
| `CONTRIBUTING.md` | Contribution guide | 15 min |
| `CHANGELOG.md` | Version history | 5 min |

**Total reading time for all docs:** ~50 minutes

## 🐛 Troubleshooting Quick Fixes

### Issue: "Cannot connect to MongoDB"
```
Solution:
1. Check MONGO_URI in server/.env
2. Ensure MongoDB is running
3. Test with: mongosh
4. Restart both servers
```

### Issue: "Port 5000 already in use"
```
Solution:
1. Change PORT in server/.env to 5001
2. Or kill process: lsof -i :5000 (macOS/Linux)
3. Or use Task Manager (Windows)
4. Restart server
```

### Issue: "Hot reload not working"
```
Solution:
1. Check console for errors
2. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Restart dev server: npm run dev
4. Clear browser cache
```

### Issue: "Auth errors or 401 responses"
```
Solution:
1. Clear localStorage: localStorage.clear()
2. Refresh page
3. Re-login to get new token
4. Check server logs for details
```

### Issue: "Rate limit (429) responses"
```
Solution:
1. Default limit: 100 requests per 15 minutes
2. Wait 15 minutes for limit to reset
3. Or restart server to reset in-memory counter
4. Adjust limit in server/middleware/rateLimiter.js if needed
```

## ✨ Pro Tips

### Debugging Tips
1. **Check logs first:** `tail -f server/logs/app.log`
2. **Use browser DevTools:** Network tab for API calls
3. **Search codebase:** Use Ctrl+Shift+F to find code
4. **Use console.log carefully:** Consider using logger.debug()
5. **Check git status:** `git status` before making changes

### Code Quality
1. **Follow naming conventions:** CamelCase for functions, snake_case for variables
2. **Add comments:** Explain WHY not WHAT
3. **Test changes:** Verify endpoints work before committing
4. **Keep commits small:** One feature per commit
5. **Review code:** Read related files before implementing

### Performance
1. **Monitor logs:** Check for slow operations
2. **Use React DevTools:** Check component renders
3. **Check network:** Monitor API response times
4. **Avoid console.log in production:** Use logger instead
5. **Test with real data:** Not just minimal examples

## 🎯 Next Steps After Setup

1. **Understand the current architecture** (30 minutes)
   - Read project documentation
   - Explore file structure
   - Review existing components

2. **Test the application** (15 minutes)
   - Create an account
   - Test login/logout
   - Test API endpoints
   - Check logs

3. **Read contribution guidelines** (15 minutes)
   - Review `CONTRIBUTING.md`
   - Understand code standards
   - Learn commit conventions
   - Check PR process

4. **Make a small contribution** (30 minutes)
   - Find a small issue or improvement
   - Create a feature branch
   - Implement the change
   - Test thoroughly
   - Create a pull request

5. **Set up your environment** (30 minutes)
   - Configure IDE extensions
   - Set up code formatting (Prettier)
   - Configure ESLint
   - Set up debugging

## 📞 Getting Help

### Documentation (First Check Here)
- General questions → `README.md`
- Quick commands → `QUICK_REFERENCE.md`
- Project layout → `PROJECT_STRUCTURE.md`
- New features → `UPGRADE_GUIDE.md`
- How to contribute → `CONTRIBUTING.md`

### Code Investigation (Second Check)
- Search code: Ctrl+Shift+F
- Look at related files
- Check git history: `git log -p filename`
- Review function implementation

### Debugging (Third Check)
- Check `server/logs/app.log`
- Browser console (F12)
- Network tab in DevTools
- Server terminal output

### Ask for Help (Last Resort)
- GitHub Issues
- Team chat/slack
- Code review comments
- Pull request discussions

---

## 📊 Setup Progress Checklist

### Pre-Setup
- [ ] Node.js and npm installed
- [ ] MongoDB available
- [ ] Git installed and configured
- [ ] Code editor (VS Code, etc.) ready

### During Setup
- [ ] Run setup script
- [ ] Dependencies installed
- [ ] .env file created and configured
- [ ] MongoDB connection tested

### Post-Setup
- [ ] Both servers running
- [ ] Application accessible at localhost:5173
- [ ] Can create and login to account
- [ ] No errors in console or logs

### Developer Ready
- [ ] Documentation read
- [ ] Code structure understood
- [ ] First API endpoint tested
- [ ] Code standards understood
- [ ] Ready to contribute!

---

**Setup Estimated Time:** 15-20 minutes  
**Total Time to Contributing:** 45-60 minutes  
**Current Status:** 🟢 Ready to Develop

For detailed help, see the documentation files in the project root.
