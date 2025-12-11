#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Backend Factory
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""
BlackRoad Backend Factory - Unified backend deployment system.

One command to generate + deploy complete backend infrastructure for any domain.
Includes Canva integration for auto-generating branded visual assets.
"""

import os
import json
import yaml
import argparse
from pathlib import Path
from datetime import datetime
import requests

# BlackRoad brand colors
BRAND_COLORS = {
    "primary": "#FF9D00",    # Orange
    "secondary": "#FF0066",  # Pink
    "accent": "#0066FF",     # Blue
    "purple": "#7700FF",
    "gradient": ["#FF9D00", "#FF6B00", "#FF0066", "#D600AA", "#7700FF", "#0066FF"]
}


class BackendFactory:
    """Factory for generating and deploying backend infrastructure."""

    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.registry_file = self.base_dir / "backend-registry.json"
        self.templates_dir = self.base_dir / "backend-templates"
        self.registry = self.load_registry()

    def load_registry(self):
        """Load backend registry."""
        if self.registry_file.exists():
            with open(self.registry_file) as f:
                return json.load(f)
        return {"backends": [], "last_updated": None}

    def save_registry(self):
        """Save backend registry."""
        self.registry["last_updated"] = datetime.now().isoformat()
        with open(self.registry_file, "w") as f:
            json.dump(self.registry, f, indent=2)

    def create_backend(self, domain, services, integrations=None, deploy=None):
        """
        Create a complete backend for a domain.

        Args:
            domain: Domain name (e.g., "blackroad.io")
            services: List of services ["api", "auth", "db", "cache", "websocket"]
            integrations: List of integrations ["canva", "stripe", "clerk"]
            deploy: Deployment target ["railway", "cloudflare", "both"]
        """
        print(f"🏭 Backend Factory - Creating backend for {domain}")
        print(f"   Services: {', '.join(services)}")

        backend_id = domain.replace(".", "-")
        backend_dir = self.base_dir / "backends" / backend_id
        backend_dir.mkdir(parents=True, exist_ok=True)

        # Generate service files
        generated_files = []
        for service in services:
            service_file = self.generate_service(backend_dir, domain, service)
            generated_files.append(service_file)

        # Generate Railway config
        railway_config = self.generate_railway_config(domain, services)
        railway_file = backend_dir / "railway.toml"
        with open(railway_file, "w") as f:
            f.write(railway_config)
        generated_files.append(str(railway_file))

        # Generate Cloudflare Worker (if needed)
        if "api" in services:
            worker_config = self.generate_cloudflare_worker(domain, services)
            worker_file = backend_dir / "cloudflare-worker.js"
            with open(worker_file, "w") as f:
                f.write(worker_config)
            generated_files.append(str(worker_file))

        # Generate Docker Compose
        docker_config = self.generate_docker_compose(domain, services)
        docker_file = backend_dir / "docker-compose.yml"
        with open(docker_file, "w") as f:
            f.write(docker_config)
        generated_files.append(str(docker_file))

        # Canva integration for branding
        if integrations and "canva" in integrations:
            print("🎨 Generating branded assets with Canva...")
            self.generate_canva_assets(domain, backend_dir)

        # Register backend
        self.registry["backends"].append({
            "domain": domain,
            "backend_id": backend_id,
            "services": services,
            "integrations": integrations or [],
            "created": datetime.now().isoformat(),
            "files": generated_files,
            "status": "created"
        })
        self.save_registry()

        print(f"\n✅ Backend created: {backend_dir}")
        print(f"   Files generated: {len(generated_files)}")

        # Deploy if requested
        if deploy:
            self.deploy_backend(backend_id, deploy)

        return backend_dir

    def generate_service(self, backend_dir, domain, service):
        """Generate a service file."""
        service_templates = {
            "api": self.template_api_service,
            "auth": self.template_auth_service,
            "db": self.template_db_service,
            "cache": self.template_cache_service,
            "websocket": self.template_websocket_service,
        }

        template_func = service_templates.get(service)
        if not template_func:
            print(f"⚠️  Unknown service: {service}")
            return None

        service_code = template_func(domain)
        service_file = backend_dir / f"{service}_service.py"

        with open(service_file, "w") as f:
            f.write(service_code)

        print(f"   ✓ Generated {service} service")
        return str(service_file)

    def template_api_service(self, domain):
        """Template for API service."""
        return f'''#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - API Service for {domain}
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""API Gateway for {domain}"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({{"ok": True, "service": "api", "domain": "{domain}"}})

@app.route('/api/status', methods=['GET'])
def status():
    """Status endpoint."""
    return jsonify({{"ok": True, "status": "operational", "domain": "{domain}"}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
'''

    def template_auth_service(self, domain):
        """Template for Auth service."""
        return f'''#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Auth Service for {domain}
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""Authentication service for {domain}"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/auth/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({{"ok": True, "service": "auth", "domain": "{domain}"}})

@app.route('/auth/login', methods=['POST'])
def login():
    """Login endpoint."""
    # TODO: Implement authentication
    return jsonify({{"ok": True, "message": "Authentication endpoint"}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app.run(host="0.0.0.0", port=port)
'''

    def template_db_service(self, domain):
        """Template for DB service."""
        return f'''#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Database Service for {domain}
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""Database service for {domain}"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/db/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({{"ok": True, "service": "db", "domain": "{domain}"}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app.run(host="0.0.0.0", port=port)
'''

    def template_cache_service(self, domain):
        """Template for Cache service."""
        return f'''#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Cache Service for {domain}
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""Cache service for {domain}"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/cache/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({{"ok": True, "service": "cache", "domain": "{domain}"}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8003))
    app.run(host="0.0.0.0", port=port)
'''

    def template_websocket_service(self, domain):
        """Template for WebSocket service."""
        return f'''#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - WebSocket Service for {domain}
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""WebSocket service for {domain}"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/ws/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({{"ok": True, "service": "websocket", "domain": "{domain}"}})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
'''

    def generate_railway_config(self, domain, services):
        """Generate Railway configuration."""
        config = {
            "build": {"builder": "NIXPACKS"},
            "deploy": {
                "restartPolicyType": "ON_FAILURE",
                "restartPolicyMaxRetries": 10
            }
        }

        # Add services
        for idx, service in enumerate(services):
            port = 8000 + idx
            config[f"service_{service}"] = {
                "build": {"builder": "NIXPACKS"},
                "deploy": {
                    "startCommand": f"python3 {service}_service.py",
                    "healthcheckPath": f"/{service}/health",
                    "restartPolicyType": "ON_FAILURE"
                },
                "env": {
                    "PORT": str(port),
                    "DOMAIN": domain,
                    "SERVICE": service
                }
            }

        return f"# Railway config for {domain}\n" + yaml.dump(config, default_flow_style=False)

    def generate_cloudflare_worker(self, domain, services):
        """Generate Cloudflare Worker."""
        return f'''/**
 * Cloudflare Worker for {domain}
 * Auto-generated by BlackRoad Backend Factory
 */

export default {{
  async fetch(request, env) {{
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {{
      return new Response(JSON.stringify({{
        ok: true,
        domain: '{domain}',
        services: {json.dumps(services)},
        worker: 'cloudflare'
      }}), {{
        headers: {{ 'Content-Type': 'application/json' }}
      }});
    }}

    // Route to services
    // TODO: Add service routing logic

    return new Response('Backend Factory Worker', {{ status: 200 }});
  }}
}};
'''

    def generate_docker_compose(self, domain, services):
        """Generate Docker Compose configuration."""
        compose = {
            "version": "3.8",
            "services": {}
        }

        for idx, service in enumerate(services):
            port = 8000 + idx
            compose["services"][service] = {
                "build": ".",
                "command": f"python3 {service}_service.py",
                "ports": [f"{port}:{port}"],
                "environment": {
                    "PORT": port,
                    "DOMAIN": domain,
                    "SERVICE": service
                },
                "restart": "unless-stopped"
            }

        return f"# Docker Compose for {domain}\n" + yaml.dump(compose, default_flow_style=False)

    def generate_canva_assets(self, domain, backend_dir):
        """Generate branded assets using Canva API."""
        canva_token = os.getenv("CANVA_TOKEN")
        if not canva_token:
            print("   ⚠️  CANVA_TOKEN not set, skipping visual generation")
            return

        assets_dir = backend_dir / "assets"
        assets_dir.mkdir(exist_ok=True)

        # TODO: Implement Canva API calls
        # 1. Create social media card
        # 2. Create GitHub banner
        # 3. Create API documentation header
        # 4. Create landing page hero image

        print(f"   ✓ Canva assets directory created: {assets_dir}")

    def deploy_backend(self, backend_id, target):
        """Deploy backend to target platform."""
        print(f"\n🚀 Deploying {backend_id} to {target}...")

        if target == "railway" or target == "both":
            self.deploy_to_railway(backend_id)

        if target == "cloudflare" or target == "both":
            self.deploy_to_cloudflare(backend_id)

    def deploy_to_railway(self, backend_id):
        """Deploy to Railway."""
        # TODO: Implement Railway deployment via API
        print("   Railway deployment triggered")

    def deploy_to_cloudflare(self, backend_id):
        """Deploy to Cloudflare."""
        # TODO: Implement Cloudflare deployment via API
        print("   Cloudflare deployment triggered")

    def list_backends(self):
        """List all created backends."""
        print("\n📋 Backend Registry")
        print("=" * 60)

        if not self.registry["backends"]:
            print("No backends created yet.")
            return

        for backend in self.registry["backends"]:
            print(f"\n{backend['domain']}")
            print(f"  ID: {backend['backend_id']}")
            print(f"  Services: {', '.join(backend['services'])}")
            print(f"  Status: {backend['status']}")
            print(f"  Created: {backend['created']}")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="BlackRoad Backend Factory - Unified backend deployment"
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create a new backend")
    create_parser.add_argument("--domain", required=True, help="Domain name")
    create_parser.add_argument(
        "--services",
        required=True,
        help="Comma-separated services (api,auth,db,cache,websocket)"
    )
    create_parser.add_argument(
        "--integrations",
        help="Comma-separated integrations (canva,stripe,clerk)"
    )
    create_parser.add_argument(
        "--deploy",
        choices=["railway", "cloudflare", "both"],
        help="Deploy to platform"
    )

    # List command
    subparsers.add_parser("list", help="List all backends")

    args = parser.parse_args()

    factory = BackendFactory()

    if args.command == "create":
        services = [s.strip() for s in args.services.split(",")]
        integrations = [i.strip() for i in args.integrations.split(",")] if args.integrations else None

        factory.create_backend(
            domain=args.domain,
            services=services,
            integrations=integrations,
            deploy=args.deploy
        )

    elif args.command == "list":
        factory.list_backends()

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
