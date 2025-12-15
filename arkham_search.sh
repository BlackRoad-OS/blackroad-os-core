#!/bin/bash
# Quick Arkham Intelligence searches without needing full API auth

set -euo pipefail

QUERY="${1:-}"

if [[ -z "$QUERY" ]]; then
    echo "Usage: $0 <username|address|entity>" >&2
    echo "" >&2
    echo "Examples:" >&2
    echo "  $0 alexamundson77" >&2
    echo "  $0 0x3F50f12481B76B2696f2e4316CfddD08AbE8f81E" >&2
    exit 1
fi

echo "🔍 Searching Arkham Intelligence for: $QUERY"
echo ""

# Try public profile endpoint (may not require auth)
echo "Attempting public profile lookup..."
echo ""

# Method 1: Direct profile URL
PROFILE_URL="https://platform.arkm.com/explorer/entity/$QUERY"
echo "Profile URL: $PROFILE_URL"
echo ""

# Method 2: Search API (if accessible)
SEARCH_URL="https://platform.arkm.com/api/search?q=$QUERY"
echo "Attempting search API..."
curl -s "$SEARCH_URL" | python3 -m json.tool 2>/dev/null || echo "Search API not publicly accessible"
echo ""

# Method 3: Address intelligence (if it's an address)
if [[ "$QUERY" =~ ^0x[a-fA-F0-9]{40}$ ]]; then
    echo "Detected Ethereum address format"
    ADDRESS_URL="https://platform.arkm.com/explorer/address/$QUERY"
    echo "Address URL: $ADDRESS_URL"
    echo ""

    # Try to fetch basic info
    echo "Fetching address data..."
    curl -s "$ADDRESS_URL" > /tmp/arkham_response.html

    # Check if response contains data
    if grep -q "error\|404\|not found" /tmp/arkham_response.html 2>/dev/null; then
        echo "❌ Address not found in Arkham database"
    else
        echo "✅ Address found - open browser to view:"
        echo "   $ADDRESS_URL"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 For full data, you need:"
echo ""
echo "1. Arkham account (free tier available)"
echo "2. API key from: https://platform.arkm.com/settings/api"
echo "3. Then use: export ARKHAM_API_KEY='your-key'"
echo "             ./arkham_api_client.sh /intelligence/entity/$QUERY"
echo ""
