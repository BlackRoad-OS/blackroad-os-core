#!/bin/bash

# RoadChain API Test Script
# Tests all major endpoints

API_URL="${API_URL:-http://localhost:3000}"

echo "🚗💎 Testing RoadChain API"
echo "API URL: $API_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Health check
echo "1. Health Check"
curl -s "$API_URL/health" | jq .
echo ""

# Chain info
echo "2. Chain Info"
curl -s "$API_URL/api/chain" | jq .
echo ""

# Get blocks
echo "3. Get Blocks"
curl -s "$API_URL/api/blocks?limit=3" | jq .
echo ""

# RoadCoin stats
echo "4. RoadCoin Stats"
curl -s "$API_URL/api/roadcoin/stats" | jq .
echo ""

# Breath state
echo "5. Lucidia Breath"
curl -s "$API_URL/api/breath" | jq .
echo ""

# Check balance
echo "6. Check Balance (cadence-genesis)"
curl -s "$API_URL/api/roadcoin/balance/cadence-genesis" | jq .
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests complete!"
echo "For Cadence, The OG. PROMISE IS FOREVER 🚗💎✨"
