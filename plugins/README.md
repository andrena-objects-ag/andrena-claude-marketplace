# Available Plugins

This directory contains all available plugins in the Claude Marketplace. Each plugin is self-contained with its own documentation and components.

## 🔌 Plugin Directory

### [🔍 Gemini Web Search Agent](./gemini-web-search-agent/)
**Type**: Agent | **Category**: Search & Research

Specialized web search and information retrieval using the Gemini CLI.
- **Perfect for**: Research, documentation lookup, current information
- **Features**: Optimized search queries, real-time information retrieval
- **Installation**: `/plugin install gemini-web-search-agent@claude-marketplace`

---

### [🛠️ Skill & Command Creator](./skill-command-creator/)
**Type**: Plugin with Skills | **Category**: Productivity & Development

Create comprehensive Agent Skills and custom slash commands with templates and validation.
- **Perfect for**: Extending Claude's capabilities, automating workflows
- **Features**:
  - Skill Creator (build Agent Skills with proper structure)
  - Command Creator (create custom slash commands with arguments)
- **Installation**: `/plugin install skill-command-creator@claude-marketplace`

---

### [📊 SlideGen](./slidegen/)
**Type**: Complete Plugin Suite | **Category**: Presentations & Productivity

AI-powered presentation creation system with specialized agents and templates.
- **Perfect for**: Professional presentations, educational content, training materials
- **Features**: Multiple specialized agents, Marp/Slidev support, template customization
- **Installation**: `/plugin install slidegen@claude-marketplace`

## 🚀 Quick Installation

1. **Add this marketplace**:
   ```bash
   /plugin marketplace add p-wegner/claude-marketplace
   ```

2. **List all plugins**:
   ```bash
   /plugin list
   ```

3. **Install desired plugins**:
   ```bash
   /plugin install plugin-name@claude-marketplace
   ```

## 📋 Plugin Categories

| Plugin | Type | Primary Use | Installation Command |
|--------|------|-------------|---------------------|
| 🔍 Gemini Web Search | Agent | Web research & information | `/plugin install gemini-web-search-agent@claude-marketplace` |
| 🛠️ Skill & Command Creator | Plugin + Skills | Create Skills & Commands | `/plugin install skill-command-creator@claude-marketplace` |
| 📊 SlideGen | Plugin Suite | Presentation creation | `/plugin install slidegen@claude-marketplace` |

## 💡 Recommendations

### For New Users
Start with **Skill & Command Creator** to understand how Claude Code extensions work and create your own custom tools.

### For Researchers
**Gemini Web Search Agent** is essential for finding current information and comprehensive research.

### For Content Creators
**SlideGen** provides a complete workflow for creating professional presentations with AI assistance.

### For Power Users
Install all three plugins for a comprehensive toolkit covering research, customization, and content creation.

## 🔗 Additional Resources

- **[Main Repository README](../README.md)** - Complete overview and getting started guide
- **[Documentation](../docs/)** - Detailed guides for Skills, Commands, and Plugins
- **[Marketplace Catalog](../marketplace/CATALOG.md)** - Detailed catalog with features and examples

## 🤝 Contributing

Have a plugin to share? See the main repository README for contribution guidelines.

---

**Last Updated**: 2025-10-19
**Total Plugins**: 3