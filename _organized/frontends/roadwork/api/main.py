"""
RoadWork API Server
FastAPI backend for roadwork.blackroad.io
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, UTC
import os
import uvicorn
import logging

# Import middleware
from middleware import LoggingMiddleware, MetricsMiddleware, init_sentry
from config.logging import setup_logging

# Set up logging
setup_logging()
logger = logging.getLogger("roadwork.api")

# Initialize Sentry
init_sentry()

# Initialize FastAPI app
app = FastAPI(
    title="RoadWork API",
    description="AI-powered job application automation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add middleware (order matters - last added runs first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://roadwork.blackroad.io",
        "https://*.blackroad.io",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Add metrics middleware
metrics_middleware = MetricsMiddleware(app)
app.add_middleware(lambda app: metrics_middleware)

# ============================================================================
# Models
# ============================================================================

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class JobSearchRequest(BaseModel):
    keywords: List[str]
    locations: List[str]
    platforms: List[str]
    remote_only: bool = False
    min_salary: Optional[int] = None
    max_applications: int = 10


class OnboardingStep(BaseModel):
    step: str
    data: Dict[str, Any]


class ApplicationApproval(BaseModel):
    application_id: str
    modifications: Optional[Dict[str, str]] = None


# ============================================================================
# Authentication
# ============================================================================

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current authenticated user from JWT token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # In production, verify JWT token
    # For now, return mock user
    return {
        "id": "user-123",
        "email": "demo@roadwork.io",
        "name": "Demo User",
        "subscription_tier": "pro"
    }


# ============================================================================
# Health & Status
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint - API info."""
    return {
        "name": "RoadWork API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(UTC).isoformat(),
        "service": "roadwork-api",
        "version": "1.0.0"
    }


@app.get("/ready")
async def ready():
    """Readiness check endpoint."""
    # Check database connection
    # Check Redis connection
    # Check external services

    return {
        "ready": True,
        "checks": {
            "database": "ok",
            "redis": "ok",
            "playwright": "ok"
        }
    }


@app.get("/metrics")
async def get_metrics():
    """Get API metrics."""
    return metrics_middleware.get_metrics()


# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/auth/signup")
async def signup(user: UserCreate):
    """Sign up new user."""
    # In production:
    # 1. Hash password
    # 2. Create user in database
    # 3. Send verification email
    # 4. Return JWT token

    return {
        "success": True,
        "user": {
            "id": "user-new",
            "email": user.email,
            "name": user.name
        },
        "token": "jwt_token_here"
    }


@app.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user."""
    # In production:
    # 1. Verify credentials
    # 2. Generate JWT token
    # 3. Return token + user data

    return {
        "success": True,
        "user": {
            "id": "user-123",
            "email": credentials.email,
            "name": "Demo User",
            "subscription_tier": "pro"
        },
        "token": "jwt_token_here"
    }


@app.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user."""
    return {"success": True}


# ============================================================================
# Onboarding Endpoints
# ============================================================================

@app.get("/onboarding/status")
async def get_onboarding_status(current_user: dict = Depends(get_current_user)):
    """Get user's onboarding progress."""
    return {
        "user_id": current_user["id"],
        "current_step": "tinder_swipe",
        "completed_steps": [
            "name_pronunciation",
            "upload_work_history",
            "parse_document"
        ],
        "progress": 0.6
    }


@app.post("/onboarding/step")
async def submit_onboarding_step(
    step: OnboardingStep,
    current_user: dict = Depends(get_current_user)
):
    """Submit onboarding step data."""
    # Process step data
    # Update user profile
    # Move to next step

    return {
        "success": True,
        "next_step": "generate_resumes",
        "progress": 0.8
    }


@app.post("/onboarding/upload")
async def upload_work_history(current_user: dict = Depends(get_current_user)):
    """Upload and parse work history document."""
    # In production:
    # 1. Accept file upload
    # 2. Parse document (PDF, DOCX, TXT)
    # 3. Extract structured data
    # 4. Save to database

    return {
        "success": True,
        "parsed_data": {
            "jobs": 5,
            "skills": 15,
            "education": 2,
            "certifications": 3
        }
    }


# ============================================================================
# Job Search Endpoints
# ============================================================================

@app.post("/jobs/search")
async def search_jobs(
    search: JobSearchRequest,
    current_user: dict = Depends(get_current_user)
):
    """Search for jobs across platforms."""
    # In production:
    # 1. Check subscription limits
    # 2. Run scrapers in parallel
    # 3. Deduplicate results
    # 4. Rank by relevance
    # 5. Return top matches

    return {
        "session_id": "session-123",
        "jobs_found": 25,
        "platforms_searched": len(search.platforms),
        "jobs": [
            {
                "id": "job-1",
                "title": "Senior Software Engineer",
                "company": "Tech Corp",
                "location": "San Francisco, CA",
                "platform": "linkedin",
                "url": "https://linkedin.com/jobs/...",
                "match_score": 0.92,
                "easy_apply": True
            },
            # ... more jobs
        ]
    }


