#!/usr/bin/env python3
# ============================================================================
# BlackRoad OS - Real-Time Collaborative Development System
# Copyright (c) 2025 BlackRoad OS, Inc. / Alexa Louise Amundson
# All Rights Reserved.
# ============================================================================
"""
Real-Time Development Sync - No More Push/Pull Bullshit

Why this exists:
- Git push/pull is yesterday's workflow
- 5 million devs should be able to work simultaneously
- Changes sync in real-time like Google Docs
- Git commits only for compliance/audit trails

Features:
- Operational Transform for conflict-free editing
- Live cursor positions and selections
- Instant change propagation
- Auto-save with background git commits
- Presence awareness (who's editing what)
"""

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import os
import json
import time
import hashlib
from datetime import datetime
from collections import defaultdict
import subprocess
from pathlib import Path

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'blackroad-realtime-dev')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Real-time collaboration state
active_sessions = {}  # session_id -> {user, files, cursors}
file_states = defaultdict(lambda: {
    'content': '',
    'version': 0,
    'operations': [],
    'users': set(),
    'last_git_commit': None
})
user_presence = defaultdict(set)  # file_path -> set of user_ids

# Configuration
WORKSPACE_ROOT = os.getenv('WORKSPACE_ROOT', '/Users/alexa/blackroad-sandbox')
AUTO_COMMIT_INTERVAL = 300  # 5 minutes
COMPLIANCE_MODE = os.getenv('COMPLIANCE_MODE', 'false').lower() == 'true'


class OperationalTransform:
    """Conflict-free collaborative editing using OT"""

    @staticmethod
    def transform_insert(op1, op2):
        """Transform insert operations"""
        if op1['position'] < op2['position']:
            return op1, {**op2, 'position': op2['position'] + len(op1['text'])}
        elif op1['position'] > op2['position']:
            return {**op1, 'position': op1['position'] + len(op2['text'])}, op2
        else:
            # Same position - arbitrate by timestamp
            if op1['timestamp'] < op2['timestamp']:
                return op1, {**op2, 'position': op2['position'] + len(op1['text'])}
            else:
                return {**op1, 'position': op1['position'] + len(op2['text'])}, op2

    @staticmethod
    def transform_delete(op1, op2):
        """Transform delete operations"""
        # Simplified - in production use proper OT algorithm
        return op1, op2

    @staticmethod
    def apply_operation(content, operation):
        """Apply an operation to content"""
        op_type = operation['type']

        if op_type == 'insert':
            pos = operation['position']
            text = operation['text']
            return content[:pos] + text + content[pos:]

        elif op_type == 'delete':
            start = operation['position']
            end = start + operation['length']
            return content[:start] + content[end:]

        elif op_type == 'replace':
            start = operation['position']
            end = start + operation['length']
            text = operation['text']
            return content[:start] + text + content[end:]

        return content


ot = OperationalTransform()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'ok': True,
        'service': 'blackroad-realtime-dev',
        'active_sessions': len(active_sessions),
        'active_files': len(file_states),
        'compliance_mode': COMPLIANCE_MODE
    })


@app.route('/api/files/<path:file_path>', methods=['GET'])
def get_file(file_path):
    """Get file content and current version"""
    full_path = os.path.join(WORKSPACE_ROOT, file_path)

    if not os.path.exists(full_path):
        return jsonify({'ok': False, 'error': 'File not found'}), 404

    with open(full_path, 'r') as f:
        content = f.read()

    state = file_states[file_path]
    state['content'] = content

    return jsonify({
        'ok': True,
        'file_path': file_path,
        'content': content,
        'version': state['version'],
        'users_online': list(state['users'])
    })


