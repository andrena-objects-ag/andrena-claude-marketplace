# Claude Code Plugin Development Best Practices

**Researched:** January 13, 2026
**Sources:**
- [Official Anthropic Engineering Blog - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Official Claude Code Documentation](https://code.claude.com/docs/en/overview)
- [Gend.co - Claude Skills and CLAUDE.md Guide](https://www.gend.co/blog/claude-skills-claude-md-guide)
- [PubNub - Best Practices for Claude Code Subagents](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)
- [Official Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Official Slash Commands Reference](https://code.claude.com/docs/en/slash-commands)

---

## Table of Contents

1. [Agent Skills Best Practices](#agent-skills-best-practices)
2. [Slash Commands Best Practices](#slash-commands-best-practices)
3. [Subagents Best Practices](#subagents-best-practices)
4. [Hooks Best Practices](#hooks-best-practices)
5. [CLAUDE.md Best Practices](#claudemd-best-practices)
6. [General Workflow Patterns](#general-workflow-patterns)

---

## Agent Skills Best Practices

### Purpose and Design

**Skills are reusable, model-invoked capabilities** - Claude automatically selects Skills based on their description when appropriate. Unlike slash commands (explicit invocation), Skills should be designed for automatic discovery.

### Core Principles

#### 1. Single Responsibility
- Each Skill addresses **one specific capability**
- Don't combine multiple unrelated tasks in one Skill
- Example: Separate "PDF processing" from "data analysis" into different Skills

#### 2. Clear, Trigger-Oriented Descriptions
- **Description is critical** - it's how Claude decides when to use the Skill
- Include both **what** the Skill does AND **when** to use it
- Maximum 1024 characters
- Use action-oriented language

**Good Example:**
```yaml
---
name: security-review
description: Perform comprehensive security review of code changes. Use when implementing authentication, handling user data, or before creating pull requests. Reviews for XSS, SQL injection, OWASP top 10 vulnerabilities.
---
```

**Bad Example:**
```yaml
---
name: security-review
description: Reviews code for security issues
---
```

#### 3. Progressive Disclosure
- Keep `SKILL.md` **under 500 lines** - this is in Claude's context on every turn
- Use reference files for detailed documentation:
  - `reference.md` - Detailed methodology
  - `examples.md` - Real-world examples
  - `scripts/` - Supporting scripts
  - `templates/` - Reusable templates

#### 4. Structured SKILL.md Format

```markdown
# Skill Name

Brief 1-2 sentence summary of what this Skill does.

## What This Skill Does

1. **Action 1** - Brief description
2. **Action 2** - Brief description
3. **Action 3** - Brief description

## When to Use This Skill

- Scenario 1
- Scenario 2
- Scenario 3

## Inputs

- Input 1: Description
- Input 2: Description

## Outputs

- Output 1: Description
- Output 2: Description

## Example Invocation

```
User: [Example request that triggers this Skill]
```

## See Also

- [reference.md](./reference.md) - Detailed implementation
- [examples.md](./examples.md) - More examples
```

#### 5. Frontmatter Configuration

```yaml
---
name: skill-identifier
description: Clear description of what and when (max 1024 chars)
allowed-tools: Read, Grep, Glob, WebSearch  # Limit scope when appropriate
model: claude-opus-4-5-20251101  # Optional: specify model
context: fork  # Use fork for complex multi-step operations
user-invocable: true  # Set to false for internal Skills
disable-model-invocation: false  # Prevent Skill tool from calling this
---
```

**Key Frontmatter Fields:**
- `allowed-tools` - Restrict which tools the Skill can use (security best practice)
- `context: fork` - Creates isolated context for complex operations
- `user-invocable: false` - Hide from slash command menu (for internal Skills)
- `model` - Override default model for this Skill
- `hooks` - Define hooks scoped to this Skill's execution

#### 6. Tool Restrictions
- Use `allowed-tools` to **limit scope** for security and clarity
- Example: Research Skills don't need `Edit` or `Write`
- Example: Implementation Skills don't need `WebSearch`

```yaml
---
name: research-assistant
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch
---
```

#### 7. Forked Context Pattern
- Use `context: fork` for:
  - Complex multi-step operations
  - Operations that require extensive exploration
  - Tasks that might pollute main context
- The forked agent returns a summary to main context

```yaml
---
name: deep-codebase-analysis
context: fork
agent: Explore  # Can specify which agent type to use
---
```

#### 8. Refusal & Escalation
Always include clear boundaries:

```markdown
## Refusal & Escalation

- Refuse: Legal advice, financial recommendations
- Escalate to: Security team for vulnerabilities, Legal for compliance questions
- Block: Destructive operations without explicit confirmation
```

#### 9. Evaluation Checklist
Include success criteria for quality control:

```markdown
## Evaluation Checklist

- [ ] Factuality vs supplied sources
- [ ] Output follows specified format
- [ ] All required fields present
- [ ] Reading level appropriate for audience
- [ ] Citations included where required
```

### Skills vs Slash Commands Decision Matrix

| Use Skills When... | Use Slash Commands When... |
|-------------------|---------------------------|
| Claude should discover capability automatically | You want explicit, manual invocation |
| Multiple files/scripts needed | Single file is sufficient |
| Complex workflow with validation | Simple prompt snippet |
| Team needs standardized detailed guidance | Quick frequently-used prompt |
| Knowledge organized across multiple files | Prompt fits in one file |

---

## Slash Commands Best Practices

### Purpose and Design

**Slash commands are explicit, user-invoked prompt templates** stored as Markdown files. They're for frequent workflows you want to trigger manually.

### Core Principles

#### 1. Location and Scope

- **Project commands:** `.claude/commands/` (shared with team via git)
- **Personal commands:** `~/.claude/commands/` (available across all projects)
- Project commands override personal commands with same name

#### 2. Naming and Organization

- Use descriptive, action-oriented names
- Use subdirectories for namespacing: `.claude/commands/frontend/component.md` → `/component (project:frontend)`
- Command name comes from filename (without `.md`)

#### 3. Argument Patterns

**Use `$ARGUMENTS` for flexible input:**
```markdown
---
argument-hint: <issue-number> [priority]
---

Fix GitHub issue: $ARGUMENTS following our coding standards
```

**Use `$1, $2, $3` for structured input:**
```markdown
---
argument-hint: <pr-number> <priority> <assignee>
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

#### 4. Bash Command Integration

Execute bash commands **before** the slash command runs using `!` prefix:

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

**Important:** Must include `allowed-tools` with the Bash tool.

#### 5. File References

Include file contents using `@` prefix:

```markdown
Review the implementation in @src/utils/helpers.js

Compare @src/old-version.js with @src/new-version.js
```

#### 6. Forked Context for Commands

Use `context: fork` with custom agents for isolated execution:

```markdown
---
description: Deep security analysis
context: fork
agent: general-purpose
allowed-tools: Read, Grep, Bash
---

Perform comprehensive security audit of the codebase.
```

#### 7. Command-Scoped Hooks

Commands can define hooks that only run during their execution:

```markdown
---
description: Deploy to staging with validation
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-deploy.sh"
          once: true
---

Deploy the current branch to staging environment.
```

- `once: true` - Run hook only once per session
- Hooks are automatically cleaned up when command finishes

#### 8. Thinking Mode Integration

Trigger extended thinking by including keywords:
- "think" - Basic extended thinking
- "think hard" - More thinking budget
- "think harder" - Even more budget
- "ultrathink" - Maximum thinking budget

#### 9. Frontmatter Best Practices

```yaml
---
description: Brief description shown in /help menu
argument-hint: <arg1> <arg2> [optional]  # Shown during autocomplete
allowed-tools: Bash(git:*), Edit, Write  # Limit permissions
model: claude-3-5-haiku-20241022  # Override model if needed
context: fork  # For isolated execution
agent: general-purpose  # Agent type when using fork
disable-model-invocation: false  # Prevent Skill tool invocation
hooks:  # Command-scoped hooks
  PreToolUse: [...]
---
```

### Common Command Patterns

**1. Git Workflow Commands**
```markdown
---
allowed-tools: Bash(git:*)
description: Create conventional commit with generated message
---

!`git status`
!`git diff HEAD`

Create a conventional commit (feat/fix/chore) based on changes.
```

**2. Testing Commands**
```markdown
---
allowed-tools: Bash
argument-hint: <test-pattern>
description: Run tests matching pattern
---

Run tests matching: $ARGUMENTS
Show coverage report.
```

**3. Code Review Commands**
```markdown
---
context: fork
agent: general-purpose
description: Comprehensive code review
---

Review staged changes for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Missing tests
```

---

## Subagents Best Practices

### Purpose and Design

**Subagents are specialized, autonomous assistants** with isolated context windows, scoped permissions, and specific system prompts. They're for creating modular AI teams.

### Core Principles

#### 1. Single-Responsibility Agents

**Give each subagent one clear goal, input, output, and handoff rule.**

```markdown
---
name: pm-spec
description: Use after receiving an enhancement request; reads requirements, writes working spec, asks clarifying questions, sets status READY_FOR_ARCH
---

# PM Spec Subagent

You are a product manager assistant...

## Input
- Enhancement request or feature description

## Output
- Working specification document
- Clarifying questions if needed
- Status: READY_FOR_ARCH

## Handoff
Set status to READY_FOR_ARCH in the queue file when complete.
```

#### 2. Permission Hygiene

**Scope tools per agent intentionally:**

- **PM & Architect**: Read-heavy (Read, Grep, Glob, WebSearch, MCP servers)
- **Implementer**: Edit, Write, Bash, testing tools
- **Release**: Only what's needed for release tasks

**Omitting `tools` grants access to ALL available tools - be explicit!**

```markdown
---
name: architect-review
tools:
  - Read
  - Grep
  - Glob
  - WebFetch
  - mcp__company-docs__*
---
```

#### 3. Context Window Advantage

**Key benefit:** Subagents have their own context window and provide summaries back to main agent.

- Use for extensive research without polluting main context
- Main agent receives concise summary instead of full exploration
- Delays need for `/compact` or `/clear`

#### 4. Location and Discovery

- **Project subagents:** `.claude/agents/` (shared with team)
- **Personal subagents:** `~/.claude/agents/` (user-specific)
- Project subagents override personal ones on name collision
- Use `/agents` command to create and manage

#### 5. Invocation Patterns

**Automatic delegation:**
```
Claude will automatically use architect-review subagent when appropriate
based on the description field.
```

**Explicit invocation:**
```
Use the architect-review subagent on "use-case-presets".
```

#### 6. Agent Pipelines with Hooks

**Chain subagents using hooks** instead of prompt glue:

```json
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/queue-next-agent.sh"
          }
        ]
      }
    ]
  }
}
```

The hook reads the queue and suggests the next agent to run.

#### 7. Definition of Done Pattern

Each subagent should end with a clear checklist:

```markdown
## Definition of Done

- [ ] Spec has clear acceptance criteria
- [ ] All questions answered or documented
- [ ] Status updated to READY_FOR_ARCH
- [ ] Summary provided
```

#### 8. Human-in-the-Loop Pattern

**Keep humans in control without losing velocity:**

1. **Clear handoffs** - Hook suggests next step, human approves
2. **Review the artifact** - Every enhancement has a slug and audit trail
3. **Minimal approvals that matter** - Pre-implementation ADR, pre-PR summary

Example hook output:
```
✓ PM spec complete for 'use-case-presets'
→ Next: Use the architect-review subagent on 'use-case-presets'
```

#### 9. Three-Stage Pipeline (Common Pattern)

```
1. PM-Spec → Reads requirement, writes spec, sets READY_FOR_ARCH
2. Architect-Review → Validates design, writes ADR, sets READY_FOR_BUILD
3. Implementer-Tester → Implements + tests, updates docs, sets DONE
```

#### 10. Important Limitations (as of Jan 2026)

- **No plan mode:** Subagents execute immediately, don't generate stepwise plans
- **No thinking mode:** No transparent intermediate output during execution
- **Permission inheritance:** If `tools` field omitted, inherits ALL available tools
- **MCP permissions:** Must explicitly grant MCP tool access in subagent definition

#### 11. Multi-Model Review Pattern

Insert other LLMs between subagents for review:

**Pattern A - MCP Bridge:**
```json
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "mcp__external-reviewer__review_output"
          }
        ]
      }
    ]
  }
}
```

**Pattern B - Hook Script:**
```bash
#!/bin/bash
# Call external LLM API, write results, update status
python3 .claude/hooks/external-review.py
```

#### 12. Subagent Quality Improvement

When a subagent underperforms:

1. Supply context on failed action vs expected action
2. Explain expected result clearly
3. Pass in the `.md` configuration file to Claude
4. Let Claude suggest and make precise modifications
5. Version control the updated `.md` for audit trail

---

## Hooks Best Practices

### Purpose and Design

**Hooks are automated commands that execute at predefined moments** during coding sessions. Think of them as event listeners for Claude Code.

### Core Principles

#### 1. Hook Types

**Command Hooks (`type: "command"`):**
- Execute bash scripts/commands
- Fast, deterministic
- Use for validation, logging, formatting

**Prompt Hooks (`type: "prompt"`):**
- Use LLM to evaluate context
- Context-aware decisions
- Slower (API call) but intelligent

#### 2. Available Events

| Event | When It Runs | Common Use Cases |
|-------|-------------|------------------|
| `PreToolUse` | Before tool executes | Validation, auto-approval, input modification |
| `PermissionRequest` | Permission dialog shown | Auto-approve/deny on behalf of user |
| `PostToolUse` | After tool succeeds | Linting, formatting, logging |
| `UserPromptSubmit` | User submits prompt | Add context, validate prompts |
| `Stop` | Main agent finishes | Continue work, summary generation |
| `SubagentStop` | Subagent finishes | Chain next subagent, validation |
| `PreCompact` | Before compact | Save state, logging |
| `SessionStart` | Session starts/resumes | Load context, setup environment |
| `SessionEnd` | Session ends | Cleanup, logging |
| `Notification` | Notifications sent | External alerts, logging |

#### 3. Configuration Structure

**Settings file location:**
- `~/.claude/settings.json` - User settings
- `.claude/settings.json` - Project settings (commit to git)
- `.claude/settings.local.json` - Local overrides (gitignore)

**Basic structure:**
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

#### 4. Matcher Patterns

**For PreToolUse, PermissionRequest, PostToolUse:**
- Exact match: `"Write"` - matches only Write tool
- Regex: `"Edit|Write"` or `"Notebook.*"`
- Wildcard: `"*"` or `""` - matches all tools

**For events without matchers (UserPromptSubmit, Stop, SubagentStop):**
- Omit the matcher field entirely

**MCP tool patterns:**
- Specific: `"mcp__github__search_repositories"`
- Server: `"mcp__github__.*"`
- All writes: `"mcp__.*__write.*"`

#### 5. Environment Variables

**Available in all hooks:**
- `$CLAUDE_PROJECT_DIR` - Project root (where Claude started)
- `$CLAUDE_CODE_REMOTE` - "true" if remote/web, empty if local CLI

**Plugin hooks only:**
- `${CLAUDE_PLUGIN_ROOT}` - Absolute path to plugin directory

**SessionStart hooks only:**
- `$CLAUDE_ENV_FILE` - File path to persist environment variables

#### 6. Hook Input/Output Protocol

**Input (via stdin):** JSON with event-specific fields
```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/conversation.jsonl",
  "cwd": "/current/directory",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_use_id": "toolu_01ABC123..."
}
```

**Output (via exit code and stdout):**
- **Exit 0:** Success, continue
- **Exit 2:** Blocking error (stderr shown to Claude)
- **Other:** Non-blocking error (logged, execution continues)

**Advanced JSON output for control:**
```json
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "Warning: Large file written",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Safe file path"
  }
}
```

#### 7. Decision Control Examples

**PreToolUse - Auto-approve safe operations:**
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Documentation file auto-approved",
    "updatedInput": {
      "file_path": "/updated/path.txt"
    }
  }
}
```

