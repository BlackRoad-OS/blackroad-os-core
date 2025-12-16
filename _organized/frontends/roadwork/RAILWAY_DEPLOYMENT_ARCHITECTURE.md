# 🏗️ RoadWork Railway Deployment Architecture

## Recommended Setup: 2 Railway Projects

---

## 🎯 Option A: Minimal (Recommended - $20-30/month)

### **Project 1: RoadWork Production**
Use Railway ID: `9d3d2549-3778-4c86-8afd-cefceaaa74d2`

**Services in this project:**
1. **PostgreSQL Database** (Railway addon)
   - All application data
   - User profiles, jobs, applications
   - Cost: $5/month

2. **Redis Cache** (Railway addon)
   - Celery task queue
   - Rate limiting
   - Session storage
   - Cost: $5/month

3. **RoadWork API** (FastAPI)
   - Main REST API server
   - All 30+ endpoints
   - Start command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
   - Cost: $5-10/month

4. **RoadWork Worker** (Celery)
   - Background jobs (scraping, applications, emails, analytics)
   - Start command: `celery -A worker.celery_app worker --loglevel=info`
   - Cost: $5-10/month

5. **RoadWork Beat** (Celery Beat)
   - Scheduled tasks (daily job hunt, email summaries)
   - Start command: `celery -A worker.celery_app beat --loglevel=info`
   - Cost: $2-5/month

**Total for Project 1: $22-35/month**

---

## 🚀 Option B: Optimized (Most Cost-Effective - $15-25/month)

### **Project 1: RoadWork All-In-One**
Use Railway ID: `9d3d2549-3778-4c86-8afd-cefceaaa74d2`

**Services:**
1. **PostgreSQL** - $5/month
2. **Redis** - $5/month
3. **RoadWork API + Worker + Beat** (Combined) - $10-15/month
   - Run all three processes in one service
   - Use a process manager (Supervisor or Honcho)
   - Cheaper but less scalable

**Total: $20-25/month**

---

## 📊 Option C: Production-Grade (Future Scaling - $40-60/month)

### **Project 1: RoadWork Core**
Use Railway ID: `9d3d2549-3778-4c86-8afd-cefceaaa74d2`

**Services:**
1. PostgreSQL - $5/month
2. Redis - $5/month
3. RoadWork API - $10-15/month (with replicas for HA)

### **Project 2: RoadWork Workers**
Use Railway ID: `6d4ab1b5-3e97-460e-bba0-4db86691c476`

**Services:**
4. RoadWork Worker (Scraper) - $10-15/month
5. RoadWork Worker (Applicator) - $5-10/month
6. RoadWork Beat Scheduler - $5/month

**Total: $40-60/month**

---

## ✅ RECOMMENDED: Start with Option A

### Why Option A?
- ✅ Clean separation of concerns
- ✅ Easy to monitor each service
- ✅ Can scale individual services
- ✅ Railway auto-restarts failed services
- ✅ Good balance of cost vs. features
- ✅ All in ONE project = easy management

### How to Set Up Option A

#### Step 1: Link to Project
```bash
railway link 9d3d2549-3778-4c86-8afd-cefceaaa74d2
```

#### Step 2: Add Database & Cache
```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis
```

#### Step 3: Create API Service
```bash
# Create railway.toml in roadwork/
cat > railway.toml <<EOF
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "uvicorn api.main:app --host 0.0.0.0 --port \$PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
EOF

# Deploy
railway up
```

#### Step 4: Create Worker Service
```bash
# In Railway Dashboard:
# 1. Click "New Service"
# 2. Select "From GitHub Repo"
# 3. Choose blackroad-sandbox repo
# 4. Set root directory: roadwork/
# 5. Set start command: celery -A worker.celery_app worker --loglevel=info
# 6. Set environment variables (copy from API service)
```

#### Step 5: Create Beat Service
```bash
# Same as worker, but start command is:
# celery -A worker.celery_app beat --loglevel=info
```

#### Step 6: Set Environment Variables
```bash
# These are shared across all services:
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set OPENAI_API_KEY=sk-...
railway variables set SENDGRID_API_KEY=SG...
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set JWT_SECRET_KEY=$(openssl rand -hex 32)
railway variables set FERNET_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
railway variables set ENVIRONMENT=production
```

---

## 🔄 Migration Path

### Start Small, Scale Later

**Week 1:** Use Option B (All-in-one) - $20/month
- Get everything working
- Test all features
- Deploy to production

**Month 2-3:** Move to Option A (Separated) - $30/month
- Split services for better monitoring
- Scale worker separately if needed
- Add more worker replicas during peak times

**Month 6+:** Move to Option C (Full Production) - $50/month
- If you have 1000+ users
- Need high availability
- Want dedicated worker pools

---

## 🎯 My Recommendation for Launch

### Use **Option A** with these 5 services:

```
Railway Project: 9d3d2549-3778-4c86-8afd-cefceaaa74d2
├── postgres (Railway addon) - $5/month
├── redis (Railway addon) - $5/month
├── roadwork-api (FastAPI) - $8/month
├── roadwork-worker (Celery) - $8/month
└── roadwork-beat (Celery Beat) - $4/month
────────────────────────────────────────────────
Total: ~$30/month
```

### Why This Works
1. **All in ONE project** = easy to manage
2. **Separate services** = easy to scale/debug
3. **Cost-effective** for starting out
4. **Railway auto-restarts** each service independently
5. **Easy monitoring** - see which service has issues

---

## 📝 Service Configuration Files

### API Service (railway.toml)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "uvicorn api.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
```

### Worker Service (railway-worker.toml)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "celery -A worker.celery_app worker --loglevel=info"
restartPolicyType = "ON_FAILURE"
```

### Beat Service (railway-beat.toml)
```toml
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "celery -A worker.celery_app beat --loglevel=info"
restartPolicyType = "ON_FAILURE"
```

---

## 🚦 Health Check Endpoints

All services should be healthy:

```bash
# API
curl https://roadwork-api-production.up.railway.app/health

# Worker (no HTTP, check Railway logs)
railway logs --service roadwork-worker

# Beat (no HTTP, check Railway logs)
railway logs --service roadwork-beat
```

---

## 💡 Pro Tips

1. **Use ONE Railway project** for all RoadWork services
   - Easier to manage
   - Shared environment variables
   - Simpler networking

2. **Set resource limits** to control costs:
   ```
   Memory: 512MB per service (start)
   CPU: Shared (start)
   Scale up if needed
   ```

3. **Enable auto-deploy** from GitHub:
   - Push to main → auto-deploy
   - No manual deployments needed

4. **Use Railway CLI** for everything:
   ```bash
   railway logs -f
   railway status
   railway variables
   ```

---

## 🎯 Summary

**For RoadWork, you need:**
- ✅ **1 Railway Project** (use ID: 9d3d2549-3778-4c86-8afd-cefceaaa74d2)
- ✅ **5 Services** (postgres, redis, api, worker, beat)
- ✅ **Total Cost:** ~$30/month

**You have 4 more Railway projects available** for:
- Staging environment (Project 2)
- Other BlackRoad services (Projects 3-5)

**Start with this setup, then scale as needed!** 🚀
