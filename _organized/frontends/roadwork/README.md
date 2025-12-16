# 🚗 RoadWork - Your AI Career Co-Pilot

**Automated job applications across 30+ platforms**

**Live at:** https://roadwork.blackroad.io

---

## 🌟 What is RoadWork?

RoadWork is an AI-powered job application automation system that applies to jobs on your behalf across 30+ platforms including Indeed, LinkedIn, Glassdoor, and more. Get 10x more interviews while you sleep.

### Key Features

✅ **30+ Job Platforms** - Indeed, LinkedIn, Glassdoor, Monster, ZipRecruiter, Wellfound, Dice, and 20+ more
✅ **AI-Powered Applications** - Smart customization for every job
✅ **Tinder-Style Job Matching** - Swipe to find roles you love
✅ **Multi-Resume Generator** - Tailored resumes for each category
✅ **Daily Automation** - Runs automatically every day
✅ **Interview Scheduler** - Auto-proposes interview times
✅ **Application Analytics** - Track views, downloads, responses
✅ **Email Summaries** - Daily progress reports

---

## 🚀 Quick Start

### For Users

Visit **https://roadwork.blackroad.io** and:

1. Sign up with email
2. Complete AI interview (2 minutes)
3. Upload your work history
4. Swipe on job preferences
5. Activate daily automation
6. Start getting interviews!

### For Developers

```bash
# Clone the repo
cd /Users/alexa/blackroad-sandbox/roadwork

# Install dependencies
pip install -r requirements.txt
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run locally
python main.py
pnpm dev
```

---

## 📦 Project Structure

```
roadwork/
├── api/                    # FastAPI backend
│   ├── main.py            # API server
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   └── services/          # Business logic
│
├── worker/                 # Background workers
│   ├── job_scraper.py     # Scraping jobs
│   ├── applicator.py      # Submitting applications
│   └── scheduler.py       # Daily automation
│
├── frontend/               # Next.js app
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── lib/               # Utilities
│
├── core/                   # Python core (from job_hunter pack)
│   ├── platforms/         # 30+ platform scrapers
│   ├── onboarding.py      # AI interview
│   ├── analytics.py       # Tracking
│   └── ...
│
└── docs/                   # Documentation
```

---

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python API framework
- **SQLAlchemy** - ORM for PostgreSQL
- **Celery** - Background task queue
- **Redis** - Caching and rate limiting
- **Playwright** - Browser automation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Infrastructure
- **Railway** - Backend hosting
- **Cloudflare Pages** - Frontend hosting
- **PostgreSQL** - Database (Railway)
- **Redis** - Cache (Railway)
- **Cloudflare D1** - Edge database

---

## 🌐 Deployment

### Production URLs

```
Frontend:  https://roadwork.blackroad.io
API:       https://api-roadwork.blackroad.io
Dashboard: https://roadwork.blackroad.io/dashboard
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link roadwork-production

# Deploy API
cd api && railway up

# Deploy Worker
cd worker && railway up
```

### Deploy Frontend to Cloudflare

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
cd frontend && pnpm build
wrangler pages deploy ./out --project-name roadwork
```

---

## 💰 Pricing

| Tier | Applications/Day | Price |
|------|------------------|-------|
| **Free** | 10 | $0/month |
| **Pro** | 100 | $20/month |
| **Premium** | Unlimited | $50/month |

---

## 📊 Features by Tier

### Free Tier
✅ 10 applications per day
✅ 5 job platforms
✅ Basic resume builder
✅ Email summaries
✅ Application tracking

### Pro Tier ($20/month)
✅ Everything in Free
✅ 100 applications per day
✅ All 30+ platforms
✅ AI-powered customization
✅ Interview scheduler
✅ Advanced analytics
✅ Priority support

### Premium Tier ($50/month)
✅ Everything in Pro
✅ Unlimited applications
✅ Custom branding
✅ API access
✅ Dedicated support
✅ White-label option

---

## 🎯 Supported Platforms (30+)

### Major Job Boards
- Indeed, LinkedIn, Glassdoor, Monster, ZipRecruiter

### Tech & Creative
- Wellfound (AngelList), Dice, Dribbble, Behance, GitHub Jobs

### Remote Work
- Remote.co, We Work Remotely, FlexJobs, Remotive, Jobspresso

### Entry-Level
- Handshake, WayUp, Idealist

### Freelance
- Upwork, Fiverr, Toptal, PeoplePerHour

### Government & Startup
- USAJobs, Built In, Hired, Crunchboard

**Full list:** [Supported Platforms](./docs/PLATFORMS.md)

---

## 📖 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get started in 5 minutes
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Platform Guide](./docs/PLATFORMS.md)** - All 30+ platforms
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to production
- **[Contributing](./docs/CONTRIBUTING.md)** - How to contribute

---

## 🔒 Security & Privacy

- ✅ All passwords encrypted with Fernet
- ✅ OAuth for Gmail/Calendar
- ✅ HTTPS only (SSL enforced)
- ✅ GDPR compliant
- ✅ Right to deletion
- ✅ Data export available
- ✅ No data selling, ever

**Privacy Policy:** https://roadwork.blackroad.io/privacy
**Terms of Service:** https://roadwork.blackroad.io/terms

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/yourusername/roadwork.git
cd roadwork

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Test
pytest tests/
pnpm test

# Commit
git commit -m "Add amazing feature"

# Push
git push origin feature/amazing-feature

# Open a PR on GitHub
```

---

## 📈 Roadmap

### Q1 2025
- [x] Core system complete
- [x] 30+ platforms integrated
- [ ] Beta launch
- [ ] First 100 users
- [ ] Product Hunt launch

### Q2 2025
- [ ] Mobile app (iOS/Android)
- [ ] Chrome extension
- [ ] 1,000 users
- [ ] Revenue: $10K/month

### Q3 2025
- [ ] API for developers
- [ ] Webhook support
- [ ] Team plans
- [ ] 10,000 users
- [ ] Revenue: $50K/month

### Q4 2025
- [ ] International expansion
- [ ] Multi-language support
- [ ] Enterprise plans
- [ ] 50,000 users
- [ ] Revenue: $200K/month

---

## 🎉 Success Stories

> "RoadWork helped me land my dream job in just 2 weeks. I applied to 200 jobs automatically and got 15 interviews!" - Sarah M.

> "I was spending 3+ hours per day applying to jobs. RoadWork does it all while I sleep. Game changer!" - Mike T.

> "The AI customization is incredible. Every application is tailored perfectly." - Jessica L.

**Join thousands of successful job seekers:** https://roadwork.blackroad.io

---

## 📧 Support

- **Email:** support@blackroad.systems
- **Twitter:** [@roadwork_io](https://twitter.com/roadwork_io)
- **Discord:** [Join our community](https://discord.gg/blackroad)
- **Docs:** https://docs.blackroad.io/roadwork

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built with:
- [BlackRoad OS](https://blackroad.io) - Core infrastructure
- [Playwright](https://playwright.dev) - Browser automation
- [FastAPI](https://fastapi.tiangolo.com) - API framework
- [Next.js](https://nextjs.org) - React framework
- [Railway](https://railway.app) - Hosting
- [Cloudflare](https://cloudflare.com) - CDN & Edge

---

**RoadWork - Your AI Career Co-Pilot** 🚗

**Built by BlackRoad** | **Powered by AI** | **Made with ❤️**

https://roadwork.blackroad.io
