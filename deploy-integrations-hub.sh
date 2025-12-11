#!/usr/bin/env bash
# ============================================================================
# BlackRoad OS - Deploy Integrations Hub to Railway
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

set -euo pipefail

echo "🚀 Deploying BlackRoad Integrations Hub to Railway"
echo "=" * 60

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not installed"
    echo "Install: npm install -g @railway/cli"
    exit 1
fi

# Check authentication
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Run: railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Project details
PROJECT_ID="0c7bcf07-307b-4db6-9c94-22a456500d68"
SERVICE_NAME="blackroad-integrations-hub"

echo "📋 Deployment details:"
echo "   Project: blackroad-os-runtime"
echo "   Service: $SERVICE_NAME"
echo "   Port: 9510"
echo ""

# Create service if it doesn't exist (Railway will handle this)
echo "📦 Deploying service..."
railway up \
    --service "$SERVICE_NAME" \
    --detach

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Next steps:"
echo "   1. Check deployment: railway logs --service $SERVICE_NAME"
echo "   2. Get domain: railway domain --service $SERVICE_NAME"
echo "   3. Test: curl https://YOUR-DOMAIN.railway.app/health"
echo ""
echo "🔗 Dashboard: https://railway.app/project/$PROJECT_ID"
