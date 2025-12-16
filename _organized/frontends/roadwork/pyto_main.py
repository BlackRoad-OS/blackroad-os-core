"""
RoadWork Main Entry Point for Pyto
Lightweight FastAPI server optimized for iOS
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import logging

# Import Pyto config
from pyto_config import *

# Set up logging
logging.basicConfig(
    level=LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("roadwork.pyto")

# Initialize FastAPI
app = FastAPI(
    title="RoadWork API (Pyto)",
    description="AI-powered job application automation - iOS Edition",
    version="1.0.0-pyto"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# DATA MODELS
# ============================================================================

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    full_name: str
    subscription_tier: str = "free"
    created_at: datetime = datetime.now()

class JobPreferences(BaseModel):
    roles: List[str]
    locations: List[str]
    remote: bool = True
    salary_min: Optional[int] = None
    industries: List[str] = []

class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    url: str
    posted_date: datetime
    matched: bool = False

# ============================================================================
# IN-MEMORY STORAGE (for Pyto testing)
# ============================================================================

users_db = {}
jobs_db = {}
applications_db = {}

# ============================================================================
# ROUTES
# ============================================================================

@app.get("/")
def root():
    return {
        "service": "RoadWork API",
        "version": "1.0.0-pyto",
        "platform": "iOS/Pyto",
        "status": "running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "platform": "pyto",
        "database": "sqlite" if "sqlite" in DATABASE_URL else "unknown",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/ready")
def ready():
    return {
        "ready": True,
        "users": len(users_db),
        "jobs": len(jobs_db),
        "applications": len(applications_db)
    }

# ============================================================================
# USER ROUTES
# ============================================================================

@app.post("/api/auth/signup")
def signup(user: User):
    """Sign up new user"""
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    user.id = f"user_{len(users_db) + 1}"
    users_db[user.email] = user.dict()

    logger.info(f"New user signed up: {user.email}")

    return {
        "success": True,
        "user": user.dict(),
        "token": f"pyto_token_{user.id}"
    }

@app.post("/api/auth/login")
def login(email: EmailStr, password: str):
    """Login user"""
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    user = users_db[email]

    return {
        "success": True,
        "user": user,
        "token": f"pyto_token_{user['id']}"
    }

@app.get("/api/user/profile")
def get_profile(email: str):
    """Get user profile"""
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    return users_db[email]

# ============================================================================
# JOB SEARCH ROUTES
# ============================================================================

@app.post("/api/jobs/search")
def search_jobs(preferences: JobPreferences):
    """Search for jobs matching preferences"""
    # Mock job data for Pyto testing
    mock_jobs = [
        {
            "id": "job_1",
            "title": "Senior Software Engineer",
            "company": "Tech Corp",
            "location": "Remote",
            "salary": "$150k - $200k",
            "url": "https://example.com/job/1",
            "posted_date": datetime.now().isoformat(),
            "matched": True
        },
        {
            "id": "job_2",
            "title": "Full Stack Developer",
            "company": "Startup Inc",
            "location": "San Francisco, CA",
            "salary": "$120k - $160k",
            "url": "https://example.com/job/2",
            "posted_date": datetime.now().isoformat(),
            "matched": True
        },
        {
            "id": "job_3",
            "title": "Python Developer",
            "company": "Data Labs",
            "location": "New York, NY",
            "salary": "$130k - $180k",
            "url": "https://example.com/job/3",
            "posted_date": datetime.now().isoformat(),
            "matched": False
        }
    ]

    # Store jobs
    for job in mock_jobs:
        jobs_db[job["id"]] = job

    logger.info(f"Found {len(mock_jobs)} jobs matching preferences")

    return {
        "success": True,
        "jobs": mock_jobs,
        "total": len(mock_jobs)
    }

@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    """Get job details"""
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")

    return jobs_db[job_id]

# ============================================================================
# APPLICATION ROUTES
# ============================================================================

@app.post("/api/applications/submit")
def submit_application(job_id: str, user_email: str):
    """Submit job application"""
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")

    if user_email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    app_id = f"app_{len(applications_db) + 1}"
    application = {
        "id": app_id,
        "job_id": job_id,
        "user_email": user_email,
        "status": "submitted",
        "submitted_at": datetime.now().isoformat()
    }

    applications_db[app_id] = application

    logger.info(f"Application submitted: {app_id} for job {job_id}")

    return {
        "success": True,
        "application": application
    }

@app.get("/api/applications")
def get_applications(user_email: str):
    """Get user's applications"""
    user_apps = [
        app for app in applications_db.values()
        if app["user_email"] == user_email
    ]

    return {
        "success": True,
        "applications": user_apps,
        "total": len(user_apps)
    }

# ============================================================================
# ANALYTICS ROUTES
# ============================================================================

@app.get("/api/analytics/stats")
def get_stats(user_email: str):
    """Get user statistics"""
    user_apps = [
        app for app in applications_db.values()
        if app["user_email"] == user_email
    ]

    return {
        "applications_sent": len(user_apps),
        "jobs_viewed": len(jobs_db),
        "interviews_scheduled": 0,
        "response_rate": 0.0
    }

# ============================================================================
# ONBOARDING ROUTES
# ============================================================================

@app.post("/api/onboarding/complete")
def complete_onboarding(
    user_email: str,
    full_name: str,
    preferences: JobPreferences
):
    """Complete user onboarding"""
    if user_email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    users_db[user_email]["full_name"] = full_name
    users_db[user_email]["preferences"] = preferences.dict()
    users_db[user_email]["onboarding_complete"] = True

    logger.info(f"Onboarding completed for: {user_email}")

    return {
        "success": True,
        "message": "Onboarding complete!",
        "next_step": "job_search"
    }

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    print("\n" + "="*60)
    print("🚗 RoadWork API Server (Pyto Edition)")
    print("="*60)
    print(f"📱 Platform: iOS/Pyto")
    print(f"🔗 API URL: http://localhost:8000")
    print(f"📚 Docs: http://localhost:8000/docs")
    print(f"💾 Database: {DATABASE_URL}")
    print(f"📝 Logs: {LOG_FILE}")
    print("="*60 + "\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
