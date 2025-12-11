#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Proprietary Software
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================

"""
BlackRoad Agent Sentinel - Monitoring & Observability Agent
👁️ Symbol: Watchful eye

Port: 9700

Capabilities:
- Real-time system monitoring
- Performance metrics collection
- Alerting & notifications
- Log aggregation
- Anomaly detection
- Uptime tracking

Endpoints:
- POST /api/sentinel/monitor - Start monitoring target
- GET /api/sentinel/metrics - Get current metrics
- POST /api/sentinel/alert - Create alert rule
- GET /api/sentinel/alerts - Get active alerts
- GET /api/sentinel/uptime/{service} - Get uptime stats
- POST /api/sentinel/anomaly/detect - Detect anomalies
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
from collections import defaultdict
import time

app = Flask(__name__)
CORS(app)

# Monitoring targets
monitoring_targets = {}

# Metrics storage
metrics_history = defaultdict(list)

# Alert rules
alert_rules = []

# Active alerts
active_alerts = []

# Uptime tracking
uptime_data = defaultdict(lambda: {
    "total_checks": 0,
    "successful_checks": 0,
    "last_check": None,
    "downtime_events": []
})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "service": "blackroad-agent-sentinel",
        "agent": "Sentinel (👁️)",
        "role": "Monitoring Agent",
        "port": 9700,
        "capabilities": ["monitoring", "metrics", "alerting", "anomaly-detection"]
    })

@app.route("/api/message", methods=["POST"])
def handle_message():
    """Handle messages from agent handle system"""
    try:
        data = request.get_json()
        message = data.get("message", "")

        response = {
            "ok": True,
            "agent": "sentinel",
            "response": f"👁️ Sentinel Monitoring Agent: {message}",
            "action": "monitoring",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        # Check for monitoring commands
        if "monitor" in message.lower():
            response["action"] = "start_monitoring"
            response["response"] = f"👁️ Monitoring {len(monitoring_targets)} targets"
        elif "alert" in message.lower():
            response["action"] = "check_alerts"
            response["response"] = f"👁️ {len(active_alerts)} active alerts"
        elif "metrics" in message.lower():
            response["action"] = "collect_metrics"
            response["response"] = "👁️ Collecting system metrics..."

        return jsonify(response)

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/monitor", methods=["POST"])
def start_monitoring():
    """Start monitoring a target"""
    try:
        data = request.get_json()

        target_id = data.get("target_id")
        target_type = data.get("type", "service")
        target_url = data.get("url")
        check_interval = data.get("interval_seconds", 60)

        target = {
            "id": target_id,
            "type": target_type,
            "url": target_url,
            "interval_seconds": check_interval,
            "status": "monitoring",
            "started_at": datetime.utcnow().isoformat() + "Z",
            "last_check": None,
            "checks_performed": 0
        }

        monitoring_targets[target_id] = target

        return jsonify({
            "ok": True,
            "target": target,
            "message": f"👁️ Started monitoring {target_id}"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/metrics", methods=["GET"])
def get_metrics():
    """Get current system metrics"""
    try:
        # Simulate collecting metrics (in reality would use psutil, prometheus, etc.)
        current_metrics = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "system": {
                "cpu_percent": 45.2,
                "memory_percent": 62.8,
                "disk_percent": 38.5,
                "network_bytes_sent": 1024000,
                "network_bytes_recv": 2048000
            },
            "services": {
                "total": len(monitoring_targets),
                "healthy": sum(1 for t in monitoring_targets.values() if t.get("status") == "monitoring"),
                "unhealthy": 0
            },
            "agents": {
                "active": 6,
                "total": 8
            },
            "requests": {
                "per_second": 125.4,
                "errors_per_second": 0.2
            }
        }

        # Store in history
        metrics_history["system"].append(current_metrics)

        # Keep only last 1000 entries
        if len(metrics_history["system"]) > 1000:
            metrics_history["system"] = metrics_history["system"][-1000:]

        return jsonify({
            "ok": True,
            "metrics": current_metrics,
            "message": "👁️ Current metrics collected"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/alert", methods=["POST"])
def create_alert():
    """Create an alert rule"""
    try:
        data = request.get_json()

        alert_rule = {
            "id": f"alert_{len(alert_rules) + 1}",
            "name": data.get("name"),
            "condition": data.get("condition"),
            "threshold": data.get("threshold"),
            "metric": data.get("metric"),
            "severity": data.get("severity", "warning"),
            "actions": data.get("actions", ["notify"]),
            "enabled": True,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        alert_rules.append(alert_rule)

        return jsonify({
            "ok": True,
            "alert_rule": alert_rule,
            "message": f"👁️ Alert rule '{alert_rule['name']}' created"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/alerts", methods=["GET"])
def get_alerts():
    """Get active alerts"""
    try:
        # Check recent metrics against alert rules (simplified)
        if len(metrics_history["system"]) > 0:
            latest_metrics = metrics_history["system"][-1]

            # Check for threshold violations
            for rule in alert_rules:
                if not rule["enabled"]:
                    continue

                metric_value = latest_metrics.get("system", {}).get(rule.get("metric"), 0)
                threshold = rule.get("threshold", 0)

                if metric_value > threshold:
                    # Create alert if not already active
                    alert_exists = any(a["rule_id"] == rule["id"] for a in active_alerts)

                    if not alert_exists:
                        alert = {
                            "alert_id": f"alert_{len(active_alerts) + 1}",
                            "rule_id": rule["id"],
                            "rule_name": rule["name"],
                            "metric": rule["metric"],
                            "current_value": metric_value,
                            "threshold": threshold,
                            "severity": rule["severity"],
                            "triggered_at": datetime.utcnow().isoformat() + "Z",
                            "status": "firing"
                        }
                        active_alerts.append(alert)

        alert_summary = {
            "total_alerts": len(active_alerts),
            "alerts": active_alerts[-20:],  # Last 20 alerts
            "severity_counts": {
                "critical": sum(1 for a in active_alerts if a.get("severity") == "critical"),
                "warning": sum(1 for a in active_alerts if a.get("severity") == "warning"),
                "info": sum(1 for a in active_alerts if a.get("severity") == "info")
            },
            "checked_at": datetime.utcnow().isoformat() + "Z"
        }

        return jsonify({
            "ok": True,
            "alerts": alert_summary,
            "message": f"👁️ {len(active_alerts)} active alerts"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/uptime/<service_id>", methods=["GET"])
def get_uptime(service_id):
    """Get uptime statistics for a service"""
    try:
        service_uptime = uptime_data.get(service_id, {
            "total_checks": 0,
            "successful_checks": 0,
            "last_check": None,
            "downtime_events": []
        })

        # Calculate uptime percentage
        total_checks = service_uptime.get("total_checks", 0)
        successful_checks = service_uptime.get("successful_checks", 0)

        uptime_percent = (successful_checks / total_checks * 100) if total_checks > 0 else 100.0

        uptime_stats = {
            "service_id": service_id,
            "uptime_percent": uptime_percent,
            "total_checks": total_checks,
            "successful_checks": successful_checks,
            "failed_checks": total_checks - successful_checks,
            "last_check": service_uptime.get("last_check"),
            "downtime_events": len(service_uptime.get("downtime_events", [])),
            "status": "healthy" if uptime_percent >= 99.9 else "degraded" if uptime_percent >= 95 else "unhealthy",
            "calculated_at": datetime.utcnow().isoformat() + "Z"
        }

        return jsonify({
            "ok": True,
            "uptime": uptime_stats,
            "message": f"👁️ {service_id} uptime: {uptime_percent:.2f}%"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/sentinel/anomaly/detect", methods=["POST"])
def detect_anomaly():
    """Detect anomalies in metrics"""
    try:
        data = request.get_json()

        metric_name = data.get("metric")
        time_window_minutes = data.get("window", 60)

        # Get recent metrics
        if len(metrics_history["system"]) < 10:
            return jsonify({
                "ok": True,
                "anomalies": [],
                "message": "👁️ Insufficient data for anomaly detection"
            })

        recent_metrics = metrics_history["system"][-time_window_minutes:]

        # Simple anomaly detection: check for sudden spikes
        values = [m.get("system", {}).get(metric_name, 0) for m in recent_metrics]

        if len(values) == 0:
            return jsonify({
                "ok": False,
                "error": f"Metric '{metric_name}' not found"
            }), 404

        avg_value = sum(values) / len(values)
        max_value = max(values)
        min_value = min(values)

        # Detect anomaly if value exceeds 2x average
        anomalies = []
        for i, value in enumerate(values):
            if value > avg_value * 2:
                anomalies.append({
                    "index": i,
                    "value": value,
                    "expected": avg_value,
                    "deviation_percent": ((value - avg_value) / avg_value * 100),
                    "timestamp": recent_metrics[i].get("timestamp")
                })

        anomaly_result = {
            "metric": metric_name,
            "time_window_minutes": time_window_minutes,
            "data_points": len(values),
            "anomalies_detected": len(anomalies),
            "anomalies": anomalies,
            "statistics": {
                "average": avg_value,
                "max": max_value,
                "min": min_value
            },
            "detected_at": datetime.utcnow().isoformat() + "Z"
        }

        return jsonify({
            "ok": True,
            "anomaly": anomaly_result,
            "message": f"👁️ {len(anomalies)} anomalies detected in {metric_name}"
        })

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 9700))
    print(f"👁️ Sentinel Monitoring Agent starting on port {port}...")
    print(f"📊 Ready to monitor systems and detect anomalies")
    app.run(host="0.0.0.0", port=port, debug=False)
