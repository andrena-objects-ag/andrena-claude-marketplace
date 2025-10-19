# Claude Marketplace Catalog

This is the complete catalog of available extensions in the Claude Marketplace.

## 📊 Statistics

- **Total Extensions**: 2
- **Agents**: 1
- **Plugins**: 1
- **Skills**: 2 (included in plugin)
- **Styles**: 0

---

## 🤖 Agents

### [Gemini Web Search Agent](./agents/gemini-web-search-agent/)

**Description**: Use this agent for web searches and retrieving current information using the Gemini CLI

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Search & Research

**Tags**: `search` `web` `gemini` `information` `current` `research`

**Features**:
- Specialized web search using Gemini CLI
- Current information retrieval
- Documentation search
- Latest developments tracking
- Explicit web search instruction patterns

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install gemini-web-search-agent@claude-marketplace
```

**Usage**:
The agent is automatically available after installation and can be used for any web search tasks requiring current information.

---

## 🔌 Plugins

### [Skill & Command Creator](./plugins/skill-command-creator/)

**Description**: A comprehensive toolkit for creating Agent Skills and slash commands with templates, validation, and best practices guidance

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Productivity & Development

**Tags**: `skills` `commands` `creation` `templates` `productivity` `development` `automation`

**Features**:
- **Skill Creator**: Create comprehensive Agent Skills with proper structure, validation, and best practices
- **Command Creator**: Create custom slash commands with proper syntax, arguments, and advanced features
- **Template Library**: Access proven templates for different Skill and command types
- **Validation Tools**: Built-in validation for syntax, structure, and functionality
- **Best Practices**: Implement Claude's recommended development patterns
- **Documentation**: Comprehensive examples and troubleshooting guides

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install skill-command-creator@claude-marketplace
```

**Usage**:
The plugin provides two Skills that activate automatically:
- **Skill Creator**: When you mention creating skills, extending Claude's capabilities, or organizing expertise
- **Command Creator**: When you mention creating slash commands, automating prompts, or organizing commands

**Included Skills**:
- Skill Creator (for creating Agent Skills)
- Command Creator (for creating slash commands)

---

---

## 🎯 Skills

*Skills are included in the [Skill & Command Creator plugin](./plugins/skill-command-creator/)*

### Available Skills:
- **Skill Creator**: Create comprehensive Agent Skills with proper structure and validation
- **Command Creator**: Create custom slash commands with advanced features and best practices

These Skills are automatically available when you install the Skill & Command Creator plugin.

---

## 🎨 Styles

*No styles available yet. Check back soon!*

---

## 📝 Categories

- **Search & Research**: Tools for finding and retrieving information
- **Productivity**: Tools for enhancing workflow and efficiency
- **Development**: Tools for software development tasks
- **Communication**: Tools for messaging and collaboration
- **Data Analysis**: Tools for working with data and analytics
- **Creation Tools**: Tools for creating Skills, commands, and extensions

---

## 🏷️ Tags

- `search` - Search and information retrieval tools
- `web` - Web-related functionality
- `gemini` - Google Gemini integration
- `research` - Research and analysis tools
- `current` - Current information and real-time data
- `skills` - Agent Skill creation and management
- `commands` - Slash command creation and automation
- `creation` - Tools for creating Skills and commands
- `templates` - Template libraries and patterns
- `productivity` - Workflow and efficiency tools
- `development` - Software development utilities
- `automation` - Automation and scripting tools

---

## 🚀 Getting Started

1. **Add the marketplace**:
   ```bash
   /plugin marketplace add p-wegner/claude-marketplace
   ```

2. **Browse available extensions**:
   ```bash
   /plugin
   ```

3. **Install an extension**:
   ```bash
   /plugin install extension-name@claude-marketplace
   ```

---

## 📬 Submitting Extensions

Want to add your extension to this marketplace? Please:

1. Follow the contribution guidelines in the main README
2. Ensure your extension meets the quality standards
3. Submit a pull request with your extension

We're looking for high-quality, well-documented extensions that enhance the Claude Code experience!

---

**Last Updated**: 2025-10-19
**Marketplace Version**: 1.0.1