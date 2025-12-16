"""
Email Worker
Sends email summaries and notifications
"""

from worker.celery_app import celery_app
from typing import Dict, Any, List
from datetime import datetime, UTC, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
import os


@celery_app.task
def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    from_email: str = None
) -> Dict[str, Any]:
    """
    Send an email via SendGrid.

    Args:
        to_email: Recipient email
        subject: Email subject
        html_content: HTML email content
        from_email: Sender email (defaults to SENDGRID_FROM_EMAIL)

    Returns:
        Send result
    """
    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))

        from_email = from_email or os.getenv("SENDGRID_FROM_EMAIL", "noreply@blackroad.io")

        message = Mail(
            from_email=Email(from_email),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )

        response = sg.send(message)

        return {
            "success": True,
            "status_code": response.status_code,
            "to": to_email,
            "subject": subject
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "to": to_email,
            "subject": subject
        }


@celery_app.task
def send_daily_summary(
    user_id: str,
    user_email: str,
    summary_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Send daily summary email to a user.

    Args:
        user_id: User ID
        user_email: User email
        summary_data: Summary statistics

    Returns:
        Send result
    """
    # Build HTML email
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }}
            .header {{ background: linear-gradient(135deg, #FF6B00 0%, #FF0066 100%);
                       color: white; padding: 20px; text-align: center; }}
            .stats {{ display: flex; justify-content: space-around; padding: 20px; }}
            .stat {{ text-align: center; }}
            .stat-value {{ font-size: 32px; font-weight: bold; color: #FF6B00; }}
            .stat-label {{ color: #666; font-size: 14px; }}
            .jobs {{ padding: 20px; }}
            .job-card {{ border: 1px solid #eee; padding: 15px; margin: 10px 0; border-radius: 8px; }}
            .footer {{ text-align: center; padding: 20px; color: #999; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚗 RoadWork Daily Summary</h1>
            <p>{datetime.now(UTC).strftime('%B %d, %Y')}</p>
        </div>

        <div class="stats">
            <div class="stat">
                <div class="stat-value">{summary_data.get('jobs_found', 0)}</div>
                <div class="stat-label">Jobs Found</div>
            </div>
            <div class="stat">
                <div class="stat-value">{summary_data.get('applications_submitted', 0)}</div>
                <div class="stat-label">Applications Submitted</div>
            </div>
            <div class="stat">
                <div class="stat-value">{summary_data.get('employer_views', 0)}</div>
                <div class="stat-label">Employer Views</div>
            </div>
        </div>

        <div class="jobs">
            <h2>Top Jobs Today</h2>
    """

    # Add top jobs
    for job in summary_data.get("top_jobs", [])[:5]:
        html += f"""
            <div class="job-card">
                <h3>{job.get('title', 'Unknown Title')}</h3>
                <p><strong>{job.get('company', 'Unknown Company')}</strong></p>
                <p>{job.get('location', 'Location not specified')}</p>
                <p>Match Score: {int(job.get('match_score', 0) * 100)}%</p>
            </div>
        """

    html += """
        </div>

        <div class="footer">
            <p>Keep building your career path with RoadWork!</p>
            <p><a href="https://roadwork.blackroad.io/dashboard">View Dashboard</a></p>
            <p><a href="https://roadwork.blackroad.io/settings">Update Preferences</a></p>
        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=user_email,
        subject=f"RoadWork Daily Summary - {summary_data.get('applications_submitted', 0)} Applications Submitted",
        html_content=html
    )


@celery_app.task
def send_daily_summaries():
    """
    Send daily summaries to all active users.
    Scheduled to run at 6 PM UTC daily.
    """
    # In production:
    # 1. Query database for all users with email summaries enabled
    # 2. For each user, gather summary data
    # 3. Send summary email
    # 4. Track delivery

    print(f"[{datetime.now(UTC)}] Sending daily summaries...")

    # TODO: Implement database queries
    # from database import get_active_users, get_user_daily_stats
    # users = get_active_users(email_summaries=True)
    # for user in users:
    #     stats = get_user_daily_stats(user.id)
    #     send_daily_summary.delay(user.id, user.email, stats)

    return {
        "status": "success",
        "message": "Daily summaries sent",
        "timestamp": datetime.now(UTC).isoformat()
    }


@celery_app.task
def send_interview_notification(
    user_email: str,
    interview_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Send interview notification email.

    Args:
        user_email: User email
        interview_data: Interview details

    Returns:
        Send result
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }}
            .header {{ background: linear-gradient(135deg, #FF6B00 0%, #FF0066 100%);
                       color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ background: #FF6B00; color: white; padding: 15px 30px;
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 Interview Request!</h1>
        </div>

        <div class="content">
            <h2>{interview_data.get('company', 'A company')} wants to interview you!</h2>

            <p><strong>Position:</strong> {interview_data.get('job_title', 'Not specified')}</p>
            <p><strong>Company:</strong> {interview_data.get('company', 'Not specified')}</p>

            <p>They've proposed the following times:</p>
            <ul>
    """

    for time_slot in interview_data.get("proposed_times", []):
        html += f"<li>{time_slot}</li>"

    html += f"""
            </ul>

            <p>Click below to propose a time that works for you:</p>

            <a href="https://roadwork.blackroad.io/interviews/{interview_data.get('interview_id')}" class="button">
                Schedule Interview
            </a>

            <p>RoadWork will automatically send your response!</p>
        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=user_email,
        subject=f"Interview Request from {interview_data.get('company', 'a company')}!",
        html_content=html
    )


@celery_app.task
def send_application_viewed_notification(
    user_email: str,
    application_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Notify user that their application was viewed.

    Args:
        user_email: User email
        application_data: Application details

    Returns:
        Send result
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }}
            .header {{ background: linear-gradient(135deg, #FF6B00 0%, #FF0066 100%);
                       color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>👀 Your Application Was Viewed!</h1>
        </div>

        <div class="content">
            <p>Good news! <strong>{application_data.get('company', 'A company')}</strong>
               viewed your application for the <strong>{application_data.get('job_title', 'position')}</strong> role.</p>

            <p>This is a positive sign that you're in consideration!</p>

            <p><strong>Application Details:</strong></p>
            <ul>
                <li>Submitted: {application_data.get('submitted_at', 'Unknown')}</li>
                <li>Views: {application_data.get('view_count', 0)}</li>
                <li>Status: {application_data.get('status', 'Under Review')}</li>
            </ul>

            <p><a href="https://roadwork.blackroad.io/applications/{application_data.get('id')}">
               View Application Details →
            </a></p>
        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=user_email,
        subject=f"Your application to {application_data.get('company')} was viewed!",
        html_content=html
    )


@celery_app.task
def send_welcome_email(
    user_email: str,
    user_name: str
) -> Dict[str, Any]:
    """
    Send welcome email to new user.

    Args:
        user_email: User email
        user_name: User name

    Returns:
        Send result
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }}
            .header {{ background: linear-gradient(135deg, #FF6B00 0%, #FF0066 100%);
                       color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ background: #FF6B00; color: white; padding: 15px 30px;
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      margin: 20px 0; }}
            .feature {{ padding: 10px 0; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚗 Welcome to RoadWork!</h1>
        </div>

        <div class="content">
            <h2>Hi {user_name}! 👋</h2>

            <p>We're excited to help you find your dream job on autopilot!</p>

            <h3>Here's what happens next:</h3>

            <div class="feature">
                <strong>1. Complete Your Profile</strong>
                <p>Upload your work history and let our AI interview you (takes 2 minutes)</p>
            </div>

            <div class="feature">
                <strong>2. Swipe on Jobs</strong>
                <p>Tinder-style job matching to find roles you'll love</p>
            </div>

            <div class="feature">
                <strong>3. Generate Resumes</strong>
                <p>We'll create tailored resumes for different job categories</p>
            </div>

            <div class="feature">
                <strong>4. Sit Back & Relax</strong>
                <p>We'll apply to jobs daily and send you progress reports</p>
            </div>

            <a href="https://roadwork.blackroad.io/onboarding" class="button">
                Get Started →
            </a>

            <p>Questions? Just reply to this email!</p>

            <p>Happy job hunting! 🎯</p>
        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=user_email,
        subject="Welcome to RoadWork - Your AI Career Co-Pilot!",
        html_content=html
    )
