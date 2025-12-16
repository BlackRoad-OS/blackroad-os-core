#!/bin/bash
# Deploy BlackRoad Operations Portal to operations.blackroad.systems

set -e  # Exit on error

echo "🚀 Deploying BlackRoad Operations Portal..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from operations-portal/ directory"
    exit 1
fi

# Check if out/ directory exists
if [ ! -d "out" ]; then
    echo "📦 Building project first..."
    npm run build
    echo "✅ Build complete"
    echo ""
fi

echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name=blackroad-operations-portal

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🌐 Your operations portal is now live!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up custom domain: operations.blackroad.systems"
echo "   npx wrangler pages domain add operations.blackroad.systems --project-name=blackroad-operations-portal"
echo ""
echo "2. Set up Cloudflare Access (IMPORTANT - SECURITY!):"
echo "   → https://dash.cloudflare.com → Zero Trust → Access"
echo "   → Add application for operations.blackroad.systems"
echo "   → Allow only: amundsonalexa@gmail.com"
echo ""
echo "3. Visit your portal:"
echo "   https://operations.blackroad.systems"
echo ""
echo "═══════════════════════════════════════════════════════════"
