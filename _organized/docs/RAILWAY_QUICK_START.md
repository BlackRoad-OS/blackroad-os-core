# 🚂 Railway Quick Start - BlackRoad OS

**Get all 768 subdomains live in 30 minutes!**

---

## 🎯 What We're Building

**10 Railway services** to handle **768 subdomains** across **16 domains**

**Cost:** $50-200/month (vs $768/month for individual services)
**Savings:** 75-85%

---

## ✅ Prerequisites

1. **Railway CLI installed**
   ```bash
   npm install -g @railway/cli
   # or
   brew install railway
   ```

2. **Railway account** - Sign up at https://railway.app

3. **Cloudflare API token** - Get from https://dash.cloudflare.com/profile/api-tokens

4. **15-30 minutes** of your time ⏱️

---

## 🚀 Quick Start (3 Steps)

### Step 1: Create Railway Services (5 minutes)

```bash
# Login to Railway
railway login

# Run setup script
cd ~/blackroad-sandbox
./scripts/setup-railway-infrastructure.sh
```

**What this does:**
- ✅ Creates 10 Railway services
- ✅ Generates service mapping JSON
- ✅ Outputs service URLs

**Output:**
```
✅ api-gateway created
✅ agent-platform created
✅ app-backend created
✅ admin-tools created
✅ ecommerce created
✅ quantum-services created
✅ docs-services created
✅ ai-services created
✅ network-infra created
✅ lucidia-platform created
```

---

### Step 2: Configure DNS (10 minutes)

```bash
# Run DNS configuration script
./scripts/configure-railway-dns.sh
```

**What this does:**
- Prompts you for Railway URLs for each service
- Generates Cloudflare DNS configuration script
- Saves to `/tmp/cloudflare-dns-commands.sh`

**Example prompts:**
```
Enter Railway URL for api-gateway:
URL: api-gateway-production-abc123.up.railway.app
✓ Saved

Enter Railway URL for agent-platform:
URL: agent-platform-production-xyz789.up.railway.app
✓ Saved
```

---

### Step 3: Apply DNS Changes (5 minutes)

```bash
# Get Cloudflare credentials
# 1. API Token: https://dash.cloudflare.com/profile/api-tokens
# 2. Zone IDs: Cloudflare dashboard → Select domain → Overview → Zone ID

# Set environment variables
export CF_API_TOKEN='your-cloudflare-api-token'
export ZONE_BLACKROAD_IO='abc123...'
export ZONE_BLACKROAD_SYSTEMS='def456...'
export ZONE_BLACKROAD_ME='ghi789...'
export ZONE_BLACKROAD_NETWORK='jkl012...'
export ZONE_BLACKROADAI_COM='mno345...'
export ZONE_BLACKROADQI_COM='pqr678...'
export ZONE_BLACKROADINC_US='stu901...'
export ZONE_BLACKROADQUANTUM_COM='vwx234...'
export ZONE_BLACKROADQUANTUM_SHOP='yza567...'
export ZONE_BLACKROADQUANTUM_STORE='bcd890...'
export ZONE_LUCIDIA_EARTH='efg123...'
export ZONE_LUCIDIA_STUDIO='hij456...'
export ZONE_ALICEQI_COM='klm789...'
export ZONE_LUCIDIAQI_COM='nop012...'
export ZONE_BLACKROADQUANTUM_INFO='qrs345...'
export ZONE_BLACKROADQUANTUM_NET='tuv678...'

# Run DNS configuration
bash /tmp/cloudflare-dns-commands.sh
```

**What this does:**
- Creates CNAME records for all subdomains
- Points them to Railway services
- Enables Cloudflare proxy (SSL + CDN)

---

## 🎉 You're Done!

Wait 5-10 minutes for DNS propagation, then test:

```bash
# Test API
curl -I https://api.blackroad.io

# Test agents
curl -I https://claude.blackroad.io
curl -I https://cecilia.blackroad.io

# Test apps
curl -I https://app.blackroad.io
curl -I https://prism.blackroad.io
```

