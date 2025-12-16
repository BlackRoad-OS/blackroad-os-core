"""
Celery Application Configuration
"""

from celery import Celery
from celery.schedules import crontab
import os

# Initialize Celery
celery_app = Celery(
    "roadwork",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    include=[
        "worker.job_scraper",
        "worker.applicator",
        "worker.email_sender",
        "worker.analytics_processor"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    worker_max_tasks_per_child=1000,
    worker_prefetch_multiplier=4,
)

# Scheduled tasks
celery_app.conf.beat_schedule = {
    # Run daily job hunt at 9 AM UTC
    "daily-job-hunt": {
        "task": "worker.job_scraper.run_daily_job_hunt",
        "schedule": crontab(hour=9, minute=0),
    },
    # Send daily summaries at 6 PM UTC
    "daily-summaries": {
        "task": "worker.email_sender.send_daily_summaries",
        "schedule": crontab(hour=18, minute=0),
    },
    # Process analytics every hour
    "process-analytics": {
        "task": "worker.analytics_processor.process_analytics",
        "schedule": crontab(minute=0),
    },
    # Clean up old sessions every day at midnight
    "cleanup-sessions": {
        "task": "worker.cleanup.cleanup_old_sessions",
        "schedule": crontab(hour=0, minute=0),
    },
}

if __name__ == "__main__":
    celery_app.start()
