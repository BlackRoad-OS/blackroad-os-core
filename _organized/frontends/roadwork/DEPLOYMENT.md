# 🚀 RoadWork Deployment Guide

## Production URLs

- **Frontend:** https://roadwork.blackroad.io
- **API:** https://api-roadwork.blackroad.io (Railway)
- **Dashboard:** https://roadwork.blackroad.io/dashboard

---

## Railway Deployment

### API Server

1. **Create New Project:**
   ```bash
   # Login to Railway
   railway login

   # Create new project
   railway init
   railway link roadwork-production
   ```

2. **Add PostgreSQL Database:**
   ```bash
   # Add PostgreSQL service
   railway add postgresql

   # Get connection string
   railway variables
   ```

3. **Add Redis:**
   ```bash
   # Add Redis service
   railway add redis
   ```

4. **Set Environment Variables:**
   ```bash
   # API keys
   railway variables set ANTHROPIC_API_KEY=sk-ant-...
   railway variables set OPENAI_API_KEY=sk-...

   # SendGrid
   railway variables set SENDGRID_API_KEY=SG...
   railway variables set SENDGRID_FROM_EMAIL=noreply@blackroad.io

   # Stripe
   railway variables set STRIPE_SECRET_KEY=sk_live_...
   railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...

   # JWT
   railway variables set JWT_SECRET_KEY=your-secret-key
   railway variables set FERNET_KEY=your-fernet-key

   # Google OAuth
   railway variables set GOOGLE_CLIENT_ID=...
   railway variables set GOOGLE_CLIENT_SECRET=...
   ```

5. **Deploy API:**
   ```bash
   # Push to Railway
   railway up

   # Check logs
   railway logs
   ```

6. **Run Migrations:**
   ```bash
   railway run alembic upgrade head
   ```

### Worker Processes

1. **Create Worker Service:**
   ```bash
   # Create new service for workers
   railway service create roadwork-worker

   # Deploy with different start command
   railway variables set START_COMMAND="celery -A worker.celery_app worker --loglevel=info"
   ```

2. **Create Beat Scheduler:**
   ```bash
   # Create service for scheduled tasks
   railway service create roadwork-beat

   # Set start command
   railway variables set START_COMMAND="celery -A worker.celery_app beat --loglevel=info"
   ```

---

## Cloudflare Pages Deployment

### Frontend

1. **Connect to GitHub:**
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect to GitHub repository
   - Select `blackroad-sandbox/roadwork` repository

2. **Build Configuration:**
   ```
   Build command: cd frontend && pnpm install && pnpm build
   Build output directory: frontend/out
   Root directory: /
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api-roadwork.blackroad.io
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

4. **Custom Domain:**
   - Go to Pages project → Custom domains
   - Add: `roadwork.blackroad.io`
   - Cloudflare will auto-configure DNS

---

## Database Setup

### Initialize Database

```bash
# SSH into Railway container
railway run bash

# Run migrations
alembic upgrade head

# Or initialize fresh
python -c "from database import init_db; init_db()"
```

### Create Initial Data

```python
# Create admin user
from database import get_db
from database.models import User, UserProfile, SubscriptionTier
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

with get_db() as db:
    admin = User(
        email="admin@blackroad.io",
        password_hash=pwd_context.hash("change-this-password"),
        name="Admin User",
        subscription_tier=SubscriptionTier.PREMIUM
    )
    db.add(admin)
    db.commit()
```

---

## Celery Workers

### Local Development

```bash
# Start Redis
redis-server

# Start Celery worker
celery -A worker.celery_app worker --loglevel=info

# Start Celery beat (scheduler)
celery -A worker.celery_app beat --loglevel=info

# Start both with Flower (monitoring)
celery -A worker.celery_app worker --loglevel=info &
celery -A worker.celery_app beat --loglevel=info &
celery -A worker.celery_app flower
```

### Production (Railway)

Workers and beat scheduler are deployed as separate Railway services with different start commands (see above).

---

## Playwright Setup

### Install Playwright Browsers

```bash
# In Railway
railway run playwright install chromium

