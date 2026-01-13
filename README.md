# Andrena Claude Marketplace

> A curated collection of high-quality plugins, agents, skills, and tools for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude-Code-blue)](https://claude.com/claude-code)

## Quick Start

Add this marketplace to Claude Code and install plugins:

```bash
/plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
/plugin list
```

## 📦 Available Plugins

### 🔍 [Gemini Web Search Agent](./plugins/gemini-web-search-agent/)
**Type**: Agent | **Category**: Search & Research

Use specialized web searches and retrieve current information using the Gemini CLI.

```bash
/plugin install gemini-web-search-agent@claude-marketplace
```

### 🛠️ [Skill & Command Creator](./plugins/skill-command-creator/)
**Type**: Plugin with Skills | **Category**: Productivity & Development

Create comprehensive Agent Skills and custom slash commands with templates, validation, and best practices.

```bash
/plugin install skill-command-creator@claude-marketplace
```

### 📊 [SlideGen](./plugins/slidegen/)
**Type**: Complete Plugin Suite | **Category**: Productivity & Presentations

AI-powered presentation creation system with specialized agents, customizable templates, and workflow automation. Supports Marp and Slidev.

```bash
/plugin install slidegen@claude-marketplace
```

### ⚡ [Parallel Subagent](./plugins/parallel-subagent-plugin/)
**Type**: Plugin with Agent | **Category**: Productivity & Automation

Parallel execution specialist for background tasks that can run independently of the main conversation thread without blocking workflow.

```bash
/plugin install parallel-subagent@claude-marketplace
```

### 💻 [Coding Aider](./plugins/coding-aider/)
**Type**: Plugin with Skill | **Category**: Development & Planning

Generate structured coding-aider plans that mirror the IntelliJ coding-aider plugin's plan system, complete with overview, goals, implementation checklist, and file context management.

```bash
/plugin install coding-aider@claude-marketplace
```

### 🚀 [PRD Parallel Execution](./plugins/prd-parallel-execution/)
**Type**: Plugin with Skill & Command | **Category**: Development & Automation

Convert PRDs into contract-first, parallel implementation plans and execute them with automated subagent orchestration.

```bash
/plugin install prd-parallel-execution@claude-marketplace
```

### 🎓 [Documentation Learner](./plugins/documentation-learner/)
**Type**: Plugin with Command | **Category**: Productivity

Extract key learnings from conversations and automatically update project documentation. Includes `--analyze-docs` mode for analyzing documentation structure.

```bash
/plugin install documentation-learner@claude-marketplace
```

### 🎲 [Ralph Learning Loop](./plugins/ralph-learning-loop/)
**Type**: Plugin with Skill, Command & Hooks | **Category**: Productivity

Autonomous iteration loop with automatic learning capture. Combines persistent iteration with knowledge capture.

```bash
/plugin install ralph-learning-loop@claude-marketplace
```

### 🛡️ [Adversarial Checkpoint](./plugins/adversarial-checkpoint-plugin/)
**Type**: Plugin with Agent, Skill, Command & Hooks | **Category**: Development

Adversarial checkpoint validation system with resumable challenger agent for quality assurance.

```bash
/plugin install adversarial-checkpoint-plugin@claude-marketplace
```

## Documentation

- **[Plugins Guide](./docs/plugins.md)** - Plugin creation and usage
- **[Skills Guide](./docs/skills.md)** - Agent Skills authoring
- **[Slash Commands](./docs/slash-commands.md)** - Custom command creation
- **[Hooks Guide](./docs/hooks-guide.md)** - Event hooks and automation
- **[MCP](./docs/mcp.md)** - MCP server integration

## Contributing

We welcome high-quality plugins that enhance the Claude Code experience.

**Requirements**: Well-documented, tested, compatible with current Claude Code version.

**Process**: Fork, add to `plugins/`, update `.claude-plugin/marketplace.json`, submit PR.

## License

MIT License. Individual plugins may have their own licenses.

## Links

- **Repository**: https://github.com/andrena-objects-ag/andrena-claude-marketplace
- **Issues**: https://github.com/andrena-objects-ag/andrena-claude-marketplace/issues

---

**Marketplace Version**: 1.0.2 | **Plugins**: 10

