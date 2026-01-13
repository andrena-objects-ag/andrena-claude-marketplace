# Ralph Learning Loop Plugin

Autonomous iteration loop with automatic learning capture. Combines Ralph Wiggum's persistent iteration with documentation-learner's knowledge capture, creating a "reasonable loop" that learns from each cycle.

## Overview

The Ralph Learning Loop plugin transforms Claude Code into an autonomous, learning agent that:
1. **Iterates persistently** on tasks until completion criteria are met
2. **Captures learnings** automatically from each cycle
3. **Builds compound knowledge** that grows with each iteration
4. **Documents insights** in your project's existing documentation structure

## Philosophy

> **"Iteration > Perfection"** + **"Learning happens in cycles"**

Traditional Ralph Wiggum: Keep iterating until done.
Ralph Learning Loop: Keep iterating AND capture what you learn along the way.

This creates a virtuous cycle:
- Each iteration produces code changes
- Each cycle produces insights about the codebase
- Captured insights inform future iterations
- Compound learning accelerates progress

## Installation

```bash
/plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
/plugin install ralph-learning-loop@andrena-marketplace
```

## Quick Start

### Basic Usage

```
/ralph-learn-loop "Migrate tests from Jest to Vitest
Success criteria:
- All tests pass with Vitest
- Coverage >= 85%
- Jest dependencies removed
Output <promise>MIGRATION_COMPLETE</promise>" \
--max-iterations 25 \
--completion-promise MIGRATION_COMPLETE \
--learn-every 5
```

### What Happens

1. Claude begins working on the task
2. Every 5 iterations, it pauses to capture learnings:
   - What approaches were tried
   - What failed and why
   - What succeeded
   - Patterns discovered
3. Learnings are documented in your project (e.g., `.llm/jest-to-vitest-migration.md`)
4. Loop resumes with enhanced context from captured learnings
5. Stops when `MIGRATION_COMPLETE` is output or 25 iterations reached

## Features

### Autonomous Iteration
- Persistent task execution until completion
- Configurable iteration limits for safety
- Completion promise detection for clean exit
- Progress tracking and status updates

### Automatic Learning Capture
- Extracts insights from conversation history
- Categorizes learnings by type (approaches, failures, successes, patterns)
- Updates project documentation automatically
- Respects existing documentation structure

### Compound Learning
- Each cycle builds on previous insights
- Documented patterns inform subsequent iterations
- Knowledge accumulates across the loop
- Creates reusable documentation for future work

### Safety Features
- Max iteration limits prevent runaway loops
- Completion promises for clean exit
- Progress tracking shows current state
- Interruptible with Ctrl+C

## Use Cases

### Test Migrations

```
/ralph-learn-loop "Migrate from Jest to Vitest
Success criteria:
- All tests pass
- No behavior changes
- Jest removed
Output <promise>DONE</promise>" \
--max-iterations 25 \
--learn-every 5
```

**Captures:** Migration patterns, file-specific challenges, configuration decisions

### Framework Upgrades

```
/ralph-learn-loop "Upgrade Next.js from 13 to 15
Success criteria:
- App builds successfully
- All routes work
- Tests pass
Output <promise>UPGRADE_COMPLETE</promise>" \
--max-iterations 30 \
--learn-every 5
```

**Captures:** Breaking changes, migration patterns, API updates, gotchas

### Feature Implementation

```
/ralph-learn-loop "Implement JWT authentication
Requirements:
- Login endpoint
- Token validation middleware
- Refresh token flow
- All endpoints tested
Output <promise>AUTH_READY</promise>" \
--max-iterations 30 \
--learn-every 3
```

**Captures:** Design decisions, integration patterns, security considerations, edge cases

### Code Standardization

```
/ralph-learn-loop "Standardize error handling in src/
Requirements:
- Use Error subclasses
- Add error codes
- Update tests
Output <promise>STANDARDIZED</promise>" \
--max-iterations 15 \
--learn-every 10
```

**Captures:** Error patterns, handling approaches, testing strategies

### Greenfield Scaffolding

```
/ralph-learn-loop "Build minimal TODO API
Requirements:
- CRUD endpoints
- Input validation
- Tests
- README docs
Output <promise>API_READY</promise>" \
--max-iterations 30 \
--learn-every 3
```