# Add to Dockerfile if using custom container
RUN playwright install --with-deps chromium
```

---

## Health Checks

All services have health check endpoints:

- **API:** `https://api-roadwork.blackroad.io/health`
- **Frontend:** `https://roadwork.blackroad.io/api/health`

Railway auto-configures health checks using these endpoints.

---

## Monitoring

### Sentry Error Tracking

```bash
# Set Sentry DSN
railway variables set SENTRY_DSN=https://...@sentry.io/...
```

### Railway Observability

- View logs: `railway logs`
- View metrics: Railway Dashboard → Metrics
- Set up alerts in Railway Dashboard

---

## Scaling

### Railway

```bash
# Scale API replicas
railway service scale --replicas 2

# Increase resources
railway service scale --memory 2GB --cpu 2
```

### Worker Scaling

Workers auto-scale based on queue size. Configure in `worker/celery_app.py`:

```python
celery_app.conf.update(
    worker_max_tasks_per_child=1000,
    worker_prefetch_multiplier=4,
)
```

---

## Backup Strategy

### Database Backups

```bash
# Manual backup
railway run pg_dump > backup.sql

# Restore
railway run psql < backup.sql
```

Railway PostgreSQL includes automatic daily backups.

### Redis Backups

Redis data is ephemeral (caching only). No backups needed.

---

## SSL/HTTPS

- **Cloudflare Pages:** Automatic SSL
- **Railway:** Automatic SSL for all services

---

## DNS Configuration

```
roadwork.blackroad.io        CNAME    roadwork.pages.dev
api-roadwork.blackroad.io    CNAME    roadwork-api-production.up.railway.app
```

Cloudflare auto-manages SSL certificates and proxying.

---

## Cost Estimate

### Railway ($20-40/month)

- PostgreSQL: $5/month (512MB)
- Redis: $5/month (256MB)
- API Server: $5-10/month (512MB-1GB RAM)
- Worker: $5-10/month (512MB-1GB RAM)
- Beat Scheduler: $2-5/month (256MB RAM)

### Cloudflare (Free)

- Pages: $0 (Free tier, unlimited bandwidth)
- DNS: $0
- SSL: $0

### External Services

- SendGrid: $0 (12K emails/month free)
- Sentry: $0 (5K errors/month free)
- Stripe: 2.9% + $0.30 per transaction

**Total: $20-40/month**

---

## Deployment Checklist

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Redis cache added
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] API server deployed
- [ ] Worker processes deployed
- [ ] Beat scheduler deployed
- [ ] Cloudflare Pages connected
- [ ] Custom domain configured
- [ ] SSL certificates verified
- [ ] Health checks passing
- [ ] Sentry configured
- [ ] Email sending working
- [ ] Stripe webhooks configured
- [ ] Test signup flow
- [ ] Test job scraping
- [ ] Test application submission
- [ ] Test email notifications

---

## Troubleshooting

### API not starting

```bash
railway logs
# Check for missing environment variables
# Verify DATABASE_URL is set
```

### Database connection failed

```bash
railway run psql
# Test direct connection
# Check firewall rules
```

### Celery tasks not running

```bash
# Check Redis connection
railway run redis-cli ping

# Check worker logs
railway logs --service roadwork-worker
```

### Playwright errors

```bash
# Install browsers
railway run playwright install chromium

# Check headless mode
# Verify memory limits (need at least 512MB)
```

---

## Next Steps

1. Deploy API to Railway ✅
2. Deploy workers to Railway ✅
3. Set up database and run migrations ✅
4. Deploy frontend to Cloudflare Pages (next)
5. Configure custom domains
6. Test end-to-end flow
7. Set up monitoring alerts
8. Launch! 🚀
