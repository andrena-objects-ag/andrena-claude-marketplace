---
name: stop-hook-builder
description: Analyzes your project to suggest and configure Stop hooks for common workflows. Detects build tools, linters, and testing frameworks. Auto-applies safe defaults (compile, lint) and interactively suggests test strategies based on project setup. Supports Node.js, Python, Rust, Go, and other ecosystems.
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

3. **Interactive Configuration** - For tests and slower operations:
   - Shows detected test setup
   - Asquires which test types to run on stop
   - Explains tradeoffs (speed vs. coverage)

## Usage

```
/stop-hook-builder
```

The skill will:
1. Analyze your project structure
2. Display detected tools and commands
3. Apply fast hooks automatically (compile, lint)
4. Ask about test strategy preferences
5. Generate or update your Stop hook configuration

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
