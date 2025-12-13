#!/bin/bash

# Test All BlackRoad Cloudflare Domains
# This script tests all deployed Pages projects and Workers

set -e

echo "🧪 Testing All BlackRoad Cloudflare Domains"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_url() {
    local name=$1
    local url=$2
    local expect_code=${3:-200}

    echo -n "Testing $name... "

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

    if [ "$status" = "$expect_code" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $status)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $status, expected $expect_code)"
        return 1
    fi
}

# Test JSON response
test_json() {
    local name=$1
    local url=$2
    local field=$3

    echo -n "Testing $name JSON... "

    response=$(curl -s "$url" 2>/dev/null)
    value=$(echo "$response" | jq -r ".$field" 2>/dev/null || echo "null")

    if [ "$value" != "null" ] && [ "$value" != "" ]; then
        echo -e "${GREEN}✅ OK${NC} ($field: $value)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (field '$field' not found)"
        return 1
    fi
}

passed=0
failed=0

echo "📦 Testing New Dynamic Apps"
echo "----------------------------"
test_url "Agent Spawner" "https://203816c1.blackroad-agents-spawner.pages.dev" && ((passed++)) || ((failed++))
test_url "Dashboard" "https://25101eeb.blackroad-dashboard.pages.dev" && ((passed++)) || ((failed++))
test_url "API Explorer" "https://3cff3b4d.blackroad-api-explorer.pages.dev" && ((passed++)) || ((failed++))
echo ""

echo "💳 Testing Payment & Commerce"
echo "------------------------------"
test_url "Payment Page" "https://c9134ee5.blackroad-payment-page.pages.dev" && ((passed++)) || ((failed++))
test_url "Buy Now" "https://803159f1.blackroad-buy-now.pages.dev" && ((passed++)) || ((failed++))
echo ""

echo "🏢 Testing Core Pages"
echo "---------------------"
test_url "Main Site (blackroad.io)" "https://blackroad.io" && ((passed++)) || ((failed++))
test_url "Docs" "https://docs.blackroad.io" && ((passed++)) || ((failed++))
test_url "Brand" "https://brand.blackroad.io" && ((passed++)) || ((failed++))
test_url "Console" "https://app.blackroad.io" && ((passed++)) || ((failed++))
echo ""

echo "🌌 Testing Lucidia Platform"
echo "----------------------------"
test_url "Lucidia Platform" "https://lucidia-platform.pages.dev" && ((passed++)) || ((failed++))
test_url "Lucidia Math" "https://lucidia-math.pages.dev" && ((passed++)) || ((failed++))
test_url "Lucidia Core" "https://lucidia-core.pages.dev" && ((passed++)) || ((failed++))
echo ""

echo "⚙️  Testing Cloudflare Workers"
echo "-------------------------------"
test_json "Payment Gateway" "https://blackroad-payment-gateway.amundsonalexa.workers.dev/health" "status" && ((passed++)) || ((failed++))
echo ""

echo "🔧 Testing Backend API (Raspberry Pi)"
echo "--------------------------------------"
# Tunnel may be ephemeral, so this is optional
if curl -s -m 5 "https://basket-aus-brass-dog.trycloudflare.com/health" > /dev/null 2>&1; then
    test_json "API Gateway (Tunnel)" "https://basket-aus-brass-dog.trycloudflare.com/health" "status" && ((passed++)) || ((failed++))
else
    echo -e "${YELLOW}⚠️  SKIP${NC} API Gateway (Tunnel) - tunnel may be down or URL changed"
fi
echo ""

echo "📊 Testing Utility Pages"
echo "-------------------------"
test_url "Tools" "https://blackroad-tools.pages.dev" && ((passed++)) || ((failed++))
test_url "Chat" "https://blackroad-chat.pages.dev" && ((passed++)) || ((failed++))
test_url "Agents Marketplace" "https://blackroad-agents.pages.dev" && ((passed++)) || ((failed++))
test_url "Admin" "https://blackroad-admin.pages.dev" && ((passed++)) || ((failed++))
test_url "Analytics" "https://blackroad-analytics.pages.dev" && ((passed++)) || ((failed++))
test_url "Builder" "https://blackroad-builder.pages.dev" && ((passed++)) || ((failed++))
test_url "Store" "https://blackroad-store.pages.dev" && ((passed++)) || ((failed++))
test_url "Workflows" "https://blackroad-workflows.pages.dev" && ((passed++)) || ((failed++))
echo ""

echo "==========================================="
echo "📈 Test Results Summary"
echo "==========================================="
echo -e "✅ Passed: ${GREEN}$passed${NC}"
echo -e "❌ Failed: ${RED}$failed${NC}"
total=$((passed + failed))
echo "📊 Total: $total"

if [ $failed -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests failed. Check output above.${NC}"
    exit 1
fi
