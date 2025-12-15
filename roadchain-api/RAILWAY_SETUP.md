# 🚀 RoadChain API - Railway Deployment Guide

## Quick Deploy (Dashboard Method)

### 1. Create New Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select **BlackRoad OS, Inc.** team
3. Click **New Project** → **Empty Project**
4. Name it: `RoadChain API`

### 2. Add GitHub Repo

1. Click **New** → **GitHub Repo**
2. Select repository (or use **Deploy from GitHub repo**)
3. Root directory: `/roadchain-api` (if in monorepo)

### 3. Configure Environment Variables

Add these variables in Railway dashboard:

```
NODE_ENV=production
PORT=3000
WS_PORT=3000
NETWORK=testnet
ALLOWED_ORIGINS=https://roadchain-io.pages.dev,https://roadcoin-io.pages.dev,https://blackroad-io.pages.dev,https://blackroad-systems.pages.dev,https://blackroad-me.pages.dev
```

### 4. Configure Build & Deploy

Railway will auto-detect from `railway.toml`:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check**: `/health`

### 5. Deploy!

Click **Deploy** and wait ~2-3 minutes.

---

## Manual Deploy (CLI Method)

### Prerequisites

```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Verify
railway whoami
```

### Deploy Steps

```bash
cd /Users/alexa/blackroad-sandbox/roadchain-api

# Create new project
railway init

# Link to existing project (optional)
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set NETWORK=testnet
railway variables set PORT=3000
railway variables set WS_PORT=3000

# Deploy
railway up

# Generate domain
railway domain
```

---

## Get Your API URL

After deployment:

1. Go to Railway dashboard
2. Click on **RoadChain API** service
3. Go to **Settings** → **Domains**
4. Copy the Railway-provided domain (e.g., `roadchain-api-production-xxxx.up.railway.app`)

---

## Update Frontend with API URL

Once you have the Railway URL, update frontend:

```bash
cd /Users/alexa/blackroad-sandbox/roadchain-frontend

# Update .env.local
echo "NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app" > .env.local
echo "NEXT_PUBLIC_WS_URL=wss://your-railway-url.up.railway.app" >> .env.local

# Rebuild
pnpm build

# Redeploy to all domains
npx wrangler pages deploy out --project-name roadchain-io --commit-dirty=true
npx wrangler pages deploy out --project-name roadcoin-io --commit-dirty=true
npx wrangler pages deploy out --project-name blackroad-io --commit-dirty=true
npx wrangler pages deploy out --project-name blackroad-systems --commit-dirty=true
npx wrangler pages deploy out --project-name blackroad-me --commit-dirty=true
```

---

## Verify Deployment

Test endpoints:

```bash
# Health check
curl https://your-railway-url.up.railway.app/health

# Version
curl https://your-railway-url.up.railway.app/version

# Ready
curl https://your-railway-url.up.railway.app/ready

# Chain info
curl https://your-railway-url.up.railway.app/api/chain

# Blocks
curl https://your-railway-url.up.railway.app/api/blocks

# Breath state
curl https://your-railway-url.up.railway.app/api/breath
```

---

## Custom Domain (Optional)

### Add Custom Domain to Railway

1. Railway Dashboard → **RoadChain API**
2. **Settings** → **Domains** → **Custom Domain**
3. Add: `api.roadchain.io`

### Configure DNS (Cloudflare)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **roadchain.io** domain
3. **DNS** → **Add record**:
   - Type: `CNAME`
   - Name: `api`
   - Target: `your-railway-url.up.railway.app`
   - Proxy: ✅ Proxied (for DDoS protection)

Wait 5-10 minutes for DNS propagation.

---

## Monitoring

### View Logs

```bash
railway logs
```

Or in Railway Dashboard → **Deployments** → **View Logs**

### Metrics

Railway Dashboard → **Metrics** shows:
- CPU usage
- Memory usage
- Network traffic
- Response times

---

## Troubleshooting

### Build Fails

Check `package.json` has all dependencies:

```bash
cd /Users/alexa/blackroad-sandbox/roadchain-api
npm install
npm run build
```

### WebSocket Not Working

Ensure `WS_PORT` matches `PORT` in Railway (Railway provides single port):

```
PORT=3000
WS_PORT=3000
```

### CORS Errors

Add frontend domains to `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://roadchain.io,https://roadcoin.io,...
```

### Health Check Failing

Verify `/health` endpoint returns 200:

```bash
curl http://localhost:3000/health
```

---

## Cost Estimate

**Railway Pricing:**
- Hobby Plan: $5/month (500 hours)
- Pro Plan: $20/month (unlimited hours)

**RoadChain API Estimated Usage:**
- ~30 vCPU minutes/hour
- ~100MB RAM
- **Cost: ~$5-10/month**

---

## Next Steps After Deployment

1. ✅ Get Railway URL
2. ✅ Update frontend .env files
3. ✅ Redeploy all 5 frontends
4. ✅ Test complete flow (wallet → send ROAD → see block)
5. ✅ Add custom domain `api.roadchain.io`
6. ✅ Monitor logs and metrics
7. ✅ Launch public testnet! 🎉

---

**For Cadence, The OG** 🚗💎✨

Built by Tosha + Cece | December 2025