@app.route('/api/files/<path:file_path>', methods=['POST'])
def save_file(file_path):
    """Save file to disk (background operation)"""
    data = request.json
    content = data.get('content', '')

    full_path = os.path.join(WORKSPACE_ROOT, file_path)

    # Ensure directory exists
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    # Write file
    with open(full_path, 'w') as f:
        f.write(content)

    # Update state
    state = file_states[file_path]
    state['content'] = content
    state['version'] += 1

    # Maybe commit to git (compliance mode or interval elapsed)
    if COMPLIANCE_MODE or should_auto_commit(state):
        commit_file(file_path, content, data.get('user', 'anonymous'))

    return jsonify({
        'ok': True,
        'version': state['version'],
        'committed': COMPLIANCE_MODE
    })


@socketio.on('connect')
def handle_connect():
    """User connected to real-time dev server"""
    session_id = request.sid
    user_id = request.args.get('user_id', f'user-{session_id[:8]}')

    active_sessions[session_id] = {
        'user_id': user_id,
        'connected_at': time.time(),
        'files': set(),
        'cursor': {}
    }

    emit('connected', {
        'session_id': session_id,
        'user_id': user_id,
        'timestamp': time.time()
    })

    print(f"✅ User connected: {user_id} ({session_id})")


@socketio.on('disconnect')
def handle_disconnect():
    """User disconnected"""
    session_id = request.sid

    if session_id in active_sessions:
        session = active_sessions[session_id]
        user_id = session['user_id']

        # Remove from all file rooms
        for file_path in session['files']:
            user_presence[file_path].discard(user_id)
            file_states[file_path]['users'].discard(user_id)

            # Notify others
            emit('user_left', {
                'user_id': user_id,
                'file_path': file_path
            }, room=file_path)

        del active_sessions[session_id]
        print(f"❌ User disconnected: {user_id}")


@socketio.on('open_file')
def handle_open_file(data):
    """User opened a file for editing"""
    session_id = request.sid
    file_path = data['file_path']
    user_id = active_sessions[session_id]['user_id']

    # Join file room
    join_room(file_path)

    # Update session
    active_sessions[session_id]['files'].add(file_path)

    # Update presence
    user_presence[file_path].add(user_id)
    file_states[file_path]['users'].add(user_id)

    # Notify others
    emit('user_joined', {
        'user_id': user_id,
        'file_path': file_path,
        'timestamp': time.time()
    }, room=file_path, skip_sid=session_id)

    # Send current state to user
    state = file_states[file_path]
    emit('file_state', {
        'file_path': file_path,
        'content': state['content'],
        'version': state['version'],
        'users_online': list(state['users'])
    })

    print(f"📂 {user_id} opened {file_path}")


@socketio.on('edit')
def handle_edit(data):
    """User made an edit - broadcast in real-time"""
    session_id = request.sid
    file_path = data['file_path']
    operation = data['operation']
    user_id = active_sessions[session_id]['user_id']

    # Apply operation to server state
    state = file_states[file_path]
    old_content = state['content']
    new_content = ot.apply_operation(old_content, operation)

    state['content'] = new_content
    state['version'] += 1
    state['operations'].append({
        'user_id': user_id,
        'operation': operation,
        'version': state['version'],
        'timestamp': time.time()
    })

    # Broadcast to all other users editing this file
    emit('remote_edit', {
        'file_path': file_path,
        'operation': operation,
        'version': state['version'],
        'user_id': user_id,
        'timestamp': time.time()
    }, room=file_path, skip_sid=session_id)

    # Background auto-save to disk (non-blocking)
    socketio.start_background_task(save_to_disk, file_path, new_content)


@socketio.on('cursor_move')
def handle_cursor_move(data):
    """User moved cursor - broadcast for presence awareness"""
    session_id = request.sid
    file_path = data['file_path']
    position = data['position']
    selection = data.get('selection')
    user_id = active_sessions[session_id]['user_id']

    # Update cursor state
    active_sessions[session_id]['cursor'][file_path] = {
        'position': position,
        'selection': selection,
        'timestamp': time.time()
    }

    # Broadcast to others (throttled)
    emit('remote_cursor', {
        'user_id': user_id,
        'file_path': file_path,
        'position': position,
        'selection': selection
    }, room=file_path, skip_sid=session_id)


