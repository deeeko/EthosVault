#!/bin/bash

# EthosVault Deployment Setup Script
# This script prepares your project for Vercel deployment

echo "🚀 EthosVault - Vercel Deployment Setup"
echo "========================================"
echo ""

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Adding files to Git..."
git add .

echo ""
echo "💾 Creating initial commit..."
git commit -m "Initial commit - EthosVault ready for deployment" || echo "⚠️  No changes to commit or commit already exists"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📌 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Create a GitHub repository:"
echo "   → Go to: https://github.com/new"
echo "   → Repository name: ethosvault"
echo "   → Click 'Create repository'"
echo ""
echo "2. Connect to GitHub (replace YOUR_USERNAME):"
echo "   → git remote add origin https://github.com/YOUR_USERNAME/ethosvault.git"
echo "   → git branch -M main"
echo "   → git push -u origin main"
echo ""
echo "3. Deploy on Vercel:"
echo "   → Go to: https://vercel.com/new"
echo "   → Import your GitHub repository"
echo "   → Add environment variables (see VERCEL_DEPLOYMENT_GUIDE.md)"
echo "   → Click 'Deploy'"
echo ""
echo "4. Get WalletConnect Project ID:"
echo "   → Go to: https://cloud.walletconnect.com"
echo "   → Create project, get Project ID"
echo "   → Add to Vercel as NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
echo ""
echo "📖 Full guide: See VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
