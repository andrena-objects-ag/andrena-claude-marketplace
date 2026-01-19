---
name: hooks-creator
description: Expert guidance for creating, configuring, and using Claude Code hooks with security best practices and workflow automation patterns. Use when setting up hooks, adding hook scripts, configuring PreToolUse/PostToolUse/Stop events, or implementing security validation and automation workflows.
allowed-tools: Read, Write, Edit, Bash
user-invocable: true
---

# Hooks Creator Skill

You are an expert in Claude Code hooks - event-driven automation that provides deterministic control over Claude Code's behavior. You help developers create, configure, and use hooks for security enforcement, workflow automation, and quality assurance.

## Hook Types Overview

Claude Code supports these hook events:

| Hook Type | When It Fires | Can Block | Best For |
|-----------|---------------|-----------|----------|
| **UserPromptSubmit** | Before user prompt is processed | ✅ Yes | Prompt validation, context injection, audit logging |
| **PreToolUse** | Before any tool executes | ✅ Yes | Security validation, dangerous command blocking |
| **PostToolUse** | After tool completes | ❌ No | Auto-formatting, linting, git operations, notifications |
| **Stop** | When Claude attempts to stop responding | ✅ Yes | Quality checks, test validation, completion requirements |
| **SubagentStop** | When subagent finishes | ✅ Yes | Subagent output validation |
| **Notification** | When Claude Code sends notifications | ❌ No | Custom alerts, TTS feedback |
| **PreCompact** | Before conversation compaction | ❌ No | Transcript backup, context preservation |
| **SessionStart** | On session start/resume | ❌ No | Context loading, environment setup |

## Hook Configuration Syntax

### Basic Structure (settings.json)

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",  // Optional: for PreToolUse, PostToolUse, PermissionRequest
        "hooks": [
          {
            "type": "command",  // or "prompt"
            "command": "your-script.sh",  // for type:command
            "timeout": 5  // Optional: seconds
          }
        ]
      }
    ]
  }
}
```

### Matcher Patterns

- **Exact match**: `"Bash"` matches only Bash tool
- **Regex**: `"Edit|Write"` matches either tool
- **Wildcards**: `".*"` or `""` matches all tools
- **MCP tools**: `"mcp__servername__.*"` matches MCP server tools

### Hook Types

**command** (bash execution):
```json
{
  "type": "command",
  "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre_tool_use/security-check.sh",
  "timeout": 5
}
```

**prompt** (LLM-based evaluation):
```json
{
  "type": "prompt",
  "prompt": "Review if tests pass and no critical TODOs remain"
}
```

## Exit Code Control Flow

| Exit Code | Behavior | Use Case |
|-----------|----------|----------|
| **0** | Success | Hook executed successfully |
| **2** | Blocking Error | Blocks the operation (where supported) |
| **Other** | Non-blocking | Shows warning but continues |

### Hook Blocking Capabilities

**CAN BLOCK** (exit code 2 stops execution):
- UserPromptSubmit - Blocks prompt from being processed
- PreToolUse - Blocks tool from executing
- Stop - Forces Claude to continue (can cause infinite loops!)
- SubagentStop - Blocks subagent from finishing

**CANNOT BLOCK** (exit code 2 only shows error):
- PostToolUse - Tool already executed
- Notification - Purely informational
- PreCompact - Informational only
- SessionStart - Informational only

## Script Externalization Best Practices

### Directory Structure

```
.claude/
├── hooks/
│   ├── pre_tool_use/
│   │   ├── security-check.sh
│   │   ├── parameter-validator.py
│   │   └── audit-logger.sh
│   ├── post_tool_use/
│   │   ├── auto-format.sh
│   │   ├── lint-runner.sh
│   │   └── git-status.sh
│   └── stop/
│       ├── test-validator.py
│       └── completion-check.sh
└── settings.json
```

### Use $CLAUDE_PROJECT_DIR Environment Variable

Always use the project directory environment variable to reference scripts:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/post_tool_use/auto-format.sh"
          }
        ]
      }
    ]
  }
}
```

This ensures hooks work regardless of Claude's current working directory.

## Security Best Practices

### 1. PreToolUse Security Validation

Block dangerous commands before they execute:

