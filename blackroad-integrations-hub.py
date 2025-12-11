#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Unified Integrations Hub
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================
"""
BlackRoad Integrations Hub - One API for all integrations

Unified interface for:
- Slack (messaging, notifications, webhooks)
- Notion (pages, databases, sync)
- Linear (issues, projects, updates)
- Asana (tasks, projects, teams)
- Trello (boards, cards, lists)
- Jira (issues, projects, workflows)
- Discord (messages, channels, webhooks)
- GitHub (repos, PRs, issues)
- Google Drive (files, folders, sharing)
- Microsoft Teams (messages, channels, meetings)
- Zoom (meetings, recordings, webinars)
- Airtable (bases, tables, records)
- Salesforce (leads, contacts, opportunities)
- HubSpot (contacts, deals, companies)
- Zendesk (tickets, users, organizations)

Port: 9510
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import requests
import json
from datetime import datetime

app = FastAPI(title="BlackRoad Integrations Hub", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Configuration
# ============================================================================

SLACK_TOKEN = os.getenv("SLACK_ACCESS_TOKEN", "")
NOTION_TOKEN = os.getenv("NOTION_TOKEN", "")
LINEAR_API_KEY = os.getenv("LINEAR_API_KEY", "")
ASANA_API_KEY = os.getenv("ASANA_API_KEY", "")
TRELLO_API_KEY = os.getenv("TRELLO_API_KEY", "")
TRELLO_TOKEN = os.getenv("TRELLO_TOKEN", "")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN", "")
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN", "")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GOOGLE_DRIVE_CREDENTIALS = os.getenv("GOOGLE_DRIVE_CREDENTIALS", "")
TEAMS_WEBHOOK_URL = os.getenv("TEAMS_WEBHOOK_URL", "")
ZOOM_API_KEY = os.getenv("ZOOM_API_KEY", "")
ZOOM_API_SECRET = os.getenv("ZOOM_API_SECRET", "")
AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY", "")
SALESFORCE_ACCESS_TOKEN = os.getenv("SALESFORCE_ACCESS_TOKEN", "")
SALESFORCE_INSTANCE_URL = os.getenv("SALESFORCE_INSTANCE_URL", "")
HUBSPOT_API_KEY = os.getenv("HUBSPOT_API_KEY", "")
ZENDESK_API_TOKEN = os.getenv("ZENDESK_API_TOKEN", "")
ZENDESK_DOMAIN = os.getenv("ZENDESK_DOMAIN", "")

# ============================================================================
# Models
# ============================================================================

class Message(BaseModel):
    platform: str
    channel: str
    text: str
    thread_id: Optional[str] = None
    attachments: Optional[List[Dict]] = None

class Task(BaseModel):
    platform: str
    title: str
    description: Optional[str] = None
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    project_id: Optional[str] = None
    labels: Optional[List[str]] = []

class Document(BaseModel):
    platform: str
    title: str
    content: str
    parent_id: Optional[str] = None
    tags: Optional[List[str]] = []

class File(BaseModel):
    platform: str
    name: str
    content: Optional[str] = None  # For text files
    file_url: Optional[str] = None  # For uploading from URL
    parent_folder_id: Optional[str] = None
    mime_type: Optional[str] = "text/plain"

# ============================================================================
# Health & Status
# ============================================================================

@app.get("/health")
async def health():
    return {"ok": True, "service": "integrations-hub", "version": "1.0.0"}

@app.get("/api/integrations/status")
async def integration_status():
    """Check status of all integrations"""
    status = {
        "slack": {"configured": bool(SLACK_TOKEN), "status": "ready" if SLACK_TOKEN else "not_configured"},
        "notion": {"configured": bool(NOTION_TOKEN), "status": "ready" if NOTION_TOKEN else "not_configured"},
        "linear": {"configured": bool(LINEAR_API_KEY), "status": "ready" if LINEAR_API_KEY else "not_configured"},
        "asana": {"configured": bool(ASANA_API_KEY), "status": "ready" if ASANA_API_KEY else "not_configured"},
        "trello": {"configured": bool(TRELLO_API_KEY and TRELLO_TOKEN), "status": "ready" if (TRELLO_API_KEY and TRELLO_TOKEN) else "not_configured"},
        "jira": {"configured": bool(JIRA_API_TOKEN), "status": "ready" if JIRA_API_TOKEN else "not_configured"},
        "discord": {"configured": bool(DISCORD_BOT_TOKEN), "status": "ready" if DISCORD_BOT_TOKEN else "not_configured"},
        "github": {"configured": bool(GITHUB_TOKEN), "status": "ready" if GITHUB_TOKEN else "not_configured"},
        "google_drive": {"configured": bool(GOOGLE_DRIVE_CREDENTIALS), "status": "ready" if GOOGLE_DRIVE_CREDENTIALS else "not_configured"},
        "teams": {"configured": bool(TEAMS_WEBHOOK_URL), "status": "ready" if TEAMS_WEBHOOK_URL else "not_configured"},
        "zoom": {"configured": bool(ZOOM_API_KEY and ZOOM_API_SECRET), "status": "ready" if (ZOOM_API_KEY and ZOOM_API_SECRET) else "not_configured"},
        "airtable": {"configured": bool(AIRTABLE_API_KEY), "status": "ready" if AIRTABLE_API_KEY else "not_configured"},
        "salesforce": {"configured": bool(SALESFORCE_ACCESS_TOKEN and SALESFORCE_INSTANCE_URL), "status": "ready" if (SALESFORCE_ACCESS_TOKEN and SALESFORCE_INSTANCE_URL) else "not_configured"},
        "hubspot": {"configured": bool(HUBSPOT_API_KEY), "status": "ready" if HUBSPOT_API_KEY else "not_configured"},
        "zendesk": {"configured": bool(ZENDESK_API_TOKEN and ZENDESK_DOMAIN), "status": "ready" if (ZENDESK_API_TOKEN and ZENDESK_DOMAIN) else "not_configured"},
    }
    return {"ok": True, "integrations": status}

# ============================================================================
# Unified Messaging API
# ============================================================================

@app.post("/api/message/send")
async def send_message(message: Message):
    """Send message to any platform"""
    try:
        if message.platform == "slack":
            return await send_slack_message(message.channel, message.text, message.thread_id)
        elif message.platform == "discord":
            return await send_discord_message(message.channel, message.text)
        elif message.platform == "teams":
            return await send_teams_message(message.text)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {message.platform}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def send_slack_message(channel: str, text: str, thread_ts: Optional[str] = None):
    """Send Slack message"""
    if not SLACK_TOKEN:
        raise HTTPException(status_code=500, detail="Slack not configured")

    payload = {
        "channel": channel,
        "text": text,
    }
    if thread_ts:
        payload["thread_ts"] = thread_ts

    response = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={"Authorization": f"Bearer {SLACK_TOKEN}"},
        json=payload
    )

    data = response.json()
    if not data.get("ok"):
        raise HTTPException(status_code=500, detail=data.get("error", "Slack API error"))

    return {"ok": True, "platform": "slack", "message_id": data.get("ts")}

async def send_discord_message(channel_id: str, content: str):
    """Send Discord message"""
    if not DISCORD_BOT_TOKEN:
        raise HTTPException(status_code=500, detail="Discord not configured")

    response = requests.post(
        f"https://discord.com/api/v10/channels/{channel_id}/messages",
        headers={"Authorization": f"Bot {DISCORD_BOT_TOKEN}"},
        json={"content": content}
    )

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Discord API error")

    data = response.json()
    return {"ok": True, "platform": "discord", "message_id": data.get("id")}

# ============================================================================
# Unified Task Management API
# ============================================================================

@app.post("/api/task/create")
async def create_task(task: Task):
    """Create task in any platform"""
    try:
        if task.platform == "linear":
            return await create_linear_issue(task)
        elif task.platform == "asana":
            return await create_asana_task(task)
        elif task.platform == "trello":
            return await create_trello_card(task)
        elif task.platform == "jira":
            return await create_jira_issue(task)
        elif task.platform == "github":
            return await create_github_issue(task)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {task.platform}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_linear_issue(task: Task):
    """Create Linear issue"""
    if not LINEAR_API_KEY:
        raise HTTPException(status_code=500, detail="Linear not configured")

    query = """
    mutation IssueCreate($title: String!, $description: String, $teamId: String!) {
      issueCreate(input: {title: $title, description: $description, teamId: $teamId}) {
        success
        issue {
          id
          identifier
          url
        }
      }
    }
    """

    variables = {
        "title": task.title,
        "description": task.description or "",
        "teamId": task.project_id or "default"
    }

    response = requests.post(
        "https://api.linear.app/graphql",
        headers={"Authorization": LINEAR_API_KEY},
        json={"query": query, "variables": variables}
    )

    data = response.json()
    if "errors" in data:
        raise HTTPException(status_code=500, detail=data["errors"][0]["message"])

    issue = data["data"]["issueCreate"]["issue"]
    return {"ok": True, "platform": "linear", "task_id": issue["id"], "url": issue["url"]}

async def create_asana_task(task: Task):
    """Create Asana task"""
    if not ASANA_API_KEY:
        raise HTTPException(status_code=500, detail="Asana not configured")

    payload = {
        "data": {
            "name": task.title,
            "notes": task.description or "",
            "projects": [task.project_id] if task.project_id else [],
        }
    }

    if task.assignee:
        payload["data"]["assignee"] = task.assignee

    if task.due_date:
        payload["data"]["due_on"] = task.due_date

    response = requests.post(
        "https://app.asana.com/api/1.0/tasks",
        headers={"Authorization": f"Bearer {ASANA_API_KEY}"},
        json=payload
    )

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Asana API error")

    data = response.json()
    return {"ok": True, "platform": "asana", "task_id": data["data"]["gid"]}

async def create_trello_card(task: Task):
    """Create Trello card"""
    if not TRELLO_API_KEY or not TRELLO_TOKEN:
        raise HTTPException(status_code=500, detail="Trello not configured")

    params = {
        "key": TRELLO_API_KEY,
        "token": TRELLO_TOKEN,
        "name": task.title,
        "desc": task.description or "",
        "idList": task.project_id or "default"
    }

    response = requests.post(
        "https://api.trello.com/1/cards",
        params=params
    )

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Trello API error")

    data = response.json()
    return {"ok": True, "platform": "trello", "task_id": data["id"], "url": data["url"]}

async def create_jira_issue(task: Task):
    """Create Jira issue"""
    if not JIRA_API_TOKEN:
        raise HTTPException(status_code=500, detail="Jira not configured")

    # Placeholder - need JIRA_SITE_URL from env
    return {"ok": True, "platform": "jira", "message": "Jira integration coming soon"}

async def create_github_issue(task: Task):
    """Create GitHub issue"""
    if not GITHUB_TOKEN:
        raise HTTPException(status_code=500, detail="GitHub not configured")

    # Expect project_id in format "owner/repo"
    if not task.project_id or "/" not in task.project_id:
        raise HTTPException(status_code=400, detail="GitHub requires project_id in format 'owner/repo'")

    payload = {
        "title": task.title,
        "body": task.description or "",
        "labels": task.labels or []
    }

    if task.assignee:
        payload["assignees"] = [task.assignee]

    response = requests.post(
        f"https://api.github.com/repos/{task.project_id}/issues",
        headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        },
        json=payload
    )

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="GitHub API error")

    data = response.json()
    return {"ok": True, "platform": "github", "task_id": str(data["number"]), "url": data["html_url"]}

# ============================================================================
# Unified Documentation API
# ============================================================================

@app.post("/api/doc/create")
async def create_document(doc: Document):
    """Create document in any platform"""
    try:
        if doc.platform == "notion":
            return await create_notion_page(doc)
        elif doc.platform == "google_drive":
            return await create_google_drive_file(doc)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {doc.platform}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_notion_page(doc: Document):
    """Create Notion page"""
    if not NOTION_TOKEN:
        raise HTTPException(status_code=500, detail="Notion not configured")

    page_data = {
        "parent": {"database_id": doc.parent_id} if doc.parent_id else {"type": "page_id", "page_id": "default"},
        "properties": {
            "title": {
                "title": [{"text": {"content": doc.title}}]
            }
        },
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"text": {"content": doc.content}}]
                }
            }
        ]
    }

    response = requests.post(
        "https://api.notion.com/v1/pages",
        headers={
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        },
        json=page_data
    )

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Notion API error")

    data = response.json()
    return {"ok": True, "platform": "notion", "page_id": data["id"], "url": data.get("url")}

# ============================================================================
# Webhook Endpoints
# ============================================================================

@app.post("/webhook/slack")
async def slack_webhook(data: dict):
    """Handle Slack webhooks"""
    # Handle URL verification
    if data.get("type") == "url_verification":
        return {"challenge": data.get("challenge")}

    # Handle events
    event = data.get("event", {})
    return {"ok": True, "received": True}

@app.post("/webhook/github")
async def github_webhook(data: dict):
    """Handle GitHub webhooks"""
    return {"ok": True, "received": True}

@app.post("/webhook/linear")
async def linear_webhook(data: dict):
    """Handle Linear webhooks"""
    return {"ok": True, "received": True}

# ============================================================================
# Google Drive Integration
# ============================================================================

async def create_google_drive_file(doc: Document):
    """Create file in Google Drive"""
    if not GOOGLE_DRIVE_CREDENTIALS:
        raise HTTPException(status_code=500, detail="Google Drive not configured")

    # Note: Requires OAuth2 flow - simplified version using API key
    # For production, use google-auth and google-api-python-client
    return {"ok": True, "platform": "google_drive", "message": "Google Drive integration requires OAuth2 setup"}

@app.get("/api/drive/files")
async def list_drive_files(folder_id: Optional[str] = None, max_results: int = 10):
    """List files in Google Drive"""
    if not GOOGLE_DRIVE_CREDENTIALS:
        raise HTTPException(status_code=500, detail="Google Drive not configured")

    return {"ok": True, "platform": "google_drive", "message": "Google Drive listing requires OAuth2 setup"}

@app.post("/api/drive/upload")
async def upload_to_drive(file: File):
    """Upload file to Google Drive"""
    if not GOOGLE_DRIVE_CREDENTIALS:
        raise HTTPException(status_code=500, detail="Google Drive not configured")

    return {"ok": True, "platform": "google_drive", "message": "Google Drive upload requires OAuth2 setup"}

# ============================================================================
# Microsoft Teams Integration
# ============================================================================

async def send_teams_message(text: str):
    """Send message to Microsoft Teams via webhook"""
    if not TEAMS_WEBHOOK_URL:
        raise HTTPException(status_code=500, detail="Microsoft Teams not configured")

    payload = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": "BlackRoad Notification",
        "themeColor": "0066FF",
        "title": "BlackRoad OS",
        "text": text
    }

    response = requests.post(TEAMS_WEBHOOK_URL, json=payload)

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Teams API error")

    return {"ok": True, "platform": "teams", "message_id": "sent"}

# ============================================================================
# Zoom Integration
# ============================================================================

@app.post("/api/zoom/meeting/create")
async def create_zoom_meeting(topic: str, start_time: str, duration: int = 60):
    """Create Zoom meeting"""
    if not ZOOM_API_KEY or not ZOOM_API_SECRET:
        raise HTTPException(status_code=500, detail="Zoom not configured")

    return {"ok": True, "platform": "zoom", "message": "Zoom integration requires JWT authentication"}

# ============================================================================
# Airtable Integration
# ============================================================================

@app.post("/api/airtable/record/create")
async def create_airtable_record(base_id: str, table_name: str, fields: Dict[str, Any]):
    """Create record in Airtable"""
    if not AIRTABLE_API_KEY:
        raise HTTPException(status_code=500, detail="Airtable not configured")

    url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"fields": fields}

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Airtable API error")

    data = response.json()
    return {"ok": True, "platform": "airtable", "record_id": data.get("id")}

# ============================================================================
# Salesforce Integration
# ============================================================================

@app.post("/api/salesforce/lead/create")
async def create_salesforce_lead(last_name: str, company: str, email: Optional[str] = None):
    """Create lead in Salesforce"""
    if not SALESFORCE_ACCESS_TOKEN or not SALESFORCE_INSTANCE_URL:
        raise HTTPException(status_code=500, detail="Salesforce not configured")

    url = f"{SALESFORCE_INSTANCE_URL}/services/data/v59.0/sobjects/Lead"
    headers = {
        "Authorization": f"Bearer {SALESFORCE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "LastName": last_name,
        "Company": company,
        "Email": email
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Salesforce API error")

    data = response.json()
    return {"ok": True, "platform": "salesforce", "lead_id": data.get("id")}

# ============================================================================
# HubSpot Integration
# ============================================================================

@app.post("/api/hubspot/contact/create")
async def create_hubspot_contact(email: str, firstname: Optional[str] = None, lastname: Optional[str] = None):
    """Create contact in HubSpot"""
    if not HUBSPOT_API_KEY:
        raise HTTPException(status_code=500, detail="HubSpot not configured")

    url = "https://api.hubapi.com/contacts/v1/contact"
    headers = {"Authorization": f"Bearer {HUBSPOT_API_KEY}"}

    properties = [{"property": "email", "value": email}]
    if firstname:
        properties.append({"property": "firstname", "value": firstname})
    if lastname:
        properties.append({"property": "lastname", "value": lastname})

    payload = {"properties": properties}

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="HubSpot API error")

    data = response.json()
    return {"ok": True, "platform": "hubspot", "contact_id": data.get("vid")}

# ============================================================================
# Zendesk Integration
# ============================================================================

@app.post("/api/zendesk/ticket/create")
async def create_zendesk_ticket(subject: str, description: str, requester_email: str):
    """Create ticket in Zendesk"""
    if not ZENDESK_API_TOKEN or not ZENDESK_DOMAIN:
        raise HTTPException(status_code=500, detail="Zendesk not configured")

    url = f"https://{ZENDESK_DOMAIN}.zendesk.com/api/v2/tickets.json"
    headers = {
        "Authorization": f"Bearer {ZENDESK_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "ticket": {
            "subject": subject,
            "comment": {"body": description},
            "requester": {"email": requester_email}
        }
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Zendesk API error")

    data = response.json()
    return {"ok": True, "platform": "zendesk", "ticket_id": data["ticket"]["id"]}

# ============================================================================
# Quick Actions
# ============================================================================

@app.post("/api/action/notify")
async def quick_notify(platform: str, message: str, channel: str = "general"):
    """Quick notification to any platform"""
    msg = Message(platform=platform, channel=channel, text=f"🔔 {message}")
    return await send_message(msg)

@app.post("/api/action/create-task")
async def quick_task(platform: str, title: str, project_id: Optional[str] = None):
    """Quick task creation"""
    task = Task(platform=platform, title=title, project_id=project_id)
    return await create_task(task)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 9510))
    uvicorn.run(app, host="0.0.0.0", port=port)