@app.get("/jobs/{job_id}")
async def get_job_details(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed job information."""
    return {
        "id": job_id,
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "description": "Full job description...",
        "requirements": [
            "5+ years experience",
            "Python, TypeScript",
            "AWS experience"
        ],
        "salary_range": "$150,000 - $200,000",
        "benefits": ["Health insurance", "401k", "Remote OK"],
        "posted_date": "2025-01-10",
        "apply_url": "https://..."
    }


# ============================================================================
# Application Endpoints
# ============================================================================

@app.get("/applications")
async def get_applications(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get user's applications."""
    return {
        "total": 45,
        "pending": 5,
        "submitted": 30,
        "interviewing": 8,
        "offers": 2,
        "applications": [
            {
                "id": "app-1",
                "job_title": "Senior Engineer",
                "company": "Tech Corp",
                "status": "submitted",
                "applied_at": "2025-01-15T10:00:00Z",
                "viewed": True,
                "response_received": False
            },
            # ... more applications
        ]
    }


@app.post("/applications/apply")
async def apply_to_job(
    job_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Apply to a job."""
    # In production:
    # 1. Check subscription limits
    # 2. Generate customized application
    # 3. Submit via platform scraper
    # 4. Track in database
    # 5. Record analytics

    return {
        "success": True,
        "application_id": "app-new",
        "job_id": job_id,
        "status": "submitted",
        "submitted_at": datetime.now(UTC).isoformat()
    }


@app.post("/applications/{application_id}/approve")
async def approve_application(
    application_id: str,
    approval: ApplicationApproval,
    current_user: dict = Depends(get_current_user)
):
    """Approve and submit pending application."""
    return {
        "success": True,
        "application_id": application_id,
        "status": "submitted",
        "submitted_at": datetime.now(UTC).isoformat()
    }


@app.delete("/applications/{application_id}")
async def reject_application(
    application_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Reject/delete pending application."""
    return {"success": True}


# ============================================================================
# Analytics Endpoints
# ============================================================================

@app.get("/analytics/dashboard")
async def get_dashboard_analytics(current_user: dict = Depends(get_current_user)):
    """Get dashboard analytics."""
    return {
        "this_month": {
            "jobs_found": 156,
            "applications_submitted": 82,
            "employer_views": 48,
            "view_rate": 0.59,
            "responses": 12,
            "response_rate": 0.15,
            "interviews": 5,
            "offers": 1
        },
        "top_platforms": [
            {"platform": "linkedin", "applications": 35, "response_rate": 0.65},
            {"platform": "indeed", "applications": 25, "response_rate": 0.28},
            {"platform": "glassdoor", "applications": 15, "response_rate": 0.42}
        ],
        "insights": [
            "LinkedIn has 2.3x better response rate",
            "Apply early morning for 40% faster responses",
            "Custom cover letters increase views by 30%"
        ]
    }


# ============================================================================
# Interview Endpoints
# ============================================================================

@app.get("/interviews")
async def get_interviews(current_user: dict = Depends(get_current_user)):
    """Get scheduled interviews."""
    return {
        "upcoming": [
            {
                "id": "interview-1",
                "company": "Tech Corp",
                "job_title": "Senior Engineer",
                "scheduled_at": "2025-01-20T14:00:00Z",
                "type": "video",
                "calendar_event_id": "cal-123"
            }
        ],
        "past": []
    }


@app.post("/interviews/{interview_id}/propose-time")
async def propose_interview_time(
    interview_id: str,
    proposed_time: datetime,
    current_user: dict = Depends(get_current_user)
):
    """Propose interview time."""
    # Send follow-up email with proposed time
    return {
        "success": True,
        "email_sent": True,
        "proposed_time": proposed_time.isoformat()
    }


# ============================================================================
# Subscription Endpoints
# ============================================================================

@app.get("/subscription")
async def get_subscription(current_user: dict = Depends(get_current_user)):
    """Get user's subscription details."""
    return {
        "tier": "pro",
        "status": "active",
        "applications_today": 8,
        "applications_limit": 100,
        "applications_remaining": 92,
        "billing_cycle_start": "2025-01-01",
        "billing_cycle_end": "2025-01-31",
        "next_billing_date": "2025-02-01",
        "amount": 20.00
    }


@app.post("/subscription/upgrade")
async def upgrade_subscription(
    tier: str,
    current_user: dict = Depends(get_current_user)
):
    """Upgrade subscription tier."""
    # Process Stripe payment
    # Update subscription
    # Send confirmation email

    return {
        "success": True,
        "tier": tier,
        "amount": 20.00 if tier == "pro" else 50.00,
        "next_billing_date": "2025-02-01"
    }


# ============================================================================
# Settings Endpoints
# ============================================================================

@app.get("/settings")
async def get_settings(current_user: dict = Depends(get_current_user)):
    """Get user settings."""
    return {
        "email_notifications": True,
        "daily_summary_time": "09:00",
        "timezone": "America/Los_Angeles",
        "platforms": ["linkedin", "indeed", "glassdoor"],
        "auto_apply": False,
        "max_applications_per_day": 10
    }


@app.patch("/settings")
async def update_settings(
    settings: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Update user settings."""
    return {
        "success": True,
        "settings": settings
    }


# ============================================================================
# Admin Endpoints
# ============================================================================

@app.get("/admin/stats")
async def get_admin_stats():
    """Get system-wide statistics (admin only)."""
    # Check admin auth
    return {
        "total_users": 1245,
        "active_users": 892,
        "total_applications": 45678,
        "applications_today": 1234,
        "success_rate": 0.15,
        "platform_health": {
            "linkedin": "healthy",
            "indeed": "healthy",
            "glassdoor": "degraded"
        }
    }


# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
