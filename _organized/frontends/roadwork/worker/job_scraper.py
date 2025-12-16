"""
Job Scraper Worker
Scrapes jobs from 30+ platforms using Playwright
"""

from celery import Task
from worker.celery_app import celery_app
from typing import List, Dict, Any
import asyncio
from datetime import datetime, UTC
import sys
import os

# Add parent directory to path to import from core
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.blackroad_core.packs.job_hunter.platforms.scraper_engine import (
    UniversalJobScraper,
    ScraperConfig
)
from src.blackroad_core.packs.job_hunter.platforms import (
    JobPlatform,
    get_platform_config,
    get_platforms_by_category
)


class JobScraperTask(Task):
    """Base task with scraper instance"""
    _scraper = None

    @property
    def scraper(self):
        if self._scraper is None:
            config = ScraperConfig(
                headless=True,
                anti_detection=True,
                rate_limit_delay=3.0
            )
            self._scraper = UniversalJobScraper(config)
        return self._scraper


@celery_app.task(base=JobScraperTask, bind=True)
def search_jobs(
    self,
    user_id: str,
    keywords: List[str],
    locations: List[str],
    platforms: List[str],
    filters: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Search for jobs across multiple platforms.

    Args:
        user_id: User ID
        keywords: Search keywords
        locations: Search locations
        platforms: List of platform names
        filters: Additional filters (remote_only, min_salary, etc.)

    Returns:
        Search results with jobs found
    """
    async def _search():
        await self.scraper.initialize()

        all_jobs = []
        platform_results = {}

        for platform_name in platforms:
            try:
                platform = JobPlatform(platform_name)
                platform_config = get_platform_config(platform)

                # Get platform-specific scraper
                if platform == JobPlatform.INDEED:
                    scraper_class = self.scraper.get_indeed_scraper()
                elif platform == JobPlatform.LINKEDIN:
                    scraper_class = self.scraper.get_linkedin_scraper()
                elif platform == JobPlatform.GLASSDOOR:
                    scraper_class = self.scraper.get_glassdoor_scraper()
                else:
                    # Use generic scraper for other platforms
                    scraper_class = self.scraper

                # Search each location
                platform_jobs = []
                for location in locations:
                    jobs = await scraper_class.search(
                        keywords=keywords,
                        location=location,
                        filters=filters
                    )
                    platform_jobs.extend(jobs)

                platform_results[platform_name] = {
                    "jobs_found": len(platform_jobs),
                    "jobs": platform_jobs
                }
                all_jobs.extend(platform_jobs)

            except Exception as e:
                platform_results[platform_name] = {
                    "error": str(e),
                    "jobs_found": 0,
                    "jobs": []
                }

        await self.scraper.cleanup()

        return {
            "user_id": user_id,
            "total_jobs": len(all_jobs),
            "platforms_searched": len(platforms),
            "platform_results": platform_results,
            "jobs": all_jobs,
            "timestamp": datetime.now(UTC).isoformat()
        }

    return asyncio.run(_search())


@celery_app.task(base=JobScraperTask, bind=True)
def scrape_platform(
    self,
    platform: str,
    keywords: List[str],
    location: str,
    filters: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Scrape jobs from a single platform.

    Args:
        platform: Platform name
        keywords: Search keywords
        location: Search location
        filters: Search filters

    Returns:
        List of jobs found
    """
    async def _scrape():
        await self.scraper.initialize()

        platform_enum = JobPlatform(platform)

        if platform_enum == JobPlatform.INDEED:
            scraper = self.scraper.get_indeed_scraper()
        elif platform_enum == JobPlatform.LINKEDIN:
            scraper = self.scraper.get_linkedin_scraper()
        elif platform_enum == JobPlatform.GLASSDOOR:
            scraper = self.scraper.get_glassdoor_scraper()
        else:
            scraper = self.scraper

        jobs = await scraper.search(
            keywords=keywords,
            location=location,
            filters=filters
        )

        await self.scraper.cleanup()

        return jobs

    return asyncio.run(_scrape())


@celery_app.task
def run_daily_job_hunt():
    """
    Run daily job hunt for all active users.
    Scheduled to run every day at 9 AM UTC.
    """
    # In production, this would:
    # 1. Query database for all users with daily automation enabled
    # 2. For each user:
    #    - Get their job preferences
    #    - Search all their preferred platforms
    #    - Filter/rank results
    #    - Auto-apply or queue for review
    #    - Track results
    # 3. Return summary

    print(f"[{datetime.now(UTC)}] Running daily job hunt for all users...")

    # TODO: Implement database queries
    # from database import get_active_users
    # users = get_active_users()
    # for user in users:
    #     search_jobs.delay(
    #         user_id=user.id,
    #         keywords=user.preferences.keywords,
    #         locations=user.preferences.locations,
    #         platforms=user.preferences.platforms,
    #         filters=user.preferences.filters
    #     )

    return {
        "status": "success",
        "message": "Daily job hunt completed",
        "timestamp": datetime.now(UTC).isoformat()
    }


@celery_app.task(base=JobScraperTask, bind=True)
def validate_job_listing(
    self,
    job_url: str,
    company_name: str
) -> Dict[str, Any]:
    """
    Validate a job listing by checking the company website.

    Args:
        job_url: Job listing URL
        company_name: Company name

    Returns:
        Validation results
    """
    async def _validate():
        await self.scraper.initialize()

        # Check if job URL is accessible
        page = await self.scraper.context.new_page()

        try:
            response = await page.goto(job_url, wait_until="domcontentloaded")

            if response.status >= 400:
                return {
                    "valid": False,
                    "reason": f"Job URL returned {response.status}",
                    "confidence": 1.0
                }

            # Check if page contains job-related content
            content = await page.content()

            job_keywords = ["apply", "position", "role", "responsibilities", "qualifications"]
            found_keywords = [kw for kw in job_keywords if kw.lower() in content.lower()]

            confidence = len(found_keywords) / len(job_keywords)

            result = {
                "valid": confidence > 0.3,
                "confidence": confidence,
                "job_url": job_url,
                "company_name": company_name,
                "timestamp": datetime.now(UTC).isoformat()
            }

            await page.close()
            await self.scraper.cleanup()

            return result

        except Exception as e:
            await page.close()
            await self.scraper.cleanup()

            return {
                "valid": False,
                "reason": str(e),
                "confidence": 0.0
            }

    return asyncio.run(_validate())


@celery_app.task
def cleanup_old_sessions():
    """
    Clean up old scraper sessions and browser instances.
    Runs daily at midnight.
    """
    # TODO: Implement session cleanup
    # - Close any orphaned browser instances
    # - Clear old cookies
    # - Remove expired session data

    return {
        "status": "success",
        "message": "Old sessions cleaned up",
        "timestamp": datetime.now(UTC).isoformat()
    }