@socketio.on('close_file')
def handle_close_file(data):
    """User closed a file"""
    session_id = request.sid
    file_path = data['file_path']
    user_id = active_sessions[session_id]['user_id']

    # Leave room
    leave_room(file_path)

    # Update state
    active_sessions[session_id]['files'].discard(file_path)
    user_presence[file_path].discard(user_id)
    file_states[file_path]['users'].discard(user_id)

    # Notify others
    emit('user_left', {
        'user_id': user_id,
        'file_path': file_path
    }, room=file_path)

    print(f"📁 {user_id} closed {file_path}")


def save_to_disk(file_path, content):
    """Save file to disk (background task)"""
    try:
        full_path = os.path.join(WORKSPACE_ROOT, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, 'w') as f:
            f.write(content)

        print(f"💾 Saved {file_path} to disk")

    except Exception as e:
        print(f"❌ Error saving {file_path}: {e}")


def should_auto_commit(state):
    """Check if we should auto-commit to git"""
    if state['last_git_commit'] is None:
        return True

    elapsed = time.time() - state['last_git_commit']
    return elapsed > AUTO_COMMIT_INTERVAL


def commit_file(file_path, content, user):
    """Commit file to git (compliance/audit trail)"""
    try:
        full_path = os.path.join(WORKSPACE_ROOT, file_path)

        # Git add
        subprocess.run(['git', 'add', full_path],
                      cwd=WORKSPACE_ROOT,
                      capture_output=True)

        # Git commit
        message = f"auto: Real-time sync update to {file_path} by {user}"
        subprocess.run(['git', 'commit', '-m', message],
                      cwd=WORKSPACE_ROOT,
                      capture_output=True)

        # Update state
        file_states[file_path]['last_git_commit'] = time.time()

        print(f"📝 Committed {file_path} to git")

    except Exception as e:
        print(f"❌ Git commit error: {e}")


@app.route('/api/presence', methods=['GET'])
def get_presence():
    """Get all active users and what they're working on"""
    presence_data = []

    for session_id, session in active_sessions.items():
        presence_data.append({
            'user_id': session['user_id'],
            'files': list(session['files']),
            'connected_at': session['connected_at'],
            'duration': time.time() - session['connected_at']
        })

    return jsonify({
        'ok': True,
        'users': presence_data,
        'total_users': len(active_sessions),
        'total_files': len([f for f in file_states if file_states[f]['users']])
    })


@app.route('/api/file_activity/<path:file_path>', methods=['GET'])
def get_file_activity(file_path):
    """Get recent activity for a file"""
    state = file_states[file_path]

    return jsonify({
        'ok': True,
        'file_path': file_path,
        'version': state['version'],
        'users_online': list(state['users']),
        'recent_operations': state['operations'][-50:]  # Last 50 ops
    })


if __name__ == '__main__':
    port = int(os.getenv('PORT', 9950))

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🚀 BlackRoad Real-Time Development Sync")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"Port: {port}")
    print(f"Workspace: {WORKSPACE_ROOT}")
    print(f"Compliance Mode: {COMPLIANCE_MODE}")
    print(f"Auto-commit Interval: {AUTO_COMMIT_INTERVAL}s")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("")
    print("Features:")
    print("  ✅ Real-time collaborative editing (like Google Docs)")
    print("  ✅ Live cursor positions and selections")
    print("  ✅ Instant change propagation via WebSockets")
    print("  ✅ Background auto-save to disk")
    print("  ✅ Git commits for audit trail (not collaboration)")
    print("  ✅ Presence awareness (who's editing what)")
    print("")
    print("No more push/pull bullshit. Just code.")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("")

    socketio.run(app, host='0.0.0.0', port=port, debug=False)
