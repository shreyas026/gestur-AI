# Contributing to GesturAI

Thank you for your interest in contributing to GesturAI! This document provides guidelines and procedures for contributing to the project.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Commit Guidelines](#commit-guidelines)
5. [Creating Pull Requests](#creating-pull-requests)
6. [Testing](#testing)
7. [Documentation](#documentation)

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB (local or remote)
- Git

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd GesturAI
   ```

2. **Run setup script:**
   - **Windows:** `setup.bat`
   - **macOS/Linux:** `chmod +x setup.sh && ./setup.sh`

3. **Configure environment:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your settings
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming
Use descriptive branch names following this pattern:
```
feature/description       - New feature
fix/description          - Bug fix
docs/description         - Documentation
refactor/description     - Code refactoring
test/description         - Tests
```

Examples:
- `feature/user-dashboard`
- `fix/auth-token-expiry`
- `docs/api-endpoints`

### Creating a Feature

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow code standards (see below)
   - Write meaningful commit messages
   - Test your changes locally

3. **Run linting:**
   ```bash
   npm run lint
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: Add user dashboard feature"
   ```

5. **Push to remote:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** (see PR guidelines)

## 📝 Code Standards

### JavaScript/Node.js Style

1. **Naming Conventions:**
   ```javascript
   // Constants: UPPER_SNAKE_CASE
   const MAX_REQUESTS = 100;
   
   // Functions/Variables: camelCase
   function getUserData() {}
   const userData = {};
   
   // Classes: PascalCase
   class UserService {}
   
   // Private methods: _leadingUnderscore
   function _privateHelper() {}
   ```

2. **File Organization:**
   ```
   // Imports at top
   const express = require('express');
   
   // Constants
   const DEFAULT_TIMEOUT = 30000;
   
   // Helper functions
   function formatData(data) {}
   
   // Main logic
   async function handleRequest() {}
   
   // Exports at bottom
   module.exports = { handleRequest };
   ```

3. **Error Handling:**
   ```javascript
   // Always use try-catch for async operations
   try {
     const result = await database.query();
     sendSuccess(res, result, "Query completed");
   } catch (error) {
     logger.error("Query failed", { error: error.message });
     sendError(res, "Query failed");
   }
   ```

4. **Comments:**
   ```javascript
   // Use meaningful comments explaining WHY, not WHAT
   // Bad:
   count++;  // Increment count
   
   // Good:
   // Increment counter to track retry attempts
   retryCount++;
   ```

### React/Client Code

1. **Component Structure:**
   ```javascript
   import { useState } from 'react';
   import './ComponentName.css';
   
   function ComponentName({ prop1, prop2 }) {
     const [state, setState] = useState(null);
     
     const handleAction = () => {
       // Handle action
     };
     
     return (
       <div className="component">
         {/* JSX */}
       </div>
     );
   }
   
   export default ComponentName;
   ```

2. **Hooks Usage:**
   ```javascript
   // Use custom hooks from utils
   const { handleError } = useErrorHandler();
   const { showSuccess, showError } = useNotification();
   
   // Place hooks at top of component
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   ```

### Server Code

1. **Middleware Order (in index.js):**
   ```javascript
   // 1. Body parsing
   app.use(express.json());
   
   // 2. Security (CORS, rate limiting)
   app.use(cors());
   app.use(createRateLimiter());
   
   // 3. Static files
   app.use('/videos', express.static(...));
   
   // 4. Routes
   app.use('/api', routes);
   
   // 5. Error handling (last)
   app.use(errorHandler);
   ```

2. **Controller Pattern:**
   ```javascript
   async function handleRequest(req, res) {
     try {
       // 1. Validate input
       if (!isValidInput(req.body)) {
         return sendValidationError(res, "Invalid input");
       }
       
       // 2. Process business logic
       const result = await service.process(req.body);
       
       // 3. Send response
       sendSuccess(res, result, "Operation successful");
       
       // 4. Log if needed
       logger.info("Operation completed", { ...details });
     } catch (error) {
       logger.error("Operation failed", { error: error.message });
       sendError(res, "Operation failed");
     }
   }
   ```

## 📌 Commit Guidelines

Use conventional commit format:

```
type(scope): subject

body

footer
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Build, dependencies, etc.

### Examples

```bash
git commit -m "feat(auth): Add email verification"
git commit -m "fix(search): Handle empty query results"
git commit -m "docs(readme): Update installation steps"
git commit -m "refactor(utils): Extract validation logic"
```

## 🔀 Creating Pull Requests

### PR Checklist
- [ ] Branch is up-to-date with main
- [ ] Code follows project standards
- [ ] All tests pass (when applicable)
- [ ] No console errors or warnings
- [ ] Documentation is updated
- [ ] Commit messages are descriptive
- [ ] No sensitive data in commits

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe how you tested the changes

## Screenshots/Demo
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🧪 Testing

### Manual Testing Checklist

For API changes:
```bash
# Test endpoint
curl -X POST http://localhost:5000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Check error handling
# Verify response format
# Check logging output
```

For UI changes:
- Test in Chrome, Firefox, Safari, Edge
- Test on mobile viewport
- Test keyboard navigation
- Test error states

### Best Practices
- Test your changes before committing
- Test both success and error cases
- Include edge cases in testing
- Document any manual testing performed

## 📚 Documentation

### When to Document

1. **New Features** - Add to README.md or UPGRADE_GUIDE.md
2. **API Endpoints** - Document in README.md
3. **Complex Logic** - Add code comments
4. **Breaking Changes** - Update CHANGELOG.md
5. **Setup Changes** - Update setup scripts and guides

### Documentation Format

```markdown
## Feature Name

Description of the feature.

### Usage

```javascript
// Code example
```

### Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| option1 | value1  | Description |

### Troubleshooting

Common issues and solutions.
```

## 🔍 Code Review Process

### What Reviewers Look For
1. Code quality and standards compliance
2. Security considerations
3. Performance implications
4. Test coverage
5. Documentation completeness
6. Breaking changes

### Responding to Feedback
- Be open to suggestions
- Ask questions if unclear
- Make requested changes
- Mark conversations as resolved
- Request re-review when changes are made

## 📋 Common Tasks

### Adding a New API Endpoint

1. Create route: `server/routes/newRoute.js`
2. Create controller: `server/controllers/newController.js`
3. Add validation in controller using `utils/validation.js`
4. Use `sendSuccess()` and `sendError()` for responses
5. Add logging using `logger` from `utils/logger.js`
6. Mount route in `server/index.js`
7. Document in README.md
8. Update CHANGELOG.md

### Adding a New React Component

1. Create: `client/src/components/NewComponent.jsx`
2. Create styles: `client/src/components/NewComponent.css`
3. Use error handling: `useErrorHandler()` hook
4. Use API client: `apiClient` from `utils/apiClient.js`
5. Handle auth errors properly
6. Add to App.jsx
7. Document if user-facing
8. Update CHANGELOG.md

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Test thoroughly after updates
npm run lint
npm run dev
```

## 🚫 What Not to Do

- Don't commit `.env` files or secrets
- Don't use console.log (use logger instead)
- Don't ignore linting errors
- Don't make multiple unrelated changes in one PR
- Don't push directly to main branch
- Don't merge your own PRs
- Don't commit sensitive data
- Don't leave large console.errors without handling

## 📞 Getting Help

1. Check the documentation (README, UPGRADE_GUIDE, QUICK_REFERENCE)
2. Review relevant source files
3. Check GitHub issues for similar problems
4. Ask in PR comments or discussions
5. Review code examples in the codebase

## 🎯 Project Goals

- Provide accessible sign language translation
- Maintain high code quality
- Ensure security and performance
- Keep documentation up-to-date
- Foster a collaborative community

---

**Thank you for contributing to GesturAI! 🙌**
