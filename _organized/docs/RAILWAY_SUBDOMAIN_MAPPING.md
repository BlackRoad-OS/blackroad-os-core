# 🌐 Railway → Cloudflare Subdomain Architecture

**Complete mapping of Railway backends to Cloudflare subdomain frontends**

Last Updated: 2025-12-14

---

## 🎯 Architecture Explained

### How It Works

**Each subdomain has TWO parts:**

1. **Frontend (Cloudflare Pages)** - FREE
   - Static HTML/CSS/JS served from global CDN
   - User-facing website
   - Example: https://roadwork.blackroad.io

2. **Backend (Railway)** - $5-30/month per service
   - Python/Node.js API server
   - Database, workers, background jobs
   - Example: https://api-roadwork.blackroad.io

**They talk to each other:**
```
User → roadwork.blackroad.io (Cloudflare Pages)
         ↓ (makes API calls)
       api-roadwork.blackroad.io (Railway backend)
```

---

## 📋 Complete Subdomain Mapping

### 1. RoadWork (Job Hunter)

**Frontend (Cloudflare Pages):**
- **Domain:** roadwork.blackroad.io
- **Project:** roadwork (Cloudflare Pages)
- **Status:** ✅ Deployed - https://478adf74.roadwork.pages.dev
- **Cost:** $0/month

**Backend (Railway):**
- **Domain:** api-roadwork.blackroad.io
- **Railway Project:** 01 (`9d3d2549-3778-4c86-8afd-cefceaaa74d2`)
- **Services:**
  - FastAPI server (REST API)
  - Celery worker (job scraper)
  - Celery beat (scheduler)
  - PostgreSQL database
  - Redis cache
- **Status:** ⏳ Ready to deploy
- **Cost:** $30/month

**DNS Setup:**
```
# Frontend
Type: CNAME
Name: roadwork
Content: roadwork.pages.dev
Proxy: Yes (orange cloud)

# Backend API
Type: CNAME
Name: api-roadwork
Content: roadwork-production.up.railway.app
Proxy: Yes (orange cloud)
```

---

### 2. BlackRoad Core (Main Platform)

**Frontend (Cloudflare Pages):**
- **Domain:** app.blackroad.io
- **Project:** blackroad-console (Cloudflare Pages)
- **Description:** Main agent dashboard/console
- **Status:** ⏳ To deploy
- **Cost:** $0/month

**Backend (Railway):**
- **Domain:** api.blackroad.io
- **Railway Project:** 03 (`aa968fb7-ec35-4a8b-92dc-1eba70fa8478`)
- **Services:**
  - BlackRoad OS Core
  - Core API
  - PostgreSQL database
  - Redis cache
- **Status:** ⏳ Ready to deploy
- **Cost:** $20/month

**DNS Setup:**
```
# Frontend
Type: CNAME
Name: app
Content: blackroad-console.pages.dev
Proxy: Yes

# Backend API
Type: CNAME
Name: api
Content: blackroad-core-production.up.railway.app
Proxy: Yes
```

---

### 3. BlackRoad Operator (Agent Orchestration)

**No Frontend (API Only):**

**Backend (Railway):**
- **Domain:** operator.blackroad.io
- **Railway Project:** 04 (`e8b256aa-8708-4eb2-ba24-99eba4fe7c2e`)
- **Services:**
  - BlackRoad OS Operator ("Cece" agent)
  - PostgreSQL database
- **Status:** ⏳ Ready to deploy
- **Cost:** $10/month

**DNS Setup:**
```
Type: CNAME
Name: operator
Content: blackroad-operator-production.up.railway.app
Proxy: Yes
```

---

### 4. BlackRoad Master (Control Plane)

**No Frontend (API Only):**

**Backend (Railway):**
- **Domain:** master.blackroad.io
- **Railway Project:** 05 (`85e6de55-fefd-4e8d-a9ec-d20c235c2551`)
- **Services:**
  - BlackRoad OS Master
  - PostgreSQL database
- **Status:** ⏳ Ready to deploy
- **Cost:** $10/month

**DNS Setup:**
```
Type: CNAME
Name: master
Content: blackroad-master-production.up.railway.app
Proxy: Yes
```

---

### 5. BlackRoad Beacon (Monitoring)

**No Frontend (API Only):**

**Backend (Railway):**
- **Domain:** beacon.blackroad.io
- **Railway Project:** 06 (`8ac583cb-ffad-40bd-8676-6569783274d1`)
- **Services:**
  - BlackRoad OS Beacon (health checks)
  - Redis cache
- **Status:** ⏳ Ready to deploy
- **Cost:** $8/month

**DNS Setup:**
```
Type: CNAME
Name: beacon
Content: blackroad-beacon-production.up.railway.app
Proxy: Yes
```