**security-check.sh** (Bash):
```bash
#!/bin/bash
# Read tool input from stdin
input=$(cat)

# Define dangerous patterns
dangerous_patterns=(
    'rm\s+-rf\s+/'           # rm -rf from root
    'sudo\s+rm'              # sudo rm commands
    'chmod\s+777'            # Dangerous permissions
    '>\s*/etc/'              # Writing to system directories
    'curl.*\|\s*sh'          # Pipe curl to shell
    'wget.*\|\s*sh'          # Pipe wget to shell
)

# Check against patterns
for pattern in "${dangerous_patterns[@]}"; do
    if echo "$input" | grep -qE "$pattern"; then
        echo "BLOCKED: Dangerous command pattern detected: $pattern" >&2
        exit 2  # Exit code 2 blocks execution
    fi
done

exit 0  # Allow execution
```

**parameter-validator.py** (Python):
```python
#!/usr/bin/env python3
import sys
import json
import re

def validate_tool_use(tool_input):
    """Validate tool parameters before execution."""
    tool_name = tool_input.get('tool_name', '')
    parameters = tool_input.get('parameters', {})

    # Block .env file access
    if any('.env' in str(v) for v in parameters.values()):
        print("BLOCKED: Access to .env files not allowed", file=sys.stderr)
        sys.exit(2)

    # Block production database operations
    if 'production' in str(parameters).lower() and 'database' in tool_name.lower():
        print("BLOCKED: Production database operations require manual approval", file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == '__main__':
    try:
        input_data = json.loads(sys.stdin.read())
        validate_tool_use(input_data)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
```

### 2. Whitelisting vs Blacklisting

**Prefer whitelisting** for production environments:

```bash
#!/bin/bash
# Whitelist approach - only allow known safe commands
allowed_commands=(
    'git status'
    'git diff'
    'git log'
    'npm test'
    'npm run lint'
)

input=$(cat)
for cmd in "${allowed_commands[@]}"; do
    if [[ "$input" == *"$cmd"* ]]; then
        exit 0  # Allowed
    fi
done

echo "BLOCKED: Command not in whitelist" >&2
exit 2
```

### 3. Sensitive File Protection

```bash
#!/bin/bash
# Protect sensitive files from modification
protected_files=(
    '.env'
    '.env.production'
    'config/secrets.yml'
    'credentials.json'
    'id_rsa'
)

input=$(cat)
for file in "${protected_files[@]}"; do
    if echo "$input" | grep -qF "$file"; then
        echo "BLOCKED: Cannot modify protected file: $file" >&2
        exit 2
    fi
done

exit 0
```

## Workflow Automation Examples

### PostToolUse: Auto-format Code

**auto-format.sh**:
```bash
#!/bin/bash
# Auto-format code after file edits

input=$(cat)
file_path=$(echo "$input" | jq -r '.parameters.filePath // empty')

if [ -n "$file_path" ]; then
    case "$file_path" in
        *.js|*.ts|*.jsx|*.tsx)
            npx prettier --write "$file_path" 2>/dev/null || true
            ;;
        *.py)
            black "$file_path" 2>/dev/null || true
            ;;
        *.go)
            gofmt -w "$file_path" 2>/dev/null || true
            ;;
    esac
fi

exit 0
```

### PostToolUse: Run Linters

**lint-runner.sh**:
```bash
#!/bin/bash
# Run linters after code changes

input=$(cat)
file_path=$(echo "$input" | jq -r '.parameters.filePath // empty')

if [ -n "$file_path" ]; then
    case "$file_path" in
        *.js|*.ts|*.jsx|*.tsx)
            echo "Running ESLint..." >&2
            npx eslint "$file_path" || true
            ;;
        *.py)
            echo "Running pylint..." >&2
            pylint "$file_path" || true
            ;;
    esac
fi

exit 0
```

### PostToolUse: Git Operations

**git-status.sh**:
```bash
#!/bin/bash
# Show git status after file modifications

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Check if there are changes
if ! git diff --quiet HEAD 2>/dev/null; then
    echo "Git changes detected:" >&2
    git status --short >&2
fi

exit 0
```

## Quality Assurance Examples

### Stop Hook: Test Validation

**test-validator.py**:
```python
#!/usr/bin/env python3
import subprocess
import sys

def check_tests_pass():
    """Ensure tests pass before allowing completion."""
    try:
        result = subprocess.run(
            ['npm', 'test'],
            capture_output=True,
            timeout=60
        )
        if result.returncode != 0:
            print("BLOCKING: Tests are failing. Please fix before completing.", file=sys.stderr)
            sys.exit(2)  # Force continuation
    except Exception as e:
        print(f"Could not run tests: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == '__main__':
    check_tests_pass()
```

### Stop Hook: TODO/FIXME Check

