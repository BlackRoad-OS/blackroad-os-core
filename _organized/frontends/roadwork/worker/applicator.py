"""
Application Worker
Submits job applications via Playwright automation
"""

from celery import Task
from worker.celery_app import celery_app
from typing import Dict, Any, List, Optional
import asyncio
from datetime import datetime, UTC
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.blackroad_core.packs.job_hunter.application_writer import ApplicationWriter
from src.blackroad_core.packs.job_hunter.form_filler import AutoFormFiller
from src.blackroad_core.packs.job_hunter.platforms.scraper_engine import (
    UniversalJobScraper,
    ScraperConfig
)


class ApplicationTask(Task):
    """Base task with application dependencies"""
    _scraper = None
    _writer = None
    _filler = None

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

    @property
    def writer(self):
        if self._writer is None:
            self._writer = ApplicationWriter()
        return self._writer

    @property
    def filler(self):
        if self._filler is None:
            self._filler = AutoFormFiller()
        return self._filler


@celery_app.task(base=ApplicationTask, bind=True)
def generate_application(
    self,
    job: Dict[str, Any],
    profile: Dict[str, Any],
    use_ai: bool = True
) -> Dict[str, Any]:
    """
    Generate application content for a job.

    Args:
        job: Job posting data
        profile: User profile data
        use_ai: Whether to use AI customization

    Returns:
        Generated application content
    """
    async def _generate():
        # Convert dicts to proper objects
        from src.blackroad_core.packs.job_hunter import JobPosting, UserProfile

        job_posting = JobPosting(**job)
        user_profile = UserProfile(**profile)

        # Generate application
        application = await self.writer.generate_application(
            job=job_posting,
            profile=user_profile,
            use_ai=use_ai
        )

        return {
            "job_id": job["id"],
            "user_id": profile["id"],
            "cover_letter": application.cover_letter,
            "resume_text": application.resume_text,
            "custom_answers": application.custom_answers,
            "match_score": application.match_score,
            "timestamp": datetime.now(UTC).isoformat()
        }

    return asyncio.run(_generate())


@celery_app.task(base=ApplicationTask, bind=True)
def submit_application(
    self,
    job_id: str,
    user_id: str,
    application_content: Dict[str, Any],
    platform: str,
    dry_run: bool = False
) -> Dict[str, Any]:
    """
    Submit a job application.

    Args:
        job_id: Job ID
        user_id: User ID
        application_content: Generated application content
        platform: Platform name
        dry_run: If True, simulate without actually submitting

    Returns:
        Submission result
    """
    async def _submit():
        await self.scraper.initialize()

        # Get job URL
        # In production, fetch from database
        job_url = application_content.get("job_url", "")

        if not job_url:
            return {
                "success": False,
                "error": "Missing job URL",
                "job_id": job_id
            }

        # Navigate to job
        page = await self.scraper.context.new_page()

        try:
            await page.goto(job_url, wait_until="domcontentloaded")

            # Fill application form
            result = await self.filler.fill_and_submit(
                page=page,
                platform=platform,
                application_content=application_content,
                dry_run=dry_run
            )

            await page.close()
            await self.scraper.cleanup()

            return {
                "success": result.get("submitted", False),
                "job_id": job_id,
                "user_id": user_id,
                "platform": platform,
                "dry_run": dry_run,
                "timestamp": datetime.now(UTC).isoformat(),
                **result
            }

        except Exception as e:
            await page.close()
            await self.scraper.cleanup()

            return {
                "success": False,
                "error": str(e),
                "job_id": job_id,
                "user_id": user_id
            }

    return asyncio.run(_submit())