**Captures:** Architecture decisions, library choices, initial patterns, setup steps

## Command Reference

### /ralph-learn-loop

```
/ralph-learn-loop "<task-description>" [--max-iterations N] [--completion-promise PROMISE] [--learn-every N]
```

#### Arguments

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task-description` | string | required | Detailed task with success criteria |
| `--max-iterations` | number | 20 | Maximum loop iterations |
| `--completion-promise` | string | "DONE" | String signaling completion |
| `--learn-every` | number | 5 | Capture learnings every N iterations (0 = disable) |

#### Learning Frequency Guide

| Value | Best For |
|-------|----------|
| 2-3 | Exploratory tasks, complex problem-solving |
| 5 | Default balanced approach |
| 8-10 | Mechanical, well-defined tasks |
| 0 | Disable learning, pure iteration |

## What Gets Captured

### By Task Type

**Refactors/Migrations:**
- Mapping between old and new patterns
- Files requiring special handling
- Configuration changes and rationale
- Breaking changes introduced

**Feature Implementation:**
- Design decisions and trade-offs
- Integration points and dependencies
- Edge cases discovered and handled
- Testing patterns that worked

**Bug Fixes:**
- Root cause analysis
- Diagnostic approaches tried
- Solution path taken
- Prevention strategies

**Greenfield Projects:**
- Architecture decisions
- Library choices and rationale
- Setup and configuration steps
- Initial patterns established

## Documentation Placement

The learning capture follows your project's existing patterns:

### Projects with `.llm/` directory
Creates topic-specific files:
- `.llm/workflows.md` - Processes and procedures
- `.llm/patterns.md` - Code and architecture patterns
- `.llm/troubleshooting.md` - Issues and solutions

### Projects without `.llm/`
Follows existing conventions:
- Updates `CLAUDE.md` if structured
- Creates appropriate `.llm/` files if referenced
- Asks for placement if unclear

## Best Practices

### 1. Define Clear Success Criteria

```
TASK:
Migrate all tests from Jest to Vitest

SUCCESS CRITERIA:
- All tests pass with Vitest
- No tests removed or behavior changed
- Coverage remains >= 85%
- Jest dependencies removed
- Vitest config created

OUTPUT:
<promise>MIGRATION_COMPLETE</promise> when all criteria met
```

### 2. Set Appropriate Limits

- **Start small**: `--max-iterations 10-15` for new tasks
- **Scale up**: Increase to 20-50 for proven, repeatable tasks
- **Monitor progress**: Review status updates to adjust

### 3. Choose Learning Frequency Wisely

- **Complex/exploratory**: `--learn-every 2-3` (capture discoveries)
- **Balanced**: `--learn-every 5` (default)
- **Mechanical**: `--learn-every 8-10` (focus on progress)
- **Disabled**: `--learn-every 0` (pure iteration, manual /learn after)

### 4. Write Effective Completion Promises

Choose unique, specific strings:
- ✅ `MIGRATION_COMPLETE` - specific and unique
- ✅ `VITEST_DEPLOY_READY` - very specific
- ❌ `Done` - too common, might trigger early
- ❌ `Complete` - risks false positives

### 5. Review Before Merging

The loop is like a junior teammate:
- Review the diff before committing
- Check that learnings are accurate
- Verify completion criteria actually met
- Test the changes manually

## Examples

### Example 1: Test Migration

**Task:** Migrate Jest tests to Vitest

```
/ralph-learn-loop "Migrate tests from Jest to Vitest
Success criteria:
- All tests pass with Vitest
- Coverage >= 85%
- Jest packages removed
- Vitest configured
Output <promise>MIGRATION_COMPLETE</promise>" \
--max-iterations 25 \
--completion-promise MIGRATION_COMPLETE \
--learn-every 5
```

**Sample Learning Capture:**
```markdown
## Jest to Vitest Migration

### Approaches Tried
1. Direct file-by-file conversion - 47 failing tests
2. Incremental with parallel tests - 12 failures
3. Shim layer for gradual migration - current approach

