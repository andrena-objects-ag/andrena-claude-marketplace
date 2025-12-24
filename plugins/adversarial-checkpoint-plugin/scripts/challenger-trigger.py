#!/usr/bin/env python3
"""
Challenger Trigger Script

This script is invoked by hooks to determine when to trigger the adversarial
challenger agent. It maintains state for resumable challenger sessions.
"""

import json
import os
import sys
import re
from pathlib import Path
from datetime import datetime

# State file for tracking challenger session
CHALLENGER_STATE_FILE = Path.home() / ".claude" / "adversarial-challenger-state.json"
# Store for active agent IDs
CHALLENGER_AGENT_STORE = Path.home() / ".claude" / "adversarial-challenger-agents.json"

def load_state():
    """Load challenger state from disk."""
    if CHALLENGER_STATE_FILE.exists():
        try:
            with open(CHALLENGER_STATE_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {
        "active": False,
        "plan_file": None,
        "agent_id": None,
        "challenge_count": 0,
        "challenges_history": [],
        "last_challenge_time": None,
        "session_start": None
    }

def save_state(state):
    """Save challenger state to disk."""
    CHALLENGER_STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CHALLENGER_STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def load_agent_store():
    """Load the agent ID store."""
    if CHALLENGER_AGENT_STORE.exists():
        try:
            with open(CHALLENGER_AGENT_STORE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {"current_agent_id": None, "previous_agent_ids": []}

def save_agent_store(store):
    """Save the agent ID store."""
    CHALLENGER_AGENT_STORE.parent.mkdir(parents=True, exist_ok=True)
    with open(CHALLENGER_AGENT_STORE, 'w') as f:
        json.dump(store, f, indent=2)

def find_plan_file():
    """Find the plan file in current directory or parent directories."""
    cwd = Path.cwd()

    # Check current directory and up to 5 levels up
    for level in range(6):
        check_dir = cwd.parents[level] if level > 0 else cwd
        for plan_name in ["PLAN.md", "IMPLEMENTATION.md", "plan.md", "implementation.md"]:
            plan_file = check_dir / plan_name
            if plan_file.exists():
                return plan_file
    return None

def parse_plan_checklists(plan_content):
    """Parse a plan file to extract checklist items."""
    # Pattern to match markdown checkboxes: - [ ] or - [x]
    checkbox_pattern = re.compile(r'^[\s]*-\s*\[([ x])\]\s*(.*?)(?:\s*\|\s*(.*))?$', re.MULTILINE)

    items = []
    for match in checkbox_pattern.finditer(plan_content):
        checked = match.group(1).lower() == 'x'
        text = match.group(2).strip()
        metadata = match.group(3).strip() if match.group(3) else ""

        items.append({
            "checked": checked,
            "text": text,
            "metadata": metadata
        })

    return items

def extract_task_id(text):
    """Extract task ID from checkbox text (e.g., [T-1.2], [G-1])."""
    match = re.search(r'\[([A-Z]-?\d*\.?\d*)\]', text)
    return match.group(1) if match else None

def should_trigger_challenger(input_data, mode):
    """
    Determine if challenger should be triggered based on hook input.

    Returns: (should_trigger, reason, context)
    """
    state = load_state()

    if mode == "init-challenger":
        # Initialize challenger session
        plan_file = find_plan_file()
        if plan_file:
            state["active"] = True
            state["plan_file"] = str(plan_file)
            state["session_start"] = datetime.now().isoformat()
            save_state(state)
            # Don't trigger on init, just set up
            return False, "Initialized challenger session", {"plan_file": str(plan_file)}
        return False, "No plan file found", {}

    if mode == "check-plan-exists":
        # Check if plan exists and activate if needed
        plan_file = find_plan_file()
        if plan_file and not state["active"]:
            state["active"] = True
            state["plan_file"] = str(plan_file)
            state["session_start"] = datetime.now().isoformat()
            save_state(state)
        # Never block on this check
        return False, "Plan check complete", {}

    if not state.get("active"):
        return False, "Challenger not active (no plan)", {}

    plan_file = Path(state.get("plan_file", ""))
    if not plan_file.exists():
        # Plan file disappeared
        state["active"] = False
        save_state(state)
        return False, "Plan file no longer exists, deactivating", {}

    if mode == "post-tool":
        # Check if the tool operation affected the plan file
        tool_name = input_data.get("tool_name", "")
        tool_input = input_data.get("tool_input", {})

        if tool_name in ["Write", "Edit", "NotebookEdit"]:
            file_path = tool_input.get("file_path") or tool_input.get("notebookPath", "")

            # If plan file was modified, analyze changes
            if str(plan_file) in file_path or file_path in str(plan_file):
                plan_content = plan_file.read_text()
                items = parse_plan_checklists(plan_content)

                # Count checked items
                checked_count = sum(1 for i in items if i["checked"])
                total_count = len(items)

                # Check if any new items were checked (simple heuristic: if we have more checked now)
                # In a real implementation, we'd track previous state

                if checked_count > 0:
                    return True, f"Plan file modified: {checked_count}/{total_count} items checked", {
                        "plan_file": str(plan_file),
                        "checked_count": checked_count,
                        "total_count": total_count,
                        "recently_checked": [i for i in items if i["checked"]][:5]  # Last 5 checked
                    }

        # Check if any code files were written that might complete plan items
        if tool_name in ["Write", "Edit"]:
            file_path = tool_input.get("file_path", "")
            # If code file was modified, might affect plan items
            if any(file_path.endswith(ext) for ext in ['.py', '.js', '.ts', '.jsx', '.tsx', '.go', '.rs', '.java', '.cpp', '.c']):
                return True, "Code file modified - possible plan item completion", {
                    "file_path": file_path
                }

    return False, "No trigger condition met", {}

def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: challenger-trigger.py <mode>", file=sys.stderr)
        sys.exit(1)

    mode = sys.argv[1]

    # Read hook input from stdin
    try:
        input_data = json.load(sys.stdin)
    except:
        input_data = {}

    should_trigger, reason, context = should_trigger_challenger(input_data, mode)

    if should_trigger:
        # Output JSON with instruction to trigger challenger
        # This will be processed by Claude to invoke the agent
        state = load_state()
        agent_store = load_agent_store()

        output = {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse" if mode == "post-tool" else "Other",
                "additionalContext": f"""
**ADVERSARIAL CHALLENGE TRIGGERED**

Reason: {reason}

Context: {json.dumps(context, indent=2)}

Challenge History: {state.get('challenge_count', 0)} previous challenges in this session.

Resume the adversarial-challenger agent to challenge this work.
Agent ID (if exists): {agent_store.get('current_agent_id', 'None - start new challenge')}

Invoke with: Use the adversarial-challenger agent to review the checkpoint at {context.get('plan_file', state.get('plan_file', 'unknown'))}
"""
            }
        }

        # Update state
        state["challenge_count"] = state.get("challenge_count", 0) + 1
        state["last_challenge_time"] = datetime.now().isoformat()
        state["challenges_history"].append({
            "time": state["last_challenge_time"],
            "mode": mode,
            "reason": reason,
            "context": context
        })
        save_state(state)

        print(json.dumps(output))
        sys.exit(0)
    else:
        # No trigger needed
        sys.exit(0)

if __name__ == "__main__":
    main()
