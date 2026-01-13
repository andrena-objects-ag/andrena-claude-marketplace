---
description: Run an autonomous iteration loop that captures learnings from each cycle
argument-hint: "<task-description> [--max-iterations N] [--completion-promise PROMISE] [--learn-every N]"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - AskUserQuestion
  - TodoWrite
hooks:
  - PreToolUse
  - PostToolUse
  - Stop
agent: parallel-task-agent
model: sonnet
context: fork
---

# /ralph-learn-loop

Run an autonomous iteration loop with automatic learning capture. This command combines the persistent iteration of Ralph Wiggum with the knowledge capture of documentation-learner, creating a "reasonable loop" that learns from each cycle.

## Philosophy

**"Iteration > Perfection"** + **"Learning happens in cycles"**

The Ralph Learning Loop recognizes that:
1. Autonomous iteration excels at mechanical, verifiable tasks
2. Each iteration produces valuable insights about the codebase
3. Capturing these insights creates compound learning over time

## Usage

```
/ralph-learn-loop "<task-description>" [--max-iterations N] [--completion-promise PROMISE] [--learn-every N]
```

### Arguments

- `$ARGUMENTS`: The task description and optional flags (see below)

### Flags

- `--max-iterations N`: Maximum number of loop iterations (default: 20)
- `--completion-promise PROMISE`: Specific string that signals task completion (default: "DONE")
- `--learn-every N`: Capture learnings every N iterations (default: 5, use 0 to disable)

## How It Works

### The Loop Cycle

1. **Execute**: Claude works on the task using the current codebase state
2. **Verify**: Run tests, linters, or build to validate progress
3. **Capture**: Every N iterations, extract and document learnings
4. **Iterate**: If not complete and under max iterations, loop back to step 1

### Learning Capture

Every N iterations (default: 5), the loop:
1. Pauses execution
2. Analyzes the conversation since the last learning capture
3. Extracts:
   - What approaches were tried
   - What failed and why
   - What succeeded
   - Code patterns discovered
   - Gotchas and edge cases
4. Updates project documentation (follows `/learn` command logic)
5. Resumes the loop with enhanced context

### Exit Conditions

The loop stops when:
- The completion promise is detected in output
- Max iterations is reached
- User interrupts with Ctrl+C
- A critical error occurs

## Best Practices

### 1. Define Clear Success Criteria

```
TASK:
Migrate all tests from Jest to Vitest

SUCCESS CRITERIA:
- All tests pass with Vitest
- No tests removed or changed in behavior
- Vitest config properly set up
- Jest dependencies removed
- Tests run successfully with npm test

OUTPUT:
<promise>MIGRATION_COMPLETE</promise> when all criteria met
```

### 2. Set Reasonable Learning Frequency

- `--learn-every 3`: For complex, exploratory tasks (captures more insights)
- `--learn-every 5`: Default (balanced between learning and progress)
- `--learn-every 10`: For mechanical, well-defined tasks
- `--learn-every 0`: Disable learning capture for pure iteration

### 3. Use Appropriate Max Iterations

- `--max-iterations 10-15`: Small, focused tasks
- `--max-iterations 20-30`: Medium complexity refactors
- `--max-iterations 50+`: Large migrations or greenfield projects

### 4. Write Effective Completion Promises

Choose unique, specific strings that won't appear accidentally:
- ✅ `MIGRATION_COMPLETE` - specific and unique
- ❌ `Done` - too common, might trigger early

## Examples

### Example 1: Test Migration with Learning

```
/ralph-learn-loop "Migrate tests from Jest to Vitest
Success criteria:
- All tests pass with Vitest
- Coverage remains >= 85%
- Jest packages removed
- Vitest config created
Output <promise>MIGRATION_COMPLETE</promise> when done" \
--max-iterations 25 \
--completion-promise MIGRATION_COMPLETE \
--learn-every 5
```

**Result**: Loop runs, migrating tests. Every 5 iterations, captures what migration patterns worked, what files were tricky, and what configuration changes were needed.

### Example 2: Feature Implementation with Insight Capture

