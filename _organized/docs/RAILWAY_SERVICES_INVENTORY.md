# 🚂 Railway Services Inventory

**Complete list of all Railway-ready services in your codebase**

Last Updated: 2025-12-14

---

## 🎯 Services Ready for Railway Deployment

### 1. RoadWork (Complete Production System)
**Location:** `/Users/alexa/blackroad-sandbox/roadwork/`
**Railway Config:** `roadwork/railway.toml`
**Status:** ✅ Complete & Ready

**Services:**
- `roadwork-api` - FastAPI server (600+ lines)
- `roadwork-worker` - Celery worker
- `roadwork-beat` - Celery beat scheduler
- PostgreSQL database
- Redis cache

**Recommended Project:** Project 01 (`9d3d2549-3778-4c86-8afd-cefceaaa74d2`)

---

### 2. BlackRoad OS Core
**Location:** `/Users/alexa/blackroad-sandbox/`
**Railway Config:** `railway.toml`
**Status:** ✅ Has config

**Service:**
- `blackroad-os-core` - Core library services
- Port: 8080
- Health check: `/health`

**Recommended Project:** Project 03 (`aa968fb7-ec35-4a8b-92dc-1eba70fa8478`)

---

### 3. BlackRoad OS Master
**Location:** `/Users/alexa/blackroad-sandbox/blackroad-os-master/`
**Railway Config:** `blackroad-os-master/railway.toml`
**Status:** ✅ Has config

**Service:**
- `blackroad-os-master` - Master control services
- Port: 8080
- Health check: `/health`

**Recommended Project:** Project 05 (`85e6de55-fefd-4e8d-a9ec-d20c235c2551`)

---

### 4. BlackRoad OS Operator
**Location:** `/Users/alexa/blackroad-sandbox/_personal/BlackRoad-Operating-System/operator_engine/`
**Railway Config:** `operator_engine/railway.toml`
**Status:** ⚠️ Needs review

**Service:**
- `blackroad-os-operator` - Orchestration layer ("Cece" agent)
- Port: 8080 (likely)

**Recommended Project:** Project 04 (`e8b256aa-8708-4eb2-ba24-99eba4fe7c2e`)

---

### 5. Prism Console
**Location:** `/Users/alexa/blackroad-sandbox/_personal/BlackRoad-Operating-System/prism-console/`
**Railway Config:** `prism-console/railway.toml`
**Status:** ⚠️ Needs review

**Service:**
- `prism-console` - Monitoring dashboard UI
- Likely static site (consider Cloudflare Pages instead)

**Alternative:** Deploy to Cloudflare Pages (free)
**Recommended Project (if Railway):** Project 08 (`47f557cf-09b8-40df-8d77-b34f91ba90cc`)

---

### 6. BlackRoad Public API
**Location:** `/Users/alexa/blackroad-sandbox/_personal/BlackRoad-Operating-System/services/public-api/`
**Railway Config:** `services/public-api/railway.toml`
**Status:** ⚠️ Needs review

**Service:**
- `public-api` - Public-facing API
- Port: 8080 (likely)

**Recommended Project:** Project 03 or 04

---

### 7. BlackRoad Core API
**Location:** `/Users/alexa/blackroad-sandbox/_personal/BlackRoad-Operating-System/services/core-api/`
**Railway Config:** `services/core-api/railway.toml`
**Status:** ⚠️ Needs review

**Service:**
- `core-api` - Core API services
- Port: 8080 (likely)

**Recommended Project:** Project 03

---

### 8. Infrastructure Services
**Location:** `/Users/alexa/blackroad-sandbox/infra/`
**Railway Config:** `infra/railway.toml`
**Status:** ⚠️ Needs review

**Purpose:** Infrastructure management/tooling

**Recommended Project:** Project 06 or standalone

---

### 9. BlackboxProgramming
**Location:** `/Users/alexa/blackroad-sandbox/blackboxprogramming/`
**Railway Config:** `blackboxprogramming/railway.toml`
**Status:** ⚠️ Needs review

**Service:**
- Separate project (blackboxprogramming org)
- May need its own Railway project

**Recommended Project:** Separate Railway account or Project 10+

---

## 📊 Deployment Priority

### 🔴 Priority 1 - Deploy First
1. **RoadWork** (complete, tested, documented)
   - Project 01
   - 5 services total
   - ~$30/month

