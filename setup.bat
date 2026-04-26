@echo off
REM GesturAI Development Setup Script for Windows
REM Run this script to set up the development environment

echo.
echo 🚀 GesturAI Development Setup
echo ================================
echo.

REM Check Node.js
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✓ Node.js version: %NODE_VER%

REM Check npm
echo Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm is not installed.
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
echo ✓ npm version: %NPM_VER%

REM Install root dependencies
echo.
echo 📦 Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to install root dependencies
    exit /b 1
)

REM Install server dependencies
echo.
echo 📦 Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to install server dependencies
    cd ..
    exit /b 1
)
cd ..

REM Install client dependencies
echo.
echo 📦 Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to install client dependencies
    cd ..
    exit /b 1
)
cd ..

REM Create .env if it doesn't exist
echo.
echo ⚙️  Setting up environment configuration...
if not exist "server\.env" (
    copy server\.env.example server\.env
    echo ✓ Created server\.env (please edit with your configuration^)
) else (
    echo ✓ server\.env already exists
)

REM Create logs directory
echo.
echo 📁 Creating logs directory...
if not exist "server\logs" (
    mkdir server\logs
)
echo ✓ Logs directory created

echo.
echo ================================
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit server\.env with your MongoDB connection string
echo 2. Run 'npm run dev' to start both server and client
echo 3. Access the app at http://localhost:5173
echo.
echo 📚 Documentation:
echo - README.md - Project overview
echo - UPGRADE_GUIDE.md - New features
echo.
pause
