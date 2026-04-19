# Smart Hooks Reference

## Config Schema

The config file lives at `.claude/hooks/smart-hooks-config.json` in the project root.

```json
{
  "version": "1.0.0",
  "hooks": {
    "PostToolUse": [
      {
        "name": "string — unique check name",
        "command": "string — shell command. Use {file} placeholder for file path",
        "filePatterns": ["glob patterns — *.js, *.ts, src/**/*.py, etc."],
        "timeout": 30,
        "blocking": false,
        "enabled": true
      }
    ],
    "Stop": [
      {
        "name": "string — unique check name",
        "command": "string — shell command. No {file} placeholder",
        "filePatterns": [],
        "timeout": 120,
        "blocking": true,
        "enabled": true
      }
    ]
  }
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `name` | string | Descriptive name for the check (shown in output) |
| `command` | string | Shell command to run. Use `{file}` for PostToolUse file path |
| `filePatterns` | string[] | Glob patterns to match files. Empty = match all. Only used in PostToolUse |
| `timeout` | number | Max seconds before killing the process |
| `blocking` | boolean | If true, a failure blocks the action (exit code 2). If false, just prints a warning |
| `enabled` | boolean | Toggle the check on/off without removing it |

## Ecosystem Detection Details

### Node.js

**Indicator**: `package.json`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| ESLint | `eslint.config.*`, `.eslintrc.*`, `package.json` eslintConfig | `npx eslint --fix "{file}"` | `npx eslint .` |
| Prettier | `.prettierrc*`, `.prettierignore`, `package.json` prettier | `npx prettier --write "{file}"` | `npx prettier --check .` |
| TypeScript | `tsconfig.json` | — | `npx tsc --noEmit` |
| Jest | `jest.config.*`, `package.json` jest | — | `npx jest --passWithNoTests` |
| Vitest | `vitest.config.*`, `vite.config.*` | — | `npx vitest run --passWithNoTests` |
| Mocha | `.mocharc.*`, `package.json` mocha | — | `npx mocha` |
| Playwright | `playwright.config.*` | — | `npx playwright test` |
| Cypress | `cypress.config.*` | — | `npx cypress run` |

**File patterns**: `*.js`, `*.ts`, `*.jsx`, `*.tsx`, `*.mjs`, `*.cjs`

### Python

**Indicator**: `pyproject.toml`, `setup.py`, `setup.cfg`, `requirements.txt`, `Pipfile`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| ruff | `ruff.toml`, `pyproject.toml [tool.ruff]` | `ruff check --fix "{file}"` | `ruff check .` |
| black | `pyproject.toml [tool.black]` | `black "{file}"` | `black --check .` |
| isort | `pyproject.toml [tool.isort]` | `isort "{file}"` | `isort --check-only .` |
| mypy | `mypy.ini`, `pyproject.toml [tool.mypy]` | — | `mypy .` |
| pytest | `pytest.ini`, `conftest.py`, `pyproject.toml [tool.pytest]` | — | `pytest` |
| unittest | (built-in, fallback) | — | `python -m unittest discover` |
| flake8 | `.flake8`, `setup.cfg` flake8, `tox.ini` | — | `flake8 .` |
| pyright | `pyrightconfig.json` | — | `pyright` |

**File patterns**: `*.py`, `*.pyi`

### Rust

**Indicator**: `Cargo.toml`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| rustfmt | `rustfmt.toml`, `.rustfmt.toml` | `rustfmt --edition 2021 "{file}"` | `cargo fmt --check` |
| clippy | (built-in) | — | `cargo clippy -- -D warnings` |
| cargo test | (built-in) | — | `cargo test` |
| cargo build | (built-in) | — | `cargo build` |

**File patterns**: `*.rs`

### Go

**Indicator**: `go.mod`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| gofmt | (built-in) | `gofmt -w "{file}"` | `gofmt -l .` |
| go vet | (built-in) | — | `go vet ./...` |
| staticcheck | (installed) | — | `staticcheck ./...` |
| golangci-lint | `.golangci.yml`, `.golangci.yaml` | — | `golangci-lint run` |
| go test | (built-in) | — | `go test ./...` |
| go build | (built-in) | — | `go build ./...` |

**File patterns**: `*.go`

### Java

**Indicator**: `pom.xml`, `build.gradle`, `build.gradle.kts`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| Maven compile | `pom.xml` | — | `mvn compile -q` |
| Maven test | `pom.xml` | — | `mvn test -q` |
| Gradle compile | `build.gradle(.kts)` | — | `./gradlew compileJava --quiet` |
| Gradle test | `build.gradle(.kts)` | — | `./gradlew test --quiet` |
| checkstyle | `checkstyle.xml`, `pom.xml` checkstyle plugin | — | `mvn checkstyle:check` or `./gradlew checkstyleMain` |
| PMD | `pom.xml` PMD plugin | — | `mvn pmd:check` |
| SpotBugs | `pom.xml` SpotBugs plugin | — | `mvn spotbugs:check` |
| ArchUnit | `pom.xml`/`build.gradle` archunit dependency | — | Tests include ArchUnit (via mvn test/gradlew test) |

**File patterns**: `*.java`

### C# / .NET

**Indicator**: `*.sln`, `*.csproj`

| Tool | Signal Files | PostToolUse Command | Stop Command |
|---|---|---|---|
| dotnet build | `*.csproj` | — | `dotnet build` |
| dotnet test | `*.csproj` | — | `dotnet test` |
| dotnet format | `*.csproj` | `dotnet format --include "{file}"` | `dotnet format --verify-no-changes` |
| StyleCop | `stylecop.json`, `*.ruleset` | — | (via dotnet build warnings) |

**File patterns**: `*.cs`, `*.csx`

## Customization

Users can edit `.claude/hooks/smart-hooks-config.json` to:

- Toggle checks with `enabled: true/false`
- Change `blocking` behavior
- Adjust `timeout` values
- Add custom checks with any shell command
- Modify `filePatterns` to scope checks to specific files
- Add `{file}` placeholder in PostToolUse commands

## Infinite Loop Prevention

Claude Code provides a built-in mechanism: when it re-runs due to a Stop hook, the hook input JSON includes `stop_hook_active: true`. The runner checks this field and exits immediately (exit 0) to prevent infinite loops. No configuration is needed — this works automatically.

## Troubleshooting

- **Config not found**: The runner exits 0 silently when no config exists. Run `/smart-hooks` to generate one.
- **Check timeout**: Increase the `timeout` value in the config.
- **False blocking**: Set `blocking: false` for checks that produce false positives.
- **Command not found**: Ensure the tool is installed and available in PATH. Disable the check with `enabled: false`.
