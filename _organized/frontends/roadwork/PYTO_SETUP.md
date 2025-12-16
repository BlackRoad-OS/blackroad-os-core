# 🚗📱 RoadWork Setup for Pyto (iOS)

**Running RoadWork job automation on your iPhone with Pyto**

---

## 📲 What is Pyto?

Pyto is a Python IDE for iOS that lets you run Python scripts on your iPhone/iPad.

**App Store:** https://apps.apple.com/app/pyto-python-3/id1436650069

---

## ✅ What Works in Pyto

- ✅ **FastAPI server** - Full REST API
- ✅ **Job search** - Mock job matching
- ✅ **User management** - Signup/login
- ✅ **Applications tracking** - Submit and track
- ✅ **Analytics** - Stats and insights
- ✅ **SQLite database** - Lightweight local storage
- ✅ **In-memory cache** - Fast data access

---

## ❌ What Doesn't Work in Pyto

- ❌ **Playwright** - Browser automation (iOS doesn't support)
- ❌ **Celery** - Background jobs (requires Redis)
- ❌ **PostgreSQL** - Heavy database (use SQLite instead)
- ❌ **Redis** - Key-value store (use Python dict)
- ❌ **Gmail API** - Too heavy for mobile

---

## 🚀 Installation Steps

### Step 1: Install Pyto on iPhone

1. Open App Store on your iPhone
2. Search for "Pyto - Python 3"
3. Install the app (free version works)

### Step 2: Install Dependencies in Pyto

```python
# In Pyto console:
import pip
pip.main(['install', 'fastapi'])
pip.main(['install', 'uvicorn'])
pip.main(['install', 'pydantic'])
pip.main(['install', 'python-dotenv'])
pip.main(['install', 'httpx'])
pip.main(['install', 'email-validator'])
```

Or install from requirements:
```python
import pip
pip.main(['install', '-r', 'pyto_requirements.txt'])
```

### Step 3: Copy Files to Pyto

Copy these files to Pyto's file system:
- `pyto_config.py` - Configuration
- `pyto_main.py` - Main server
- `pyto_requirements.txt` - Dependencies (optional)

**How to transfer files:**
1. Open Pyto app
2. Tap "Files" tab
3. Tap "+" to create new file
4. Copy/paste content from Mac to iPhone

Or use AirDrop/iCloud Drive.

### Step 4: Configure Environment

In Pyto, create `.env` file:

```bash
# Environment
ENVIRONMENT=development

# API Keys (get from blackroad.systems@gmail.com)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# JWT
JWT_SECRET_KEY=pyto-dev-secret-key
JWT_ALGORITHM=HS256

# Log level
LOG_LEVEL=INFO
```

### Step 5: Run the Server

In Pyto, run:
```python
python pyto_main.py
```

You should see:
```
============================================================
🚗 RoadWork API Server (Pyto Edition)
============================================================
📱 Platform: iOS/Pyto
🔗 API URL: http://localhost:8000
📚 Docs: http://localhost:8000/docs
💾 Database: sqlite:///data/roadwork.db
📝 Logs: logs/roadwork.log
============================================================
```

---

## 🧪 Testing the API

### Option 1: In Pyto Console

```python
import httpx

# Test health endpoint
response = httpx.get("http://localhost:8000/health")
print(response.json())

# Expected:
# {
#   "status": "healthy",
#   "platform": "pyto",
#   "database": "sqlite",
#   "timestamp": "2025-12-15T..."
# }
```

### Option 2: Using Postman (iOS app)

1. Install Postman app from App Store
2. Create new request
3. GET `http://localhost:8000/health`
4. Send

### Option 3: Safari on iPhone

Open in Safari:
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Ready: http://localhost:8000/ready

---

## 📝 API Endpoints Available

### Health & Status
- `GET /` - Service info
- `GET /health` - Health check
- `GET /ready` - Readiness check

### Authentication
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Login
- `GET /api/user/profile` - Get profile

### Job Search
- `POST /api/jobs/search` - Search jobs
- `GET /api/jobs/{job_id}` - Get job details

### Applications
- `POST /api/applications/submit` - Submit application
- `GET /api/applications` - Get user's applications

### Analytics
- `GET /api/analytics/stats` - Get statistics

### Onboarding
- `POST /api/onboarding/complete` - Complete onboarding

---

## 📊 Example Usage

### 1. Sign Up

```python
import httpx

response = httpx.post(
    "http://localhost:8000/api/auth/signup",
    json={
        "email": "alexa@blackroad.io",
        "full_name": "Alexa Amundson",
        "subscription_tier": "pro"
    }
)

print(response.json())
# {
#   "success": true,
#   "user": {...},
#   "token": "pyto_token_user_1"
# }
```

### 2. Search Jobs

```python
response = httpx.post(
    "http://localhost:8000/api/jobs/search",
    json={
        "roles": ["Software Engineer", "Full Stack Developer"],
        "locations": ["Remote", "San Francisco"],
        "remote": True,
        "salary_min": 120000,
        "industries": ["Tech", "Finance"]
    }
)

jobs = response.json()["jobs"]
print(f"Found {len(jobs)} jobs")
```

### 3. Submit Application

```python
response = httpx.post(
    "http://localhost:8000/api/applications/submit",
    params={
        "job_id": "job_1",
        "user_email": "alexa@blackroad.io"
    }
)

print(response.json())
# {
#   "success": true,
#   "application": {...}
# }
```

### 4. Get Stats

```python
response = httpx.get(
    "http://localhost:8000/api/analytics/stats",
    params={"user_email": "alexa@blackroad.io"}
)

stats = response.json()
print(f"Applications sent: {stats['applications_sent']}")
```

---

## 💾 Data Storage

### Database Location
```
Pyto Files/
└── data/
    └── roadwork.db (SQLite)
```

### Logs Location
```
Pyto Files/
└── logs/
    └── roadwork.log
```

### Backup Data

```python
# In Pyto
import shutil
shutil.copy("data/roadwork.db", "data/roadwork_backup.db")
```

---

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution:** Install missing dependency:
```python
import pip
pip.main(['install', 'module-name'])
```

### Issue: "Port already in use"
**Solution:** Restart Pyto app or change port:
```python
# In pyto_main.py, line 267:
uvicorn.run(app, host="0.0.0.0", port=8001)  # Changed from 8000
```

### Issue: "Database locked"
**Solution:** Close other connections or restart server

### Issue: "Can't access localhost from browser"
**Solution:**
- Make sure server is running
- Use Safari (Chrome may block localhost)
- Try http://127.0.0.1:8000 instead

---

## 🚧 Limitations on iOS

1. **No browser automation** - Can't scrape job sites
2. **No background jobs** - Server stops when app closes
3. **Limited processing power** - Don't expect 1000s of jobs
4. **No email sending** - Would need API integration
5. **No file uploads** - iOS restrictions

**For full features, use the Railway-deployed version at:**
`https://roadwork.blackroad.io`

---

## 📱 Recommended Use Cases for Pyto

### ✅ Good For:
- **API testing** - Test endpoints on the go
- **Demos** - Show RoadWork to potential users
- **Development** - Quick prototyping
- **Learning** - Understand how the system works
- **Mock data** - Generate test applications

### ❌ Not Good For:
- **Production use** - Use Railway instead
- **Heavy scraping** - Use desktop/server
- **Background automation** - Need always-on server
- **Email sending** - Need SMTP server
- **Large-scale processing** - Limited mobile resources

---

## 🔗 Connect to Production API

Instead of running locally, you can point to production:

```python
# In pyto_config.py:
API_URL = "https://roadwork-production.up.railway.app"

# Then use httpx to call production API:
import httpx

response = httpx.get("https://roadwork-production.up.railway.app/health")
print(response.json())
```

This way you can:
- ✅ Test production API from iPhone
- ✅ No need to run server locally
- ✅ Access real data
- ✅ Use all features (scraping, email, etc.)

---

## 🎯 Next Steps

### On Pyto (iOS):
1. ✅ Install dependencies
2. ✅ Run pyto_main.py
3. ✅ Test API endpoints
4. ✅ Create mock jobs
5. ✅ Submit test applications

### On Railway (Production):
1. Deploy full RoadWork backend
2. Enable Playwright scraping
3. Set up Celery workers
4. Configure PostgreSQL
5. Launch at roadwork.blackroad.io

---

## 📞 Support

**Issues with Pyto:**
- Pyto Support: https://pyto.app/support
- Pyto Docs: https://docs.pyto.app/

**Issues with RoadWork:**
- Email: blackroad.systems@gmail.com
- GitHub: https://github.com/BlackRoad-OS/blackroad-os-core

---

## 🎊 You're All Set!

RoadWork is now running on your iPhone in Pyto! 🚗📱

**Quick Test:**
```python
python pyto_main.py

# In another Pyto console:
import httpx
print(httpx.get("http://localhost:8000/health").json())
```

**Expected Output:**
```json
{
  "status": "healthy",
  "platform": "pyto",
  "database": "sqlite",
  "timestamp": "2025-12-15T20:45:00.000Z"
}
```

🚗💎 **RoadWork: Your AI Career Co-Pilot - Now on iOS!**
