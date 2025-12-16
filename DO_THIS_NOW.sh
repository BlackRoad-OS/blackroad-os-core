#!/bin/bash

echo "🎯 FINAL STEPS TO REVENUE - RUN THESE COMMANDS"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Add Stripe Keys to Cloudflare Pages${NC}"
echo ""
echo "Run these commands (you'll be prompted for each value):"
echo ""
echo -e "${BLUE}cd roadwork/frontend${NC}"
echo ""
echo -e "${BLUE}npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=roadwork-production${NC}"
echo "  → Paste: mk_1SUDtxChUUSEbzyhpqbBHfjB"
echo ""
echo -e "${BLUE}npx wrangler pages secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY --project-name=roadwork-production${NC}"
echo "  → Paste: mk_1SUDMBChUUSEbzyhlofUCjGe"
echo ""

echo -e "${YELLOW}Step 2: Create Stripe Products${NC}"
echo ""
echo "1. Go to: https://dashboard.stripe.com/products"
echo "2. Create 'RoadWork Pro' - \$29.99/month"
echo "3. Create 'RoadWork Premium' - \$99.99/month"
echo "4. Copy the Price IDs (price_...)"
echo "5. Add them to Cloudflare Pages:"
echo ""
echo -e "${BLUE}npx wrangler pages secret put STRIPE_PRO_PRICE_ID --project-name=roadwork-production${NC}"
echo "  → Paste the Pro Price ID"
echo ""
echo -e "${BLUE}npx wrangler pages secret put STRIPE_PREMIUM_PRICE_ID --project-name=roadwork-production${NC}"
echo "  → Paste the Premium Price ID"
echo ""

echo -e "${YELLOW}Step 3: Redeploy${NC}"
echo ""
echo -e "${BLUE}cd roadwork/frontend${NC}"
echo -e "${BLUE}npm run build${NC}"
echo -e "${BLUE}npx wrangler pages deploy out --project-name=roadwork-production --commit-dirty=true${NC}"
echo ""

echo -e "${YELLOW}Step 4: Test${NC}"
echo ""
echo "Visit: https://86e34789.roadwork-production.pages.dev/signup?plan=pro"
echo "Test card: 4242 4242 4242 4242"
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}If checkout loads → YOU'RE LIVE! 🎉${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Time required: 10 minutes"
echo "Revenue potential: \$4K-250K/month"
echo ""
echo "GO MAKE MONEY! 💰"
