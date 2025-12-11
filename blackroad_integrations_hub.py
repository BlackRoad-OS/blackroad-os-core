#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Integrations Hub
# Copyright (c) 2025 BlackRoad OS, Inc.
# All Rights Reserved.
# ============================================================================
"""
BlackRoad Integrations Hub - Unified API for all productivity integrations.

Supported Platforms:
- Project Management: Asana, Notion, Jira, Linear
- Email: Gmail, Outlook
- Storage: Google Drive, Dropbox, OneDrive
- Communication: Slack, Discord
- Calendar: Google Calendar, Outlook Calendar
- Code: GitHub, GitLab
- Design: Figma
- AI: ChatGPT (via router), Claude (via router)
"""

import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Integration configurations
INTEGRATIONS = {
    # Project Management
    "asana": {
        "name": "Asana",
        "category": "project_management",
        "icon": "📋",
        "enabled": bool(os.getenv("ASANA_TOKEN")),
        "base_url": "https://app.asana.com/api/1.0"
    },
    "notion": {
        "name": "Notion",
        "category": "project_management",
        "icon": "📝",
        "enabled": bool(os.getenv("NOTION_TOKEN")),
        "base_url": "https://api.notion.com/v1"
    },
    "jira": {
        "name": "Jira",
        "category": "project_management",
        "icon": "🎯",
        "enabled": bool(os.getenv("JIRA_TOKEN") and os.getenv("JIRA_DOMAIN")),
        "base_url": (
            f"https://{os.getenv('JIRA_DOMAIN', 'yourcompany')}"
            ".atlassian.net/rest/api/3"
        )
    },
    "linear": {
        "name": "Linear",
        "category": "project_management",
        "icon": "📊",
        "enabled": bool(os.getenv("LINEAR_TOKEN")),
        "base_url": "https://api.linear.app/graphql"
    },

    # Email
    "gmail": {
        "name": "Gmail",
        "category": "email",
        "icon": "📧",
        "enabled": bool(os.getenv("GMAIL_TOKEN")),
        "base_url": "https://gmail.googleapis.com/gmail/v1"
    },
    "outlook": {
        "name": "Outlook",
        "category": "email",
        "icon": "📨",
        "enabled": bool(os.getenv("OUTLOOK_TOKEN")),
        "base_url": "https://graph.microsoft.com/v1.0"
    },

    # Storage
    "google_drive": {
        "name": "Google Drive",
        "category": "storage",
        "icon": "💾",
        "enabled": bool(os.getenv("GOOGLE_DRIVE_TOKEN")),
        "base_url": "https://www.googleapis.com/drive/v3"
    },
    "dropbox": {
        "name": "Dropbox",
        "category": "storage",
        "icon": "📦",
        "enabled": bool(os.getenv("DROPBOX_TOKEN")),
        "base_url": "https://api.dropboxapi.com/2"
    },
    "onedrive": {
        "name": "OneDrive",
        "category": "storage",
        "icon": "☁️",
        "enabled": bool(os.getenv("ONEDRIVE_TOKEN")),
        "base_url": "https://graph.microsoft.com/v1.0/me/drive"
    },

    # Communication
    "slack": {
        "name": "Slack",
        "category": "communication",
        "icon": "💬",
        "enabled": bool(os.getenv("SLACK_TOKEN")),
        "base_url": "https://slack.com/api"
    },
    "discord": {
        "name": "Discord",
        "category": "communication",
        "icon": "🎮",
        "enabled": bool(os.getenv("DISCORD_TOKEN")),
        "base_url": "https://discord.com/api/v10"
    },

    # Calendar
    "google_calendar": {
        "name": "Google Calendar",
        "category": "calendar",
        "icon": "📅",
        "enabled": bool(os.getenv("GOOGLE_CALENDAR_TOKEN")),
        "base_url": "https://www.googleapis.com/calendar/v3"
    },
    "outlook_calendar": {
        "name": "Outlook Calendar",
        "category": "calendar",
        "icon": "📆",
        "enabled": bool(os.getenv("OUTLOOK_TOKEN")),
        "base_url": "https://graph.microsoft.com/v1.0"
    },

    # Code
    "github": {
        "name": "GitHub",
        "category": "code",
        "icon": "🐙",
        "enabled": bool(os.getenv("GITHUB_TOKEN")),
        "base_url": "https://api.github.com"
    },
    "gitlab": {
        "name": "GitLab",
        "category": "code",
        "icon": "🦊",
        "enabled": bool(os.getenv("GITLAB_TOKEN")),
        "base_url": "https://gitlab.com/api/v4"
    },

    # Design
    "figma": {
        "name": "Figma",
        "category": "design",
        "icon": "🎨",
        "enabled": bool(os.getenv("FIGMA_TOKEN")),
        "base_url": "https://api.figma.com/v1"
    },
    "canva": {
        "name": "Canva",
        "category": "design",
        "icon": "🖼️",
        "enabled": bool(os.getenv("CANVA_TOKEN")),
        "base_url": "https://api.canva.com/rest/v1"
    },

    # Notes & Productivity
    "onenote": {
        "name": "OneNote",
        "category": "notes",
        "icon": "📓",
        "enabled": bool(os.getenv("ONENOTE_TOKEN") or os.getenv("OUTLOOK_TOKEN")),
        "base_url": "https://graph.microsoft.com/v1.0/me/onenote"
    },

    # AI (passthrough to AI router)
    "ai_router": {
        "name": "AI Router",
        "category": "ai",
        "icon": "🤖",
        "enabled": True,
        "base_url": "http://localhost:9600/api/ai"
    }
}


