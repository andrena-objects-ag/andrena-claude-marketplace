# Adversarial Checkpoint Plugin

> Keep your AI agent on track with persistent adversarial validation at every checkpoint.

An innovative Claude Code plugin that combines **markdown-based planning** with a **resumable adversarial challenger agent** triggered by **hooks**. The system maintains persistent challenge memory across the session, ensuring quality and preventing premature completion.

## How It Works

```
┌─────────────────────┐
│   PLAN.md           │
│   - Goals           │
│   - Tasks [ ]       │
│   - Constraints     │
│   - Evidence Req    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hooks Layer                              │
│  PostToolUse → Stop → SubagentStop → SessionStart          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         Adversarial Challenger Agent (Resumable)            │
│  - Challenges assumptions                                   │
│  - Validates evidence                                       │
│  - Finds edge cases                                         │
│  - Reviews security                                         │
│  - Maintains persistent memory across invocations           │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **Resumable Challenger Agent** - Maintains context across multiple hook-triggered invocations
- **Automatic Hook Triggers** - Challenger fires at checkpoints (file edits, stop attempts)
- **Markdown Plan Templates** - Structured checklists with validation criteria
- **Persistent Challenge Memory** - Tracks issues raised, patterns observed, remediation status
- **Plan Validator Skill** - Ensures plans are well-structured before work begins
- **Evidence-Based Completion** - Every checkbox requires concrete proof

## Installation

1. Add to your marketplace or enable directly:
   ```
   /plugin enable adversarial-checkpoint-plugin
   ```

2. The hooks will automatically install and the challenger agent becomes available

## Quick Start

### 1. Create a Plan

```
/plan create
```

This creates a `PLAN.md` file with:
- Structured goals with success criteria
- Tasks with validation methods
- Constraints (must haves, must nots)
- Risk register
- Definition of done

### 2. Work on Tasks

As you work and check off items:

```markdown
- [x] **[T-1.0]** Implement OAuth │ *Constraint: MUST-1* │ *Evidence: tests pass*
  - [x] **[T-1.1]** Install packages │ *Evidence: package.json updated*
```

### 3. Automatic Challenges

When you edit the plan file or attempt to stop, the challenger automatically:

1. **Reviews changes** - What was newly checked?
2. **Demands evidence** - Show me the proof it works
3. **Challenges assumptions** - What if this is wrong?
4. **Finds edge cases** - What would break this?
5. **Checks security** - Any vulnerabilities?

### 4. Persistent Challenge Context

The challenger remembers across the session:
- Previous issues raised
- Whether they were fixed
- Recurring patterns
- Quality trends

### 5. Resume and Iterate

```
/plan resume
```

Brings back the full challenger context to continue validation.

## Plugin Structure

```
adversarial-checkpoint-plugin/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── agents/
│   └── adversarial-challenger.md # Resumable critic agent
├── skills/
│   └── plan-validator/
│       └── SKILL.md             # Plan validation framework
├── hooks/
│   └── hooks.json               # Hook triggers
├── commands/
│   └── plan.md                  # /plan command
├── scripts/
│   └── challenger-trigger.py    # Hook integration script
├── templates/
│   └── plan-template.md         # Standard plan template
└── README.md
```

## Commands

| Command | Description |
|---------|-------------|
| `/plan create` | Create new implementation plan |
| `/plan validate` | Validate plan structure |
| `/plan status` | Show plan completion and challenge history |
| `/plan challenge [id]` | Manual challenge for task/phase |
| `/plan resume` | Resume challenger with full context |
| `/plan reset` | Reset challenger session |

## Hook Integration

The plugin installs these hooks:

### PostToolUse Hook
- **Triggers**: After Write/Edit operations
- **Action**: Checks if plan file was modified
- **If yes**: Triggers challenger to validate newly checked items

### Stop Hook
- **Triggers**: When Claude attempts to stop
- **Action**: Reviews all recent work
- **Can block**: If critical issues remain unaddressed

### SubagentStop Hook
- **Triggers**: When a subagent completes
- **Action**: Challenges subagent output quality
- **Validates**: Scope, assumptions, completeness

### SessionStart Hook
- **Triggers**: On session start/resume
- **Action**: Initializes challenger, finds plan file

## Challenger State

The challenger maintains persistent state in `~/.claude/adversarial-challenger-state.json`:

```json
{
  "active": true,
  "plan_file": "/path/to/PLAN.md",
  "agent_id": "abc123...",
  "challenge_count": 7,
  "challenges_history": [
    {
      "time": "2025-01-15T10:30:00",
      "mode": "post-tool",
      "reason": "Plan file modified: 3 items checked",
      "context": {...}
    }
  ],
  "last_challenge_time": "2025-01-15T14:22:00",
  "session_start": "2025-01-15T09:00:00"
}
```

## Challenge Report Format

```
CHALLENGE REPORT: [Task/Checkpoint Name]
Session: [session-id]
Previous Challenges: [count]

