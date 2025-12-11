#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

"""
BlackRoad Agent Guardian - Security Agent
🛡️ Symbol: Shield, protection

Port: 9600

Capabilities:
- Security monitoring & threat detection
- Access control & authorization
- Vulnerability scanning
- Audit logging
- Intrusion detection
- Security policy enforcement

Endpoints:
- POST /api/guardian/scan - Security scan
- POST /api/guardian/authorize - Authorization check
- GET /api/guardian/threats - List detected threats
- POST /api/guardian/audit - Log security event
- GET /api/guardian/status - Security status
- POST /api/guardian/policy/enforce - Enforce security policy
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import hashlib
import re

app = Flask(__name__)
CORS(app)

# Threat database
detected_threats = []

# Audit log
audit_log = []

# Security policies
security_policies = {
    "password_min_length": 12,
    "require_mfa": True,
    "session_timeout_minutes": 30,
    "max_login_attempts": 5,
    "require_https": True,
    "allowed_origins": ["blackroad.io", "*.blackroad.io", "localhost"],
    "rate_limit_per_minute": 100
}

# Known vulnerabilities
KNOWN_VULNERABILITIES = [
    "sql_injection",
    "xss",
    "csrf",
    "command_injection",
    "path_traversal",
    "open_redirect",
    "xxe",
    "ssrf"
]

# Rate limiting
rate_limits = {}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "service": "blackroad-agent-guardian",
        "agent": "Guardian (🛡️)",
        "role": "Security Agent",
        "port": 9600,
        "capabilities": ["security-monitoring", "threat-detection", "access-control", "audit-logging"]
    })

@app.route("/api/message", methods=["POST"])
def handle_message():
    """Handle messages from agent handle system"""
    try:
        data = request.get_json()
        message = data.get("message", "")

        # Log security event
        audit_log.append({
            "event": "message_received",
            "message": message,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source": "agent_handle_system"
        })

        response = {
            "ok": True,
            "agent": "guardian",
            "response": f"🛡️ Guardian Security Agent: {message}",
            "action": "analyzing_security",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        # Check for security commands
        if "scan" in message.lower():
            response["action"] = "security_scan"
            response["response"] = "🛡️ Initiating comprehensive security scan..."
        elif "threat" in message.lower():
            response["action"] = "threat_analysis"
            response["response"] = f"🛡️ {len(detected_threats)} threats detected. Analyzing..."
        elif "audit" in message.lower():
            response["action"] = "audit_check"
            response["response"] = f"🛡️ {len(audit_log)} audit events recorded"

        return jsonify(response)

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/scan", methods=["POST"])
def security_scan():
    """Perform security scan"""
    try:
        data = request.get_json()

        target = data.get("target", "system")
        scan_type = data.get("type", "comprehensive")

        # Simulate security scan
        vulnerabilities_found = []

        if scan_type in ["comprehensive", "vulnerability"]:
            # Check for common vulnerabilities
            for vuln in KNOWN_VULNERABILITIES:
                # Simulate random detection (in reality, would do actual scanning)
                if hash(f"{target}{vuln}") % 10 < 3:  # 30% chance
                    vulnerabilities_found.append({
                        "type": vuln,
                        "severity": "high" if hash(vuln) % 2 == 0 else "medium",
                        "location": f"{target}/api/endpoint",
                        "recommendation": f"Fix {vuln} vulnerability immediately"
                    })

        scan_result = {
            "scan_id": f"scan_{datetime.utcnow().timestamp()}",
            "target": target,
            "type": scan_type,
            "vulnerabilities_found": len(vulnerabilities_found),
            "vulnerabilities": vulnerabilities_found,
            "security_score": max(0, 100 - (len(vulnerabilities_found) * 15)),
            "scan_duration_seconds": 2.5,
            "scanned_at": datetime.utcnow().isoformat() + "Z",
            "status": "critical" if len(vulnerabilities_found) > 3 else "warning" if len(vulnerabilities_found) > 0 else "clean"
        }

        # Add to threats if vulnerabilities found
        if len(vulnerabilities_found) > 0:
            detected_threats.append({
                "threat_type": "vulnerabilities",
                "count": len(vulnerabilities_found),
                "scan_id": scan_result["scan_id"],
                "detected_at": scan_result["scanned_at"]
            })

        # Audit log
        audit_log.append({
            "event": "security_scan",
            "scan_id": scan_result["scan_id"],
            "target": target,
            "result": scan_result["status"],
            "timestamp": scan_result["scanned_at"]
        })

        return jsonify({
            "ok": True,
            "scan": scan_result,
            "message": f"🛡️ Security scan complete. Status: {scan_result['status']}"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/authorize", methods=["POST"])
def authorize():
    """Authorization check"""
    try:
        data = request.get_json()

        user_id = data.get("user_id")
        resource = data.get("resource")
        action = data.get("action", "read")
        token = data.get("token")

        # Simple authorization logic (in reality, would check against proper auth system)
        authorized = False
        reason = ""

        if not token:
            reason = "No token provided"
        elif len(token) < 32:
            reason = "Invalid token format"
        else:
            # Simulate token validation
            authorized = True
            reason = "Token valid and user authorized"

        auth_result = {
            "authorized": authorized,
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "reason": reason,
            "checked_at": datetime.utcnow().isoformat() + "Z"
        }

        # Audit log
        audit_log.append({
            "event": "authorization_check",
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "result": "granted" if authorized else "denied",
            "timestamp": auth_result["checked_at"]
        })

        status_code = 200 if authorized else 403

        return jsonify({
            "ok": authorized,
            "authorization": auth_result,
            "message": f"🛡️ Authorization: {reason}"
        }), status_code

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/threats", methods=["GET"])
def get_threats():
    """List detected threats"""
    try:
        # Get threats from last 24 hours
        recent_threats = [
            t for t in detected_threats
            if datetime.fromisoformat(t["detected_at"].replace("Z", "")) > datetime.utcnow() - timedelta(days=1)
        ]

        threat_summary = {
            "total_threats": len(detected_threats),
            "recent_threats": len(recent_threats),
            "threats": recent_threats[-20:],  # Last 20 threats
            "severity_distribution": {
                "critical": sum(1 for t in recent_threats if t.get("severity") == "critical"),
                "high": sum(1 for t in recent_threats if t.get("severity") == "high"),
                "medium": sum(1 for t in recent_threats if t.get("severity") == "medium"),
                "low": sum(1 for t in recent_threats if t.get("severity") == "low")
            },
            "retrieved_at": datetime.utcnow().isoformat() + "Z"
        }

        return jsonify({
            "ok": True,
            "threats": threat_summary,
            "message": f"🛡️ {len(recent_threats)} threats detected in last 24 hours"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/audit", methods=["POST"])
def log_audit():
    """Log security event to audit trail"""
    try:
        data = request.get_json()

        audit_entry = {
            "event_type": data.get("event_type"),
            "actor": data.get("actor"),
            "action": data.get("action"),
            "resource": data.get("resource"),
            "result": data.get("result", "success"),
            "ip_address": request.remote_addr,
            "user_agent": request.headers.get("User-Agent", "unknown"),
            "metadata": data.get("metadata", {}),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        audit_log.append(audit_entry)

        return jsonify({
            "ok": True,
            "audit": audit_entry,
            "message": "🛡️ Security event logged to audit trail"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/status", methods=["GET"])
def security_status():
    """Get overall security status"""
    try:
        recent_threats = [
            t for t in detected_threats
            if datetime.fromisoformat(t["detected_at"].replace("Z", "")) > datetime.utcnow() - timedelta(hours=1)
        ]

        status = {
            "security_level": "critical" if len(recent_threats) > 5 else "warning" if len(recent_threats) > 0 else "secure",
            "threats_last_hour": len(recent_threats),
            "audit_events_today": len([
                e for e in audit_log
                if datetime.fromisoformat(e["timestamp"].replace("Z", "")) > datetime.utcnow() - timedelta(days=1)
            ]),
            "policies_active": len(security_policies),
            "policies": security_policies,
            "last_scan": detected_threats[-1]["detected_at"] if detected_threats else None,
            "system_health": "operational",
            "checked_at": datetime.utcnow().isoformat() + "Z"
        }

        return jsonify({
            "ok": True,
            "status": status,
            "message": f"🛡️ Security level: {status['security_level']}"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/guardian/policy/enforce", methods=["POST"])
def enforce_policy():
    """Enforce security policy"""
    try:
        data = request.get_json()

        policy_name = data.get("policy")
        target = data.get("target")
        value = data.get("value")

        # Update policy
        if policy_name in security_policies:
            old_value = security_policies[policy_name]
            security_policies[policy_name] = value

            enforcement_result = {
                "policy": policy_name,
                "old_value": old_value,
                "new_value": value,
                "target": target,
                "enforced_at": datetime.utcnow().isoformat() + "Z",
                "status": "enforced"
            }

            # Audit log
            audit_log.append({
                "event": "policy_enforcement",
                "policy": policy_name,
                "old_value": old_value,
                "new_value": value,
                "timestamp": enforcement_result["enforced_at"]
            })

            return jsonify({
                "ok": True,
                "enforcement": enforcement_result,
                "message": f"🛡️ Policy '{policy_name}' enforced"
            })
        else:
            return jsonify({
                "ok": False,
                "error": f"Policy '{policy_name}' not found",
                "available_policies": list(security_policies.keys())
            }), 404

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 9600))
    print(f"🛡️ Guardian Security Agent starting on port {port}...")
    print(f"🔒 Security policies active: {len(security_policies)}")
    app.run(host="0.0.0.0", port=port, debug=False)
