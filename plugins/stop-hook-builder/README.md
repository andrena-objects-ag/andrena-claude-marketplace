# Stop Hook Builder

Automatically configure intelligent Stop hooks for your project based on detected tools and workflows.

## Features

- **Project Analysis** - Detects build tools, linters, and testing frameworks
- **Command Validation** - Tests each detected command before including it
- **Execution Time Measurement** - Measures actual speed, adjusts categories accordingly
- **Smart Categorization** - Separates commands by measured speed (fast/medium/slow)
- **Auto-Apply Safe Defaults** - Compile and lint hooks added automatically
- **Interactive Test Configuration** - Choose which test types to run on stop
- **End-to-End Hook Testing** - **Executes generated hook to verify it works before declaring success**
- **Multi-Language Support** - Node.js, Python, Rust, Go, and more

## How It Works

### 1. Analysis

The skill scans your project for:
- **Build tools**: webpack, vite, tsc, cargo build, go build, maven, gradle
- **Linters**: eslint, pylint, ruff, clippy, gofmt, golangci-lint
- **Test frameworks**: jest, pytest, cargo test, go test, playwright, cypress
- **Package managers**: npm, yarn, pnpm, pip, poetry, cargo, go modules

### 2. Categorization

Detected commands are categorized by execution time:

| Category | Typical Time | Behavior |
|----------|--------------|----------|
| **Fast** | < 5 seconds | Auto-applied (compile, lint) |
| **Medium** | 5-60 seconds | Suggested with opt-in (unit tests) |
| **Slow** | > 60 seconds | Opt-in with warning (e2e, integration) |

### 3. Validation

Before applying any hook, each command is validated:

1. **Execution Test** - Run command, check exit code
2. **Time Measurement** - Measure actual execution time
3. **Error Analysis** - Check for setup issues (missing deps, config errors)

Commands that fail validation are excluded with explanations.

**Example validation output:**
```
Testing detected commands...

✓ tsc --noEmit
  Exit: 0, Time: 2.3s → Fast ✓

✓ npm run lint
  Exit: 0, Time: 4.1s → Fast ✓

⚠ npm test
  Exit: 1, Time: 8.2s
  Issues: 2 failing tests
  Status: SKIPPED (fix tests first)
```

| Category | Typical Time | Behavior |
|----------|--------------|----------|
| **Fast** | < 5 seconds | Auto-applied (compile, lint) |
| **Medium** | 5-60 seconds | Suggested with opt-in (unit tests) |
| **Slow** | > 60 seconds | Opt-in with warning (e2e, integration) |

### 3. Configuration

The skill generates a structured hook script at `.claude/hooks/stop/quality-check.sh` that:
- Runs checks in order (fast → slow)
- Stops at first failure
- Provides colored, clear output
- Can be customized after generation

## Usage

```
/stop-hook-builder
```

The skill will:
1. Analyze your project structure
2. Display detected tools and commands
3. Apply fast hooks automatically
4. Ask about test strategy preferences
5. Generate the Stop hook configuration

## Examples

### Node.js + TypeScript Project

Detected:
- `tsc --noEmit` (Fast) ✓ Auto-applied
- `eslint .` (Fast) ✓ Auto-applied
- `npm test` (Medium) ? Ask user
- `npm run test:e2e` (Slow) ⚠️ Opt-in with warning

### Python Project

Detected:
- `ruff check .` (Fast) ✓ Auto-applied
- `mypy .` (Fast) ✓ Auto-applied
- `pytest tests/unit` (Medium) ? Ask user
- `pytest tests/integration` (Slow) ⚠️ Opt-in with warning

## Generated Hook

```bash
#!/bin/bash
# .claude/hooks/stop/quality-check.sh

# Fast checks
run_check "TypeScript compile" "tsc --noEmit"
run_check "ESLint" "eslint ."

# Medium checks (if enabled)
run_check "Unit tests" "npm test -- --testPathPattern=unit"

# Slow checks (if explicitly enabled)
run_check "E2E tests" "npm run test:e2e"
```

## Critical: End-to-End Hook Testing

**Before declaring the hook "created", the skill executes the generated hook to verify it works:**

```bash
# Test the generated hook
bash .claude/hooks/stop/quality-check.sh
```

**Success output:**
```
Running: TypeScript compile
✓ TypeScript compile passed

Running: ESLint
✓ ESLint passed

All quality checks passed!
```

**If hook fails, the skill:**
1. Analyzes the error
2. Fixes the hook script or command
3. Re-executes until all checks pass
4. Only then reports success to user

This ensures hooks are actually working, not just created.

## Customization

After generation, you can:
- Edit the hook script directly
- Add custom checks
- Adjust timeout values
- Modify the settings.json hooks entry

## Test Strategy Guidance

The skill helps you decide:

### Unit Tests
- **Speed**: Fast (5-30s)
- **Recommendation**: Include for most projects
- **When to skip**: Very large test suites (>5 min)

### Integration Tests
- **Speed**: Medium (30s-2min)
- **Recommendation**: Include if fast enough
- **When to skip**: Slow external dependencies

### E2E Tests
- **Speed**: Slow (2-10min)
- **Recommendation**: Opt-in only
- **Use case**: Pre-commit or manual, not on every stop

## Version

1.0.0