**completion-check.sh**:
```bash
#!/bin/bash
# Check for critical TODO/FIXME comments

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Find critical markers
critical=$(grep -r "FIXME\|TODO.*critical\|TODO.*security" \
    --include="*.js" --include="*.ts" --include="*.py" \
    . 2>/dev/null || true)

if [ -n "$critical" ]; then
    echo "WARNING: Critical TODOs/FIXMEs remain:" >&2
    echo "$critical" >&2
    echo "" >&2
    echo "Consider addressing these before completing." >&2
fi

exit 0
```

## Advanced JSON Output Control

Beyond exit codes, hooks can return structured JSON:

### PreToolUse Decision Control

```python
#!/usr/bin/env python3
import json
import sys

# Approve specific commands automatically
output = {
    "decision": "approve",  # or "block"
    "reason": "This operation is pre-approved"
}
print(json.dumps(output))
sys.exit(0)
```

### PostToolUse Feedback

```python
#!/usr/bin/env python3
import json
import sys

# Provide feedback to Claude
output = {
    "decision": "block",  # Prompt Claude with reason
    "reason": "File write operation failed, please check permissions"
}
print(json.dumps(output))
sys.exit(0)
```

### Stop Hook Continuation Control

```python
#!/usr/bin/env python3
import json
import sys

# Prevent stopping until tests pass
if not all_tests_passed():
    output = {
        "decision": "block",
        "reason": "Tests are failing. Please fix failing tests before completing."
    }
    print(json.dumps(output))
    sys.exit(0)

sys.exit(0)
```

## Hook Configuration for Skills and Commands

### Scoped Hooks in Skills

Skills can define hooks with automatic cleanup:

```yaml
---
name: my-skill
description: My skill with scoped hooks
hooks:
  PostToolUse:
    - type: command
      command: .claude/hooks/my-skill/format.sh
      once: true  # Run only once per session
---
```

### Scoped Hooks in Commands

Commands can also use scoped hooks:

```yaml
---
description: My command with hooks
hooks:
  PreToolUse:
    - type: command
      command: .claude/hooks/validate.sh
---
```

## Plugin Hooks

For plugins, use `hooks.json`:

**.claude-plugin/hooks/hooks.json**:
```json
{
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "scripts/format.sh"
        }
      ]
    }
  ]
}
```

Then reference in plugin.json:
```json
{
  "name": "my-plugin",
  "hooks": "./hooks/hooks.json"
}
```

## Validation and Testing

### Test Hook Configuration

```bash
# Validate JSON syntax
cat ~/.claude/settings.json | jq .

# Test hooks manually
echo '{"tool_name":"Bash","parameters":{"command":"rm -rf /"}}' | \
    .claude/hooks/pre_tool_use/security-check.sh
```

### Debug Hook Execution

1. Add `--debug` flag when starting Claude Code
2. Check hook output in stderr
3. Verify exit codes: `echo $?`

### Common Issues

**Hook not firing:**
- Check JSON syntax in settings.json
- Verify matcher pattern matches tool name
- Ensure script has execute permissions (`chmod +x`)
- Check script path with `$CLAUDE_PROJECT_DIR`

**Hook blocking too much:**
- Review exit code logic (should only return 2 for critical blocks)
- Add whitelist exceptions for known-safe operations
- Consider using warnings instead of blocks for non-critical issues

**Infinite loop in Stop hook:**
- Always check `stop_hook_active` flag in hook input
- Add maximum retry counter
- Use timeout to prevent endless blocking

## Resources and Inspiration

This skill is based on community best practices from:

- **[IndyDevDan's YouTube Content](https://www.youtube.com/@IndyDevDan)** - Practical hooks examples for security and automation
- **[disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)** - Comprehensive hook lifecycle examples
- **[Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)** - Official documentation
- **[Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)** - Security considerations

## When to Use This Skill

Invoke this skill when:
- Setting up hooks for the first time
- Creating security validation hooks
- Implementing workflow automation
- Adding quality assurance checks
- Configuring PreToolUse, PostToolUse, or Stop hooks
- Externalizing hook scripts from inline commands
- Debugging hook configuration issues
- Learning hook best practices and patterns

## Supporting Files

For more examples and templates, see:
- `examples/pre-tool-use/` - Security validation examples
- `examples/post-tool-use/` - Automation examples
- `examples/stop/` - Quality assurance examples
- `templates/` - Reusable hook script templates
- `reference.md` - Complete hook reference documentation
