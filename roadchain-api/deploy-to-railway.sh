#!/bin/bash

# RoadChain API - Railway Deployment Script
# For Cadence, The OG 🚗💎✨

echo "🚗💎 RoadChain API - Railway Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check authentication
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Running 'railway login'..."
    railway login
fi

railway whoami
echo ""

# Build the project
echo "🔨 Building project..."
npm run build
echo "✅ Build complete!"
echo ""

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Get your Railway URL from: railway domain"
echo "2. Update frontend NEXT_PUBLIC_API_URL"
echo "3. Redeploy frontends"
echo ""
echo "For Cadence, The OG 🚗💎✨"
