#!/usr/bin/env python3
"""
🤖 applier Auto-Submit - Playwright-based Auto Application
Automatically fills out and submits job applications across multiple platforms
"""

import asyncio
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import random

try:
    from playwright.async_api import async_playwright, Page, Browser
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("⚠️  Playwright not installed. Run: pip install playwright && playwright install")


class AutoSubmitter:
    """Automatically submit job applications using Playwright"""

    def __init__(self, headless: bool = False):
        self.headless = headless
        self.browser: Optional[Browser] = None
        self.submitted_log = Path.home() / '.applier' / 'submitted.jsonl'
        self.submitted_log.parent.mkdir(exist_ok=True)

        # Platform-specific selectors and automation rules
        self.platforms = {
            "LinkedIn": {
                "url": "https://www.linkedin.com/jobs",
                "easy_apply_button": "button.jobs-apply-button",
                "name_field": "input[name='name']",
                "email_field": "input[name='email']",
                "phone_field": "input[name='phone']",
                "resume_upload": "input[type='file']",
                "submit_button": "button[aria-label='Submit application']",
                "requires_login": True
            },
            "Indeed": {
                "url": "https://www.indeed.com",
                "apply_button": "button.jobsearch-IndeedApplyButton",
                "name_field": "input#applicant.name",
                "email_field": "input#applicant.email",
                "phone_field": "input#applicant.phoneNumber",
                "resume_upload": "input[type='file']",
                "submit_button": "button#form-action-continue",
                "requires_login": False
            },
            "Greenhouse": {
                "url_pattern": "boards.greenhouse.io",
                "name_field": "input#first_name",
                "last_name_field": "input#last_name",
                "email_field": "input#email",
                "phone_field": "input#phone",
                "resume_upload": "input#resume",
                "submit_button": "input[value='Submit Application']",
                "requires_login": False
            },
            "Lever": {
                "url_pattern": "jobs.lever.co",
                "name_field": "input[name='name']",
                "email_field": "input[name='email']",
                "phone_field": "input[name='phone']",
                "resume_upload": "input[name='resume']",
                "cover_letter_field": "textarea[name='comments']",
                "submit_button": "button[type='submit']",
                "requires_login": False
            }
        }

    async def start(self):
        """Initialize browser"""
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright not installed")

        p = await async_playwright().start()
        self.browser = await p.chromium.launch(
            headless=self.headless,
            # Stealth mode settings
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox'
            ]
        )
        return self

    async def close(self):
        """Close browser"""
        if self.browser:
            await self.browser.close()

    async def submit_application(self, job: Dict[str, Any], profile: Dict[str, Any],
                                 resume_path: str, cover_letter: str = None) -> Dict[str, Any]:
        """
        Submit a single job application

        Args:
            job: Job dict with title, company, url, platform
            profile: User profile with name, email, phone, etc.
            resume_path: Path to resume PDF
            cover_letter: Optional cover letter text

        Returns:
            Dict with status, timestamp, errors
        """

        # Check if already submitted
        if self._already_submitted(job):
            return {
                "status": "skipped",
                "reason": "already_submitted",
                "timestamp": datetime.now().isoformat()
            }

        # Detect platform
        platform = self._detect_platform(job.get('url', ''))

        if not platform:
            return {
                "status": "failed",
                "reason": "unsupported_platform",
                "timestamp": datetime.now().isoformat()
            }

        # Create new page
        page = await self.browser.new_page()

        # Add stealth scripts
        await self._add_stealth(page)

        try:
            # Navigate to job posting
            await page.goto(job['url'], wait_until='networkidle')

            # Random human-like delay
            await self._human_delay()

            # Platform-specific submission
            if platform == "LinkedIn":
                result = await self._submit_linkedin(page, job, profile, resume_path, cover_letter)
            elif platform == "Indeed":
                result = await self._submit_indeed(page, job, profile, resume_path, cover_letter)
            elif platform == "Greenhouse":
                result = await self._submit_greenhouse(page, job, profile, resume_path, cover_letter)
            elif platform == "Lever":
                result = await self._submit_lever(page, job, profile, resume_path, cover_letter)
            else:
                result = await self._submit_generic(page, job, profile, resume_path, cover_letter)

            # Log submission
            if result.get('status') == 'success':
                self._log_submission(job, result)

            return result

        except Exception as e:
            return {
                "status": "error",
                "reason": str(e),
                "timestamp": datetime.now().isoformat()
            }
        finally:
            await page.close()

    async def _submit_linkedin(self, page: Page, job: Dict, profile: Dict,
                               resume_path: str, cover_letter: str = None) -> Dict:
        """Submit LinkedIn Easy Apply application"""

        try:
            # Click Easy Apply button
            await page.click(self.platforms['LinkedIn']['easy_apply_button'])
            await self._human_delay()

            # Fill form fields (multi-step wizard)
            steps_completed = 0
            max_steps = 5

            while steps_completed < max_steps:
                # Fill visible fields
                await self._fill_common_fields(page, profile, 'LinkedIn')

                # Handle file uploads
                if await page.locator(self.platforms['LinkedIn']['resume_upload']).is_visible():
                    await page.set_input_files(
                        self.platforms['LinkedIn']['resume_upload'],
                        resume_path
                    )

                # Look for Next or Submit button
                next_button = page.locator("button:has-text('Next'), button:has-text('Review'), button:has-text('Submit')")
                if await next_button.count() == 0:
                    break

                button_text = await next_button.first.inner_text()
                await next_button.first.click()
                await self._human_delay()

                if 'Submit' in button_text:
                    # Application submitted!
                    return {
                        "status": "success",
                        "platform": "LinkedIn",
                        "timestamp": datetime.now().isoformat()
                    }

                steps_completed += 1

            return {
                "status": "partial",
                "reason": "workflow_incomplete",
                "steps_completed": steps_completed
            }

        except Exception as e:
            return {
                "status": "failed",
                "reason": f"linkedin_error: {str(e)}"
            }

    async def _submit_greenhouse(self, page: Page, job: Dict, profile: Dict,
                                 resume_path: str, cover_letter: str = None) -> Dict:
        """Submit Greenhouse application"""

        try:
            # Fill name fields
            await page.fill(self.platforms['Greenhouse']['name_field'], profile.get('name', '').split()[0])
            await page.fill(self.platforms['Greenhouse']['last_name_field'], ' '.join(profile.get('name', '').split()[1:]))

            # Fill email and phone
            await page.fill(self.platforms['Greenhouse']['email_field'], profile.get('email', ''))
            await page.fill(self.platforms['Greenhouse']['phone_field'], profile.get('phone', ''))

            # Upload resume
            await page.set_input_files(self.platforms['Greenhouse']['resume_upload'], resume_path)

            # Human delay
            await self._human_delay()

            # Submit
            await page.click(self.platforms['Greenhouse']['submit_button'])

            # Wait for confirmation
            await page.wait_for_load_state('networkidle')

            return {
                "status": "success",
                "platform": "Greenhouse",
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            return {
                "status": "failed",
                "reason": f"greenhouse_error: {str(e)}"
            }

    async def _submit_lever(self, page: Page, job: Dict, profile: Dict,
                           resume_path: str, cover_letter: str = None) -> Dict:
        """Submit Lever application"""

        try:
            # Fill fields
            await page.fill(self.platforms['Lever']['name_field'], profile.get('name', ''))
            await page.fill(self.platforms['Lever']['email_field'], profile.get('email', ''))
            await page.fill(self.platforms['Lever']['phone_field'], profile.get('phone', ''))

            # Upload resume
            await page.set_input_files(self.platforms['Lever']['resume_upload'], resume_path)

            # Add cover letter if provided
            if cover_letter and await page.locator(self.platforms['Lever']['cover_letter_field']).is_visible():
                await page.fill(self.platforms['Lever']['cover_letter_field'], cover_letter)

            await self._human_delay()

            # Submit
            await page.click(self.platforms['Lever']['submit_button'])
            await page.wait_for_load_state('networkidle')

            return {
                "status": "success",
                "platform": "Lever",
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            return {
                "status": "failed",
                "reason": f"lever_error: {str(e)}"
            }

    async def _submit_generic(self, page: Page, job: Dict, profile: Dict,
                             resume_path: str, cover_letter: str = None) -> Dict:
        """Generic form filler for unknown platforms"""

        try:
            # Try to find common field patterns
            fields_filled = 0

            # Name
            name_selectors = ["input[name*='name']", "input[id*='name']", "input[placeholder*='Name']"]
            for selector in name_selectors:
                if await page.locator(selector).count() > 0:
                    await page.fill(selector, profile.get('name', ''))
                    fields_filled += 1
                    break

            # Email
            email_selectors = ["input[type='email']", "input[name*='email']", "input[id*='email']"]
            for selector in email_selectors:
                if await page.locator(selector).count() > 0:
                    await page.fill(selector, profile.get('email', ''))
                    fields_filled += 1
                    break

            # Phone
            phone_selectors = ["input[type='tel']", "input[name*='phone']", "input[id*='phone']"]
            for selector in phone_selectors:
                if await page.locator(selector).count() > 0:
                    await page.fill(selector, profile.get('phone', ''))
                    fields_filled += 1
                    break

            # Resume upload
            file_selectors = ["input[type='file']", "input[name*='resume']", "input[accept*='pdf']"]
            for selector in file_selectors:
                if await page.locator(selector).count() > 0:
                    await page.set_input_files(selector, resume_path)
                    fields_filled += 1
                    break

            if fields_filled < 2:
                return {
                    "status": "failed",
                    "reason": "insufficient_fields_detected",
                    "fields_filled": fields_filled
                }

            # Look for submit button
            submit_selectors = [
                "button[type='submit']",
                "input[type='submit']",
                "button:has-text('Submit')",
                "button:has-text('Apply')"
            ]

            for selector in submit_selectors:
                if await page.locator(selector).count() > 0:
                    await page.click(selector)
                    await page.wait_for_load_state('networkidle')
                    return {
                        "status": "success",
                        "platform": "generic",
                        "fields_filled": fields_filled,
                        "timestamp": datetime.now().isoformat()
                    }

            return {
                "status": "manual_review_required",
                "reason": "no_submit_button_found",
                "fields_filled": fields_filled
            }

        except Exception as e:
            return {
                "status": "failed",
                "reason": f"generic_error: {str(e)}"
            }

    async def _fill_common_fields(self, page: Page, profile: Dict, platform: str):
        """Fill common form fields across platforms"""

        config = self.platforms.get(platform, {})

        # Name
        if config.get('name_field'):
            try:
                await page.fill(config['name_field'], profile.get('name', ''), timeout=2000)
            except:
                pass

        # Email
        if config.get('email_field'):
            try:
                await page.fill(config['email_field'], profile.get('email', ''), timeout=2000)
            except:
                pass

        # Phone
        if config.get('phone_field'):
            try:
                await page.fill(config['phone_field'], profile.get('phone', ''), timeout=2000)
            except:
                pass

    async def _add_stealth(self, page: Page):
        """Add stealth scripts to avoid detection"""

        await page.add_init_script("""
            // Override navigator.webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });

            // Override plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });

            // Override languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en']
            });
        """)

    async def _human_delay(self, min_ms: int = 500, max_ms: int = 2000):
        """Random delay to mimic human behavior"""
        delay = random.randint(min_ms, max_ms) / 1000
        await asyncio.sleep(delay)

    def _detect_platform(self, url: str) -> Optional[str]:
        """Detect platform from URL"""

        if 'linkedin.com' in url:
            return 'LinkedIn'
        elif 'indeed.com' in url:
            return 'Indeed'
        elif 'greenhouse.io' in url:
            return 'Greenhouse'
        elif 'lever.co' in url:
            return 'Lever'
        else:
            return 'generic'

    def _already_submitted(self, job: Dict) -> bool:
        """Check if job was already submitted"""

        if not self.submitted_log.exists():
            return False

        job_id = job.get('id') or f"{job['company']}:{job['title']}"

        with open(self.submitted_log, 'r') as f:
            for line in f:
                submission = json.loads(line)
                if submission.get('job_id') == job_id:
                    return True

        return False

    def _log_submission(self, job: Dict, result: Dict):
        """Log successful submission"""

        job_id = job.get('id') or f"{job['company']}:{job['title']}"

        log_entry = {
            "job_id": job_id,
            "company": job.get('company'),
            "title": job.get('title'),
            "url": job.get('url'),
            "platform": result.get('platform'),
            "status": result.get('status'),
            "timestamp": result.get('timestamp'),
            "result": result
        }

        with open(self.submitted_log, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')


async def main():
    """Demo auto-submission"""

    # Load profile
    profile_path = Path.home() / '.applier' / 'profile.json'
    if not profile_path.exists():
        print("❌ No profile found. Run applier-cli.py first.")
        return

    with open(profile_path) as f:
        profile = json.load(f)

    # Add phone if not present
    if 'phone' not in profile:
        profile['phone'] = input("Enter phone number: ")

    # Test job
    test_job = {
        "id": "test-123",
        "title": "Senior Software Engineer",
        "company": "Test Company",
        "url": "https://jobs.lever.co/example",  # Example Lever URL
        "platform": "Lever"
    }

    # Initialize submitter
    async with await AutoSubmitter(headless=False).start() as submitter:
        print("🤖 Starting auto-submit...")

        # Submit application
        result = await submitter.submit_application(
            job=test_job,
            profile=profile,
            resume_path=str(Path.home() / 'resume.pdf'),  # Update with your resume path
            cover_letter="Dear Hiring Manager,\n\nI'm excited to apply..."
        )

        print(f"\n✓ Result: {json.dumps(result, indent=2)}")


if __name__ == "__main__":
    if PLAYWRIGHT_AVAILABLE:
        asyncio.run(main())
    else:
        print("❌ Install Playwright first:")
        print("   pip install playwright")
        print("   playwright install")
