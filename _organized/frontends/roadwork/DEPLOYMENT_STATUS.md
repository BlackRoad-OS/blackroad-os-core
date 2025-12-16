# 🚀 RoadWork Deployment Status

**Last Updated:** 2025-12-14

---

## 🌐 Production URLs

### Live Endpoints

- **Frontend:** https://roadwork.blackroad.io (Cloudflare Pages - *to be deployed*)
- **API:** https://roadwork-production.up.railway.app (Railway - *to be deployed*)
- **Custom Domain:** https://api-roadwork.blackroad.io (DNS CNAME - *to be configured*)

### Health Checks

```bash
# Check API health
curl https://roadwork-production.up.railway.app/health

# Check metrics
curl https://roadwork-production.up.railway.app/metrics

# Check readiness
curl https://roadwork-production.up.railway.app/ready
```

---

## 🚂 Railway Infrastructure

### Project: RoadWork Production
**Project ID:** `9d3d2549-3778-4c86-8afd-cefceaaa74d2`

**Services to Deploy:**
1. ⏳ PostgreSQL Database (Railway addon)
2. ⏳ Redis Cache (Railway addon)
3. ⏳ RoadWork API (FastAPI server)
4. ⏳ RoadWork Worker (Celery worker)
5. ⏳ RoadWork Beat (Celery beat scheduler)

**Status:** Ready to deploy - waiting for deployment

---

## 📋 Deployment Checklist

### Phase 1: Railway Backend (30 minutes)

#### Step 1: Link Project
```bash
cd /Users/alexa/blackroad-sandbox/roadwork
railway link 9d3d2549-3778-4c86-8afd-cefceaaa74d2
```
- [ ] Linked to Railway project

#### Step 2: Add Database & Cache
```bash
railway add postgresql
railway add redis
```
- [ ] PostgreSQL added
- [ ] Redis added
- [ ] Connection strings saved

#### Step 3: Set Environment Variables
```bash
# Copy these commands and fill in your API keys:

railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set OPENAI_API_KEY=sk-...
railway variables set SENDGRID_API_KEY=SG...
railway variables set SENDGRID_FROM_EMAIL=noreply@blackroad.io
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set JWT_SECRET_KEY=$(openssl rand -hex 32)
railway variables set FERNET_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
railway variables set GOOGLE_CLIENT_ID=...
railway variables set GOOGLE_CLIENT_SECRET=...
railway variables set GOOGLE_REDIRECT_URI=https://roadwork.blackroad.io/auth/google/callback
railway variables set SENTRY_DSN=https://...@sentry.io/...
railway variables set ENVIRONMENT=production
railway variables set API_URL=https://roadwork-production.up.railway.app
railway variables set FRONTEND_URL=https://roadwork.blackroad.io
```
- [ ] All environment variables set

#### Step 4: Deploy API
```bash
railway up
```
- [ ] API deployed
- [ ] Health check passing (`/health`)

#### Step 5: Run Database Migrations
```bash
railway run alembic upgrade head
```
- [ ] Migrations completed
- [ ] Database schema created

#### Step 6: Create Worker Service
In Railway Dashboard:
1. Click "New Service"
2. Select "From GitHub Repo"
3. Choose `blackroad-sandbox` repo
4. Set root directory: `roadwork/`
5. Set start command: `celery -A worker.celery_app worker --loglevel=info`
6. Copy environment variables from API service

- [ ] Worker service created
- [ ] Environment variables copied
- [ ] Worker running (check logs)

#### Step 7: Create Beat Service
Same as worker, but start command:
```
celery -A worker.celery_app beat --loglevel=info
```
- [ ] Beat service created
- [ ] Beat running (check logs)

---

### Phase 2: Cloudflare Pages Frontend (15 minutes)

#### Step 1: Connect GitHub
1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect to GitHub
4. Select `blackroad-sandbox` repository

- [ ] GitHub connected

#### Step 2: Configure Build
```
Project name: roadwork
Branch: main
Build command: cd roadwork/frontend && pnpm install && pnpm build
Build output directory: roadwork/frontend/out
Root directory: /
```
- [ ] Build settings configured

#### Step 3: Set Environment Variables
```
NEXT_PUBLIC_API_URL=https://roadwork-production.up.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```
- [ ] Environment variables set

#### Step 4: Deploy
Click "Save and Deploy"

- [ ] First build started
- [ ] Build succeeded
- [ ] Site live at `*.pages.dev`

#### Step 5: Add Custom Domain
1. Go to project → Custom domains
2. Add `roadwork.blackroad.io`
3. Cloudflare auto-configures DNS

- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL certificate active

---

### Phase 3: DNS Configuration (5 minutes)

#### API Custom Domain

In Cloudflare DNS:
```
Type: CNAME
Name: api-roadwork
Content: roadwork-production.up.railway.app
Proxy: Yes (orange cloud)
TTL: Auto
```
- [ ] DNS record created
- [ ] SSL active

