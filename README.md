# Claude Marketplace

> A curated collection of high-quality plugins, agents, skills, and tools for Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude-Code-blue)](https://claude.com/claude-code)

## 🚀 Quick Start

Add this marketplace to Claude Code and install plugins:

```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin list  # See all available plugins
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

## 📋 Plugin Categories

| Category | Plugins | Description |
|----------|---------|-------------|
| 🔍 **Search & Research** | 1 | Web search and information retrieval |
| 🛠️ **Productivity & Development** | 1 | Skill/command creation tools |
| ⚡ **Productivity & Automation** | 1 | Parallel task execution and background processing |
| 📊 **Presentations** | 1 | Presentation creation and automation |
| 📈 **Total** | **4** | **Comprehensive toolkit** |

## 🎯 What Each Plugin Does

### 🔍 Gemini Web Search Agent
- **Perfect for**: Finding current information, web research, documentation lookup
- **Features**: Specialized search queries, real-time information retrieval
- **Use when**: You need up-to-date web information or want to research specific topics

### 🛠️ Skill & Command Creator
- **Perfect for**: Creating reusable Skills and automating frequent tasks
- **Features**:
  - **Skill Creator**: Build Agent Skills with proper structure and validation
  - **Command Creator**: Create custom slash commands with arguments and advanced features
- **Use when**: You want to extend Claude's capabilities or automate workflows

### 📊 SlideGen
- **Perfect for**: Creating professional presentations with AI assistance
- **Features**:
  - Multiple specialized agents (architecture, research, content, formatting)
  - Template customization and branding
  - Support for Marp and Slidev formats
  - Research-backed content generation
- **Use when**: You need to create presentations, slides, or visual content

### ⚡ Parallel Subagent
- **Perfect for**: Running background tasks without blocking main conversation
- **Features**:
  - **Parallel Worker Agent**: Specialized subagent for non-blocking background tasks
  - Independent execution context separate from main conversation
  - Background research, file processing, and code analysis
  - Test execution and validation without interrupting workflow
  - Automatic invocation for parallelizable tasks
- **Use when**: You want to run research, analysis, or processing tasks while continuing with main development work

## 🏗️ Repository Structure

```
claude-marketplace/
├── 📄 README.md                 # This file - overview and quick start
├── 📁 plugins/                  # All available plugins
│   ├── 🔍 gemini-web-search-agent/
│   ├── 🛠️ skill-command-creator/
│   ├── 📊 slidegen/
│   └── ⚡ parallel-subagent-plugin/
├── 📁 docs/                     # Detailed documentation
│   ├── skills.md               # Agent Skills guide
│   ├── marketplace.md          # Marketplace usage guide
│   └── ...                     # Additional docs
├── 📁 .claude-plugin/           # Marketplace configuration
│   └── marketplace.json        # Plugin definitions
└── 📁 marketplace/              # Legacy structure (being phased out)
    └── CATALOG.md              # Detailed catalog
```

## 📚 Documentation

- **[Skills Guide](./docs/skills.md)** - Learn about Agent Skills
- **[Marketplace Guide](./docs/marketplace.md)** - Understanding marketplaces
- **[Slash Commands](./docs/slash_commands.md)** - Custom command creation
- **[Plugins Reference](./docs/plugins.md)** - Complete plugin documentation

## 🤝 Contributing

We welcome high-quality plugins that enhance the Claude Code experience!

### Requirements for Plugin Submission:
1. **Quality**: Well-documented, thoroughly tested, and follows best practices
2. **Utility**: Solves real problems and provides clear value to users
3. **Documentation**: Comprehensive README with installation and usage instructions
4. **Compatibility**: Works with current Claude Code version and follows plugin standards

### Submission Process:
1. Fork this repository
2. Add your plugin to the `plugins/` directory
3. Update `.claude-plugin/marketplace.json` with your plugin details
4. Submit a pull request with a clear description of your plugin

## 📄 License

This marketplace is licensed under the MIT License. Individual plugins may have their own licenses.

## 🔗 Links

- **Claude Code**: https://claude.com/claude-code
- **Repository**: https://github.com/p-wegner/claude-marketplace
- **Issues**: https://github.com/p-wegner/claude-marketplace/issues

---

**Last Updated**: 2025-10-25
**Marketplace Version**: 1.0.2
**Total Plugins**: 4

> 💡 **Tip**: Start with the Skill & Command Creator if you're new to plugins - it will help you understand how Skills and commands work!