"""
Analytics Processor Worker
Processes application analytics and generates insights
"""

from worker.celery_app import celery_app
from typing import Dict, Any, List
from datetime import datetime, UTC, timedelta
from collections import defaultdict
import statistics


@celery_app.task
def process_analytics():
    """
    Process analytics for all users.
    Runs every hour.
    """
    # In production:
    # 1. Query recent engagement events
    # 2. Update application success scores
    # 3. Generate platform insights
    # 4. Update user recommendations

    print(f"[{datetime.now(UTC)}] Processing analytics...")

    return {
        "status": "success",
        "message": "Analytics processed",
        "timestamp": datetime.now(UTC).isoformat()
    }


@celery_app.task
def calculate_success_scores(
    user_id: str,
    application_ids: List[str]
) -> Dict[str, float]:
    """
    Calculate success scores for applications.

    Args:
        user_id: User ID
        application_ids: List of application IDs

    Returns:
        Dictionary of application_id -> success_score
    """
    scores = {}

    # In production, fetch engagement data from database
    # For now, return placeholder scores

    for app_id in application_ids:
        # Success score calculation:
        # - Base: 0.0
        # - Viewed: +0.3
        # - Profile viewed: +0.2
        # - Downloaded: +0.3
        # - Response: +0.5
        # - Interview: +1.0

        # Placeholder
        scores[app_id] = 0.5

    return scores


@celery_app.task
def generate_platform_insights(
    user_id: str,
    timeframe_days: int = 30
) -> Dict[str, Any]:
    """
    Generate insights about platform performance.

    Args:
        user_id: User ID
        timeframe_days: Number of days to analyze

    Returns:
        Platform insights
    """
    # In production, query database for application data

    insights = {
        "best_platform": {
            "name": "LinkedIn",
            "response_rate": 0.65,
            "avg_views": 12.5,
            "applications": 35
        },
        "worst_platform": {
            "name": "Indeed",
            "response_rate": 0.28,
            "avg_views": 5.2,
            "applications": 25
        },
        "recommendations": [
            "LinkedIn has 2.3x better response rate than Indeed",
            "Apply early morning (6-9 AM) for 40% faster responses",
            "Custom cover letters increase views by 30%",
            "Jobs with 'Easy Apply' get 50% more applications but 20% lower quality"
        ],
        "platform_comparison": [
            {
                "platform": "LinkedIn",
                "applications": 35,
                "response_rate": 0.65,
                "avg_days_to_response": 3.2
            },
            {
                "platform": "Indeed",
                "applications": 25,
                "response_rate": 0.28,
                "avg_days_to_response": 5.8
            },
            {
                "platform": "Glassdoor",
                "applications": 15,
                "response_rate": 0.42,
                "avg_days_to_response": 4.5
            }
        ],
        "timestamp": datetime.now(UTC).isoformat()
    }

    return insights