CRITICAL ISSUES (Must fix):
- [ ] [ISSUE] Description │ Evidence: [proof]

CONCERNS (Should address):
- [ ] [CONCERN] Description │ Impact: [what happens]

SUGGESTIONS (Consider):
- [SUGGESTION] Rationale

VALIDATION STATUS: [PASS/FAIL]
Rationale: [reasoning]

RESUMABLE CONTEXT:
[Key points for next invocation]
```

## Plan Template

The plugin includes a comprehensive plan template with:

- **Goals** with success criteria
- **Constraints** (must haves, must nots, trade-offs)
- **Tasks** with validation methods
- **Risk register** with mitigations
- **Assumptions** to be challenged
- **Dependencies** tracking
- **Challenger log** for challenge history

## Best Practices

### 1. Be Specific in Checkboxes

**Bad:**
```markdown
- [ ] Implement auth
```

**Good:**
```markdown
- [ ] **[T-1.0]** Implement OAuth 2.0 login │ *Constraint: MUST-1* │ *Validation: Manual test with valid/invalid tokens*
```

### 2. Define Evidence Requirements

For each task, specify what proves completion:
- "Tests pass: `npm test` returns exit code 0"
- "Manual test: Login with valid token succeeds, invalid rejected"
- "Security scan: No critical vulnerabilities"

### 3. Let Challenges Guide You

The challenger isn't being difficult—it's preventing bugs. Listen to it:
- Address critical issues before proceeding
- Consider concerns seriously
- Use suggestions to improve quality
- Remember challenges are saved for context

### 4. Use Resume for Continuity

When returning to work:
```
/plan resume
```

The challenger remembers everything from the session.

### 5. Update the Challenger Log

After addressing challenges, update the plan's challenger log section to track what was fixed.

## Examples

### Example Plan Snippet

```markdown
## Goals
- [ ] **[G-1]** User authentication │ *Success: Users can log in with OAuth*
- [ ] **[G-2]** API security │ *Success: All endpoints require auth*

## Tasks
### Phase 1: Authentication
- [ ] **[T-1.0]** OAuth Integration │ *Constraint: MUST-1* │ *Validation: Manual login test*
  - [ ] **[T-1.1]** Install deps │ *Evidence: package.json has oauth packages*
  - [ ] **[T-1.2]** Configure OAuth │ *Evidence: .env with OAUTH_CLIENT_ID*

## Constraints
### Must Haves
- [ ] **[MUST-1]** OAuth 2.0 with PKCE
- [ ] **[MUST-2]** No credential storage in code
```

### Example Challenge

```
CHALLENGE REPORT: T-1.0 OAuth Integration

CRITICAL ISSUES:
- [ ] No test for expired token handling │ Evidence: Test suite only has happy path
- [ ] PKCE not verified in implementation │ Evidence: Code shows plain code_challenge

CONCERNS:
- [ ] No rate limiting on OAuth endpoint │ Impact: DoS vulnerability

SUGGESTIONS:
- Add test for token refresh flow

VALIDATION STATUS: FAIL
Rationale: Critical security flows untested, PKCE not properly implemented

RESUMABLE CONTEXT:
Previous challenge found similar testing gaps in T-2.0. Pattern: unit tests present but integration/edge case tests missing.
```

## Troubleshooting

### Challenger not triggering

1. Check hooks are installed: `/hooks`
2. Verify plan file exists: `ls PLAN.md`
3. Check challenger state: `~/.claude/adversarial-challenger-state.json`

### Challenger lost context

1. Use `/plan resume` to restore context
2. Or `/plan reset` to start fresh

### Plan file not detected

1. Plan must be named `PLAN.md` or `IMPLEMENTATION.md`
2. Or use one of: `plan.md`, `implementation.md`
3. File must be in current directory or parent directories

## Version History

- **1.0.0** - Initial release with resumable challenger agent

## License

MIT

## Contributing

Contributions welcome! This is part of the [Claude Marketplace](https://github.com/p-wegner/claude-marketplace).
