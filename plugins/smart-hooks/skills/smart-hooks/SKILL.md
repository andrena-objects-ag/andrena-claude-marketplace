---
name: smart-hooks
description: "Analyzes your project stack (language, framework, tools) and auto-generates a JSON config for quality hooks (linting, formatting, testing). Covers Node.js, Python, Rust, Go, Java, and C# ecosystems. Run /smart-hooks to detect and configure, or invoke model-driven when a project needs quality hook setup."
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
---

# Smart Hooks – Auto-Configuration Skill

You are a project quality configuration specialist. Your job is to analyze a project, detect its tech stack and quality tools, validate each tool, and generate a `smart-hooks-config.json` file.

## Workflow

### Step 1: Detect Project Ecosystem

Scan the project root for indicator files. Map them to ecosystems:

| Indicator Files | Ecosystem |
|---|---|
| `package.json` | Node.js |
| `pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `Pipfile` | Python |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `pom.xml`, `build.gradle`, `build.gradle.kts` | Java |
| `*.sln`, `*.csproj` | C# / .NET |

A project may have **multiple ecosystems** (e.g., a Node.js frontend + Python backend). Detect all of them.

### Step 2: Detect Quality Tools

For **each** detected ecosystem, look for specific tool signals. Use `reference.md` for the complete detection rules — here is a summary:

**Node.js**: ESLint (`eslint.config.*`, `.eslintrc.*`), Prettier (`.prettierrc*`, `package.json` prettier key), TypeScript (`tsconfig.json`), Jest/Vitest/Mocha (config files + package.json deps), Playwright (`playwright.config.*`), Cypress (`cypress.config.*`)

**Python**: ruff (`ruff.toml`, `pyproject.toml [tool.ruff]`), black (`pyproject.toml [tool.black]`), isort (`pyproject.toml [tool.isort]`), mypy (`mypy.ini`, `pyproject.toml [tool.mypy]`), pytest (`pytest.ini`, `conftest.py`, `pyproject.toml [tool.pytest]`), unittest (built-in)

**Rust**: clippy (built-in), rustfmt (`rustfmt.toml`), cargo test (built-in)

**Go**: go vet (built-in), gofmt (built-in), staticcheck, golangci-lint, go test (built-in)

**Java**: checkstyle (`checkstyle.xml`), PMD, SpotBugs, Maven/Gradle test (built-in), ArchUnit (dependency in pom.xml/build.gradle)

**C#**: dotnet format, dotnet build, dotnet test, StyleCop, Roslyn analyzers

### Step 3: Validate Detected Tools

For each detected tool, verify it actually works:

1. Run the command with `--help`, `--version`, or a dry-run flag
2. Measure approximate execution time
3. If a tool fails validation, note it but skip it in the config (mark as disabled)

### Step 4: Generate Config

Create `.claude/hooks/smart-hooks-config.json` in the project root. Use this schema:

```json
{
  "version": "1.0.0",
  "hooks": {
    "PostToolUse": [],
    "Stop": []
  }
}
```

**PostToolUse checks** (run after each file edit):
- Auto-fix linters (ESLint --fix, ruff --fix, etc.) → `blocking: false`
- Formatters (Prettier, black, gofmt, rustfmt) → `blocking: false`
- Set appropriate `filePatterns` for each check

**Stop checks** (run when Claude stops):
- Full lint → `blocking: true` (fast tools) or `blocking: false` (slow tools)
- Type checking → `blocking: false` (often slow)
- Unit tests → `blocking: true`
- Integration/E2E tests → `blocking: false` (too slow to block)
- Build/compile → `blocking: true`

Set `timeout` based on measured execution time × 2 (with a minimum of 10s and max of 120s).

### Step 5: Verify End-to-End

After generating the config, run the smart-hooks runner manually to verify it works:

```bash
echo '{"tool_name":"Write","tool_input":{"file_path":"test.txt"}}' | node "${CLAUDE_PLUGIN_ROOT}/scripts/smart-hooks-runner.js" PostToolUse
```

```bash
echo '{}' | node "${CLAUDE_PLUGIN_ROOT}/scripts/smart-hooks-runner.js" Stop
```

Both should exit 0. If not, debug and fix the config.

## Important Rules

- **Never overwrite** an existing `smart-hooks-config.json` without user consent
- **Always validate** commands before adding them to the config
- **Use conservative timeouts** — better too long than too short
- **Prefer non-blocking** for PostToolUse (these run on every edit)
- **Prefer blocking** for Stop (these are the final quality gate)
- **Include comments in README** about how to customize the config
