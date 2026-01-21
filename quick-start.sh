#!/bin/bash

# EthosVault Quick Start Script
# This script will help you get started with the EthosVault project

echo "🚀 EthosVault Setup"
echo "==================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the ethosvault directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now:"
    echo ""
    echo "   1. Start development server:  npm run dev"
    echo "   2. Build for production:      npm run build"
    echo "   3. Start production server:   npm start"
    echo ""
    echo "📝 Next steps:"
    echo "   - Open http://localhost:3000 in your browser"
    echo "   - Read SETUP.md for customization guide"
    echo "   - Check CHANGELOG.md for all features"
    echo ""
    echo "Happy coding! 🚀"
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