---

### 6. BlackRoad Packs (Domain Services)

**No Frontend (API Only):**

**Backend (Railway):**
- **Domain:** packs.blackroad.io
- **Railway Project:** 07 (`b61ecd98-adb2-4788-a2e0-f98e322af53a`)
- **Services:**
  - Pack Finance
  - Pack Legal
  - Pack Research Lab
  - Pack Creator Studio
  - Pack Infra DevOps
  - PostgreSQL database
- **Status:** ⏳ Ready to deploy
- **Cost:** $20/month

**DNS Setup:**
```
Type: CNAME
Name: packs
Content: blackroad-packs-production.up.railway.app
Proxy: Yes
```

---

### 7. Prism Console (Monitoring Dashboard)

**Frontend (Cloudflare Pages):**
- **Domain:** prism.blackroad.io
- **Project:** blackroad-prism-console (Cloudflare Pages)
- **Description:** Real-time monitoring dashboard
- **Status:** ⏳ To deploy
- **Cost:** $0/month

**Backend:**
- Uses: api.blackroad.io, operator.blackroad.io, beacon.blackroad.io
- No dedicated backend (queries other services)

**DNS Setup:**
```
Type: CNAME
Name: prism
Content: blackroad-prism-console.pages.dev
Proxy: Yes
```

---

### 8. BlackRoad Home (Marketing Site)

**Frontend (Cloudflare Pages):**
- **Domain:** blackroad.io (root domain)
- **Project:** blackroad-home (Cloudflare Pages)
- **Description:** Main marketing/landing site
- **Status:** ⏳ To deploy
- **Cost:** $0/month

**Backend:**
- None (static marketing site)

**DNS Setup:**
```
Type: CNAME
Name: @ (root)
Content: blackroad-home.pages.dev
Proxy: Yes
```

---

### 9. Documentation

**Frontend (Cloudflare Pages):**
- **Domain:** docs.blackroad.io
- **Project:** blackroad-docs (Cloudflare Pages)
- **Description:** Technical documentation
- **Status:** ⏳ To deploy
- **Cost:** $0/month

**Backend:**
- None (static docs)

**DNS Setup:**
```
Type: CNAME
Name: docs
Content: blackroad-docs.pages.dev
Proxy: Yes
```

---

## 📊 Complete Subdomain Map

```
┌─────────────────────────────────────────────────────────────────────┐
│ BlackRoad OS - Complete Infrastructure                             │
└─────────────────────────────────────────────────────────────────────┘

Frontend (Cloudflare Pages - FREE)          Backend (Railway - $)
─────────────────────────────────────────   ──────────────────────────────────
blackroad.io                                 (none - static site)
├─ Marketing site
└─ Cost: $0/month

app.blackroad.io                             api.blackroad.io
├─ Agent console/dashboard          →        ├─ BlackRoad Core
└─ Cost: $0/month                            ├─ Core API
                                             ├─ PostgreSQL + Redis
                                             └─ Cost: $20/month

roadwork.blackroad.io                        api-roadwork.blackroad.io
├─ Job hunter UI                    →        ├─ FastAPI server
└─ Cost: $0/month                            ├─ Celery workers (3)
                                             ├─ PostgreSQL + Redis
                                             └─ Cost: $30/month

prism.blackroad.io                           (uses other APIs)
├─ Monitoring dashboard             →        ├─ Queries: api, operator, beacon
└─ Cost: $0/month                            └─ Cost: $0 (no dedicated backend)

docs.blackroad.io                            (none - static docs)
├─ Documentation
└─ Cost: $0/month

(API-only services - no frontend)
─────────────────────────────────────────
operator.blackroad.io                        ├─ Operator service
                                             ├─ PostgreSQL
                                             └─ Cost: $10/month

master.blackroad.io                          ├─ Master service
                                             ├─ PostgreSQL
                                             └─ Cost: $10/month

beacon.blackroad.io                          ├─ Beacon service
                                             ├─ Redis
                                             └─ Cost: $8/month

packs.blackroad.io                           ├─ 5 pack services
                                             ├─ PostgreSQL
                                             └─ Cost: $20/month
```

---

## 💰 Cost Breakdown by Subdomain

### Frontend Costs (Cloudflare Pages)
- blackroad.io: **$0/month**
- app.blackroad.io: **$0/month**
- roadwork.blackroad.io: **$0/month**
- prism.blackroad.io: **$0/month**
- docs.blackroad.io: **$0/month**

**Total Frontend: $0/month** ✨

### Backend Costs (Railway)
- api.blackroad.io (Core): **$20/month**
- api-roadwork.blackroad.io: **$30/month**
- operator.blackroad.io: **$10/month**
- master.blackroad.io: **$10/month**
- beacon.blackroad.io: **$8/month**
- packs.blackroad.io: **$20/month**

