#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Deploy All 20 Domain Backends
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""Deploy backends for all 20 BlackRoad domains."""

import subprocess
import sys

# All 20 domains with their service requirements
DOMAINS = {
    # Core platform
    "blackroad.io": {
        "services": "api,auth,db,cache,websocket",
        "integrations": "canva,stripe,clerk"
    },
    "blackroad.network": {
        "services": "api,mesh,p2p,websocket",
        "integrations": "canva"
    },
    "blackroad.systems": {
        "services": "api,monitoring,health",
        "integrations": "canva"
    },

    # AI platforms
    "blackroadai.com": {
        "services": "api,llm,rag",
        "integrations": "canva"
    },
    "lucidia.earth": {
        "services": "api,agents,quantum",
        "integrations": "canva"
    },
    "lucidiastud.io": {
        "services": "api,creative",
        "integrations": "canva"
    },

    # Identity & Data
    "lucidiaqi.com": {
        "services": "api,identity,did",
        "integrations": "canva"
    },
    "aliceqi.com": {
        "services": "api,personal",
        "integrations": "canva"
    },

    # Business entities
    "blackroad-inc.us": {
        "services": "api,corporate",
        "integrations": "canva"
    },
    "blackroad.me": {
        "services": "api,personal",
        "integrations": "canva"
    },

    # Specialized services
    "blackroadquantum.com": {
        "services": "api,quantum,ml",
        "integrations": "canva"
    },
    "blackroadagents.com": {
        "services": "api,agents,registry",
        "integrations": "canva"
    },

    # Additional domains
    "blackroad.dev": {
        "services": "api,developer,docs",
        "integrations": "canva"
    },
    "blackroad.cloud": {
        "services": "api,infrastructure",
        "integrations": "canva"
    },
    "blackroad.tech": {
        "services": "api,technology",
        "integrations": "canva"
    },
    "blackroad.digital": {
        "services": "api,digital,web3",
        "integrations": "canva"
    },
    "blackroad.ventures": {
        "services": "api,investment",
        "integrations": "canva"
    },
    "blackroad.capital": {
        "services": "api,finance",
        "integrations": "canva"
    },
    "blackroad.fund": {
        "services": "api,crowdfunding,dao",
        "integrations": "canva"
    },
    "blackroad.dao": {
        "services": "api,governance,voting",
        "integrations": "canva"
    },
}


def deploy_backend(domain, config):
    """Deploy backend for a domain."""
    cmd = [
        "./blackroad-backend-factory.py",
        "create",
        "--domain", domain,
        "--services", config["services"],
        "--integrations", config["integrations"]
    ]

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr


def main():
    """Deploy all backends."""
    print("🏭 BlackRoad Backend Factory - Mass Deployment")
    print("=" * 60)
    print(f"Deploying {len(DOMAINS)} domain backends\n")

    success_count = 0
    failed = []

    for idx, (domain, config) in enumerate(DOMAINS.items(), 1):
        print(f"[{idx}/{len(DOMAINS)}] Deploying {domain}")
        print(f"   Services: {config['services']}")

        success, output = deploy_backend(domain, config)

        if success:
            success_count += 1
            print(f"   ✅ Success\n")
        else:
            failed.append(domain)
            print(f"   ❌ Failed: {output}\n")

    print("=" * 60)
    print(f"✅ {success_count}/{len(DOMAINS)} backends deployed successfully")

    if failed:
        print(f"\n❌ Failed domains:")
        for domain in failed:
            print(f"   - {domain}")
    else:
        print("\n🎉 All backends deployed!")

    print(f"\n📋 View registry: cat backend-registry.json")
    print(f"📊 List all backends: ./blackroad-backend-factory.py list")


if __name__ == "__main__":
    main()