def get_headers(integration):
    """Get authentication headers for an integration."""
    config = INTEGRATIONS.get(integration)
    if not config:
        return {}

    # Different auth patterns
    if integration == "asana":
        return {"Authorization": f"Bearer {os.getenv('ASANA_TOKEN')}"}
    elif integration == "notion":
        return {
            "Authorization": f"Bearer {os.getenv('NOTION_TOKEN')}",
            "Notion-Version": "2022-06-28"
        }
    elif integration == "jira":
        return {
            "Authorization": f"Bearer {os.getenv('JIRA_TOKEN')}",
            "Content-Type": "application/json"
        }
    elif integration == "github":
        return {"Authorization": f"token {os.getenv('GITHUB_TOKEN')}"}
    elif integration in ["gmail", "google_drive", "google_calendar"]:
        return {"Authorization": f"Bearer {os.getenv('GMAIL_TOKEN')}"}
    elif integration in ["outlook", "outlook_calendar", "onedrive"]:
        return {"Authorization": f"Bearer {os.getenv('OUTLOOK_TOKEN')}"}
    elif integration == "slack":
        return {"Authorization": f"Bearer {os.getenv('SLACK_TOKEN')}"}
    elif integration == "discord":
        return {"Authorization": f"Bot {os.getenv('DISCORD_TOKEN')}"}
    elif integration == "dropbox":
        return {"Authorization": f"Bearer {os.getenv('DROPBOX_TOKEN')}"}
    elif integration == "figma":
        return {"X-Figma-Token": os.getenv("FIGMA_TOKEN")}
    elif integration == "canva":
        return {"Authorization": f"Bearer {os.getenv('CANVA_TOKEN')}"}
    elif integration == "onenote":
        token = os.getenv("ONENOTE_TOKEN") or os.getenv("OUTLOOK_TOKEN")
        return {"Authorization": f"Bearer {token}"}

    return {}


# ============================================================================
# INTEGRATION STATUS
# ============================================================================

@app.route('/api/integrations/list', methods=['GET'])
def list_integrations():
    """List all integrations grouped by category."""
    categories = {}

    for integration_id, config in INTEGRATIONS.items():
        category = config["category"]
        if category not in categories:
            categories[category] = []

        categories[category].append({
            "id": integration_id,
            "name": config["name"],
            "icon": config["icon"],
            "enabled": config["enabled"],
            "status": "connected" if config["enabled"] else "not_configured"
        })

    return jsonify({
        "ok": True,
        "categories": categories,
        "total_enabled": sum(1 for c in INTEGRATIONS.values() if c["enabled"]),
        "total_available": len(INTEGRATIONS)
    })