@celery_app.task
def track_engagement_event(
    application_id: str,
    event_type: str,
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Track an engagement event.

    Args:
        application_id: Application ID
        event_type: Event type (viewed, downloaded, response, etc.)
        metadata: Additional event data

    Returns:
        Tracking result
    """
    # In production, save to database and update analytics

    event = {
        "application_id": application_id,
        "event_type": event_type,
        "metadata": metadata or {},
        "timestamp": datetime.now(UTC).isoformat()
    }

    # Trigger notifications based on event type
    if event_type == "APPLICATION_VIEWED":
        # Send notification to user
        from worker.email_sender import send_application_viewed_notification
        # send_application_viewed_notification.delay(...)
        pass

    elif event_type == "INTERVIEW_REQUEST":
        # Send interview notification
        from worker.email_sender import send_interview_notification
        # send_interview_notification.delay(...)
        pass

    return {
        "success": True,
        "event": event
    }


@celery_app.task
def generate_weekly_report(
    user_id: str
) -> Dict[str, Any]:
    """
    Generate weekly performance report.

    Args:
        user_id: User ID

    Returns:
        Weekly report data
    """
    end_date = datetime.now(UTC)
    start_date = end_date - timedelta(days=7)

    # In production, query database for weekly data

    report = {
        "user_id": user_id,
        "week_starting": start_date.isoformat(),
        "week_ending": end_date.isoformat(),
        "summary": {
            "jobs_found": 156,
            "applications_submitted": 82,
            "employer_views": 48,
            "view_rate": 0.59,
            "responses": 12,
            "response_rate": 0.15,
            "interviews_scheduled": 5,
            "offers_received": 1
        },
        "daily_breakdown": [
            {
                "date": (end_date - timedelta(days=i)).strftime("%Y-%m-%d"),
                "applications": 12,
                "views": 7,
                "responses": 2
            }
            for i in range(7)
        ],
        "top_jobs": [
            {
                "title": "Senior Software Engineer",
                "company": "Tech Corp",
                "status": "Interview Scheduled",
                "match_score": 0.95
            },
            {
                "title": "Lead Developer",
                "company": "Startup Inc",
                "status": "Under Review",
                "match_score": 0.92
            }
        ],
        "insights": [
            "Your response rate increased by 15% this week!",
            "LinkedIn applications performed best (75% view rate)",
            "Early morning applications got faster responses"
        ],
        "timestamp": datetime.now(UTC).isoformat()
    }

    return report


@celery_app.task
def calculate_match_scores(
    user_profile: Dict[str, Any],
    jobs: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Calculate match scores for jobs.

    Args:
        user_profile: User profile data
        jobs: List of job postings

    Returns:
        Jobs with match scores
    """
    user_skills = set(user_profile.get("skills", []))
    user_keywords = set(user_profile.get("preferred_keywords", []))

    scored_jobs = []

    for job in jobs:
        job_skills = set(job.get("required_skills", []))
        job_keywords = set(job.get("title", "").lower().split())

        # Calculate skill match
        if user_skills and job_skills:
            skill_match = len(user_skills & job_skills) / len(job_skills)
        else:
            skill_match = 0.0

        # Calculate keyword match
        if user_keywords and job_keywords:
            keyword_match = len(user_keywords & job_keywords) / max(len(user_keywords), 1)
        else:
            keyword_match = 0.0

        # Calculate location match
        location_match = 1.0 if job.get("location") in user_profile.get("preferred_locations", []) else 0.5

        # Calculate salary match
        salary_match = 1.0
        if "salary_min" in job and "min_salary" in user_profile:
            if job["salary_min"] >= user_profile["min_salary"]:
                salary_match = 1.0
            else:
                salary_match = 0.5

        # Weighted average
        match_score = (
            skill_match * 0.4 +
            keyword_match * 0.3 +
            location_match * 0.2 +
            salary_match * 0.1
        )

        scored_job = {**job, "match_score": round(match_score, 2)}
        scored_jobs.append(scored_job)

    # Sort by match score
    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)

    return scored_jobs


@celery_app.task
def analyze_application_patterns(
    user_id: str,
    timeframe_days: int = 90
) -> Dict[str, Any]:
    """
    Analyze user's application patterns to provide recommendations.

    Args:
        user_id: User ID
        timeframe_days: Days of history to analyze

    Returns:
        Pattern analysis and recommendations
    """
    # In production, query database for historical data

    analysis = {
        "user_id": user_id,
        "timeframe_days": timeframe_days,
        "patterns": {
            "best_time_to_apply": {
                "time": "6:00 AM - 9:00 AM",
                "response_rate": 0.42,
                "avg_response_time_hours": 24
            },
            "best_day_to_apply": {
                "day": "Tuesday",
                "response_rate": 0.38
            },
            "optimal_application_length": {
                "cover_letter_words": 150,
                "response_rate": 0.35
            }
        },
        "success_factors": [
            {
                "factor": "Custom cover letter",
                "impact": "+30% view rate"
            },
            {
                "factor": "Applied within 24 hours of posting",
                "impact": "+25% response rate"
            },
            {
                "factor": "Skill match >80%",
                "impact": "+40% interview rate"
            }
        ],
        "recommendations": [
            "Apply to jobs early morning (6-9 AM) for best results",
            "Tuesday and Wednesday applications get most responses",
            "Keep cover letters around 150 words for optimal engagement",
            "Apply within first 24 hours of job posting",
            "Focus on jobs with >80% skill match"
        ],
        "timestamp": datetime.now(UTC).isoformat()
    }

    return analysis