**PostToolUse - Block and provide feedback:**
```json
{
  "decision": "block",
  "reason": "Linting failed. Fix errors before continuing.",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Linter output:\n..."
  }
}
```

**Stop - Force continuation:**
```json
{
  "decision": "block",
  "reason": "Tests are failing. Please fix the failing tests before stopping."
}
```

#### 8. Prompt-Based Hooks (LLM Evaluation)

Use for intelligent, context-aware decisions:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if Claude should stop: $ARGUMENTS. Check if all tasks are complete. Respond with {\"ok\": true} to allow stopping or {\"ok\": false, \"reason\": \"explanation\"} to continue.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Response schema:**
```json
{
  "ok": true | false,
  "reason": "Explanation (required when ok=false)"
}
```

#### 9. Component-Scoped Hooks

Skills, agents, and slash commands can define their own hooks:

```yaml
---
name: secure-operations
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
          once: true
---
```

- Scoped to component lifecycle
- Automatically cleaned up when component finishes
- `once: true` - Run only once per session (Skills/Commands only)

#### 10. Plugin Hooks

Plugins define hooks in `hooks/hooks.json`:

```json
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### 11. SessionStart - Persisting Environment

**Individual variables:**
```bash
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

**Capture all changes from setup:**
```bash
#!/bin/bash
ENV_BEFORE=$(export -p | sort)

# Run setup that modifies environment
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

#### 12. Best Practices Summary

**Treat hooks like production code:**
- Version under `.claude/hooks/`
- Validate JSON with `jq`
- Keep idempotent
- Make executable (`chmod +x`)
- Test thoroughly before deployment

**Settings hygiene:**
- Keep valid JSON (single root object)
- Use project settings for team, local for personal overrides
- Review/apply changes via `/hooks` or settings UI

**Security:**
- Validate and sanitize inputs
- Always quote shell variables: `"$VAR"` not `$VAR`
- Block path traversal (check for `..`)
- Use absolute paths
- Skip sensitive files (`.env`, `.git/`, keys)

**Performance:**
- Default 60s timeout, adjust as needed
- All matching hooks run in parallel
- Identical commands deduplicated
- Set appropriate timeouts for expensive operations

**Debugging:**
- Use `claude --debug` for detailed execution logs
- Check `/hooks` menu to verify registration
- Test commands manually first
- Monitor stdout/stderr in verbose mode (ctrl+o)

---

## CLAUDE.md Best Practices

### Purpose and Design

**CLAUDE.md is automatically pulled into context** when starting conversations. It's ideal for documenting project-specific patterns, commands, and conventions.

### Core Principles

#### 1. Location Hierarchy

Claude reads CLAUDE.md files from multiple locations:

**Recommended structure:**
- `~/.claude/CLAUDE.md` - Global across all projects
- `<project-root>/CLAUDE.md` - Main project documentation (commit to git)
- `<project-root>/CLAUDE.local.md` - Personal overrides (add to .gitignore)
- `<project-root>/<subdirectory>/CLAUDE.md` - Scoped to subdirectory

**For monorepos:**
- `root/CLAUDE.md` - Monorepo-wide conventions
- `root/frontend/CLAUDE.md` - Frontend-specific patterns
- `root/backend/CLAUDE.md` - Backend-specific patterns

All relevant files are automatically pulled into context.

#### 2. Keep It Concise

**CLAUDE.md is in context on every turn** - optimize ruthlessly:

- Keep under 2000 lines total across all CLAUDE.md files
- For detailed docs, create `.llm/` directory with reference files
- Reference detailed docs from CLAUDE.md: "See `.llm/testing.md` for test patterns"

#### 3. Recommended Structure

```markdown
# Project Name

Brief 1-2 line project description

## Architecture

- Stack: Next.js 14, React 18, TypeScript 5.3
- State: Zustand
- Styling: Tailwind CSS 3.4
- Testing: Vitest + Playwright
- Monorepo: /apps/web, /packages/ui, /packages/config

## Common Commands

- `npm run dev` - Start development server
- `npm run test` - Run unit tests
- `npm run e2e` - Run E2E tests
- `npm run build` - Production build
- `npm run typecheck` - Type checking

## Code Style

- Use ES modules (import/export), not CommonJS (require)
- Destructure imports: `import { foo } from 'bar'`
- Prefer functional components with hooks
- Keep components under 200 lines

## Coding Rules

- **IMPORTANT:** Prefer small diffs; no unrequested refactors
- Add/modify tests for changed logic
- Accessibility: label form controls; keyboard nav required
- i18n: wrap user-facing strings in translation helper

## Git & Reviews

- Conventional commits (feat/fix/chore)
- One issue per PR
- Include: summary, rationale, screenshots, test notes
- Don't add dependencies without discussion

## Testing

- Unit tests: Co-located with source files
- E2E tests: `tests/e2e/`
- Run tests before committing
- Minimum 80% coverage for new code

## Definition of Done

- Tests pass; coverage not lower
- No TypeScript errors
- Lighthouse perf ≥ 90 on changed pages
- Accessibility: No automated violations

## Prompts for You (Claude)

- **YOU MUST:** Before coding, propose plan in bullets; wait for "OK"
- Keep solutions minimal and focused; avoid over-engineering
- Think hard about edge cases before implementing
```

#### 4. Use Emphasis for Critical Rules

Claude responds better to emphasis:

- **IMPORTANT:** Use for critical patterns
- **YOU MUST:** Use for non-negotiable requirements
- **NEVER:** Use for absolute prohibitions

```markdown
## Coding Rules

- **IMPORTANT:** Prefer small diffs; no unrequested refactors
- **YOU MUST:** Add tests for changed logic
- **NEVER:** commit directly to main branch
```

#### 5. Tuning CLAUDE.md (Iterative Improvement)

**CLAUDE.md is a prompt** - refine like any frequently used prompt:

1. Start with basics
2. Add patterns as you encounter issues
3. Use `/memory` (or press `#`) to quickly add learned patterns
4. Run through prompt improver periodically
5. Add emphasis for patterns Claude frequently misses

**Anti-pattern:** Adding extensive content without iteration.

#### 6. Team Patterns

**For shared projects:**
- Keep CLAUDE.md in git for team consistency
- Use `/init` to generate initial CLAUDE.md
- Review and update as team patterns evolve
- Include CLAUDE.md changes in relevant PRs

**For personal overrides:**
- Use `CLAUDE.local.md` (add to .gitignore)
- Personal preferences, local paths, shortcuts

#### 7. Common Sections

**Essential:**
- Architecture overview
- Common bash commands
- Code style guidelines
- Testing instructions

**Recommended:**
- Repository etiquette (branch naming, merge vs rebase)
- Developer environment setup
- Unexpected behaviors or gotchas
- Performance considerations

**Optional:**
- Security guidelines
- Deployment process
- API conventions
- Database patterns

#### 8. Integration with Skills

Reference Skills from CLAUDE.md for better discovery:

```markdown
## Available Skills

- Use /security-review before creating PRs
- Use /api-docs-generator when adding endpoints
- Use /test-generator for new features
```

#### 9. Progressive Disclosure Pattern

**CLAUDE.md (concise):**
```markdown
## Testing

- Unit tests: Co-located, filename.test.ts
- E2E tests: tests/e2e/
- See `.llm/testing-guide.md` for detailed patterns
```

**.llm/testing-guide.md (detailed):**
```markdown
# Testing Guide

## Unit Testing Patterns
[Extensive examples, edge cases, best practices...]

## E2E Testing Patterns
[Detailed Playwright patterns, selectors, assertions...]

## Test Data Management
[Factories, fixtures, database seeding...]
```

---

## General Workflow Patterns

Based on official Anthropic recommendations and community best practices.

### 1. Explore, Plan, Code, Commit

**The most versatile workflow for complex problems:**

```
1. Explore
   - "Read the files that handle authentication"
   - "Don't write any code yet, just understand the system"
   - Use subagents for complex exploration

2. Plan
   - "Think about how to implement feature X"
   - Use extended thinking: "think", "think hard", "think harder", "ultrathink"
   - Create GitHub issue or doc with the plan

3. Code
   - "Implement the solution from your plan"
   - Ask Claude to verify reasonableness as it implements

4. Commit
   - "Create a commit and PR"
   - Update READMEs/changelogs if relevant
```

**Why it works:**
- Without exploration/planning, Claude jumps straight to coding
- Deeper thinking upfront = better solutions
- Plan serves as checkpoint to reset if implementation goes wrong

### 2. Write Tests, Commit; Code, Iterate, Commit

**Test-driven development with agentic coding:**

```
1. Write Tests
   - "Write tests based on these input/output pairs"
   - "Do test-driven development - don't create mock implementations"

2. Confirm Failure
   - "Run the tests and confirm they fail"
   - "Don't write implementation yet"

3. Commit Tests
   - "Commit the tests"

4. Implement
   - "Write code that passes the tests"
   - "Don't modify the tests"
   - "Keep going until all tests pass"
   - Use independent subagents to verify not overfitting

5. Commit Code
   - "Commit the implementation"
```

**Why it works:**
- Clear target to iterate against
- Claude can evaluate results and incrementally improve
- Tests serve as specification

### 3. Write Code, Screenshot Result, Iterate

**Visual development workflow:**

```
1. Setup Screenshot Capability
   - Puppeteer MCP server
   - iOS simulator MCP server
   - Manual screenshot paste

2. Provide Visual Mock
   - Drag-drop image or provide file path

3. Implement and Iterate
   - "Implement the design, take screenshots, and iterate until matches"

4. Commit
   - "Commit when you're satisfied"
```

**Why it works:**
- Visual targets significantly improve output quality
- 2-3 iterations typically produce much better results
- Claude can see its own output and self-correct

### 4. Safe YOLO Mode

**Unattended execution in safe environment:**

```bash
# In Docker container without internet access
docker run --rm -it \
  -v $(pwd):/workspace \
  --network none \
  my-dev-container \
  claude --dangerously-skip-permissions \
  -p "Fix all lint errors"
```

**Use cases:**
- Fixing lint errors
- Generating boilerplate
- Mass file formatting
- Routine refactoring

**Safety requirements:**
- Run in container
- No internet access
- Only for reversible operations
- Review output before committing

### 5. Codebase Q&A

**Learning and exploration:**

```
- "How does logging work in this project?"
- "How do I make a new API endpoint?"
- "What does `async move { ... }` do on line 134 of foo.rs?"
- "What edge cases does CustomerOnboardingFlowImpl handle?"
- "Why are we calling foo() instead of bar() on line 333?"
```

**Why it works:**
- Natural way to learn new codebases
- Claude explores agentically to find answers
- Significantly improves onboarding time

### 6. Git Interaction Patterns

**90%+ of git operations through Claude:**

```
# History exploration
- "What changes made it into v1.2.3?"
- "Who owns the authentication feature?"
- "Why was this API designed this way?" (use git log/blame)

# Commit messages
- "Create a commit" (Claude reads changes + history automatically)

# Complex operations
- "Revert changes to src/utils/helpers.js"
- "Resolve these rebase conflicts"
- "Compare and graft patches from branch X to Y"
```

### 7. GitHub Interaction Patterns

**Streamlined PR and issue workflows:**

```
# Pull requests
- "Create a PR" (Claude: reads diff, history, generates message)
- "Fix the review comments on PR #123 and push"

# Builds and CI
- "Fix the failing build on PR #123"
- "Fix all linter warnings"

# Issues
- "Triage open issues and categorize by priority"
- "Fix issue #456"
```

### 8. Multi-Claude Workflows

**Parallel development with multiple instances:**

**Pattern A: Separate checkout + review**
```
1. Claude 1: Write feature X
2. /clear or new Claude instance
3. Claude 2: Review feature X code
4. Claude 3 (or /clear): Edit based on feedback
```

**Pattern B: Multiple checkouts**
```
1. Create 3-4 git checkouts in separate folders
2. Open each in separate terminal tabs
3. Start Claude in each with different tasks
4. Cycle through to approve permissions
```

**Pattern C: Git worktrees (recommended)**
```bash
# Create worktrees for parallel work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b

# Launch Claude in each
cd ../project-feature-a && claude
cd ../project-feature-b && claude

# Cleanup when done
git worktree remove ../project-feature-a
```

**Why it works:**
- Separate contexts prevent contamination
- Independent tasks can progress in parallel
- No waiting for sequential completion

### 9. Headless Mode Automation

**CI/CD and automation patterns:**

**Pattern A: Fan-out (large migrations)**
```bash
# 1. Generate task list
claude -p "List all files needing migration from React to Vue"

# 2. Loop through tasks
for file in $(cat task-list.txt); do
  claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
    --allowedTools Edit,Bash
done
```

**Pattern B: Pipeline integration**
```bash
# Integrate into data pipeline
claude -p "Analyze sentiment in logs" --json | jq '.result' | next-step
```

**Use cases:**
- Issue triage on GitHub events
- Subjective linting in CI
- Automated PR descriptions
- Log analysis
- Code quality checks

### 10. Optimization Tactics

**Based on Anthropic recommendations:**

**Be specific:**
- ❌ "add tests for foo.py"
- ✅ "write a new test case for foo.py, covering the edge case where the user is logged out. avoid mocks"

**Give Claude images:**
- Paste screenshots (Mac: cmd+ctrl+shift+4 → ctrl+v)
- Drag-drop images
- Provide file paths

**Mention files:**
- Use tab-completion to reference files/folders
- Helps Claude find correct resources

**Give Claude URLs:**
- Paste URLs for Claude to fetch
- Add domains to allowlist to skip permission prompts

**Course correct early:**
- Ask for plan before coding
- Press Escape to interrupt anytime
- Double-tap Escape to go back in history
- Ask Claude to undo changes

**Use /clear frequently:**
- Between tasks to reset context
- Prevents context window pollution
- Improves performance on new tasks

**Use checklists for complex workflows:**
```
1. "Run lint and write all errors to lint-errors.md as checklist"
2. "Fix each issue one by one, verify, and check it off"
```

---

## Version Management Best Practices

### Plugin Versioning

When making ANY changes to a plugin:

**1. Semantic Versioning Required:**
- Bug fixes (e.g., fixing hooks.json) → PATCH: 1.0.0 → 1.0.1
- New features → MINOR: 1.0.1 → 1.1.0
- Breaking changes → MAJOR: 1.1.0 → 2.0.0

**2. Two Files to Update:**
```json
// plugins/[plugin-name]/plugin.json
{
  "version": "1.0.1"
}
```

```json
// .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "plugin-name",
      "version": "1.0.1"
    }
  ]
}
```

**3. Commit Message:**
```
Fix hooks.json structure and bump to v1.0.1
```

**4. Update README:**
- Document version changes
- Maintain changelog if present

---

## Summary: Quick Decision Guide

### When to Use What

**Skills:**
- Complex capabilities with multiple steps
- Claude should invoke automatically
- Multiple supporting files needed
- Team workflows to standardize

**Slash Commands:**
- Frequent, manual workflows
- Simple prompt snippets
- Explicit invocation preferred
- Single file sufficient

**Subagents:**
- Specialized tasks requiring isolation
- Multi-stage pipelines
- Different permission scopes
- Context window preservation

**Hooks:**
- Automated validation/formatting
- Chain subagents together
- Add context automatically
- Enforce policies

**CLAUDE.md:**
- Project patterns and conventions
- Common commands
- Code style guidelines
- Architecture overview

---

## References

### Official Documentation
- [Claude Code Best Practices (Anthropic Engineering)](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code Official Docs](https://code.claude.com/docs/en/overview)
- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Slash Commands Reference](https://code.claude.com/docs/en/slash-commands)

### Community Resources
- [Gend.co - Skills and CLAUDE.md Guide](https://www.gend.co/blog/claude-skills-claude-md-guide)
- [PubNub - Subagents Best Practices](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)

### Internal Documentation
- `docs/plugins.md` - Plugin system overview
- `docs/skills.md` - Skills authoring guide
- `docs/slash-commands.md` - Command creation guide
- `docs/sub-agents.md` - Subagent development guide
- `docs/hooks.md` - Hooks implementation guide

---

**Last Updated:** January 13, 2026
**Applies to:** Claude Code (all versions as of Jan 2026)
