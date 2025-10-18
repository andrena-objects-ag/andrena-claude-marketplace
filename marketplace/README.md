# Claude Marketplace

A curated marketplace for Claude Code agents, plugins, skills, and styles.

## Overview

This marketplace provides a centralized location for discovering and installing high-quality Claude Code extensions. It includes agents, plugins, skills, and output styles that enhance your Claude Code experience.

## Quick Start

### Add this marketplace

```bash
/plugin marketplace add p-wegner/claude-marketplace
```

### Browse available plugins

```bash
/plugin
```

### Install the Gemini Web Search Agent

```bash
/plugin install gemini-web-search-agent@claude-marketplace
```

## Available Extensions

### Agents

#### Gemini Web Search Agent

- **Name**: `gemini-web-search-agent`
- **Description**: Use this agent for web searches and retrieving current information using the Gemini CLI
- **Version**: 1.0.0
- **Category**: Search & Research

**Features:**
- Specialized web search using Gemini CLI
- Current information retrieval
- Documentation search
- Latest developments tracking
- Explicit web search instruction patterns

**Usage:**
The agent is automatically available after installation and can be used for any web search tasks requiring current information.

## Directory Structure

```
marketplace/
├── agents/                 # Agent definitions
│   └── gemini-web-search-agent/
│       ├── plugin.json
│       └── gemini-web-search-agent.md
├── plugins/               # Plugin implementations
├── skills/               # Skill definitions
└── styles/               # Output style definitions
```

## Contributing

We welcome contributions to the marketplace! To add your own extension:

1. Fork this repository
2. Add your extension to the appropriate directory
3. Update `.claude-plugin/marketplace.json` with your plugin entry
4. Submit a pull request

### Plugin Entry Template

```json
{
  "name": "your-extension-name",
  "source": "./marketplace/your-category/your-extension",
  "description": "Brief description of your extension",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  },
  "keywords": ["relevant", "tags"],
  "category": "agents|plugins|skills|styles",
  "tags": ["additional", "search", "tags"],
  "strict": false
}
```

## Support

For issues or questions about:
- **This marketplace**: Create an issue in this repository
- **Specific extensions**: Contact the extension author
- **Claude Code**: See the [Claude Code documentation](https://docs.claude.com/claude-code)

## License

This marketplace is licensed under the MIT License. Individual extensions may have their own licenses - please check each extension's documentation.

---

**Made with ❤️ for the Claude Code community**