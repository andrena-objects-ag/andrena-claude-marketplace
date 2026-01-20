---
name: stop-hook-builder
description: Analyzes your project to suggest and configure Stop hooks for common workflows. Detects build tools, linters, and testing frameworks. Auto-applies safe defaults (compile, lint) and interactively suggests test strategies based on project setup. **CRITICAL: After generating hooks, executes the hook script end-to-end to verify it works correctly before declaring success.** Supports Node.js, Python, Rust, Go, and other ecosystems.
user-invocable: true
---

# Stop Hook Builder

Automatically configure intelligent Stop hooks for your project based on detected tools and workflows.

## How It Works

1. **Project Analysis** - Scans your project for:
   - Build tools (webpack, vite, tsc, cargo build, go build, etc.)
   - Linters (eslint, pylint, clippy, gofmt, etc.)
   - Testing frameworks and test locations
   - Package managers (npm, yarn, pnpm, pip, cargo, etc.)

2. **Categorization** - Separates detected commands by speed:
   - **Fast** (compile, lint) - Auto-applied, safe for every stop
   - **Medium** (unit tests) - Suggested with option to include
   - **Slow** (integration/e2e) - Offered as opt-in with warnings

3. **Command Validation** - Tests each detected command before including it:
   - Runs the command to verify it works
   - Measures actual execution time
   - Checks exit codes and error output
   - Only includes commands that succeed
   - Warns about commands that are slower than expected

4. **Hook Generation** - Creates the hook script and settings.json entry

5. **End-to-End Test** - **CRITICAL: Executes the generated hook script to verify it works:**
   - Runs the complete hook script with all configured checks
   - Verifies each check passes in order
   - Confirms proper error handling and output
   - Only declares success after hook executes successfully
   - If hook fails, debug and fix before completing

## Usage

```
/stop-hook-builder
```

The skill will:
1. Analyze your project structure
2. Test each detected command and measure execution time
3. Display validated tools with actual timings
4. Apply fast hooks automatically (compile, lint)
5. Ask about test strategy preferences
6. Generate the hook script and configuration
7. **Execute the generated hook end-to-end to verify it works**
8. Report final success only after hook passes execution test

## What Gets Detected

### Node.js Projects
| Tool | Command | Category |
|------|---------|----------|
| TypeScript | `tsc --noEmit` | Fast |
| ESLint | `npm run lint` | Fast |
| Prettier | `npm run format:check` | Fast |
| Jest (unit) | `npm test -- --testPathPattern=unit` | Medium |
| Playwright (e2e) | `npm run test:e2e` | Slow |

### Python Projects
| Tool | Command | Category |
|------|---------|----------|
| mypy | `mypy .` | Fast |
| ruff | `ruff check .` | Fast |
| pytest (unit) | `pytest tests/unit` | Medium |
| pytest (integration) | `pytest tests/integration` | Slow |

### Rust Projects
| Tool | Command | Category |
|------|---------|----------|
| clippy | `cargo clippy` | Fast |
| fmt check | `cargo fmt --check` | Fast |
| unit tests | `cargo test` | Medium |

### Go Projects
| Tool | Command | Category |
|------|---------|----------|
| build | `go build ./...` | Fast |
| vet | `go vet ./...` | Fast |
| tests | `go test ./...` | Medium |

## Validation Process

Before applying any hook, each detected command is validated:

### 1. Command Execution Test

```bash
# Test that command exists and runs
tsc --noEmit
```

**Success criteria:**
- Exit code 0 (command succeeded)
- No critical errors in stderr
- Command completes within timeout

**Failure handling:**
- Command excluded from hook
- User notified with reason
- Alternative suggested if available

### 2. Execution Time Measurement

```bash
# Measure actual execution time
time npm run lint
```

**Results:**
- Actual time measured and displayed
- Category adjusted if measurement differs from expectation
- Example: "Expected: Fast (<5s), Actual: 12s → Medium"

### 3. Error Output Analysis

```bash
# Check for setup issues
npm run lint 2>&1 | grep -i "error\|warning\|missing"
```

**Detected issues:**
- Missing dependencies → Suggest installation
- Configuration errors → Show fix
- Environment issues → Provide setup instructions

### Validation Output Example

```
Testing detected commands...

✓ tsc --noEmit
  Exit: 0, Time: 2.3s
  Category: Fast ✓

✓ npm run lint
  Exit: 0, Time: 4.1s
  Category: Fast ✓

⚠ npm test
  Exit: 1, Time: 8.2s
  Issues: 2 failing tests
  Status: SKIPPED (fix tests before enabling)

✓ npm run test:unit
  Exit: 0, Time: 15.3s
  Category: Medium ✓

Summary: 3 commands validated, 1 skipped (fix required)
```

## End-to-End Hook Testing

**After generating the hook script, it MUST be executed to verify it works correctly:**

### Test Execution

```bash
# Execute the generated hook script
bash .claude/hooks/stop/quality-check.sh
```

**Expected successful output:**
```
Running: TypeScript compile
✓ TypeScript compile passed

Running: ESLint
✓ ESLint passed

Running: Unit tests
✓ Unit tests passed

All quality checks passed!
```

**If any check fails:**
```
Running: TypeScript compile
✗ TypeScript compile failed

Error: src/auth.ts:45:12 - TS2345: Type 'string' is not assignable to type 'number'

[Diagnose the issue, fix the hook script or command, and re-test]
```

### Test Success Criteria

The hook is only considered "created" when:
1. Script file exists and is executable
2. settings.json has correct hook entry
3. **Hook script executes successfully with all checks passing**
4. **Output format is clear and helpful**
5. **Exit code is 0 when all checks pass**

### Test Failure Recovery

If hook execution fails:
1. Analyze the error output
2. Identify the failing check
3. Check if the command needs adjustment (flags, paths, etc.)
4. Fix the hook script
5. Re-execute until all checks pass
6. Only then report success to user

## Test Strategy Options

When tests are detected, the skill asks:

### Unit Tests (Medium)
- **Include in Stop hook?** - Fast enough for most projects
- **Typical time**: 5-30 seconds
- **Recommendation**: Yes, for most projects

### Integration Tests (Medium/Slow)
- **Include in Stop hook?** - Depends on setup
- **Typical time**: 30 seconds - 2 minutes
- **Recommendation**: Ask user based on project size

### E2E Tests (Slow)
- **Include in Stop hook?** - Usually too slow
- **Typical time**: 2-10 minutes
- **Recommendation**: Opt-in only, with clear warning

## Examples

Analyze and configure:
```
/stop-hook-builder
```

Skip tests, only compile/lint:
```
/stop-hook-builder --no-tests
```

Include all tests (warning for slow ones):
```
/stop-hook-builder --all-tests
```

## Implementation Steps for Agent

When this skill is invoked, follow this exact sequence:

1. **Detect** project type and tools
2. **Validate** each command by running it
3. **Generate** hook script with validated commands
4. **Write** hook script to `.claude/hooks/stop/quality-check.sh`
5. **Make executable** with `chmod +x`
6. **Update** `.claude/settings.json` with Stop hook entry
7. **Execute** the hook script: `bash .claude/hooks/stop/quality-check.sh`
8. **Verify** all checks pass and output is correct
9. **Report** success only after step 8 completes successfully
10. **Debug** and re-test if execution fails

**Do NOT declare the hook created until step 8 passes.**