@app.route('/api/integrations/<integration>/status', methods=['GET'])
def integration_status(integration):
    """Check status of a specific integration."""
    config = INTEGRATIONS.get(integration)
    if not config:
        return jsonify({"ok": False, "error": "Integration not found"})

    return jsonify({
        "ok": True,
        "integration": integration,
        "name": config["name"],
        "category": config["category"],
        "enabled": config["enabled"],
        "status": "connected" if config["enabled"] else "not_configured"
    })


# ============================================================================
# ASANA
# ============================================================================

@app.route('/api/asana/tasks', methods=['GET'])
def asana_tasks():
    """Get Asana tasks."""
    if not INTEGRATIONS["asana"]["enabled"]:
        return jsonify({"ok": False, "error": "Asana not configured"})

    try:
        url = (
            f"{INTEGRATIONS['asana']['base_url']}/tasks"
            "?assignee=me&opt_fields=name,completed,due_on"
        )
        response = requests.get(
            url, headers=get_headers("asana"), timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "tasks": response.json()["data"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# NOTION
# ============================================================================

@app.route('/api/notion/pages', methods=['GET'])
def notion_pages():
    """Get Notion pages."""
    if not INTEGRATIONS["notion"]["enabled"]:
        return jsonify({"ok": False, "error": "Notion not configured"})

    try:
        url = f"{INTEGRATIONS['notion']['base_url']}/search"
        data = {"filter": {"property": "object", "value": "page"}}
        response = requests.post(
            url, headers=get_headers("notion"), json=data, timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "pages": response.json()["results"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# JIRA
# ============================================================================

@app.route('/api/jira/issues', methods=['GET'])
def jira_issues():
    """Get Jira issues."""
    if not INTEGRATIONS["jira"]["enabled"]:
        return jsonify({"ok": False, "error": "Jira not configured"})

    try:
        url = (
            f"{INTEGRATIONS['jira']['base_url']}"
            "/search?jql=assignee=currentUser()"
        )
        response = requests.get(url, headers=get_headers("jira"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "issues": response.json()["issues"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# GMAIL
# ============================================================================

@app.route('/api/gmail/messages', methods=['GET'])
def gmail_messages():
    """Get Gmail messages."""
    if not INTEGRATIONS["gmail"]["enabled"]:
        return jsonify({"ok": False, "error": "Gmail not configured"})

    try:
        url = (
            f"{INTEGRATIONS['gmail']['base_url']}"
            "/users/me/messages?maxResults=20"
        )
        response = requests.get(url, headers=get_headers("gmail"), timeout=10)

        if response.status_code == 200:
            messages = response.json()["messages"]
            return jsonify({"ok": True, "messages": messages})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# GOOGLE DRIVE
# ============================================================================

@app.route('/api/drive/files', methods=['GET'])
def drive_files():
    """Get Google Drive files."""
    if not INTEGRATIONS["google_drive"]["enabled"]:
        return jsonify({"ok": False, "error": "Google Drive not configured"})

    try:
        url = (
            f"{INTEGRATIONS['google_drive']['base_url']}/files"
            "?pageSize=20&fields=files(id,name,mimeType,modifiedTime)"
        )
        response = requests.get(
            url, headers=get_headers("google_drive"), timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "files": response.json()["files"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# SLACK
# ============================================================================

@app.route('/api/slack/channels', methods=['GET'])
def slack_channels():
    """Get Slack channels."""
    if not INTEGRATIONS["slack"]["enabled"]:
        return jsonify({"ok": False, "error": "Slack not configured"})

    try:
        url = f"{INTEGRATIONS['slack']['base_url']}/conversations.list"
        response = requests.get(url, headers=get_headers("slack"), timeout=10)

        if response.status_code == 200:
            channels = response.json()["channels"]
            return jsonify({"ok": True, "channels": channels})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# GITHUB (from existing integrations)
# ============================================================================

@app.route('/api/github/repos', methods=['GET'])
def github_repos():
    """Get GitHub repositories."""
    if not INTEGRATIONS["github"]["enabled"]:
        return jsonify({"ok": False, "error": "GitHub not configured"})

    try:
        url = (
            f"{INTEGRATIONS['github']['base_url']}"
            "/user/repos?per_page=20&sort=updated"
        )
        response = requests.get(
            url, headers=get_headers("github"), timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "repos": response.json()})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# OUTLOOK / MICROSOFT 365
# ============================================================================

@app.route('/api/outlook/messages', methods=['GET'])
def outlook_messages():
    """Get Outlook messages."""
    if not INTEGRATIONS["outlook"]["enabled"]:
        return jsonify({"ok": False, "error": "Outlook not configured"})

    try:
        url = (
            f"{INTEGRATIONS['outlook']['base_url']}"
            "/me/messages?$top=20&$select=subject,from,receivedDateTime"
        )
        response = requests.get(url, headers=get_headers("outlook"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "messages": response.json()["value"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/outlook/send', methods=['POST'])
def outlook_send():
    """Send an Outlook email."""
    if not INTEGRATIONS["outlook"]["enabled"]:
        return jsonify({"ok": False, "error": "Outlook not configured"})

    data = request.json
    if not data or not data.get("to") or not data.get("subject"):
        return jsonify({"ok": False, "error": "Missing required fields"})

    try:
        url = f"{INTEGRATIONS['outlook']['base_url']}/me/sendMail"
        message = {
            "message": {
                "subject": data["subject"],
                "body": {
                    "contentType": "HTML",
                    "content": data.get("body", "")
                },
                "toRecipients": [
                    {"emailAddress": {"address": email}}
                    for email in data["to"].split(",")
                ]
            }
        }
        response = requests.post(
            url, headers=get_headers("outlook"), json=message, timeout=10
        )

        if response.status_code == 202:
            return jsonify({"ok": True, "message": "Email sent"})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/outlook/calendar/events', methods=['GET'])
def outlook_calendar_events():
    """Get Outlook calendar events."""
    if not INTEGRATIONS["outlook_calendar"]["enabled"]:
        return jsonify({"ok": False, "error": "Outlook Calendar not configured"})

    try:
        url = (
            f"{INTEGRATIONS['outlook_calendar']['base_url']}"
            "/me/calendar/events?$top=20&$select=subject,start,end"
        )
        response = requests.get(
            url, headers=get_headers("outlook_calendar"), timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "events": response.json()["value"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# GMAIL ENHANCED
# ============================================================================

@app.route('/api/gmail/send', methods=['POST'])
def gmail_send():
    """Send a Gmail message."""
    if not INTEGRATIONS["gmail"]["enabled"]:
        return jsonify({"ok": False, "error": "Gmail not configured"})

    data = request.json
    if not data or not data.get("to") or not data.get("subject"):
        return jsonify({"ok": False, "error": "Missing required fields"})

    try:
        import base64
        from email.mime.text import MIMEText

        message = MIMEText(data.get("body", ""))
        message["to"] = data["to"]
        message["subject"] = data["subject"]

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

        url = f"{INTEGRATIONS['gmail']['base_url']}/users/me/messages/send"
        response = requests.post(
            url,
            headers=get_headers("gmail"),
            json={"raw": raw},
            timeout=10
        )

        if response.status_code == 200:
            return jsonify({"ok": True, "message": "Email sent"})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/gmail/labels', methods=['GET'])
def gmail_labels():
    """Get Gmail labels."""
    if not INTEGRATIONS["gmail"]["enabled"]:
        return jsonify({"ok": False, "error": "Gmail not configured"})

    try:
        url = f"{INTEGRATIONS['gmail']['base_url']}/users/me/labels"
        response = requests.get(url, headers=get_headers("gmail"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "labels": response.json()["labels"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# ONENOTE
# ============================================================================

@app.route('/api/onenote/notebooks', methods=['GET'])
def onenote_notebooks():
    """Get OneNote notebooks."""
    if not INTEGRATIONS["onenote"]["enabled"]:
        return jsonify({"ok": False, "error": "OneNote not configured"})

    try:
        url = f"{INTEGRATIONS['onenote']['base_url']}/notebooks"
        response = requests.get(url, headers=get_headers("onenote"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "notebooks": response.json()["value"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/onenote/pages', methods=['GET'])
def onenote_pages():
    """Get OneNote pages."""
    if not INTEGRATIONS["onenote"]["enabled"]:
        return jsonify({"ok": False, "error": "OneNote not configured"})

    try:
        url = f"{INTEGRATIONS['onenote']['base_url']}/pages?$top=20"
        response = requests.get(url, headers=get_headers("onenote"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "pages": response.json()["value"]})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/onenote/create_page', methods=['POST'])
def onenote_create_page():
    """Create a OneNote page."""
    if not INTEGRATIONS["onenote"]["enabled"]:
        return jsonify({"ok": False, "error": "OneNote not configured"})

    data = request.json
    if not data or not data.get("title"):
        return jsonify({"ok": False, "error": "Missing title"})

    try:
        # Get default notebook/section
        url = f"{INTEGRATIONS['onenote']['base_url']}/sections"
        response = requests.get(url, headers=get_headers("onenote"), timeout=10)

        if response.status_code != 200:
            return jsonify({"ok": False, "error": "Failed to get sections"})

        sections = response.json()["value"]
        if not sections:
            return jsonify({"ok": False, "error": "No sections found"})

        section_id = sections[0]["id"]

        # Create page
        url = (
            f"{INTEGRATIONS['onenote']['base_url']}"
            f"/sections/{section_id}/pages"
        )
        html_content = f"""
        <!DOCTYPE html>
        <html>
            <head>
                <title>{data['title']}</title>
            </head>
            <body>
                <p>{data.get('content', '')}</p>
            </body>
        </html>
        """

        headers = get_headers("onenote").copy()
        headers["Content-Type"] = "application/xhtml+xml"

        response = requests.post(url, headers=headers, data=html_content, timeout=10)

        if response.status_code == 201:
            return jsonify({"ok": True, "page": response.json()})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# CANVA
# ============================================================================

@app.route('/api/canva/designs', methods=['GET'])
def canva_designs():
    """Get Canva designs."""
    if not INTEGRATIONS["canva"]["enabled"]:
        return jsonify({"ok": False, "error": "Canva not configured"})

    try:
        url = f"{INTEGRATIONS['canva']['base_url']}/designs"
        response = requests.get(url, headers=get_headers("canva"), timeout=10)

        if response.status_code == 200:
            return jsonify({"ok": True, "designs": response.json().get("items", [])})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/canva/create', methods=['POST'])
def canva_create():
    """Create a Canva design."""
    if not INTEGRATIONS["canva"]["enabled"]:
        return jsonify({"ok": False, "error": "Canva not configured"})

    data = request.json
    if not data or not data.get("design_type"):
        return jsonify({"ok": False, "error": "Missing design_type"})

    try:
        url = f"{INTEGRATIONS['canva']['base_url']}/designs"
        payload = {
            "design_type": data["design_type"],
            "title": data.get("title", "New Design")
        }
        response = requests.post(
            url, headers=get_headers("canva"), json=payload, timeout=10
        )

        if response.status_code in [200, 201]:
            return jsonify({"ok": True, "design": response.json()})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/canva/export/<design_id>', methods=['POST'])
def canva_export(design_id):
    """Export a Canva design."""
    if not INTEGRATIONS["canva"]["enabled"]:
        return jsonify({"ok": False, "error": "Canva not configured"})

    data = request.json or {}
    file_format = data.get("format", "png")

    try:
        url = f"{INTEGRATIONS['canva']['base_url']}/designs/{design_id}/export"
        payload = {"file_format": file_format}
        response = requests.post(
            url, headers=get_headers("canva"), json=payload, timeout=30
        )

        if response.status_code in [200, 202]:
            return jsonify({"ok": True, "export": response.json()})
        else:
            error = f"API error: {response.status_code}"
            return jsonify({"ok": False, "error": error})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# UNIFIED SEARCH
# ============================================================================

@app.route('/api/search/all', methods=['GET'])
def search_all():
    """Search across all connected platforms."""
    query = request.args.get('q', '')
    if not query:
        return jsonify({"ok": False, "error": "No query provided"})

    results = {
        "query": query,
        "sources": []
    }

    # Search each enabled integration
    # (This would call each integration's search API)
    # For now, return structure

    for integration_id, config in INTEGRATIONS.items():
        if config["enabled"]:
            results["sources"].append({
                "integration": integration_id,
                "name": config["name"],
                "icon": config["icon"],
                "results": []  # Would populate with actual search results
            })

    return jsonify({"ok": True, **results})


# ============================================================================
# AI ROUTER PASSTHROUGH
# ============================================================================

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """Passthrough to AI router."""
    try:
        response = requests.post(
            f"{INTEGRATIONS['ai_router']['base_url']}/chat",
            json=request.json,
            timeout=30
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route('/api/ai/providers', methods=['GET'])
def ai_providers():
    """Get AI providers from router."""
    try:
        response = requests.get(
            f"{INTEGRATIONS['ai_router']['base_url']}/providers",
            timeout=10
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


# ============================================================================
# HEALTH
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check."""
    return jsonify({
        "ok": True,
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })


if __name__ == "__main__":
    print("🚀 BlackRoad Integrations Hub starting...")
    print("\nAvailable Integrations:")

    categories = {}
    for integration_id, config in INTEGRATIONS.items():
        category = config["category"]
        if category not in categories:
            categories[category] = []

        if config["enabled"]:
            status = "✅ ENABLED"
        else:
            status = "⚠️  DISABLED (missing token)"
        integration_line = f"  {config['icon']} {config['name']}: {status}"
        categories[category].append(integration_line)

    for category, integrations in categories.items():
        print(f"\n{category.replace('_', ' ').title()}:")
        for integration in integrations:
            print(integration)

    print("\n✅ API ready at http://localhost:9700")
    print("\nEndpoints:")
    print("  GET  /api/integrations/list       - List all integrations")
    print("\n  Project Management:")
    print("    GET  /api/asana/tasks           - Asana tasks")
    print("    GET  /api/notion/pages          - Notion pages")
    print("    GET  /api/jira/issues           - Jira issues")
    print("\n  Email:")
    print("    GET  /api/gmail/messages        - Gmail messages")
    print("    POST /api/gmail/send            - Send Gmail")
    print("    GET  /api/gmail/labels          - Gmail labels")
    print("    GET  /api/outlook/messages      - Outlook messages")
    print("    POST /api/outlook/send          - Send Outlook email")
    print("\n  Calendar:")
    print("    GET  /api/outlook/calendar/events - Outlook events")
    print("\n  Storage:")
    print("    GET  /api/drive/files           - Google Drive files")
    print("\n  Communication:")
    print("    GET  /api/slack/channels        - Slack channels")
    print("\n  Code:")
    print("    GET  /api/github/repos          - GitHub repositories")
    print("\n  Notes:")
    print("    GET  /api/onenote/notebooks     - OneNote notebooks")
    print("    GET  /api/onenote/pages         - OneNote pages")
    print("    POST /api/onenote/create_page   - Create OneNote page")
    print("\n  Design:")
    print("    GET  /api/canva/designs         - Canva designs")
    print("    POST /api/canva/create          - Create Canva design")
    print("    POST /api/canva/export/<id>     - Export Canva design")
    print("\n  Search & AI:")
    print("    GET  /api/search/all?q=...      - Unified search")
    print("    POST /api/ai/chat               - AI chat (via router)")
    print("    GET  /api/ai/providers          - AI providers")
    print("\n  System:")
    print("    GET  /api/health                - Health check")

    print("\nConfiguration:")
    print("  Set environment variables for each service:")
    print("    - ASANA_TOKEN, NOTION_TOKEN, JIRA_TOKEN + JIRA_DOMAIN, LINEAR_TOKEN")
    print("    - GMAIL_TOKEN, OUTLOOK_TOKEN")
    print("    - GOOGLE_DRIVE_TOKEN, DROPBOX_TOKEN, ONEDRIVE_TOKEN")
    print("    - SLACK_TOKEN, DISCORD_TOKEN")
    print("    - GOOGLE_CALENDAR_TOKEN, OUTLOOK_CALENDAR_TOKEN")
    print("    - GITHUB_TOKEN, GITLAB_TOKEN")
    print("    - FIGMA_TOKEN, CANVA_TOKEN")
    print("    - ONENOTE_TOKEN (or use OUTLOOK_TOKEN)")
    print("\n🔥 Total Integrations: 19 platforms")
    print("   Canva 🖼️, OneNote 📓, Gmail 📧, Outlook 📨, and 15 more!")

    app.run(host="0.0.0.0", port=9700, debug=True)
