#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Canva Auto-Branding System
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""
Auto-generate branded visual assets for all BlackRoad domains using Canva API.

Features:
- Social media cards (Twitter, LinkedIn, Facebook)
- GitHub repository banners
- API documentation headers
- Landing page hero images
- Consistent brand colors across all assets
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime

# BlackRoad Brand Guidelines
BRAND = {
    "colors": {
        "primary": "#FF9D00",      # Orange
        "secondary": "#FF0066",    # Pink
        "accent": "#0066FF",       # Blue
        "purple": "#7700FF",
        "dark": "#1a1a1a",
        "light": "#ffffff"
    },
    "gradient": ["#FF9D00", "#FF6B00", "#FF0066", "#D600AA", "#7700FF", "#0066FF"],
    "fonts": {
        "heading": "Inter",
        "body": "Inter",
        "mono": "JetBrains Mono"
    }
}

# Asset templates to generate
ASSET_TYPES = {
    "social_card": {
        "width": 1200,
        "height": 630,
        "description": "Social media sharing card (Twitter, LinkedIn)"
    },
    "github_banner": {
        "width": 1280,
        "height": 640,
        "description": "GitHub repository banner"
    },
    "api_docs_header": {
        "width": 1920,
        "height": 400,
        "description": "API documentation header"
    },
    "hero_image": {
        "width": 1920,
        "height": 1080,
        "description": "Landing page hero image"
    }
}


class CanvaBrandingSystem:
    """Auto-branding system using Canva API."""

    def __init__(self):
        self.api_token = os.getenv("CANVA_TOKEN")
        self.base_url = "https://api.canva.com/rest/v1"
        self.output_dir = Path("brand-assets")
        self.output_dir.mkdir(exist_ok=True)

        # Asset registry
        self.registry_file = Path("canva-assets-registry.json")
        self.registry = self.load_registry()

    def load_registry(self):
        """Load asset registry."""
        if self.registry_file.exists():
            with open(self.registry_file) as f:
                return json.load(f)
        return {"assets": [], "generated": None}

    def save_registry(self):
        """Save asset registry."""
        self.registry["generated"] = datetime.now().isoformat()
        with open(self.registry_file, "w") as f:
            json.dump(self.registry, f, indent=2)

    def create_design(self, design_type, title):
        """
        Create a Canva design.

        Args:
            design_type: Type of design (e.g., "Presentation", "SocialMedia")
            title: Title for the design

        Returns:
            Design ID or None if failed
        """
        if not self.api_token:
            print("⚠️  CANVA_TOKEN not set - using mock mode")
            return self.mock_create_design(design_type, title)

        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "design_type": design_type,
            "title": title
        }

        try:
            response = requests.post(
                f"{self.base_url}/designs",
                headers=headers,
                json=payload,
                timeout=30
            )

            if response.status_code in [200, 201]:
                design = response.json()
                return design.get("id")
            else:
                print(f"❌ Canva API error: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Error creating design: {e}")
            return None

    def mock_create_design(self, design_type, title):
        """Mock design creation (when CANVA_TOKEN not set)."""
        return f"mock-design-{design_type.lower()}-{hash(title) % 10000}"

    def export_design(self, design_id, file_format="png"):
        """
        Export a Canva design.

        Args:
            design_id: Design ID
            file_format: Export format (png, jpg, pdf)

        Returns:
            Export URL or None
        """
        if not self.api_token or design_id.startswith("mock-"):
            return self.mock_export_design(design_id, file_format)

        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "file_format": file_format
        }

        try:
            response = requests.post(
                f"{self.base_url}/designs/{design_id}/export",
                headers=headers,
                json=payload,
                timeout=60
            )

            if response.status_code in [200, 202]:
                export = response.json()
                return export.get("url")
            else:
                print(f"❌ Export error: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Error exporting: {e}")
            return None

    def mock_export_design(self, design_id, file_format):
        """Mock export (when CANVA_TOKEN not set)."""
        return f"https://mock-canva-export.com/{design_id}.{file_format}"

    def generate_domain_assets(self, domain, purpose="Core Platform"):
        """
        Generate all branded assets for a domain.

        Args:
            domain: Domain name (e.g., "blackroad.io")
            purpose: Domain purpose/description
        """
        print(f"\n🎨 Generating branded assets for {domain}")
        print(f"   Purpose: {purpose}")

        domain_dir = self.output_dir / domain.replace(".", "-")
        domain_dir.mkdir(exist_ok=True)

        generated_assets = []

        for asset_type, config in ASSET_TYPES.items():
            print(f"\n   Creating {asset_type}...")
            print(f"   Size: {config['width']}x{config['height']}")

            # Create design
            title = f"{domain} - {asset_type.replace('_', ' ').title()}"
            design_id = self.create_design("SocialMedia", title)

            if design_id:
                # Export design
                export_url = self.export_design(design_id, "png")

                asset_info = {
                    "domain": domain,
                    "asset_type": asset_type,
                    "design_id": design_id,
                    "export_url": export_url,
                    "dimensions": f"{config['width']}x{config['height']}",
                    "created": datetime.now().isoformat()
                }

                generated_assets.append(asset_info)
                print(f"   ✓ {asset_type}: {export_url}")

        # Save to registry
        self.registry["assets"].extend(generated_assets)
        self.save_registry()

        print(f"\n✅ Generated {len(generated_assets)} assets for {domain}")
        return generated_assets

    def generate_all_domains(self, domains_config):
        """
        Generate assets for all domains.

        Args:
            domains_config: Dict of {domain: purpose}
        """
        print("🎨 BlackRoad Canva Auto-Branding System")
        print("=" * 60)
        print(f"Generating branded assets for {len(domains_config)} domains\n")

        total_assets = 0

        for idx, (domain, purpose) in enumerate(domains_config.items(), 1):
            print(f"[{idx}/{len(domains_config)}]")
            assets = self.generate_domain_assets(domain, purpose)
            total_assets += len(assets)

        print("\n" + "=" * 60)
        print(f"✅ Generated {total_assets} total assets")
        print(f"📋 Registry: {self.registry_file}")
        print(f"📁 Assets: {self.output_dir}/")

    def list_assets(self):
        """List all generated assets."""
        print("\n📋 Canva Asset Registry")
        print("=" * 60)

        if not self.registry["assets"]:
            print("No assets generated yet.")
            return

        by_domain = {}
        for asset in self.registry["assets"]:
            domain = asset["domain"]
            if domain not in by_domain:
                by_domain[domain] = []
            by_domain[domain].append(asset)

        for domain, assets in by_domain.items():
            print(f"\n{domain}")
            for asset in assets:
                print(f"  {asset['asset_type']}: {asset['export_url']}")


