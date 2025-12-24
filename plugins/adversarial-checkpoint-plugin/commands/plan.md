---
title: Plan
description: Create and manage implementation plans with adversarial checkpoint validation
aliases: [implementation, checklist]
---

# Plan Command

Create and manage implementation plans with adversarial checkpoint validation. Plans are markdown files with structured checklists that are automatically challenged by the adversarial-challenger agent.

## Usage

```
/plan
```

Interactively guides you through plan creation, validation, and management.

## Subcommands

### Create New Plan

```
/plan create
```

Creates a new implementation plan using the standard template. Prompts for:
- Project name
- Overview
- Goals (with success criteria)
- Constraints
- Initial tasks

### Validate Existing Plan

```
/plan validate [file]
```

Validates an existing plan file against best practices:
- Structure completeness
- Checklist quality
- Constraint coverage
- Challenge readiness

Uses the `plan-validator` skill for comprehensive validation.

### Show Plan Status

```
/plan status
```

Shows current plan status:
- Completion percentage
- Outstanding items
- Recent challenge history
- Active agent ID for resuming

### Challenge Checkpoint

```
/plan challenge [task-id]
```

Manually triggers adversarial challenge for:
- Specific task (if task-id provided)
- All recently completed items
- Current checkpoint

### Resume Challenger Session

```
/plan resume
```

Resumes the adversarial-challenger agent with full session history. The challenger remembers:
- Previous challenges raised
- Issues that were addressed vs. ignored
- Patterns observed across the session
- Context from all previous invocations

### Reset Challenger

```
/plan reset
```

Resets the challenger session state. Use when:
- Starting a new project
- Challenger state is corrupted
- Want to begin fresh challenge cycle

## Plan File Format

Plans use markdown with structured checkboxes:

```markdown
## Goals
- [ ] **[G-1]** Add authentication │ *Success: users can log in*
- [ ] **[G-2]** Secure API endpoints │ *Success: auth required*

## Tasks
- [ ] **[T-1.0]** Implement OAuth │ *Constraint: MUST-1* │ *Validation: manual test*
  - [ ] **[T-1.1]** Install dependencies │ *Evidence: package.json updated*
  - [ ] **[T-1.2]** Configure OAuth │ *Evidence: .env file created*
```

## Automatic Challenger Triggers

The challenger is automatically triggered by:

1. **PostToolUse Hook** - When PLAN.md is modified
2. **Stop Hook** - When Claude attempts to stop (challenges completion)
3. **SubagentStop Hook** - When a subagent completes work

## Challenger State

Challenger maintains persistent state across the session:

- **Active plan file** being tracked
- **Challenge count** for the session
- **Challenge history** with timestamps and reasons
- **Agent ID** for resuming with full context

State stored in: `~/.claude/adversarial-challenger-state.json`

## Examples

### Create a new plan

```
> /plan create
```

Follow prompts to create a comprehensive implementation plan.

### Validate before starting work

```
> /plan validate
```

Ensures your plan is ready for adversarial validation.

### After completing tasks

```
> /plan challenge T-1.0
```

Get adversarial review of specific task completion.

### Resume challenger context

```
> /plan resume
```

Continues challenger with full memory of previous challenges.

## Best Practices

1. **Always start with `/plan create`** - Use the template for structure
2. **Be specific in checkboxes** - Include validation methods
3. **Run `/plan validate`** - Before starting implementation
4. **Let challenges guide you** - The challenger improves quality
5. **Use resume for continuity** - Maintains challenge context

## See Also

- [Adversarial Challenger Agent](../agents/adversarial-challenger.md) - The critic agent
- [Plan Validator Skill](../skills/plan-validator/SKILL.md) - Plan validation framework
- [Plan Template](../templates/plan-template.md) - Standard template format