---

### Phase 4: Testing & Verification (10 minutes)

#### Backend Tests
```bash
# Test health
curl https://roadwork-production.up.railway.app/health

# Test API endpoints
curl https://roadwork-production.up.railway.app/

# Check logs
railway logs
```
- [ ] Health check passing
- [ ] API responding
- [ ] No errors in logs

#### Frontend Tests
```bash
# Visit site
open https://roadwork.blackroad.io

# Test pages
# - Landing page loads
# - Signup page works
# - Login page works
```
- [ ] Landing page loads
- [ ] All pages accessible
- [ ] No console errors

#### Integration Tests
1. Sign up for account
2. Complete onboarding
3. View dashboard
4. Check email notifications

- [ ] Signup flow works
- [ ] Onboarding completes
- [ ] Dashboard displays
- [ ] Emails sending

---

## 🔐 Secrets Management

### Required API Keys

**AI Services:**
- ANTHROPIC_API_KEY - Get from: https://console.anthropic.com
- OPENAI_API_KEY - Get from: https://platform.openai.com

**Email:**
- SENDGRID_API_KEY - Get from: https://app.sendgrid.com
- SENDGRID_FROM_EMAIL - Your verified sender

**Payment:**
- STRIPE_SECRET_KEY - Get from: https://dashboard.stripe.com
- STRIPE_PUBLISHABLE_KEY - Get from: https://dashboard.stripe.com
- STRIPE_WEBHOOK_SECRET - Create webhook first

**Google OAuth:**
- GOOGLE_CLIENT_ID - Get from: https://console.cloud.google.com
- GOOGLE_CLIENT_SECRET - Get from: https://console.cloud.google.com

**Monitoring:**
- SENTRY_DSN - Get from: https://sentry.io

**Generated (run locally):**
```bash
# JWT Secret
openssl rand -hex 32

# Fernet Key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

## 💰 Cost Tracking

### Monthly Costs

**Railway ($30/month):**
- PostgreSQL: $5/month
- Redis: $5/month
- API: $8/month
- Worker: $8/month
- Beat: $4/month

**Cloudflare ($0/month):**
- Pages hosting: Free
- DNS: Free
- SSL: Free
- Bandwidth: Unlimited (free tier)

**External Services (Variable):**
- SendGrid: $0 (12K emails/month free)
- Sentry: $0 (5K errors/month free)
- Stripe: 2.9% + $0.30 per transaction

**Total: ~$30/month**

---

## 📊 Monitoring

### Health Checks

**Endpoints:**
- `/health` - Basic health (200 OK)
- `/ready` - Database connection check
- `/metrics` - API metrics (requests, errors, latency)

**Railway Auto-Monitoring:**
- CPU usage
- Memory usage
- Request count
- Error rate

**Sentry Error Tracking:**
- Exceptions
- Performance issues
- User feedback

---

## 🚨 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check Railway logs
railway logs

# Verify environment variables
railway variables

# Rebuild
railway up --detach
```

**Database Connection Error:**
```bash
# Check DATABASE_URL
railway variables | grep DATABASE_URL

# Test connection
railway run psql

# Run migrations
railway run alembic upgrade head
```

**Worker Not Processing:**
```bash
# Check worker logs
railway logs --service roadwork-worker

# Check Redis connection
railway run redis-cli ping

# Restart worker
railway restart --service roadwork-worker
```

**Frontend Build Error:**
- Check Cloudflare Pages build logs
- Verify build command path
- Check environment variables

---

## 📞 Support Contacts

**Railway:**
- Dashboard: https://railway.app
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Cloudflare:**
- Dashboard: https://dash.cloudflare.com
- Docs: https://developers.cloudflare.com
- Community: https://community.cloudflare.com

**BlackRoad:**
- Email: blackroad.systems@gmail.com
- Primary: amundsonalexa@gmail.com

---

## 🎯 Next Steps After Deployment

1. **Test all features end-to-end**
2. **Set up Stripe webhooks**
3. **Configure Google OAuth**
4. **Add first test users**
5. **Monitor logs for 24 hours**
6. **Run first automated job hunt**
7. **Send test emails**
8. **Launch! 🚀**

---

## ✅ Deployment Progress

**Overall Status:** 🟡 Ready to Deploy

- ✅ Code complete (17,000+ lines)
- ✅ Documentation complete
- ✅ Railway project configured
- ✅ Environment template ready
- ⏳ Deployment pending
- ⏳ DNS configuration pending
- ⏳ Testing pending
- ⏳ Launch pending

**Estimated Time to Production:** 60 minutes

---

**Ready to deploy RoadWork to production!** 🚀

**All 14 Railway projects tracked and ready for the complete BlackRoad OS ecosystem!**
