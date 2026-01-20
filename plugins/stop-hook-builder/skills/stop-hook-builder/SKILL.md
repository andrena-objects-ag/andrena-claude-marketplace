---
name: stop-hook-builder
description: Analyzes your project to suggest and configure Stop hooks for common workflows. Detects build tools, linters, and testing frameworks. Auto-applies safe defaults (compile, lint) and interactively suggests test strategies based on project setup. Validates generated hooks by running each command before applying. Supports Node.js, Python, Rust, Go, and other ecosystems.
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

3. **Validation** - **Tests each detected command before including it:**
   - Runs the command to verify it works
   - Measures actual execution time
   - Checks exit codes and error output
   - Only includes commands that succeed
   - Warns about commands that are slower than expected

4. **Interactive Configuration** - For tests and slower operations:
   - Shows detected test setup with validation results
   - Displays actual measured execution times
   - Asks which test types to run on stop
   - Explains tradeoffs (speed vs. coverage)

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
6. Generate or update your Stop hook configuration

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

## Hook Configuration

Generated hooks use a structured script approach:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/stop/quality-check.sh"
          }
        ]
      }
    ]
  }
}
```

The script handles:
- Running checks in order (fast to slow)
- Stopping on first failure
- Clear error reporting
- Optional verbose mode

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