```
/ralph-learn-loop "Implement user authentication with JWT
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

**Result**: Builds auth system while frequently capturing learnings about JWT implementation patterns, security considerations, and testing approaches.

### Example 3: Code Standardization

```
/ralph-learn-loop "Standardize error handling across src/
Requirements:
- Replace string errors with Error subclasses
- Add error codes and messages
- Update tests for error changes
Output <promise>STANDARDIZED</promise>" \
--max-iterations 15 \
--completion-promise STANDARDIZED \
--learn-every 10
```

**Result**: Iterates through files standardizing errors, with periodic captures of error handling patterns discovered.

## What Gets Captured in Learnings

The loop captures different types of insights based on task type:

### For Refactors/Migrations:
- Mapping between old and new patterns
- Files that required special handling
- Configuration changes and their rationale
- Breaking changes introduced

### For Feature Implementation:
- Design decisions and trade-offs
- Integration points and dependencies
- Edge cases discovered and handled
- Testing patterns that worked

### For Bug Fixes:
- Root cause analysis
- Diagnostic approaches tried
- Solution path taken
- Prevention strategies

### For Greenfield Projects:
- Architecture decisions
- Library choices and rationale
- Setup and configuration steps
- Initial patterns established

## Documentation Placement

The learning capture follows the `/learn` command logic:
1. Analyzes project structure (CLAUDE.md, .llm/, docs/)
2. Follows existing documentation patterns
3. Creates appropriate files based on project conventions
4. Updates CLAUDE.md with references if needed

## Guardrails and Safety

### Always Set Max Iterations
This is your primary safety net. Start low (10-15) and increase for proven tasks.

### Monitor Progress
The loop provides status updates showing:
- Current iteration number
- Learnings captured so far
- Progress toward completion
- Estimated remaining iterations

### Review Learnings
Each learning capture shows what was documented and where. Review these to ensure quality.

### Completion Promises Are Fragile
Treat them as exact string matches. If the loop doesn't stop, check:
- Promise spelling in output
- Whitespace or formatting differences
- Output format changes

## Troubleshooting

### Loop Won't Stop
1. Check if completion promise was output exactly
2. Verify max iterations hasn't been reached
3. Use Ctrl+C to interrupt if needed

### Learnings Not Captured
1. Check --learn-every setting (might be 0)
2. Review iteration count (might not have reached a learning checkpoint)
3. Check project documentation permissions

### Loop Wandering
1. Refine task description with more specific success criteria
2. Add measurable constraints (test coverage, build success)
3. Reduce max iterations to force convergence

### Poor Quality Learnings
1. Task may be too mechanical - increase --learn-every
2. Task may be too exploratory - decrease --learn-every
3. Consider manual learning capture with /learn instead

## When to Use Ralph Learning Loop

### Ideal For:
- Test migrations with coverage requirements
- Framework upgrades with clear compatibility targets
- Feature implementation with well-defined requirements
- Code standardization with measurable criteria
- Documentation generation from existing code
- Greenfield scaffolding with clear specs

### Less Ideal For:
- Exploratory architecture decisions
- Security-sensitive code (needs human oversight)
- Product trade-off discussions
- Highly subjective requirements
- Tasks without clear success metrics

## Comparison: Ralph Learning Loop vs Alternatives

| Feature | Ralph Learning Loop | Ralph Wiggum | Manual + /learn |
|---------|-------------------|--------------|-----------------|
| Autonomous iteration | ✅ | ✅ | ❌ |
| Automatic learning capture | ✅ | ❌ | ❌ |
| Progress tracking | ✅ | ✅ | ❌ |
| Human oversight | Optional | Optional | Required |
| Compound learning | ✅ | ❌ | Possible |
| Best for | Complex tasks with insights | Mechanical tasks | All tasks |

## Advanced Usage

### Custom Learning Intervals

Different task phases benefit from different learning frequencies:

```
Phase 1 (Exploration): --learn-every 2  # Capture discoveries
Phase 2 (Implementation): --learn-every 8  # Focus on progress
Phase 3 (Refinement): --learn-every 3  # Capture polish patterns
```

### Combining with Other Commands

Run a loop, then use `/learn` to capture additional insights:
```
/ralph-learn-loop "..." --learn-every 0
# After loop completes
/learn
```

### Integration Hooks

The loop emits hooks that can trigger other automation:
- `PreToolUse`: Before each tool call
- `PostToolUse`: After each tool call
- `Stop`: On loop completion or interruption

## References

- [Ralph Wiggum Explained](https://jpcaparas.medium.com/ralph-wiggum-explained-the-claude-code-loop-that-keeps-going-3250dcc30809)
- [Geoffrey Huntley's Ralph](https://ghuntley.com/ralph/)
- [Documentation Learner](../documentation-learner/README.md)
- [Claude Code Hooks Documentation](../../../docs/hooks.md)

## Version History

- **v1.0.0**: Initial release
  - Autonomous iteration with learning capture
  - Configurable learning intervals
  - Project-aware documentation updates
  - Progress tracking and safety features
