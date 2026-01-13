---
name: loop-learner
description: Automatically captures learnings during autonomous iteration loops. Analyzes loop progress, extracts insights about approaches tried, failures encountered, successes achieved, and patterns discovered. Updates project documentation with compound learning from each cycle. Use during long-running autonomous tasks where insights accumulate over multiple iterations.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
model: sonnet
hooks:
  - PostToolUse
---

# Loop Learner Skill

Autonomous learning capture for iteration loops. This skill extracts and documents insights as they emerge during Ralph-style loops, creating compound knowledge that builds with each cycle.

## When This Skill Is Invoked

This skill activates automatically when:
1. An autonomous loop is running (like `/ralph-learn-loop`)
2. The loop reaches a learning checkpoint (every N iterations)
3. There's sufficient conversation history to extract meaningful insights

## What This Skill Does

### Learning Extraction

Analyzes the conversation since the last learning capture and extracts:

#### Approaches Tried
- What solutions were attempted
- What variations or alternatives were explored
- What strategies evolved over iterations

#### Failures and Blockers
- What didn't work and why
- Error messages and their causes
- Dead ends encountered

#### Successes and Breakthroughs
- What solutions finally worked
- What patterns proved effective
- What approaches scaled

#### Code Patterns Discovered
- Reusable code structures
- Integration patterns
- Configuration approaches

#### Gotchas and Edge Cases
- Surprising behaviors
- Platform-specific issues
- Documentation gaps

### Documentation Update

Updates project documentation following the `/learn` command logic:
1. Analyzes existing documentation structure
2. Determines appropriate placement for learnings
3. Creates or updates documentation files
4. Maintains progressive disclosure (overview + details)

## Learning Categories

### By Task Type

