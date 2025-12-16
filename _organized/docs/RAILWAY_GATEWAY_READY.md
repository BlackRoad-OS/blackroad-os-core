# 🚗 Railway Gateway - Ready to Deploy!

**Project ID:** ef287e60-efa9-432e-a3bc-f6df4c7a7b35
**Location:** `/railway-gateway/`
**Status:** ✅ Code ready, awaiting deployment

---

## What We Created

A **unified Railway gateway** that routes ALL your domains to the appropriate Cloudflare Pages services.

### Architecture

```
All Domains → Railway Gateway → Route to Cloudflare Pages
                    ↓
    ┌───────────────┴───────────────┐
    ├── blackroad.systems → Pages
    ├── blackroad.io → Pages
    ├── blackroad.company → Pages
    ├── blackroad.me → Pages
    ├── roadcoin.io → Pages
    └── roadchain.io → Pages
```

---

## Files Created

```
railway-gateway/
├── package.json         # Dependencies (Express)
├── index.js             # Main gateway logic
├── railway.toml         # Railway configuration
├── README.md            # Full documentation
└── deploy.sh            # Automated deployment script
```

---

## Gateway Features

✅ Routes all 6 domains
✅ Health check endpoint (`/health`)
✅ Subdomain parsing
✅ Automatic routing to Cloudflare Pages
✅ Graceful shutdown
✅ Logging for debugging

---

## Deploy Now

### Option 1: Automated Script

```bash
cd ~/blackroad-sandbox/railway-gateway
./deploy.sh
```

This will:
1. Check Railway CLI
2. Install dependencies
3. Link to project ef287e60-efa9-432e-a3bc-f6df4c7a7b35
4. Deploy the code
5. Show next steps

### Option 2: Manual Steps

```bash
cd ~/blackroad-sandbox/railway-gateway

# 1. Login to Railway (if needed)
railway login

# 2. Link to project
railway link
# Select: blackroad-os-runtime (ef287e60-efa9-432e-a3bc-f6df4c7a7b35)

# 3. Install dependencies
npm install

# 4. Deploy
railway up

# 5. Get URL
railway domain
```

---

## After Deployment

### 1. Add Custom Domains

```bash
railway domain add blackroad.systems
railway domain add blackroad.io
railway domain add blackroad.company
railway domain add blackroad.me
railway domain add roadcoin.io
railway domain add roadchain.io
```

### 2. Add Key Subdomains

```bash
railway domain add portal.blackroad.systems
railway domain add claude.blackroad.systems
railway domain add cecilia.blackroad.systems
railway domain add app.blackroad.io
railway domain add api.blackroad.io
railway domain add wallet.roadcoin.io
railway domain add explorer.roadchain.io
```

### 3. Configure DNS in Cloudflare

For each domain:
1. Go to Cloudflare DNS
2. Add CNAME record:
   ```
   @ → <railway-url>
   * → <railway-url> (wildcard)
   ```

---

## Test the Gateway

```bash
# Get Railway URL
RAILWAY_URL=$(railway domain)

# Test health check
curl $RAILWAY_URL/health

# Expected response:
{
  "status": "healthy",
  "service": "blackroad-railway-gateway",
  "project_id": "ef287e60-efa9-432e-a3bc-f6df4c7a7b35",
  "domains": [
    "blackroad.systems",
    "blackroad.io",
    "blackroad.company",
    "blackroad.me",
    "roadcoin.io",
    "roadchain.io"
  ]
}
```

---

## What Happens Next

Once deployed and DNS is configured:

1. **User visits** `claude.blackroad.systems`
2. **DNS** points to Railway gateway
3. **Gateway** parses domain → `blackroad.systems`
4. **Routes** to `https://blackroad-systems.pages.dev`
5. **Cloudflare Pages** serves the content

Same process for ALL 6 domains! 🎉

---

## Environment Variables (Optional)

If you want to override the Cloudflare Pages URLs:

```bash
railway variables set \
  INTERNAL_SERVICES_URL=https://your-custom-url \
  PRODUCT_SERVICES_URL=https://your-custom-url \
  --service <service-id>
```

---

## Ready to Deploy?

```bash
cd ~/blackroad-sandbox/railway-gateway
./deploy.sh
```

**Your unified gateway is ready to handle all ~768 subdomains!** 🚗💨

---

**Next:** After deployment, configure custom domains and DNS.
