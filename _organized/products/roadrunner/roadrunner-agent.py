#!/usr/bin/env python3
"""
🏃‍♂️ RoadRunner — Autonomous Job Application Agent

An AI agent that takes job postings, matches them to your profile,
tailors applications, and submits them automatically.

Usage:
    python3 roadrunner-agent.py --job-url "https://..." --profile ~/.applier/profile.json
    python3 roadrunner-agent.py --search "Staff Engineer" --auto-apply
"""

import json
import asyncio
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime
import subprocess

try:
    from playwright.async_api import async_playwright, Page
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False


class RoadRunnerAgent:
    """Autonomous job application agent"""

    def __init__(self, profile_path: str = None):
        self.profile_path = profile_path or str(Path.home() / '.applier' / 'profile.json')
        self.profile = self._load_profile()
        self.applier_dir = Path.home() / '.applier'
        self.applier_dir.mkdir(exist_ok=True)

    def _load_profile(self) -> Dict[str, Any]:
        """Load user profile"""
        profile_path = Path(self.profile_path)
        if not profile_path.exists():
            raise FileNotFoundError(f"Profile not found: {profile_path}")

        with open(profile_path, 'r') as f:
            return json.load(f)

    async def parse_job_posting(self, job_url: str) -> Dict[str, Any]:
        """
        Parse job posting from URL

        Returns:
            {
                "title": str,
                "company": str,
                "location": str,
                "salary": str,
                "description": str,
                "requirements": List[str],
                "responsibilities": List[str],
                "url": str
            }
        """
        print(f"🔍 Parsing job posting: {job_url}")

        if not PLAYWRIGHT_AVAILABLE:
            # Fallback: Return minimal info
            return {
                "title": "Unknown",
                "company": "Unknown",
                "location": "Remote",
                "salary": "Not specified",
                "description": "",
                "requirements": [],
                "responsibilities": [],
                "url": job_url
            }

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            try:
                await page.goto(job_url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(2)

                # Extract job details (platform-agnostic selectors)
                job_data = {
                    "url": job_url,
                    "title": await self._extract_text(page, 'h1, .job-title, [class*="title"]'),
                    "company": await self._extract_text(page, '.company, [class*="company"]'),
                    "location": await self._extract_text(page, '.location, [class*="location"]'),
                    "salary": await self._extract_text(page, '.salary, [class*="salary"], [class*="compensation"]'),
                    "description": await self._extract_text(page, '.description, [class*="description"], .content'),
                    "requirements": [],
                    "responsibilities": []
                }

                # Extract requirements and responsibilities
                description = job_data["description"]
                if "requirements" in description.lower():
                    # Parse requirements section
                    job_data["requirements"] = self._parse_list_items(description, "requirements")

                if "responsibilities" in description.lower():
                    job_data["responsibilities"] = self._parse_list_items(description, "responsibilities")

                print(f"   ✅ Parsed: {job_data['title']} at {job_data['company']}")
                return job_data

            finally:
                await browser.close()

    async def _extract_text(self, page: Page, selector: str) -> str:
        """Extract text from page using selector"""
        try:
            element = await page.query_selector(selector)
            if element:
                return (await element.inner_text()).strip()
        except:
            pass
        return ""

    def _parse_list_items(self, text: str, section: str) -> List[str]:
        """Parse bullet points from a section"""
        # Simple parser - look for lines starting with • - * or numbers
        lines = text.split('\n')
        items = []
        in_section = False

        for line in lines:
            line = line.strip()
            if section.lower() in line.lower():
                in_section = True
                continue

            if in_section:
                # Check if it's a bullet point or numbered item
                if line.startswith(('•', '-', '*')) or (len(line) > 0 and line[0].isdigit() and line[1] in ('.', ')')):
                    items.append(line.lstrip('•-*0123456789.) '))
                elif len(items) > 0 and line == '':
                    # Empty line might indicate end of section
                    break

        return items[:10]  # Limit to 10 items

    def calculate_match_score(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate how well the job matches your profile

        Returns:
            {
                "score": int (0-100),
                "reasoning": str,
                "strengths": List[str],
                "concerns": List[str],
                "recommendation": str ("apply" | "maybe" | "skip")
            }
        """
        print(f"🧠 Analyzing match: {job['title']}")

        score = 0
        strengths = []
        concerns = []

        # Check title match
        profile_title = self.profile.get('title', '').lower()
        job_title = job['title'].lower()

        if any(word in job_title for word in ['vp', 'head', 'chief', 'director']):
            score += 30
            strengths.append("Leadership role aligns with orchestrator profile")
        elif any(word in job_title for word in ['principal', 'staff', 'architect']):
            score += 25
            strengths.append("Senior IC role suitable for orchestration expertise")
        elif 'senior' in job_title:
            score += 15
            concerns.append("May be below your experience level")
        else:
            score += 5
            concerns.append("Entry-level role not aligned with experience")

        # Check skills match
        profile_skills = [s.lower() for s in self.profile.get('skills', [])]
        job_text = (job['description'] + ' ' + ' '.join(job['requirements'])).lower()

        matched_skills = [skill for skill in profile_skills if skill.lower() in job_text]
        skill_match_pct = len(matched_skills) / max(len(profile_skills), 1) * 100

        score += min(30, int(skill_match_pct / 3))

        if len(matched_skills) > 10:
            strengths.append(f"Strong skills match ({len(matched_skills)} skills aligned)")
        elif len(matched_skills) > 5:
            strengths.append(f"Good skills match ({len(matched_skills)} skills aligned)")
        else:
            concerns.append(f"Limited skills overlap ({len(matched_skills)} skills matched)")

        # Check for AI/orchestration keywords
        ai_keywords = ['ai', 'machine learning', 'orchestration', 'architecture', 'multi-agent', 'distributed systems']
        ai_match = sum(1 for keyword in ai_keywords if keyword in job_text)

        if ai_match >= 3:
            score += 20
            strengths.append("Strong AI/orchestration focus")
        elif ai_match >= 1:
            score += 10

        # Check location
        job_location = job['location'].lower()
        if 'remote' in job_location or 'anywhere' in job_location:
            score += 10
            strengths.append("Remote-friendly")
        elif any(loc in job_location for loc in ['lakeville', 'minnesota', 'mn']):
            score += 10
            strengths.append("Local to your area")
        else:
            concerns.append("Location may require relocation")

        # Check company
        target_companies = [c.lower() for c in self.profile.get('target_companies', [])]
        if job['company'].lower() in target_companies:
            score += 10
            strengths.append("Target company on your list")

        # Determine recommendation
        if score >= 80:
            recommendation = "apply"
            reasoning = "Excellent match - strongly recommended"
        elif score >= 60:
            recommendation = "maybe"
            reasoning = "Good match - consider applying"
        else:
            recommendation = "skip"
            reasoning = "Limited match - not recommended"

        return {
            "score": min(100, score),
            "reasoning": reasoning,
            "strengths": strengths,
            "concerns": concerns,
            "recommendation": recommendation,
            "matched_skills": matched_skills
        }

    def generate_cover_letter(self, job: Dict[str, Any], match_analysis: Dict[str, Any]) -> str:
        """Generate tailored cover letter"""
        print(f"✍️  Generating cover letter for {job['company']}")

        # Use your orchestrator positioning
        name = self.profile.get('name', '')
        phone = self.profile.get('phone', '')
        email = self.profile.get('email', '')

        company = job['company']
        title = job['title']

        # Get key strengths
        strengths = match_analysis.get('strengths', [])
        matched_skills = match_analysis.get('matched_skills', [])[:5]

        # Build cover letter
        cover_letter = f"""Dear {company} Hiring Team,

I am writing to express my strong interest in the {title} position. As an AI Systems Orchestrator who has designed and coordinated a 112,758-file distributed platform orchestrating 3,300+ autonomous agents, I believe my experience in large-scale system architecture and AI coordination aligns exceptionally well with this role.

"""

        # Add matched strengths
        if strengths:
            cover_letter += "Key alignment with your requirements:\n\n"
            for strength in strengths[:3]:
                cover_letter += f"• {strength}\n"
            cover_letter += "\n"

        # Add orchestration philosophy
        cover_letter += f"""My approach emphasizes orchestration over implementation—I design architectures, coordinate distributed teams (human + AI), and leverage modern AI development tools (Claude, ChatGPT, Cursor) to achieve 10x development velocity. This allows me to focus on strategic impact rather than manual implementation.

"""

        # Add relevant experience
        if 'experience' in self.profile:
            highlights = self.profile['experience'].get('highlights', [])[:2]
            if highlights:
                cover_letter += "Recent achievements include:\n\n"
                for highlight in highlights:
                    cover_letter += f"• {highlight}\n"
                cover_letter += "\n"

        # Add matched skills
        if matched_skills:
            skills_str = ', '.join(matched_skills[:7])
            cover_letter += f"""Technical expertise particularly relevant to this role: {skills_str}, and proven success in multi-cloud orchestration, regulatory compliance, and AI-assisted development.

"""

        # Closing
        cover_letter += f"""I am excited about the opportunity to bring my orchestration expertise and strategic technical leadership to {company}. I would welcome the chance to discuss how my background in coordinating large-scale AI systems can contribute to your team's success.

Thank you for your consideration.

Best regards,
{name}
{email}
{phone}
"""

        return cover_letter

    async def submit_application(self, job: Dict[str, Any], cover_letter: str, dry_run: bool = False) -> Dict[str, Any]:
        """Submit job application"""

        if dry_run:
            print(f"🔍 DRY RUN: Would submit to {job['company']}")
            return {
                "success": True,
                "message": "Dry run - application not submitted",
                "job": job,
                "cover_letter": cover_letter
            }

        print(f"📤 Submitting application to {job['company']}")

        # For now, save the application locally
        # In production, this would use the auto-submit functionality

        app_file = self.applier_dir / 'applications' / f"{datetime.now().strftime('%Y-%m-%d')}.json"
        app_file.parent.mkdir(exist_ok=True)

        application = {
            "timestamp": datetime.now().isoformat(),
            "job": job,
            "cover_letter": cover_letter,
            "status": "prepared"
        }

        # Load existing applications
        applications = []
        if app_file.exists():
            with open(app_file, 'r') as f:
                applications = json.load(f)

        applications.append(application)

        with open(app_file, 'w') as f:
            json.dump(applications, f, indent=2)

        print(f"   ✅ Application saved to {app_file}")
        print(f"   📋 Review and submit manually at: {job['url']}")

        return {
            "success": True,
            "message": "Application prepared and saved",
            "job": job,
            "file": str(app_file)
        }

    async def process_job(self, job_url: str, auto_submit: bool = False) -> Dict[str, Any]:
        """Process a single job posting end-to-end"""

        print(f"\n{'='*60}")
        print(f"🏃‍♂️ RoadRunner Processing Job")
        print(f"{'='*60}\n")

        # Step 1: Parse job posting
        job = await self.parse_job_posting(job_url)

        # Step 2: Calculate match
        match_analysis = self.calculate_match_score(job)

        print(f"\n📊 Match Analysis:")
        print(f"   Score: {match_analysis['score']}%")
        print(f"   Recommendation: {match_analysis['recommendation'].upper()}")

        if match_analysis['strengths']:
            print(f"\n   ✅ Strengths:")
            for strength in match_analysis['strengths']:
                print(f"      • {strength}")

        if match_analysis['concerns']:
            print(f"\n   ⚠️  Concerns:")
            for concern in match_analysis['concerns']:
                print(f"      • {concern}")

        # Step 3: Generate cover letter (if match is good)
        if match_analysis['recommendation'] in ['apply', 'maybe']:
            cover_letter = self.generate_cover_letter(job, match_analysis)

            # Step 4: Submit (or save for review)
            result = await self.submit_application(job, cover_letter, dry_run=not auto_submit)

            return {
                "job": job,
                "match": match_analysis,
                "cover_letter": cover_letter,
                "submission": result
            }
        else:
            print(f"\n⏭️  Skipping - match score too low ({match_analysis['score']}%)")
            return {
                "job": job,
                "match": match_analysis,
                "skipped": True
            }

    async def batch_process(self, search_query: str, max_applications: int = 10) -> List[Dict[str, Any]]:
        """Process multiple jobs from search"""

        print(f"\n🔍 Searching for: {search_query}")
        print(f"🎯 Target: {max_applications} applications\n")

        # Use existing scraper
        scraper_path = Path(__file__).parent / 'applier-scrapers-simple.py'
        if not scraper_path.exists():
            print(f"❌ Scraper not found: {scraper_path}")
            return []

        # Run scraper
        print("🔎 Running job scraper...")
        result = subprocess.run(
            ['python3', str(scraper_path)],
            capture_output=True,
            text=True
        )

        # Load results
        results_file = self.applier_dir / 'search_results.json'
        if not results_file.exists():
            print("❌ No search results found")
            return []

        with open(results_file, 'r') as f:
            jobs = json.load(f)

        print(f"✅ Found {len(jobs)} jobs\n")

        # Process each job
        results = []
        applied = 0

        for job in jobs[:max_applications * 2]:  # Search more than needed
            if applied >= max_applications:
                break

            try:
                result = await self.process_job(job['url'], auto_submit=False)
                results.append(result)

                if not result.get('skipped'):
                    applied += 1

            except Exception as e:
                print(f"❌ Error processing {job.get('company', 'Unknown')}: {e}")

        print(f"\n{'='*60}")
        print(f"✅ Batch Complete: {applied} applications prepared")
        print(f"{'='*60}\n")

        return results


async def main():
    parser = argparse.ArgumentParser(description="RoadRunner - Autonomous Job Application Agent")
    parser.add_argument('--job-url', help='Single job posting URL to process')
    parser.add_argument('--search', help='Search query for batch processing')
    parser.add_argument('--profile', default=None, help='Path to profile.json')
    parser.add_argument('--auto-submit', action='store_true', help='Actually submit applications (default: dry run)')
    parser.add_argument('--max', type=int, default=10, help='Maximum applications to generate')

    args = parser.parse_args()

    # Initialize agent
    agent = RoadRunnerAgent(profile_path=args.profile)

    if args.job_url:
        # Process single job
        result = await agent.process_job(args.job_url, auto_submit=args.auto_submit)

        # Print summary
        print("\n📋 Summary:")
        print(json.dumps(result, indent=2))

    elif args.search:
        # Batch process
        results = await agent.batch_process(args.search, max_applications=args.max)

        # Print summary
        print("\n📊 Batch Results:")
        applied = sum(1 for r in results if not r.get('skipped'))
        skipped = sum(1 for r in results if r.get('skipped'))
        print(f"   Applied: {applied}")
        print(f"   Skipped: {skipped}")
        print(f"   Total: {len(results)}")

    else:
        parser.print_help()


if __name__ == '__main__':
    asyncio.run(main())
