#!/usr/bin/env python3
"""
🔍 applier-scrapers-simple - Simple Job Scraper (No Dependencies)
Works with just Python standard library + requests
"""

import json
import re
from typing import List, Dict, Any
from datetime import datetime
from pathlib import Path
import urllib.request
import urllib.parse


class SimpleJobScraper:
    """Simple job scraper using just requests"""

    def __init__(self):
        self.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

    def search_all(self, role: str, location: str = "Remote", count: int = 100) -> List[Dict[str, Any]]:
        """Search all available platforms"""

        print(f"🔍 Searching for: {role}")
        print(f"📍 Location: {location}")
        print(f"🎯 Target: {count} jobs\n")

        all_jobs = []

        # Search Greenhouse boards (public API)
        print("🔎 Searching Greenhouse boards (30+ companies)...")
        greenhouse_jobs = self.search_greenhouse(role, location, count)
        all_jobs.extend(greenhouse_jobs)
        print(f"   ✅ Found {len(greenhouse_jobs)} jobs on Greenhouse\n")

        print(f"✅ Total found: {len(all_jobs)} jobs\n")
        return all_jobs[:count]

    def search_greenhouse(self, role: str, location: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Search Greenhouse job boards (public API)"""

        jobs = []

        # Top tech companies using Greenhouse
        companies = [
            ("airbnb", "Airbnb"),
            ("databricks", "Databricks"),
            ("stripe", "Stripe"),
            ("coinbase", "Coinbase"),
            ("notion", "Notion"),
            ("figma", "Figma"),
            ("webflow", "Webflow"),
            ("airtable", "Airtable"),
            ("mercury", "Mercury"),
            ("ramp", "Ramp"),
            ("plaid", "Plaid"),
            ("square", "Square"),
            ("robinhood", "Robinhood"),
            ("gusto", "Gusto"),
            ("dropbox", "Dropbox"),
            ("gitlab", "GitLab"),
            ("cloudflare", "Cloudflare"),
            ("shopify", "Shopify"),
            ("doordash", "DoorDash"),
            ("instacart", "Instacart"),
            ("opendoor", "Opendoor"),
            ("chime", "Chime"),
            ("brex", "Brex"),
            ("benchling", "Benchling"),
            ("flexport", "Flexport"),
            ("compass", "Compass"),
            ("faire", "Faire"),
            ("greenhouse", "Greenhouse"),
            ("amplitude", "Amplitude"),
            ("miro", "Miro")
        ]

        role_keywords = role.lower().split()

        for company_id, company_name in companies:
            if len(jobs) >= limit:
                break

            try:
                url = f"https://boards-api.greenhouse.io/v1/boards/{company_id}/jobs"

                req = urllib.request.Request(url, headers={'User-Agent': self.user_agent})
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode())
                    company_jobs = data.get('jobs', [])

                    for job in company_jobs:
                        if len(jobs) >= limit:
                            break

                        title = job.get('title', '')

                        # Filter by role keywords
                        if any(keyword in title.lower() for keyword in role_keywords):
                            location_name = job.get('location', {}).get('name', 'Remote')

                            # Filter by location if specified
                            if location.lower() == 'remote':
                                if 'remote' not in location_name.lower():
                                    continue

                            jobs.append({
                                "id": f"greenhouse_{job.get('id')}",
                                "title": title,
                                "company": company_name,
                                "location": location_name,
                                "url": job.get('absolute_url', ''),
                                "platform": "Greenhouse",
                                "posted": "Recently",
                                "description": self._clean_html(job.get('content', '')),
                                "salary": "Not specified",
                                "match": 85  # Default match score
                            })

            except Exception as e:
                # Silent fail - continue to next company
                pass

        return jobs

    def search_lever(self, role: str, location: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Search Lever job boards (public API)"""

        jobs = []

        # Top tech companies using Lever
        companies = [
            ("anthropic", "Anthropic"),
            ("vercel", "Vercel"),
            ("linear", "Linear"),
            ("railway", "Railway"),
            ("render", "Render"),
            ("fly-io", "Fly.io"),
            ("supabase", "Supabase"),
            ("replit", "Replit"),
            ("cursor", "Cursor"),
            ("loom", "Loom"),
            ("retool", "Retool"),
            ("lattice", "Lattice"),
            ("ramp", "Ramp"),
            ("canva", "Canva"),
            ("airtable", "Airtable")
        ]

        role_keywords = role.lower().split()

        for company_id, company_name in companies:
            if len(jobs) >= limit:
                break

            try:
                url = f"https://api.lever.co/v0/postings/{company_id}?mode=json"

                req = urllib.request.Request(url, headers={'User-Agent': self.user_agent})
                with urllib.request.urlopen(req, timeout=10) as response:
                    company_jobs = json.loads(response.read().decode())

                    for job in company_jobs:
                        if len(jobs) >= limit:
                            break

                        title = job.get('text', '')

                        # Filter by role keywords
                        if any(keyword in title.lower() for keyword in role_keywords):
                            categories = job.get('categories', {})
                            location_name = categories.get('location', 'Remote')

                            # Filter by location if specified
                            if location.lower() == 'remote':
                                if 'remote' not in location_name.lower():
                                    continue

                            # Parse posted date
                            created_ts = job.get('createdAt', 0)
                            posted_date = datetime.fromtimestamp(created_ts / 1000).strftime('%Y-%m-%d') if created_ts else 'Recently'

                            jobs.append({
                                "id": f"lever_{job.get('id')}",
                                "title": title,
                                "company": company_name,
                                "location": location_name,
                                "url": job.get('hostedUrl', ''),
                                "platform": "Lever",
                                "posted": posted_date,
                                "description": self._clean_html(job.get('description', '')),
                                "salary": "Not specified",
                                "match": 85  # Default match score
                            })

            except Exception as e:
                # Silent fail - continue to next company
                pass

        return jobs

    def _clean_html(self, html: str) -> str:
        """Clean HTML tags from description"""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', html)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()[:500]  # First 500 chars


def main():
    """Demo scraper"""

    print("🚗 applier - Simple Job Scraper\n")
    print("=" * 60)
    print()

    scraper = SimpleJobScraper()

    # Search for jobs
    jobs = scraper.search_all(
        role="Senior Software Engineer",
        location="Remote",
        count=50
    )

    # Save results
    output_dir = Path.home() / '.applier'
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / 'search_results.json'

    with open(output_file, 'w') as f:
        json.dump(jobs, f, indent=2)

    print(f"💾 Saved {len(jobs)} jobs to {output_file}\n")

    # Show results
    print("=" * 60)
    print("📋 TOP 10 MATCHES")
    print("=" * 60)
    print()

    for i, job in enumerate(jobs[:10], 1):
        print(f"{i}. {job['company']} - {job['title']}")
        print(f"   📍 {job['location']}")
        print(f"   🔗 {job['url']}")
        print(f"   📅 Posted: {job['posted']}")
        print()

    # Show summary
    print("=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print()

    # Count by company
    companies = {}
    for job in jobs:
        companies[job['company']] = companies.get(job['company'], 0) + 1

    print(f"Total Jobs: {len(jobs)}")
    print(f"Companies: {len(companies)}")
    print()
    print("Top Companies:")
    for company, count in sorted(companies.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  • {company}: {count} jobs")
    print()

    # Count by platform
    platforms = {}
    for job in jobs:
        platforms[job['platform']] = platforms.get(job['platform'], 0) + 1

    print("By Platform:")
    for platform, count in platforms.items():
        print(f"  • {platform}: {count} jobs")
    print()

    print("✅ Done! Use 'applier' to apply to these jobs.")
    print()


if __name__ == "__main__":
    main()
