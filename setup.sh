#!/bin/bash
# GesturAI Development Setup Script
# Run this script to set up the development environment

set -e

echo "🚀 GesturAI Development Setup"
echo "================================"

# Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi
echo "  Node.js version: $(node --version)"

# Check npm
echo "✓ Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm is not installed."
    exit 1
fi
echo "  npm version: $(npm --version)"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create .env if it doesn't exist
echo ""
echo "⚙️  Setting up environment configuration..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✓ Created server/.env (please edit with your configuration)"
else
    echo "✓ server/.env already exists"
fi

# Create logs directory
echo ""
echo "📁 Creating logs directory..."
mkdir -p server/logs
echo "✓ Logs directory created"

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit server/.env with your MongoDB connection string"
echo "2. Run 'npm run dev' to start both server and client"
echo "3. Access the app at http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- UPGRADE_GUIDE.md - New features"
echo ""
