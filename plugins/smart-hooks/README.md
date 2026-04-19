# Smart Hooks

Auto-configure quality hooks (linting, formatting, testing) for any project. Analyzes your stack, detects tools, validates them, and generates a JSON config — no scripts to maintain.

## What It Does

- **Auto-detection**: Scans your project for language/framework indicators and quality tools
- **Validation**: Runs each detected tool to verify it works before configuring it
- **Config generation**: Creates `.claude/hooks/smart-hooks-config.json` with sensible defaults
- **Generic runner**: A plain Node.js script reads the config at runtime — edit JSON, no scripts to touch

## Supported Ecosystems

| Ecosystem | Lint | Format | Test | Type Check |
|---|---|---|---|---|
| Node.js | ESLint | Prettier | Jest, Vitest, Mocha | TypeScript |
| Python | ruff, flake8 | black, isort | pytest, unittest | mypy, pyright |
| Rust | clippy | rustfmt | cargo test | — |
| Go | go vet, golangci-lint | gofmt | go test | — |
| Java | checkstyle, PMD | — | Maven/Gradle test | — |
| C# | dotnet format | dotnet format | dotnet test | — |

Also detects: Playwright, Cypress, ArchUnit, SpotBugs, staticcheck, and more.

## Installation

```bash
/plugin install smart-hooks@andrena-marketplace
```

## Usage

### Generate Config

```bash
/smart-hooks
```

This analyzes your project, validates tools, and generates `.claude/hooks/smart-hooks-config.json`.

### How Hooks Work

The plugin registers two hook events:

- **PostToolUse** (after file edits): Runs auto-fix linters and formatters on the edited file
- **Stop** (when Claude stops): Runs full lint, type checks, and tests as a quality gate

### Customize

Edit `.claude/hooks/smart-hooks-config.json` to:

- Toggle checks with `enabled: true/false`
- Change `blocking` (whether failures stop the action)
- Adjust `timeout` values
- Add custom shell commands
- Modify `filePatterns` to scope checks

### Example Config

```json
{
  "version": "1.0.0",
  "hooks": {
    "PostToolUse": [
      {
        "name": "eslint-fix",
        "command": "npx eslint --fix \"{file}\"",
        "filePatterns": ["*.js", "*.ts"],
        "timeout": 30,
        "blocking": false,
        "enabled": true
      }
    ],
    "Stop": [
      {
        "name": "unit-tests",
        "command": "npm test",
        "filePatterns": [],
        "timeout": 120,
        "blocking": true,
        "enabled": true
      }
    ]
  }
}
```

## Architecture

```
smart-hooks/
├── hooks/hooks.json              # Plugin hooks (PostToolUse + Stop)
├── scripts/smart-hooks-runner.js # Generic Node.js runner (no deps)
├── skills/smart-hooks/           # Auto-detection skill
│   ├── SKILL.md
│   └── reference.md
└── templates/default-configs/    # Reference defaults per ecosystem
```

The runner reads from `$CLAUDE_PROJECT_DIR/.claude/hooks/smart-hooks-config.json`. If no config exists, it exits silently (no-op).

## Infinite Loop Prevention

Claude Code provides built-in loop prevention: when it re-runs due to a Stop hook, the hook input includes `stop_hook_active: true`. The runner detects this and exits immediately — no infinite loops.

## Version

1.0.0

## License

MIT