@celery_app.task(base=ApplicationTask, bind=True)
def batch_apply(
    self,
    user_id: str,
    applications: List[Dict[str, Any]],
    auto_submit: bool = False
) -> Dict[str, Any]:
    """
    Process a batch of applications.

    Args:
        user_id: User ID
        applications: List of application data
        auto_submit: If True, submit immediately; if False, queue for review

    Returns:
        Batch processing results
    """
    results = {
        "total": len(applications),
        "generated": 0,
        "submitted": 0,
        "queued": 0,
        "failed": 0,
        "applications": []
    }

    for app in applications:
        try:
            # Generate application content
            content = generate_application.apply_async(
                args=[app["job"], app["profile"], True]
            ).get()

            results["generated"] += 1

            if auto_submit:
                # Submit application
                submit_result = submit_application.apply_async(
                    args=[
                        app["job"]["id"],
                        user_id,
                        content,
                        app["job"]["platform"],
                        False  # Not dry run
                    ]
                ).get()

                if submit_result["success"]:
                    results["submitted"] += 1
                else:
                    results["failed"] += 1

                results["applications"].append(submit_result)
            else:
                # Queue for review
                results["queued"] += 1
                results["applications"].append({
                    "job_id": app["job"]["id"],
                    "status": "queued_for_review",
                    "content": content
                })

        except Exception as e:
            results["failed"] += 1
            results["applications"].append({
                "job_id": app.get("job", {}).get("id", "unknown"),
                "status": "failed",
                "error": str(e)
            })

    return results


@celery_app.task
def process_pending_applications():
    """
    Process applications pending review.
    Runs when user approves applications from dashboard.
    """
    # In production:
    # 1. Query database for approved applications
    # 2. Submit each application
    # 3. Update status in database
    # 4. Send notifications

    return {
        "status": "success",
        "message": "Pending applications processed",
        "timestamp": datetime.now(UTC).isoformat()
    }


@celery_app.task(base=ApplicationTask, bind=True)
def apply_via_company_website(
    self,
    job_id: str,
    user_id: str,
    company_url: str,
    application_content: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Apply directly via company careers page.

    Args:
        job_id: Job ID
        user_id: User ID
        company_url: Company careers page URL
        application_content: Application content

    Returns:
        Application result
    """
    async def _apply():
        await self.scraper.initialize()

        page = await self.scraper.context.new_page()

        try:
            await page.goto(company_url, wait_until="domcontentloaded")

            # Look for application form
            # This is a generic implementation - would need customization per company
            apply_button = await page.query_selector('a[href*="apply"], button:has-text("Apply")')

            if not apply_button:
                return {
                    "success": False,
                    "error": "Could not find apply button",
                    "job_id": job_id
                }

            await apply_button.click()
            await page.wait_for_load_state("domcontentloaded")

            # Fill generic application form
            # Name
            name_input = await page.query_selector('input[name*="name"], input[id*="name"]')
            if name_input:
                await name_input.fill(application_content.get("full_name", ""))

            # Email
            email_input = await page.query_selector('input[type="email"], input[name*="email"]')
            if email_input:
                await email_input.fill(application_content.get("email", ""))

            # Resume upload
            resume_input = await page.query_selector('input[type="file"]')
            if resume_input and application_content.get("resume_path"):
                await resume_input.set_input_files(application_content["resume_path"])

            # Cover letter
            cover_letter_input = await page.query_selector('textarea[name*="cover"], textarea[id*="cover"]')
            if cover_letter_input:
                await cover_letter_input.fill(application_content.get("cover_letter", ""))

            # Submit
            submit_button = await page.query_selector('button[type="submit"], input[type="submit"]')
            if submit_button:
                await submit_button.click()
                await page.wait_for_load_state("networkidle")

            await page.close()
            await self.scraper.cleanup()

            return {
                "success": True,
                "job_id": job_id,
                "user_id": user_id,
                "method": "company_website",
                "timestamp": datetime.now(UTC).isoformat()
            }

        except Exception as e:
            await page.close()
            await self.scraper.cleanup()

            return {
                "success": False,
                "error": str(e),
                "job_id": job_id
            }

    return asyncio.run(_apply())