**Refactors/Migrations:**
```markdown
## Migration Patterns

### Approach: Incremental Migration
- Migrate module by module rather than big bang
- Run old and new tests in parallel during transition
- Use feature flags to control rollout

### Files Requiring Special Handling
- `src/utils/formatters.ts` - Custom Jest mocks needed manual conversion
- `__tests__/integration/*` - Timeout adjustments required for Vitest

### Configuration Changes
- Added `vitest.config.ts` with `testTimeout: 10000`
- Configured `coverage.provider: 'v8'` for compatibility
```

**Feature Implementation:**
```markdown
## Implementation Decisions

### Authentication Flow
- Chose JWT over sessions for API-first architecture
- Implemented refresh token rotation for security
- Used short-lived access tokens (15min) + long-lived refresh tokens (7 days)

### Integration Points
- Auth middleware injected at router level
- Token validation happens before controller execution
- User context attached to request object

### Edge Cases Handled
- Token expiration during request - automatic retry with refresh token
- Concurrent token refresh - token versioning prevents reuse
- Blacklisted tokens - Redis-based blacklist with TTL
```

**Bug Fixes:**
```markdown
## Root Cause Analysis

### Issue: Intermittent test failures
**Cause:** Race condition in async test cleanup
**Discovery Process:** Added logging, observed pattern of failures
**Solution:** Explicit await on cleanup promises

### Diagnostic Approaches Tried
- Added debug logging - revealed timing issues
- Isolated test suite - confirmed no cross-test pollution
- Reproduced locally - confirmed environment independence

### Prevention Strategy
- Always use explicit cleanup in test `afterEach`
- Avoid relying on garbage collection
- Add timeout to failing tests to expose timing issues
```

**Greenfield Projects:**
```markdown
## Architecture Decisions

### Project Structure
- Chose monorepo with npm workspaces for multi-package management
- Separated `packages/api`, `packages/web`, `packages/shared`
- Enables code sharing and independent deployments

### Technology Choices
- **Framework:** Next.js - SSR + API routes in one package
- **Styling:** Tailwind CSS - rapid UI development
- **State:** Zustand - simple, TypeScript-first state management

### Initial Patterns Established
- API routes follow `/api/v1/{resource}` pattern
- All async functions use Result type for error handling
- Components use `defineComponent` for type inference
```

## Documentation Structure

### For Projects With `.llm/` Directory

Creates topic-specific files:
- `.llm/workflows.md` - Processes and procedures
- `.llm/patterns.md` - Code and architecture patterns
- `.llm/deployment.md` - Deployment and operations
- `.llm/troubleshooting.md` - Common issues and solutions

### For Projects Without `.llm/`

Follows existing conventions:
- Adds to `CLAUDE.md` if it exists and is structured
- Creates appropriate `.llm/` files if CLAUDE.md references them
- Asks user for placement if structure is unclear

## Quality Indicators

Good learning capture includes:
- **Specific examples** - file paths, function names, error messages
- **Contextual rationale** - why certain approaches worked
- **Reusable patterns** - generalizable from specific instances
- **Progressive disclosure** - overview first, details in references

Poor learning capture:
- Vague generalizations without specifics
- Duplicate information already documented
- One-off solutions without broader applicability
- Purely descriptive content without actionable guidance

## Integration with Loop Command

The `/ralph-learn-loop` command invokes this skill at checkpoints:

```
Iteration 1: Execute → Verify → Continue
Iteration 2: Execute → Verify → Continue
Iteration 3: Execute → Verify → Continue
Iteration 4: Execute → Verify → Continue
Iteration 5: Execute → Verify → **[LOOP LEARNER ACTIVATES]** → Capture learnings → Continue
Iteration 6: Execute → Verify → Continue
...
```

## Best Practices

### During Active Loops

1. **Be specific**: Capture exact error messages, file paths, function names
2. **Explain why**: Not just what worked, but why it worked
3. **Document failures**: Failed attempts are as valuable as successes
4. **Track evolution**: How understanding changed over iterations

### For Documentation

1. **Follow structure**: Match existing documentation patterns
2. **Use categories**: Group related learnings together
3. **Add references**: Link to related documentation
4. **Maintain chronology**: Most recent learnings first

### For Quality

1. **Review before commit**: Check captured learnings for accuracy
2. **Remove duplicates**: Don't document what already exists
3. **Generalize appropriately**: Extract reusable patterns from specifics
4. **Preserve context**: Keep enough detail for future understanding

## Examples

### Example 1: Migration Learning Capture

```
[After iteration 5 of test migration]

**Learning Capture: Migration Progress**

**Approaches Tried:**
1. Direct file-by-file conversion - resulted in 47 failing tests
2. Incremental conversion with parallel test runs - reduced to 12 failures
3. Shim layer for gradual migration - current approach

**Current Status:**
- 65/100 test files migrated
- Coverage maintained at 87%
- 3 files requiring manual intervention identified

**Patterns Discovered:**
- Jest mocks using `jest.mock()` need direct Vitest replacement
- Tests using `jest.useFakeTimers()` require `vi.useFakeTimers()`
- Snapshot tests need path resolution fix for `__snapshots__` location

**Documented In:** `.llm/jest-to-vitest-migration.md`
```

### Example 2: Feature Learning Capture

```
[After iteration 8 of auth implementation]

**Learning Capture: Implementation Insights**

**Successes:**
- JWT middleware pattern working reliably
- Token refresh flow handles edge cases
- Integration tests passing consistently

**Failures and Fixes:**
- Cookie storage failed due to SameSite restrictions → switched to localStorage
- Token validation timing issues → added cache layer with 5min TTL
- Concurrent refresh requests → implemented deduplication with request key

**Design Decisions:**
- Access token lifetime: 15min (security vs UX balance)
- Refresh token rotation: prevents token reuse attacks
- Token blacklist: Redis-based with automatic expiration

**Documented In:** `.llm/authentication-implementation.md`
```

## Limitations

This skill is designed for autonomous loops and may not be ideal for:
- **Manual workflows** - use `/learn` command instead
- **Single-shot tasks** - insufficient iteration history
- **Highly exploratory work** - too much noise, not enough signal
- **Rapid prototyping** - patterns may not solidify enough

## Related Skills and Commands

- `/learn` - Manual learning capture with conversation analysis
- `documentation-learner` - Plugin for learning extraction and documentation
- `/ralph-learn-loop` - Command that uses this skill automatically

## Version History

- **v1.0.0**: Initial release
  - Learning extraction from loop conversations
  - Category-based documentation organization
  - Project-aware structure detection
  - Quality indicators and best practices