def main():
    """CLI entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description="BlackRoad Canva Auto-Branding System"
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Generate command
    generate_parser = subparsers.add_parser(
        "generate",
        help="Generate assets for a domain"
    )
    generate_parser.add_argument("--domain", required=True, help="Domain name")
    generate_parser.add_argument("--purpose", default="Core Platform", help="Domain purpose")

    # Generate all command
    subparsers.add_parser("generate-all", help="Generate assets for all 20 domains")

    # List command
    subparsers.add_parser("list", help="List all generated assets")

    args = parser.parse_args()

    branding = CanvaBrandingSystem()

    if args.command == "generate":
        branding.generate_domain_assets(args.domain, args.purpose)

    elif args.command == "generate-all":
        # All 20 domains
        domains = {
            "blackroad.io": "Core Platform",
            "blackroad.network": "Network Infrastructure",
            "blackroad.systems": "System Monitoring",
            "blackroadai.com": "AI Services",
            "lucidia.earth": "Agent Orchestration",
            "lucidiastud.io": "Creative Tools",
            "lucidiaqi.com": "Digital Identity",
            "aliceqi.com": "Personal Brand",
            "blackroad-inc.us": "Corporate Entity",
            "blackroad.me": "Personal Site",
            "blackroadquantum.com": "Quantum Computing",
            "blackroadagents.com": "Agent Marketplace",
            "blackroad.dev": "Developer Portal",
            "blackroad.cloud": "Cloud Services",
            "blackroad.tech": "Technology Showcase",
            "blackroad.digital": "Digital Services",
            "blackroad.ventures": "Investment Platform",
            "blackroad.capital": "Financial Services",
            "blackroad.fund": "Crowdfunding",
            "blackroad.dao": "DAO Governance"
        }
        branding.generate_all_domains(domains)

    elif args.command == "list":
        branding.list_assets()

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