### 🟡 Priority 2 - Deploy Next
2. **BlackRoad OS Core** (main library)
   - Project 03
   - 1 service
   - ~$10/month

3. **BlackRoad OS Master** (control plane)
   - Project 05
   - 1 service
   - ~$10/month

### 🟢 Priority 3 - Deploy Later
4. **BlackRoad OS Operator** (orchestration)
   - Project 04
   - 1 service
   - ~$10/month

5. **APIs** (public-api, core-api)
   - Projects 03/04
   - 2 services
   - ~$15/month

6. **Prism Console** → Consider Cloudflare Pages instead

---

## 🎯 Recommended Railway Project Assignment

### Complete Deployment Strategy

```
Project 01: RoadWork Production
├── roadwork-api
├── roadwork-worker
├── roadwork-beat
├── postgres
└── redis
Cost: $30/month

Project 02: RoadWork Staging
├── roadwork-api-staging
├── postgres-staging
└── redis-staging
Cost: $15/month

Project 03: BlackRoad Core Services
├── blackroad-os-core
├── core-api
├── postgres
└── redis
Cost: $20/month

Project 04: BlackRoad Operator
├── blackroad-os-operator
└── postgres
Cost: $10/month

Project 05: BlackRoad Master
├── blackroad-os-master
└── postgres
Cost: $10/month

Project 06: BlackRoad Beacon (Monitoring)
├── blackroad-os-beacon (health checks)
└── redis
Cost: $8/month

Project 07: BlackRoad Packs
├── pack-finance
├── pack-legal
├── pack-research-lab
├── pack-creator-studio
├── pack-infra-devops
└── postgres
Cost: $20/month

Project 08: Prism Console (or Cloudflare Pages)
└── Static site (if using Railway)
Cost: $5/month or $0 (Cloudflare)

Project 09: BlackRoad Home (or Cloudflare Pages)
└── Marketing site
Cost: $5/month or $0 (Cloudflare)

Projects 10-14: Available for expansion
```

**Total Estimated Cost (All Deployed): $123/month**
**Recommended Start: $30/month (RoadWork only)**

---

## 🔍 Next Steps

### 1. Review Each Service
For each service with ⚠️ status:
```bash
cd [service-directory]
cat railway.toml
cat package.json  # or requirements.txt
ls -la
```

### 2. Verify Health Endpoints
Ensure each service has:
- `/health` endpoint
- `/ready` endpoint (optional)
- Proper error handling

### 3. Update Railway Configs
Make sure each `railway.toml` has:
- Correct `startCommand`
- Health check path
- Restart policy
- Environment variables

### 4. Test Locally
Before deploying:
```bash
# For Node services
npm install
npm start

# For Python services
pip install -r requirements.txt
python main.py
```

### 5. Deploy in Order
1. Start with RoadWork (highest priority, most complete)
2. Then BlackRoad Core services
3. Then supporting services
4. Monitor costs and scale as needed

---

## 📋 Service Health Check Template

All services should implement:

```javascript
// Node.js / Express
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'service-name',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

app.get('/ready', async (req, res) => {
  // Check database connection
  // Check Redis connection
  // Check external dependencies
  res.json({
    ready: true,
    checks: {
      database: 'ok',
      redis: 'ok'
    }
  })
})
```

```python
# Python / FastAPI
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "service-name",
        "version": "1.0.0",
        "timestamp": datetime.now(UTC).isoformat()
    }

@app.get("/ready")
async def ready():
    # Check connections
    return {
        "ready": True,
        "checks": {
            "database": "ok",
            "redis": "ok"
        }
    }
```

---

## 🚀 Quick Deploy Commands

### For Each Service

```bash
# 1. Navigate to service
cd /Users/alexa/blackroad-sandbox/[service-name]

# 2. Link to Railway project
railway link [PROJECT_ID]

# 3. Deploy
railway up

# 4. Check logs
railway logs

# 5. Check status
railway status
```

---

## 📞 Support

**Need help deploying a specific service?**
- Check service README
- Review railway.toml configuration
- Test locally first
- Deploy to staging before production

**Railway Issues:**
- Dashboard: https://railway.app
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

**All Railway-ready services inventoried and mapped to projects!** 🎉
