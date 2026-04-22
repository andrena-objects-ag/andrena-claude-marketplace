# Documentation Learner Plugin

Extract key learnings from conversations and automatically update project documentation with workflows, patterns, and best practices.

## Overview

The Documentation Learner is an Agent Skill that captures and preserves knowledge from your Claude Code conversations. After solving problems, discovering workflows, or identifying patterns, use `/documentation-learner` or simply ask Claude to capture learnings — the skill auto-triggers based on context.

## Installation

```bash
/plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
/plugin install documentation-learner@andrena-marketplace
```

## Features

### Automatic Learning Capture

The skill automatically activates when you ask Claude to capture learnings, document discoveries, or save what was learned. It analyzes the current conversation and extracts actionable learnings, including:

- **Workflows**: How to accomplish tasks (creating PRs, running tests, deploying, debugging)
- **Patterns**: Code patterns, architectural decisions, conventions
- **Tools and Scripts**: Usage of helper scripts, pipeline tools, development utilities
- **Common Pitfalls**: Issues encountered and their resolutions
- **Best Practices**: Techniques that proved effective

### Automation Verification Assessment

For each learning, the skill assesses whether it can be automatically verified:

- **Linter rules**: For syntax patterns, naming conventions, or forbidden constructs
- **PostToolUse hooks**: For file content validation after edits
- **Pre-commit hooks**: For final validation before commit
- **Documentation only**: For soft guidelines that can't be auto-verified

When a learning has automation potential, the skill asks if you'd like to also create a verification approach.

### Documentation Structure Analysis

Ask Claude to analyze your documentation structure and it will identify duplicates, oversized files, content overlap, and modularization opportunities.

### Granular Documentation Destinations

Learnings can be routed to the most appropriate destination:

| Destination | Purpose | Auto-verifiable? |
|-------------|---------|------------------|
| **CLAUDE.md** | Project-wide rules AI should always follow | Yes (linters, hooks) |
| **.claude/rules/\*.md** | Stack or framework-specific conventions | Yes (linters, hooks) |
| **.llm/\*.md** | Detailed how-to guides and workflows | Usually not |
| **TECHNIQUES.md** | Specific technical patterns and solutions | Usually not |
| **PITFALLS.md** | Common errors and their solutions | Sometimes |

## Usage

### Capture Learnings

After a productive conversation where you've discovered new workflows or solved problems:

```
/documentation-learner
```

Or simply say: "Capture what we learned" / "Document this workflow" / "Save these learnings"

Claude will:
1. **Analyze your project structure** to understand existing documentation organization
2. **Review the conversation** for actionable learnings
3. **Assess automation potential** for each learning (linters, hooks, or documentation-only)
4. **Determine placement** — either following existing structure or asking you where to document
5. **Update documentation files** (CLAUDE.md, .claude/rules/, .llm/, TECHNIQUES.md, PITFALLS.md)
6. **Present a summary** of what was captured, where, and any automation opportunities

### Analyze Documentation Structure

```
/documentation-learner --analyze-docs
```

Or say: "Analyze our documentation structure" / "Audit the docs"

Claude will scan all documentation, detect issues (duplicates, large files, content overlap), and recommend improvements.

## Why a Skill Instead of a Command?

As of v2.0.0, this plugin uses an Agent Skill instead of a slash command. Benefits:

- **Auto-triggering**: Claude activates it automatically based on context
- **Richer interaction**: Skills integrate more deeply with Claude's tool use and reasoning
- **User-invocable**: Still available as `/documentation-learner` in the slash menu
- **Model-invoked**: Claude can proactively suggest capturing learnings

## Version History

- **v2.0.0**: Converted from command to Agent Skill
  - Auto-triggers based on conversation context
  - Retains all learning extraction and docs analysis capabilities
  - Available via `/documentation-learner` or natural language
  - Breaking change: `/learn` command removed; use `/documentation-learner` or ask naturally

- **v1.2.0**: Automation verification and granular destinations

- **v1.1.0**: Generic documentation structure support

- **v1.0.0**: Initial release with `/learn` command
