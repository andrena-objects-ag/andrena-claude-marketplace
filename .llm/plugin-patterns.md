# Plugin Architecture Patterns

**Documented:** January 20, 2026
**Learned from:** Development of code-review and stop-hook-builder plugins

This document captures architectural patterns and design decisions for Claude Code plugin development, complementing the best practices guide.

---

## Table of Contents

1. [Externalized Prompts Pattern](#externalized-prompts-pattern)
2. [Extensible Guidelines Pattern](#extensible-guidelines-pattern)
3. [Stop Hook Automation Patterns](#stop-hook-automation-patterns)
4. [Subagent vs In-Context Decision Pattern](#subagent-vs-in-context-decision-pattern)
5. [Plugin Version Management Workflow](#plugin-version-management-workflow)

---

## Externalized Prompts Pattern

### Problem

When both a Skill and an Agent need to share the same core prompt/guidelines, duplicating the content creates maintenance issues and inconsistency risks.

### Solution

Externalize the shared prompt into a separate file that both components reference.

### Structure

```
plugin-name/
├── prompts/
│   └── shared-prompt.md          # Shared guidelines
├── agents/
│   └── agent.md                  # References prompts/shared-prompt.md
├── skills/
│   └── skill/
│       └── SKILL.md              # References prompts/shared-prompt.md
```

### Implementation

**1. Create the shared prompt file:**

```markdown
# Shared Guidelines

{{CUSTOM_EXTENSIONS}}

## Core Principles

1. Principle one
2. Principle two
3. Principle three
```

**2. Reference from Agent:**

```markdown
# Agent Description

This agent uses the shared guidelines from `prompts/shared-prompt.md`.

To load and apply:
```bash
source "${CLAUDE_PLUGIN_ROOT}/scripts/load-guidelines.sh"
echo "$REVIEW_GUIDELINES"
```
```

**3. Reference from Skill:**

```yaml
---
name: my-skill
description: Uses shared guidelines from prompts/shared-prompt.md with optional custom extensions
---
```

### Benefits

- **Single source of truth** - Update once, applies everywhere
- **Easier maintenance** - No need to sync multiple files
- **Testability** - Can test prompt independently
- **Reusability** - Other plugins can reference the same prompt

### When to Use

- Multiple components (Skill + Agent) need identical core behavior
- Prompt is substantial (>50 lines)
- Prompt may need regular updates
- Want to allow user/custom extensions

---

## Extensible Guidelines Pattern

### Problem

Base guidelines provide general direction, but projects need to add their own rules and conventions without modifying plugin files.

### Solution

Use a placeholder system with project-local custom guideline files that merge into the base prompt.

### Structure

```
project-root/
├── .claude/
│   └── code-review/              # Plugin-specific namespace
│       └── custom-guidelines.d/  # Drop-in directory
│           ├── 01-typescript.md
│           ├── 02-project-rules.md
│           └── 03-forbidden-patterns.md
```

### Implementation

**1. Base prompt with placeholder:**

```markdown
# Base Guidelines

{{CUSTOM_GUIDELINES}}

## Core Principles

- Principle 1
- Principle 2
```

**2. Loader script (bash):**

```bash
#!/bin/bash
# scripts/load-guidelines.sh

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"
CUSTOM_DIR="${CLAUDE_PROJECT_DIR}/.claude/code-review/custom-guidelines.d"

# Read base guidelines
BASE_GUIDELINES=$(cat "${PLUGIN_ROOT}/prompts/review-prompt.md")

# Collect custom guidelines
CUSTOM_CONTENT=""
if [ -d "$CUSTOM_DIR" ]; then
    for file in "$CUSTOM_DIR"/*.md; do
        filename=$(basename "$file")
        CUSTOM_CONTENT+="
## Custom: ${filename%.md}

$(cat "$file")

"
    done
fi

# Replace placeholder
REVIEW_GUIDELINES="${BASE_GUIDELINES//\{\{CUSTOM_GUIDELINES\}\}/$CUSTOM_CONTENT}"
export REVIEW_GUIDELINES
```

**3. Numbered prefixes for ordering:**

```
01-typescript.md       # Processed first
02-project-rules.md    # Processed second
03-forbidden-patterns.md # Processed third
```

### Example Custom Guideline

```markdown
# TypeScript Security Rules

When reviewing TypeScript code, also check for:

- **any types**: Flag usage of `any` - suggest proper types
- **type assertions**: Look for unsafe `as` casts
- **non-null assertions**: Flag `!` operator usage
```

### Best Practices

- Use numbered prefixes for predictable ordering (01-, 02-, etc.)
- Keep custom guidelines focused on project-specific concerns
- Document the custom directory in plugin README
- Provide example custom guidelines in `examples/` directory

### When to Use

- Plugin needs to work across different projects
- Projects have different conventions/standards
- Want to allow customization without forking plugin
- Guidelines may vary by team/organization

---

## Stop Hook Automation Patterns

### Problem

Developers want automatic quality checks (compile, lint, tests) to run before Claude stops, but:
- Different projects have different tools
- Test suites vary widely in execution time
- E2E tests too slow for every stop

### Solution

Intelligent Stop hook builder that:
1. Detects project tools automatically
2. Categorizes commands by speed
3. Auto-applies fast checks (compile, lint)
4. Interactively suggests test strategies

### Speed Categories

| Category | Time | Behavior | Examples |
|----------|------|----------|----------|
| **Fast** | < 5s | Auto-applied | tsc, eslint, ruff, clippy |
| **Medium** | 5-60s | User choice | Unit tests (npm test, pytest) |
| **Slow** | > 60s | Opt-in w/ warning | E2e tests, integration tests |

### Detection Patterns

**Node.js:**
```bash
# Build tools
if [ -f "tsconfig.json" ]; then
    FAST_CHECKS+=("tsc --noEmit")
fi

# Linters
if grep -q "eslint" package.json; then
    FAST_CHECKS+=("npm run lint")
fi

# Test detection
if grep -q "\"test\":" package.json; then
    # Check for test patterns
    if [ -d "tests/unit" ]; then
        MEDIUM_CHECKS+=("npm test -- tests/unit")
    fi
fi
```

**Python:**
```bash
# Detect project type
if [ -f "pyproject.toml" ]; then
    FAST_CHECKS+=("ruff check .")
    FAST_CHECKS+=("mypy .")
fi

# Test detection
if [ -d "tests/unit" ]; then
    MEDIUM_CHECKS+=("pytest tests/unit")
fi
```

**Rust:**
```bash
FAST_CHECKS+=("cargo clippy")
MEDIUM_CHECKS+=("cargo test")
```

### Generated Hook Script Template

```bash
#!/bin/bash
# .claude/hooks/stop/quality-check.sh

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

run_check() {
    local name="$1"
    local command="$2"
    echo -e "${YELLOW}Running: $name${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✓ $name passed${NC}"
    else
        echo -e "${RED}✗ $name failed${NC}"
        exit 2  # Block stopping
    fi
}

cd "$CLAUDE_PROJECT_DIR" || exit 1

# Fast checks - run every time
{{FAST_CHECKS}}

# Medium checks - if enabled
{{MEDIUM_CHECKS}}

# Slow checks - if explicitly enabled
{{SLOW_CHECKS}}

echo -e "${GREEN}All checks passed!${NC}"
exit 0
```

### Interactive Test Configuration

When tests are detected, ask the user:

```
Detected test setup:
- Unit tests (npm test) - ~30 seconds
- Integration tests (npm run test:integration) - ~2 minutes
- E2E tests (npm run test:e2e) - ~5 minutes

Include in Stop hook?
1. Unit tests only (recommended)
2. Unit + Integration
3. All tests (will be slow on every stop)
4. Skip tests for now
```

### Best Practices

- Always check `stop_hook_active` flag to prevent infinite loops
- Use exit code 2 to block stopping (continue work)
- Provide clear, colored output for user feedback
- Run fast checks first for quick feedback
- Stop on first failure (don't waste time)

### When to Use

- Quality gates needed before work is "done"
- Team wants consistent code quality
- Automated checks available (compile, lint, test)
- Want to catch issues early in development cycle

---

## Subagent vs In-Context Decision Pattern

### Problem

When should a Skill use a forked subagent vs. operating in the current conversation context?

### Decision Matrix

| Factor | Use Subagent (fork) | Use In-Context |
|--------|---------------------|----------------|
| **Context pollution** | High (lots of files read) | Low (minimal exploration) |
| **Isolation needed** | Yes (consistent output) | No (benefit from history) |
| **Complexity** | Multi-step, extensive | Simple, focused |
| **Previous context** | Not needed | Helpful/required |
| **Performance** | Needs full context window | Lightweight operation |

### Implementation

**Subagent (forked) - Default:**

```yaml
---
name: code-review
description: Review code for bugs, security, and best practices
agent: ./agents/code-reviewer.md
context: fork
---
```

**In-context (optional):**

```
User: /code-review --in-context
Review the payment module we've been discussing
```

### Best Practice: Default to Fork

For most operations like code review, use `context: fork` by default:

- **Consistency**: Same inputs produce same outputs
- **Isolation**: No contamination from previous discussion
- **Clean context**: Agent sees only what's relevant

Offer in-context as an opt-in flag when:
- Previous discussion is highly relevant
- User explicitly wants contextual awareness
- Operation is lightweight

### Example: Code Review Skill

**Default behavior (forked):**
```
/code-review
Review src/auth/login.ts
```
→ Creates fresh agent with no prior context

**Opt-in (in-context):**
```
/code-review --in-context
Review the auth changes we discussed earlier
```
→ Runs in current conversation with full history

---

## Plugin Version Management Workflow

### The Problem

When updating plugins, forgetting to bump versions causes:
- Confusion about which version is installed
- Marketplace showing wrong version
- Difficulty tracking changes

### The Solution

Always follow this workflow when making ANY plugin change:

### Step 1: Two-File Version Bump

**Update plugin.json:**
```json
{
  "name": "my-plugin",
  "version": "1.0.1"  // Bumped from 1.0.0
}
```

**Update marketplace.json:**
```json
{
  "plugins": [
    {
      "name": "my-plugin",
      "version": "1.0.1"  // Bumped from 1.0.0
    }
  ]
}
```

### Step 2: Semantic Versioning Rules

| Change Type | Bump | Example |
|-------------|------|---------|
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| New feature | MINOR | 1.0.1 → 1.1.0 |
| Breaking change | MAJOR | 1.1.0 → 2.0.0 |

### Step 3: Commit Message Format

```
[Descriptive message] (vX.X.X)

Examples:
- Fix hooks.json structure (v1.0.1)
- Add custom guidelines support (v1.1.0)
- Rename plugin to code-review (v2.0.0)
```

### Step 4: Update Documentation

- Update README.md with new version
- Add entry to CHANGELOG.md (if present)
- Document breaking changes clearly

### Automation Checklist

Before committing:
- [ ] Updated `plugins/[name]/plugin.json`
- [ ] Updated `.claude-plugin/marketplace.json`
- [ ] Commit message includes version
- [ ] README.md updated (if needed)
- [ ] CHANGELOG.md updated (if present)

### Common Mistakes

1. **Only updating one file** → Both plugin.json AND marketplace.json must match
2. **Forgetting commit message** → Include version in commit for traceability
3. **Wrong version bump type** → Follow semver strictly
4. **Not documenting changes** → Users need to know what changed

---

## Example: Code Review Plugin Architecture

Combines multiple patterns from this document:

```
code-review/
├── prompts/
│   └── review-prompt.md          # Externalized shared prompt
│                                  # with {{CUSTOM_GUIDELINES}} placeholder
├── agents/
│   └── code-reviewer.md          # References shared prompt
├── skills/
│   └── code-review/
│       └── SKILL.md              # Uses agent + fork by default
├── scripts/
│   └── load-guidelines.sh        # Merges custom guidelines
├── examples/
│   └── custom-guidelines.d/      # Example custom guidelines
│       ├── 01-typescript.md
│       └── 02-project-specific.md
└── plugin.json                   # Version 1.0.0
```

**Patterns used:**
1. Externalized Prompts - Shared review-prompt.md
2. Extensible Guidelines - {{CUSTOM_GUIDELINES}} + .claude/code-review/custom-guidelines.d/
3. Subagent Default - context: fork for isolated reviews
4. Version Management - Both files updated, version in commit

---

## Related Documentation

- [.llm/best-practices/claude-code-plugins.md](./best-practices/claude-code-plugins.md) - Comprehensive best practices
- [docs/plugins.md](../docs/plugins.md) - Plugin system reference
- [docs/hooks.md](../docs/hooks.md) - Hooks implementation guide

---

**Last Updated:** January 20, 2026
**Applies to:** Claude Code Plugin Development