### Patterns Discovered
- `jest.mock()` → direct `vi.mock()` replacement
- `jest.useFakeTimers()` → `vi.useFakeTimers()`
- Snapshot path: `__snapshots__` needs resolution fix

### Files Requiring Special Handling
- `src/utils/formatters.ts` - Custom mocks needed manual conversion
- `__tests__/integration/*` - Timeout adjustments required
```

### Example 2: Feature Implementation

**Task:** Build JWT authentication

```
/ralph-learn-loop "Implement JWT authentication
Requirements:
- Login endpoint with JWT tokens
- Token validation middleware
- Refresh token flow
- Tests for all endpoints
Output <promise>AUTH_COMPLETE</promise>" \
--max-iterations 30 \
--completion-promise AUTH_COMPLETE \
--learn-every 3
```

**Sample Learning Capture:**
```markdown
## Authentication Implementation

### Design Decisions
- JWT over sessions for API-first architecture
- Access tokens: 15min (security vs UX)
- Refresh tokens: 7 days with rotation

### Integration Points
- Middleware at router level
- Validation before controllers
- User context on request object

### Edge Cases Handled
- Token expiration → auto retry with refresh
- Concurrent refresh → token versioning
- Blacklisted tokens → Redis with TTL
```

## Comparison

| Feature | Ralph Learning Loop | Ralph Wiggum | Manual + /learn |
|---------|-------------------|--------------|-----------------|
| Autonomous iteration | ✅ | ✅ | ❌ |
| Automatic learning | ✅ | ❌ | ❌ |
| Progress tracking | ✅ | ✅ | ❌ |
| Compound knowledge | ✅ | ❌ | Possible |
| Best for | Complex tasks with insights | Mechanical tasks | All tasks |

## Troubleshooting

### Loop Won't Stop
1. Check if completion promise was output exactly
2. Verify max iterations hasn't been reached
3. Use Ctrl+C to interrupt

### Learnings Not Captured
1. Check `--learn-every` setting (might be 0)
2. Review iteration count (might not be at checkpoint)
3. Check documentation file permissions

### Loop Wandering
1. Refine task description with specific criteria
2. Add measurable constraints (tests, build, coverage)
3. Reduce max iterations to force convergence

### Poor Quality Learnings
1. Task too mechanical → increase `--learn-every`
2. Task too exploratory → decrease `--learn-every`
3. Consider manual `/learn` for complex tasks

## Architecture

### Components

1. **Command**: `/ralph-learn-loop` - Main entry point
2. **Skill**: `loop-learner` - Automatic learning extraction
3. **Hooks**: Loop lifecycle management
   - `PreToolUse`: Check loop health before actions
   - `PostToolUse`: Assess progress after actions
   - `Stop`: Loop exit handling

### Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     LOOP START                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  EXECUTE: Claude works on task with current codebase        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  VERIFY: Run tests/linters to validate progress             │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │ At checkpoint?│
                    └───────┬───────┘
                       YES │         │ NO
                           ▼         │
        ┌────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  CAPTURE LEARNINGS: Analyze conversation, extract insights   │
│  - Approaches tried                                         │
│  - Failures and causes                                      │
│  - Successes and patterns                                   │
│  - Gotchas and edge cases                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  UPDATE DOCS: Write learnings to project documentation       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────┐
        │ Complete or max reached?  │
        └───────────┬───────────────┘
                   YES│         │NO
                      ▼         │
              ┌─────────────┐  │
              │   EXIT      │  │
              └─────────────┘  │
                      ▼        │
                 ┌─────────────────┘
                 │ LOOP (continue)
                 └─────────────────┘
```

## References

- [Ralph Wiggum Explained](https://jpcaparas.medium.com/ralph-wiggum-explained-the-claude-code-loop-that-keeps-going-3250dcc30809)
- [Geoffrey Huntley's Ralph](https://ghuntley.com/ralph/)
- [Documentation Learner Plugin](../documentation-learner/)
- [Claude Code Hooks](../../docs/hooks.md)

## License

MIT License - see LICENSE file for details.

## Version History

- **v1.0.0**: Initial release
  - Autonomous iteration with learning capture
  - Configurable learning intervals
  - Project-aware documentation updates
  - Progress tracking and safety features
