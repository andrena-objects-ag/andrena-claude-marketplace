# Claude Code Hooks Automation Patterns

**Documented:** January 20, 2026
**Researched from:** Community blogs, GitHub repositories, official documentation, and developer experiences

This document captures smart patterns for using Claude Code hooks to improve developer experience and output quality, based on real-world implementations.

---

## Table of Contents

1. [Stop Hook Quality Gates Pattern](#stop-hook-quality-gates-pattern)
2. [PostToolUse Auto-Format Pipeline](#posttooluse-auto-format-pipeline)
3. [UserPromptSubmit Context Injection](#userpromptsubmit-context-injection)
4. [PreToolUse Security Validation](#pretooluse-security-validation)
5. [SessionStart Environment Bootstrap](#sessionstart-environment-bootstrap)
6. [SubagentStop Pipeline Chaining](#subagentstop-pipeline-chaining)
7. [Infinite Loop Prevention](#infinite-loop-prevention)
8. [Prompt-Based Intelligent Decisions](#prompt-based-intelligent-decisions)
9. [MCP Tool Integration Hooks](#mcp-tool-integration-hooks)
10. [Progressive Quality Enforcement](#progressive-quality-enforcement)

---

## Stop Hook Quality Gates Pattern

### Concept

Stop hooks run when Claude finishes responding, making them ideal for "end-of-turn quality gates" - automated checks that must pass before Claude can stop working.

### Real-World Implementations

**From [Koder.ai - Claude Code git hooks](https://koder.ai/blog/claude-code-git-hooks-automation):**

Stop hooks that enforce:
- Secret detection (block commits with exposed credentials)
- Code formatting (must match project style)
- Test execution (all tests must pass)
- Commit summary generation

**From [Medium - Smarter Web-Search](https://medium.com/rigel-computer/building-smarter-time-based-web-search-for-claude-code-22defafa12c4):**

"Using Hooks to enforce End-of-Turn Quality Gates" - Run deterministic, automated quality checks that can block completion.

### Implementation Pattern

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/stop/quality-gate.sh"
          }
        ]
      }
    ]
  }
}
```

**Quality gate script:**

```bash
#!/bin/bash
# .claude/hooks/stop/quality-gate.sh

# Read hook input
input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

# Prevent infinite loops
if [ "$stop_hook_active" = "true" ]; then
  exit 0  # Allow stop if already in a hook-triggered continuation
fi

# Run quality checks
cd "$CLAUDE_PROJECT_DIR" || exit 1

# Check 1: No secrets
if git diff --cached | grep -iE "password|api[_-]key|secret"; then
  echo "BLOCKED: Potential secret detected in changes" >&2
  exit 2  # Block stopping
fi

# Check 2: TypeScript compilation
if ! npx tsc --noEmit; then
  echo "BLOCKED: TypeScript errors detected" >&2
  exit 2  # Block stopping
fi

# Check 3: Tests pass
if ! npm test -- --run; then
  echo "BLOCKED: Tests are failing" >&2
  exit 2  # Block stopping
fi

exit 0  # All checks passed, allow stop
```

### Smart Categorization (Speed-Based)

From [GitHub Issue - Blocking Stop Hooks](https://github.com/anthropics/claude-code/issues/3656):

Categorize checks by speed to balance quality vs. developer experience:

| Check | Time | Behavior |
|-------|------|----------|
| Compile | <5s | Always run |
| Lint | <10s | Always run |
| Unit tests | 30-60s | Always run |
| Integration tests | 2-5min | Optional flag |
| E2e tests | 5-15min | Manual only |

### Use Cases

- **Accessibility enforcement** - Check React components for a11y requirements
- **Directory-specific standards** - Enforce different rules for different directories
- **Secret detection** - Block operations that might expose credentials
- **Test coverage** - Ensure minimum test coverage before stopping

### Sources

- [GitHub Issue #3656 - Restore Blocking Stop Command Hooks](https://github.com/anthropics/claude-code/issues/3656)
- [Koder.ai - Claude Code git hooks automation](https://koder.ai/blog/claude-code-git-hooks-automation)
- [Medium - Building Smarter Time-Based Web-Search](https://medium.com/rigel-computer/building-smarter-time-based-web-search-for-claude-code-22defafa12c4)
- [Agentic Patterns - Stop Hook Auto-Continue Pattern](https://agentic-patterns.com/patterns/stop-hook-auto-continue-pattern/)

---

## PostToolUse Auto-Format Pipeline

### Concept

Automatically format, lint, and process code immediately after Claude writes or edits files - creating an invisible "cleanup pipeline" that runs after every change.

### Real-World Implementations

**From [Medium - 5 Automations That Eliminate Developer Friction](https://medium.com/coding-nexus/claude-code-hooks-5-automations-that-eliminate-developer-friction-7b6ddeff9dd2):**

> "So Claude writes a file. Prettier formats it. ESLint fixes what it can. And only then do you see the [result]"

This creates a seamless experience where code is always formatted correctly.

**From [Reddit - File-Specific Type Checks](https://www.reddit.com/r/ClaudeAI/comments/1lto1q4/using_claude_code_hooks_for_filespecific_type/):**

Python workflow showing automatic formatting (ruff), linting, and type checks (basedpyright) on file changes.

### Implementation Pattern

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/post-tool-use/format-pipeline.sh"
          }
        ]
      }
    ]
  }
}
```

**Pipeline script:**

```bash
#!/bin/bash
# .claude/hooks/post-tool-use/format-pipeline.sh

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

if [ -z "$file_path" ]; then
  exit 0  # Not a file write/edit operation
fi

# Determine file type and run appropriate formatters
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx)
    # TypeScript/JavaScript
    npx prettier --write "$file_path" 2>/dev/null || true
    npx eslint --fix "$file_path" 2>/dev/null || true
    ;;
  *.py)
    # Python
    ruff check --fix "$file_path" 2>/dev/null || true
    black "$file_path" 2>/dev/null || true
    ;;
  *.go)
    # Go
    gofmt -w "$file_path" 2>/dev/null || true
    ;;
esac

exit 0  # Success (don't block)
```

### Best Practices

**From [Eesel - Complete Guide to Hooks](https://www.eesel.ai/blog/hooks-in-claude-code):**

- **Use specific file patterns** - Don't run heavy operations on every edit
- **Avoid blocking** - PostToolUse shouldn't block (tool already ran)
- **Cache results** - Don't re-run expensive checks unnecessarily
- **Silent success** - Only show output when there's an issue

### Advanced: Conditional Formatting

```bash
# Only format if file was actually modified
if [ -f "$file_path" ]; then
  # Check if file needs formatting
  if ! npx prettier --check "$file_path" >/dev/null 2>&1; then
    npx prettier --write "$file_path"
    echo "Formatted: $file_path" >&2
  fi
fi
```

### Sources

- [Medium - 5 Automations That Eliminate Developer Friction](https://medium.com/coding-nexus/claude-code-hooks-5-automations-that-eliminate-developer-friction-7b6ddeff9dd2)
- [Eesel - Complete Guide to Hooks](https://www.eesel.ai/blog/hooks-in-claude-code)
- [Reddit - File-Specific Type Checks](https://www.reddit.com/r/ClaudeAI/comments/1lto1q4/using_claude_code_hooks_for_filespecific_type/)
- [Gend.co - Configure Claude Code Hooks](https://www.gend.co/blog/configure-claude-code-hooks-automation)
- [GitHub - johnlindquist/claude-hooks](https://github.com/johnlindquist/claude-hooks)

---

## UserPromptSubmit Context Injection

### Concept

Hook fires before user prompt is processed, allowing you to inject additional context, validate prompts, or transform the user's request before Claude sees it.

### Real-World Implementations

**From [Debugg.ai - Pre-Prompt Middleware](https://debugg.ai/resources/pre-prompt-middleware-claude-code-hooks-enforce-pm-and-coding-standards):**

Injecting PM context, acceptance criteria, and coding standards automatically based on detected patterns in the prompt.

**From [GitHub - BMAD Context Injection](https://github.com/darraghh1/bmad-context-injection):**

Skill-based context injection that maps keywords/patterns to knowledge files.

### Implementation Pattern

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/user-prompt-submit/context-injector.sh"
          }
        ]
      }
    ]
  }
}
```

**Context injector script:**

```bash
#!/bin/bash
# .claude/hooks/user-prompt-submit/context-injector.sh

input=$(cat)
prompt=$(echo "$input" | jq -r '.prompt // empty')

# Detect patterns and inject relevant context
context=""

# Detect testing-related prompts
if echo "$prompt" | grep -qiE "test|spec|mock"; then
  if [ -f ".claude/context/testing-patterns.md" ]; then
    context+="$(cat .claude/context/testing-patterns.md)"
    context+="\n\n"
  fi
fi

# Detect API-related prompts
if echo "$prompt" | grep -qiE "api|endpoint|route|controller"; then
  if [ -f ".claude/context/api-standards.md" ]; then
    context+="$(cat .claude/context/api-standards.md)"
    context+="\n\n"
  fi
fi

# Output context (exit 0 = allow prompt, stdout added to context)
echo "$context"
exit 0
```

### Advanced: Prompt Validation

**Block certain prompts:**

```bash
#!/bin/bash

input=$(cat)
prompt=$(echo "$input" | jq -r '.prompt')

# Block prompts that might expose secrets
if echo "$prompt" | grep -iE "print.*password|dump.*key|log.*token"; then
  echo "BLOCKED: This prompt may expose sensitive information" >&2
  exit 2  # Block prompt
fi

exit 0  # Allow prompt
```

### Structured Output (Advanced)

```bash
#!/bin/bash

# For more control, use JSON output
output=$(cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "$(cat .claude/context/project-standards.md)"
  }
}
EOF
)

echo "$output"
exit 0
```

### Sources

- [Debugg.ai - Pre-Prompt Middleware](https://debugg.ai/resources/pre-prompt-middleware-claude-code-hooks-enforce-pm-and-coding-standards)
- [GitHub - BMAD Context Injection](https://github.com/darraghh1/bmad-context-injection)
- [Gend.co - Configure Claude Code Hooks](https://www.gend.co/blog/configure-claude-code-hooks-automation)
- [Medium - 5 Automations That Eliminate Developer Friction](https://medium.com/coding-nexus/claude-code-hooks-5-automations-that-eliminate-developer-friction-7b6ddeff9dd2)
- [GitHub - disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)

---

## PreToolUse Security Validation

### Concept

Intercept tool calls before execution to validate security, block dangerous operations, or modify tool inputs.

### Real-World Implementations

**From [Egghead.io - Secure Your Claude Skills](https://egghead.io/secure-your-claude-skills-with-custom-pre-tool-use-hooks~dhqko):**

Creating security layers beyond `allowed-tools` configuration by intercepting and validating tool commands.

**From [Dev.to - The Ultimate Claude Code Guide](https://dev.to/holasoymalva/the-ultimate-claude-code-guide-every-hidden-trick-hack-and-power-feature-you-need-to-know-2l45):**

Examples of blocking dangerous commands using PreToolUse hooks with matcher patterns.

### Implementation Pattern

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-tool-use/security-check.sh"
          }
        ]
      }
    ]
  }
}
```

**Security check script:**

```bash
#!/bin/bash
# .claude/hooks/pre-tool-use/security-check.sh

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# Dangerous patterns to block
dangerous_patterns=(
  "rm -rf /"
  "rm -rf \.\."
  "chmod 777"
  "curl.*\|.*sh"
  "wget.*\|.*sh"
  "> /etc/"
)

for pattern in "${dangerous_patterns[@]}"; do
  if echo "$command" | grep -qE "$pattern"; then
    echo "BLOCKED: Dangerous command pattern: $pattern" >&2
    exit 2  # Block tool execution
  fi
done

# Protected files
protected_files=(".env" ".env.production" "secrets.yml" "id_rsa")
for file in "${protected_files[@]}"; do
  if echo "$command" | grep -qF "$file"; then
    echo "BLOCKED: Cannot modify protected file: $file" >&2
    exit 2
  fi
done

exit 0  # Allow execution
```

### ⚠️ Important Limitation

**From [GitHub Issue #4362](https://github.com/anthropics/claude-code/issues/4362):**

> PreToolUse hooks cannot effectively block tool execution due to a bug where the blocking decision isn't properly processed.

**Workaround:** Use PostToolUse hooks to revert changes, or combine with Stop hooks for quality gates.

### Advanced: JSON Output for Control

```bash
#!/bin/bash

# Auto-approve safe operations, modify others
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command')

# Auto-approve read operations
if [[ "$command" == "git status"* ]] || [[ "$command" == "git diff"* ]]; then
  output='{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "allow",
      "permissionDecisionReason": "Safe read-only git command"
    }
  }'
  echo "$output"
  exit 0
fi

exit 0  # Let normal permission flow proceed
```

### Sources

- [Egghead.io - Secure Your Claude Skills](https://egghead.io/secure-your-claude-skills-with-custom-pre-tool-use-hooks~dhqko)
- [GitHub Issue #4362 - PreToolUse blocking bug](https://github.com/anthropics/claude-code/issues/4362)
- [Dev.to - The Ultimate Claude Code Guide](https://dev.to/holasoymalva/the-ultimate-claude-code-guide-every-hidden-trick-hack-and-power-feature-you-need-to-know-2l45)
- [MCP Market - Claude Code Bash Patterns](https://mcpmarket.com/tools/skills/claude-code-bash-patterns)
- [Learn Agentic AI - Mastering Claude Code Hooks](https://learn-agentic-ai.com/blog/mastering-claude-code-hooks-building-observable-ai-systems)

---

## SessionStart Environment Bootstrap

### Concept

Automatically set up development environment when Claude Code session starts - load context, configure tools, set environment variables.

### Real-World Implementations

**From [Medium - How I Turned Claude Code Into a War Machine](https://medium.com/@aedelon/skills-hooks-and-commands-automating-claude-code-2025-c2b1dccf76d4):**

SessionStart hooks used for:
- Loading project context
- Reading project configurations and types
- Setting environment variables
- Configuring tool environments

### Implementation Pattern

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/session-start/bootstrap.sh"
          }
        ]
      }
    ]
  }
}
```

**Bootstrap script:**

```bash
#!/bin/bash
# .claude/hooks/session-start/bootstrap.sh

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
ENV_FILE="${CLAUDE_ENV_FILE:-/dev/null}"

# Function to persist environment variables
persist_var() {
  if [ -n "$CLAUDE_ENV_FILE" ]; then
    echo "export $1=\"$2\"" >> "$CLAUDE_ENV_FILE"
  fi
}

cd "$PROJECT_DIR" || exit 1

# Detect project type and set up environment
if [ -f "package.json" ]; then
  # Node.js project
  persist_var "PROJECT_TYPE" "nodejs"

  # Check for TypeScript
  if [ -f "tsconfig.json" ]; then
    echo "TypeScript project detected. Loading type definitions..." >&2
    persist_var "TYPESCRIPT" "true"
  fi
elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  # Python project
  persist_var "PROJECT_TYPE" "python"
  echo "Python project detected" >&2
elif [ -f "Cargo.toml" ]; then
  # Rust project
  persist_var "PROJECT_TYPE" "rust"
  echo "Rust project detected" >&2
fi

# Load git context
if [ -d ".git" ]; then
  CURRENT_BRANCH=$(git branch --show-current)
  persist_var "GIT_BRANCH" "$CURRENT_BRANCH"
  echo "On branch: $CURRENT_BRANCH" >&2
fi

# Add project-specific context to Claude's view
if [ -f ".claude/context/project-overview.md" ]; then
  # This will be added to context
  cat .claude/context/project-overview.md
fi

exit 0
```

### Persisting Environment Variables

**From [Official Claude Code Docs - Hooks Reference](https://code.claude.com/docs/en/hooks):**

The `CLAUDE_ENV_FILE` variable provides a file path to persist environment variables for the session.

**Capture all environment changes:**

```bash
#!/bin/bash

# Capture environment before
ENV_BEFORE=$(export -p | sort)

# Run setup that modifies environment
source ~/.nvm/nvm.sh
nvm use 20

# Capture changes and persist
if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

### Best Practices

- **Check if directory exists** before cd operations
- **Use CLAUDE_ENV_FILE** to persist variables
- **Provide feedback** via stderr (visible to user)
- **Handle missing dependencies** gracefully

### Sources

- [Medium - How I Turned Claude Code Into a War Machine](https://medium.com/@aedelon/skills-hooks-and-commands-automating-claude-code-2025-c2b1dccf76d4)
- [GitHub - Claude Code Hook Development](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/hook-development/SKILL.md)
- [Claude中文 - Hooks System](https://claudecn.com/en/docs/claude-code/advanced/hooks/)
- [Dev.to - The Ultimate Claude Code Guide](https://dev.to/holasoymalva/the-ultimate-claude-code-guide-every-hidden-trick-hack-and-power-feature-you-need-to-know-2l45)
- [Eesel - Developer's Guide to Hooks](https://www.eesel.ai/en/blog/claude-code-hooks)

---

## SubagentStop Pipeline Chaining

### Concept

Chain multiple subagents together by having hooks trigger the next agent when the current one finishes - creating multi-stage automated pipelines.

### Real-World Implementations

**From [GitHub Issue #4784 - Proactive Hooks for Command Chaining](https://github.com/anthropics/claude-code/issues/4784):**

Proposes hooks for deterministic command chaining between subagents.

**From [Reddit - Subagent Output Chaining](https://www.reddit.com/r/ClaudeCode/comments/1q3ogs5/reminder_you_can_actually_ask_claude_code_to/):**

Discussion about chaining subagent outputs to form useful pipelines.

### Implementation Pattern

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/subagent-stop/chain-next.sh"
          }
        ]
      }
    ]
  }
}
```

**Chain script (queue-based):**

```bash
#!/bin/bash
# .claude/hooks/subagent-stop/chain-next.sh

input=$(cat)
agent_status=$(echo "$input" | jq -r '.status // "unknown"')

# Only chain if agent succeeded
if [ "$agent_status" != "success" ]; then
  exit 0
fi

# Check queue file for next agent
QUEUE_FILE=".claude/agent-queue.json"

if [ ! -f "$QUEUE_FILE" ]; then
  exit 0  # No queue, nothing to chain
fi

# Read and update queue
next_agent=$(jq -r '.next // empty' "$QUEUE_FILE")

if [ -n "$next_agent" ]; then
  # Update queue for next time
  jq '.next = .agents[0] | .agents = .agents[1:]' "$QUEUE_FILE" > "${QUEUE_FILE}.tmp"
  mv "${QUEUE_FILE}.tmp" "$QUEUE_FILE"

  # Suggest next agent to Claude
  echo "✓ Agent complete. Next: Use the ${next_agent} subagent" >&2
fi

exit 0
```

### Three-Stage Pipeline Example

```
1. PM-Spec Agent
   → Writes spec, sets status READY_FOR_ARCH
   → SubagentStop hook triggers

2. Architect-Review Agent (triggered by hook)
   → Reviews design, writes ADR, sets READY_FOR_BUILD
   → SubagentStop hook triggers

3. Implementer Agent (triggered by hook)
   → Implements, tests, updates docs, sets DONE
```

### Advanced: Human-in-the-Loop

```bash
#!/bin/bash

# Check if human approval is needed
if [ -f ".claude/pending-approval.json" ]; then
  approval=$(jq -r '.approved // false' ".claude/pending-approval.json")

  if [ "$approval" != "true" ]; then
    echo "⏸️  Awaiting human approval before continuing to next agent" >&2
    echo "Review: .claude/pending-approval.json" >&2
    exit 0  # Don't chain yet
  fi

  # Clean up and continue
  rm ".claude/pending-approval.json"
fi

# Chain to next agent
echo "→ Continuing to next agent in pipeline" >&2
```

### Sources

- [GitHub Issue #4784 - Proactive Hooks for Command Chaining](https://github.com/anthropics/claude-code/issues/4784)
- [Reddit - Subagent Output Chaining](https://www.reddit.com/r/ClaudeCode/comments/1q3ogs5/reminder_you_can_actually_ask_claude_code_to/)
- [Agentic Patterns - Stop Hook Auto-Continue](https://agentic-patterns.com/patterns/stop-hook-auto-continue-pattern/)
- [Medium - Multi-Agent Workflow](https://medium.com/@techofhp/claude-code-and-subagents-how-to-build-your-first-multi-agent-workflow-3cdbc5e430fa)

---

## Infinite Loop Prevention

### Concept

Stop hooks that block stopping can cause infinite loops. The `stop_hook_active` flag prevents this by indicating when you're already in a hook-triggered continuation.

### Why This Matters

**From Reddit discussions:**

> Infinite loops can occur when Stop Claude → triggers hook → hook runs Claude command → creates recursive cycle. One example mentioned potential cost of **$3600/day** if left unchecked.

### Implementation Pattern

```bash
#!/bin/bash
# ALWAYS check stop_hook_active first

input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

if [ "$stop_hook_active" = "true" ]; then
  # Already in a hook-triggered continuation
  # MUST allow stop to prevent infinite loop
  exit 0
fi

# First time - can block if needed
if ! npm test; then
  echo "Tests failing. Cannot stop." >&2
  exit 2  # Block stopping
fi

exit 0
```

### Maximum Retry Pattern

```bash
#!/bin/bash

MAX_RETRIES=3
RETRY_COUNT_FILE="/tmp/claude-stop-retries"

input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

if [ "$stop_hook_active" = "true" ]; then
  # Increment retry counter
  if [ -f "$RETRY_COUNT_FILE" ]; then
    count=$(cat "$RETRY_COUNT_FILE")
    count=$((count + 1))
    echo "$count" > "$RETRY_COUNT_FILE"

    if [ "$count" -ge "$MAX_RETRIES" ]; then
      # Max retries reached, allow stop
      rm "$RETRY_COUNT_FILE"
      echo "Maximum retries reached. Allowing stop." >&2
      exit 0
    fi
  else
    echo "1" > "$RETRY_COUNT_FILE"
  fi

  # Continue trying to fix
  if ! npm test; then
    echo "Tests still failing (retry $count/$MAX_RETRIES)" >&2
    exit 2
  fi
else
  # Not in hook continuation, clean state
  rm -f "$RETRY_COUNT_FILE"
fi

exit 0
```

### Best Practices

1. **ALWAYS check `stop_hook_active` first** in every Stop hook
2. **Test thoroughly** in safe environments before production
3. **Set reasonable timeouts** for hook execution
4. **Use retry limits** to prevent endless loops
5. **Provide feedback** so user knows what's happening

### Sources

- [Reddit Discussion - Infinite Loop Costs](https://www.reddit.com/r/ClaudeCode/comments/1q3ogs5/reminder_you_can_actually_ask_claude_code_to/)
- [Claude中文 Documentation](https://claudecn.com/en/docs/claude-code/advanced/hooks/)
- [Tencent Cloud CodeBuddy Documentation](https://copilot.tencent.com/docs/cli/hooks)
- [GitHub - Claude Code Mastery](https://github.com/TheDecipherist/claude-code-mastery)

---

## Prompt-Based Intelligent Decisions

### Concept

Use `type: "prompt"` hooks to have an LLM evaluate context and make intelligent decisions instead of deterministic bash scripts.

### How It Works

**From [Official Claude Code Docs](https://code.claude.com/docs/en/hooks):**

> Prompt-based hooks send the hook input and your prompt to a fast LLM (Haiku), which responds with structured JSON containing a decision.

### Implementation Pattern

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop. Check:\n1. All user tasks complete\n2. No errors need addressing\n3. Tests passing\n\nInput: $ARGUMENTS\n\nRespond with JSON: {\"ok\": true} to allow stopping, or {\"ok\": false, \"reason\": \"explanation\"} to continue.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Response Schema

The LLM must respond with:

```json
{
  "ok": true | false,
  "reason": "Explanation when ok=false"
}
```

### Use Cases

**Intelligent test decisions:**

```json
{
  "type": "prompt",
  "prompt": "The user just modified test files. Should we run the full test suite or just the affected tests? Consider:\n- How many tests changed\n- Test suite execution time\n- CI will run full suite\n\nInput: $ARGUMENTS\n\nReturn: {\"ok\": true, \"runTests\": \"affected|full|skip\", \"reason\": \"your reasoning\"}"
}
```

**Context-aware stopping:**

```json
{
  "type": "prompt",
  "prompt": "Should Claude continue working? Consider:\n- Are there obvious bugs in recent changes?\n- Did Claude complete the requested task?\n- Are there TODOs/FIXMEs in modified files?\n\nInput: $ARGUMENTS\n\nReturn: {\"ok\": false, \"reason\": \"...\"} if more work needed, or {\"ok\": true} if done."
}
```

### When to Use Prompt-Based vs Command Hooks

| Factor | Command Hooks | Prompt Hooks |
|--------|---------------|-------------|
| **Decision type** | Deterministic rules | Context-aware evaluation |
| **Speed** | Fast (local execution) | Slower (API call) |
| **Complexity** | Simple conditions | Complex reasoning |
| **Use case** | Validation, formatting | Intelligent decisions |

### Sources

- [Official Claude Code Docs - Hooks Reference](https://code.claude.com/docs/en/hooks)
- [GitHub - Hook Development SKILL](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/hook-development/SKILL.md)
- [Paddo.dev - Hooks Guardrails](https://paddo.dev/blog/claude-code-hooks-guardrails/)
- [Medium - Making AI Gen Deterministic](https://medium.com/spillwave-solutions/claude-code-hooks-making-ai-gen-deterministic-ad4779c3a801)

---

## MCP Tool Integration Hooks

### Concept

Use hooks to integrate with Model Context Protocol (MCP) tools - external services that Claude can interact with.

### MCP Tool Naming Pattern

MCP tools follow the pattern: `mcp__<server>__<tool>`

Examples:
- `mcp__github__search_repositories`
- `mcp__filesystem__read_file`
- `mcp__memory__create_entities`

### Implementation Pattern

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__github__.*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-tool-use/github-validator.sh"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre-tool-use/validate-write.sh"
          }
        ]
      }
    ]
  }
}
```

### Hook MCP Tool Events

```bash
#!/bin/bash
# Log MCP tool usage for analytics

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')

if [[ "$tool_name" == mcp__* ]]; then
  # Extract server and tool
  server=$(echo "$tool_name" | cut -d'__' -f2)
  tool=$(echo "$tool_name" | cut -d'__' -f3-)

  echo "MCP tool used: $server/$tool" >> .claude/mcp-usage.log
fi

exit 0
```

### Common MCP Integrations

**From [GetClockwise - MCP Tool Integration](https://www.getclockwise.com/blog/claude-code-mcp-tools-integration):**

- **GitHub** - Repository search, PR management, issue tracking
- **Figma** - Design file access and updates
- **Notion** - Database operations and documentation
- **Sentry** - Error tracking and monitoring

**From [Ruvnet - MCP Tools Wiki](https://github.com/ruvnet/claude-flow/wiki/MCP-Tools):**

87 specialized tools for AI orchestration and swarm coordination.

### Sources

- [Official Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Architecture Overview](https://modelcontextprotocol.io/docs/learn/architecture)
- [GetClockwise - MCP Tools Integration](https://www.getclockwise.com/blog/claude-code-mcp-tools-integration)
- [Ruvnet - MCP Tools Wiki](https://github.com/ruvnet/claude-flow/wiki/MCP-Tools)
- [Medium - Complete MCP Guide](https://mrzacsmith.medium.com/the-complete-claude-code-guide-skills-mcp-tool-integration-part-2-20dcf2fb8877)

---

## Progressive Quality Enforcement

### Concept

Start with light, fast checks. Gradually increase strictness as the codebase stabilizes - preventing developer friction while maintaining quality.

### The Pattern

**Stage 1: Week 1 - Basic Formatting**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE\""
          }
        ]
      }
    ]
  }
}
```

**Stage 2: Week 2-3 - Add Linting**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE\" && npx eslint --fix \"$FILE\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx eslint . || echo 'Lint errors exist' >&2"
          }
        ]
      }
    ]
  }
}
```

**Stage 3: Week 4+ - Full Quality Gates**
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/stop/full-quality-gate.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/bin/bash
# Full quality gate - all checks must pass

# Check stop_hook_active first!
if [ "$(jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

# 1. Formatting
if ! npx prettier --check .; then
  echo "Formatting issues detected" >&2
  exit 2
fi

# 2. Linting
if ! npx eslint .; then
  echo "Lint errors detected" >&2
  exit 2
fi

# 3. Type checking
if ! npx tsc --noEmit; then
  echo "Type errors detected" >&2
  exit 2
fi

# 4. Tests
if ! npm test; then
  echo "Tests failing" >&2
  exit 2
fi

exit 0
```

### Rollout Strategy

1. **Week 1**: Formatting only (silent, non-blocking)
2. **Week 2**: Add warnings (stop hook shows issues but doesn't block)
3. **Week 3**: Make blocking for new code (PreToolUse/PostToolUse)
4. **Week 4**: Full enforcement (Stop hook blocks on any issue)

### Sources

- [Anthropic - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Eesel - Developer's Guide to Hooks](https://www.eesel.ai/en/blog/claude-code-hooks)
- [Medium - 17 Best Claude Code Workflows](https://medium.com/@joe.njenga/17-best-claude-code-workflows-that-separate-amateurs-from-pros-instantly-level-up-5075680d4c49)
- [Dev.to - Mastering Claude Hooks](https://dev.to/bredmond1019/mastering-claude-hooks-building-observable-ai-systems-part-2-2ic4)

---

## Summary: When to Use Each Hook Type

| Hook Type | Best For | Can Block | Common Use Cases |
|-----------|----------|-----------|------------------|
| **UserPromptSubmit** | Context injection, prompt validation | ✅ Yes | Adding project context, blocking risky prompts |
| **PreToolUse** | Security validation, input modification | ✅ Yes | Blocking dangerous commands, modifying inputs |
| **PostToolUse** | Auto-formatting, notifications | ❌ No | Prettier, ESLint, git status |
| **Stop** | Quality gates, continuation logic | ✅ Yes | Test validation, forcing more work |
| **SubagentStop** | Pipeline chaining, validation | ✅ Yes | Multi-agent workflows, handoffs |
| **SessionStart** | Environment setup, context loading | ❌ No | Setting env vars, loading project info |
| **SessionEnd** | Cleanup, logging | ❌ No | Saving session state, analytics |

---

## Additional Resources

### Official Documentation
- [Get started with Claude Code hooks](https://code.claude.com/docs/en/hooks-guide)
- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)

### Community Resources
- [GitHub - disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) - Comprehensive hook examples
- [GitHub - johnlindquist/claude-hooks](https://github.com/johnlindquist/claude-hooks) - TypeScript-based hooks
- [Eesel - Complete Guide to Hooks](https://www.eesel.ai/blog/hooks-in-claude-code) - Developer tutorial
- [Agentic Patterns - Stop Hook Auto-Continue](https://agentic-patterns.com/patterns/stop-hook-auto-continue-pattern/)

### Video Content
- [YouTube - MUST KNOW to Keep Claude Agent in Control](https://www.youtube.com/watch?v=CEODfvJLIGQ) - Hooks mastery tutorial

### Blog Articles
- [Medium - Claude Code Hooks: 5 Automations](https://medium.com/coding-nexus/claude-code-hooks-5-automations-that-eliminate-developer-friction-7b6ddeff9dd2)
- [Medium - Making AI Gen Deterministic](https://medium.com/spillwave-solutions/claude-code-hooks-making-ai-gen-deterministic-ad4779c3a801)
- [Koder.ai - git hooks automation](https://koder.ai/blog/claude-code-git-hooks-automation)

---

**Last Updated:** January 20, 2026
**Research Date:** 2026-01-20
**Applies to:** Claude Code v2.1.2+