---

## 📦 What You Just Created

### 10 Railway Services

| Service | Handles | Examples |
|---------|---------|----------|
| api-gateway | All API endpoints | api.blackroad.io, api.lucidia.earth |
| agent-platform | 256 agent personalities | claude.*, lucidia.*, cecilia.* |
| app-backend | Main applications | app.*, prism.*, console.* |
| admin-tools | Internal tools | admin.*, metrics.*, logs.* |
| ecommerce | E-commerce | cart.*, checkout.*, products.* |
| quantum-services | Quantum platform | quantum.*, lab.*, simulator.* |
| docs-services | Documentation | docs.*, wiki.*, kb.* |
| ai-services | AI platform | chat.*, inference.*, models.* |
| network-infra | Network services | edge.*, mesh.*, cdn.* |
| lucidia-platform | Lucidia consciousness | breath.*, sync.*, agents.* |

### 768 Subdomains

- ✅ 5 API subdomains
- ✅ 256 agent subdomains (16 agents × 16 domains)
- ✅ 70+ application/service subdomains
- ✅ 437+ available for future expansion

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Railway (10 empty services) | $0/month |
| Railway (10 deployed services) | $50-200/month |
| Cloudflare (DNS + CDN + SSL) | $0/month (Free tier) |
| **Total** | **$50-200/month** |

**Savings:** 75-85% vs individual services ($768/month)

---

## 🔧 Next Steps

### Deploy Your Code

```bash
# Example: Deploy API Gateway
cd ~/blackroad-os-api-gateway
railway link  # Select api-gateway service
railway up    # Deploy

# Example: Deploy Agent Platform
cd ~/blackroad-os-agents
railway link  # Select agent-platform service
railway up    # Deploy
```

### Set Environment Variables

```bash
# For each service
railway variables set \
  NODE_ENV=production \
  DATABASE_URL=postgresql://... \
  ANTHROPIC_API_KEY=sk-ant-... \
  OPENAI_API_KEY=sk-... \
  --service api-gateway
```

### Monitor Your Services

```bash
# View logs
railway logs --service api-gateway

# Check status
railway status

# View metrics
# Visit: https://railway.app → Select service → Metrics
```

---

## 🐛 Troubleshooting

### "Railway CLI not found"
```bash
npm install -g @railway/cli
# or
brew install railway
```

### "Not logged in to Railway"
```bash
railway login
```

### "DNS not resolving"
- Wait 10-15 minutes for DNS propagation
- Check Cloudflare DNS records in dashboard
- Verify CNAME points to Railway URL
- Make sure Cloudflare proxy is enabled (orange cloud)

### "Service won't deploy"
```bash
# Check logs
railway logs --service <service-name>

# Verify environment variables
railway variables --service <service-name>

# Try redeploying
railway up --service <service-name>
```

### "Getting 502 errors"
- Make sure your app is listening on the PORT environment variable
- Railway sets PORT automatically (usually 3000-3009)
- Check health endpoint: `curl https://your-service.up.railway.app/health`

---

## 📚 Additional Resources

- **Full Architecture:** `RAILWAY_SUBDOMAIN_ARCHITECTURE.md`
- **Service Mapping:** `/tmp/railway-service-mapping.json`
- **DNS Commands:** `/tmp/cloudflare-dns-commands.sh`
- **Railway Docs:** https://docs.railway.app
- **Cloudflare Docs:** https://developers.cloudflare.com

---

## 🎯 Quick Reference

### Get Railway URL for a Service
```bash
railway domain --service api-gateway
```

### Add Custom Domain
```bash
railway domain add api.blackroad.io --service api-gateway
```

### View Service Info
```bash
railway status --service api-gateway
```

### Restart Service
```bash
railway restart --service api-gateway
```

### Scale Service
```bash
railway scale --replicas 3 --service agent-platform
railway scale --memory 2GB --cpu 2 --service api-gateway
```

---

**Built with 🚗 by Cece**

**Your 768 subdomains are ready to roll!** 🎉