**Total Backend: $98/month**

### Grand Total
**$98/month** for complete BlackRoad OS ecosystem

---

## 🚀 Deployment Strategy

### Phase 1: RoadWork Only ($30/month)
```bash
# Deploy RoadWork backend
./scripts/deploy-railway-project.sh 01

# Configure DNS
# Cloudflare DNS → Add CNAME: api-roadwork → roadwork-production.up.railway.app

# Frontend already live at:
https://roadwork.blackroad.io (after DNS config)
```

### Phase 2: Add Core Platform (+$20/month = $50 total)
```bash
# Deploy BlackRoad Core
./scripts/deploy-railway-project.sh 03

# Configure DNS
# Cloudflare DNS → Add CNAME: api → blackroad-core-production.up.railway.app

# Deploy app.blackroad.io frontend
cd _personal/BlackRoad-Operating-System/prism-console
npm run build
npx wrangler pages deploy out --project-name=blackroad-console
```

### Phase 3: Add Control Plane (+$28/month = $78 total)
```bash
# Deploy Operator, Master, Beacon
./scripts/deploy-railway-project.sh 04
./scripts/deploy-railway-project.sh 05
./scripts/deploy-railway-project.sh 06
```

### Phase 4: Add Packs (+$20/month = $98 total)
```bash
# Deploy all domain packs
./scripts/deploy-railway-project.sh 07
```

---

## 🔐 Environment Variables Per Subdomain

### api-roadwork.blackroad.io
```bash
API_URL=https://api-roadwork.blackroad.io
FRONTEND_URL=https://roadwork.blackroad.io
ENVIRONMENT=production
```

### api.blackroad.io
```bash
API_URL=https://api.blackroad.io
FRONTEND_URL=https://app.blackroad.io
OPERATOR_URL=https://operator.blackroad.io
MASTER_URL=https://master.blackroad.io
BEACON_URL=https://beacon.blackroad.io
```

### operator.blackroad.io
```bash
OPERATOR_URL=https://operator.blackroad.io
CORE_API_URL=https://api.blackroad.io
MASTER_URL=https://master.blackroad.io
```

---

## 🌐 DNS Configuration Script

Create all DNS records at once:

```bash
# In Cloudflare Dashboard → blackroad.io → DNS

# Frontends (Cloudflare Pages)
CNAME  @         blackroad-home.pages.dev         Proxied
CNAME  app       blackroad-console.pages.dev      Proxied
CNAME  roadwork  roadwork.pages.dev               Proxied
CNAME  prism     blackroad-prism-console.pages.dev Proxied
CNAME  docs      blackroad-docs.pages.dev         Proxied

# Backends (Railway)
CNAME  api           blackroad-core-production.up.railway.app      Proxied
CNAME  api-roadwork  roadwork-production.up.railway.app            Proxied
CNAME  operator      blackroad-operator-production.up.railway.app  Proxied
CNAME  master        blackroad-master-production.up.railway.app    Proxied
CNAME  beacon        blackroad-beacon-production.up.railway.app    Proxied
CNAME  packs         blackroad-packs-production.up.railway.app     Proxied
```

---

## ✅ Quick Checklist

### For Each Subdomain:

**Frontend (Cloudflare Pages):**
- [ ] Create Pages project
- [ ] Deploy static site
- [ ] Configure custom domain
- [ ] Verify SSL certificate

**Backend (Railway):**
- [ ] Link to Railway project
- [ ] Add databases (PostgreSQL/Redis)
- [ ] Deploy service
- [ ] Set environment variables
- [ ] Configure custom domain in Railway
- [ ] Add DNS CNAME in Cloudflare
- [ ] Test health endpoint

---

## 📚 Related Documentation

- **RAILWAY_PROJECT_CONFIGURATION.md** - Complete Railway setup
- **RAILWAY_DEPLOYMENT_READY.md** - Deployment guide
- **ROADWORK_DEPLOYED.md** - RoadWork deployment status

---

## 🎯 Summary

**Architecture:**
- Each subdomain = 1 frontend (Cloudflare Pages) + 1 backend (Railway)
- Frontends are FREE on Cloudflare Pages
- Backends cost $8-30/month on Railway
- They communicate via API calls

**Example (RoadWork):**
```
User visits: roadwork.blackroad.io (Cloudflare Pages - FREE)
  ↓
Frontend calls: api-roadwork.blackroad.io/api/jobs/search (Railway - $30/month)
  ↓
Backend scrapes jobs, stores in database, returns data
  ↓
Frontend displays beautiful job cards
```

**Total Cost:** $0 (frontend) + $98 (backend) = **$98/month** for entire ecosystem

---

**All subdomains mapped and ready to deploy!** 🚀
