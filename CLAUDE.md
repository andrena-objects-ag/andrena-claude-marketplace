# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Claude Marketplace** - a curated collection of high-quality plugins, agents, skills, and tools for Claude Code. The repository serves as a centralized marketplace for discovering, installing, and managing Claude Code extensions.

## Architecture

### Marketplace Structure

```
claude-marketplace/
├── .claude-plugin/marketplace.json    # Core marketplace configuration
├── plugins/                           # All available plugins
│   ├── gemini-web-search-agent/       # Web search agent plugin
│   ├── skill-command-creator/         # Skill and command creation toolkit
│   ├── slidegen/                      # Presentation creation system
│   ├── parallel-subagent-plugin/      # Parallel execution agent
│   └── coding-aider/                  # Development planning tool (in progress)
├── docs/                              # Comprehensive documentation
```

### Marketplace Configuration

The marketplace is defined in `.claude-plugin/marketplace.json` with:
- **Metadata**: Marketplace name, version, description
- **Plugin definitions**: Each plugin with version, source, and component paths
- **Version management**: Semantic versioning for all plugins
- **Strict mode**: Some plugins require `strict: true` for validation

### Plugin System Architecture

Claude Code plugins can contain multiple component types:

1. **Commands** (`commands/`): Custom slash commands with markdown files and frontmatter
2. **Agents** (`agents/`): Specialized subagents for specific tasks
3. **Skills** (`skills/`): Agent capabilities with SKILL.md files and supporting resources
4. **Hooks** (`hooks/`): Event handlers for automation
5. **MCP Servers** (`.mcp.json`): External tool integration via Model Context Protocol

## Development Workflow

### Adding New Plugins

1. **Create plugin directory** in `plugins/`
2. **Choose ONE approach for plugin definition**:
   - **Option A**: Use `plugin.json` inside plugin directory (recommended for simple plugins)
   - **Option B**: Define components directly in `marketplace.json` (recommended for complex plugins)
3. **Update marketplace.json** with plugin entry following schema:
   ```json
   {
     "name": "plugin-name",
     "source": "./plugins/plugin-name",
     "version": "1.0.0",
     "description": "Brief description",
     "category": "agents|productivity|utilities",
     "strict": false
   }
   ```
4. **Set strict mode appropriately**:
   - `strict: true` when defining components in `marketplace.json` with detailed specs
   - `strict: false` when using `plugin.json` for component definitions
5. **Update plugin README.md** with plugin description
6. **Update toplevel repo README.md** with added plugin

### Plugin Manifest Conflicts - IMPORTANT

**Never define components in both `plugin.json` AND `marketplace.json`**. This causes conflicting manifest errors.

**Rules to avoid conflicts**:
- If plugin has detailed component specs in `marketplace.json` → Set `strict: true` and NO `plugin.json`
- If plugin uses `plugin.json` → Define components only there and set `strict: false` in marketplace
- Complex plugins with many components (agents, skills, commands) should use `strict: true`

### Plugin Versioning

- **Semantic versioning**: Use `MAJOR.MINOR.PATCH` format
- **Version updates**: Update both plugin manifest and marketplace.json
- **Documentation**: Update plugin READMEs with version changes

## Documentation Structure

### Core Documentation
- `docs/decision-guide.md` - When to use agents, skills, commands
- `docs/marketplace.md` - Complete marketplace usage and creation guide
- `docs/plugins.md` - Plugin system reference and schemas
- `docs/skills.md` - Skills authoring and management
- `docs/slash_commands.md` - Custom command creation
- `docs/subagents.md` - Subagent development and integration
- `docs/hooks.md` - Event hooks and automation
- `docs/mcp_support.md` - MCP support and configuration


### Component Documentation
- **Agent files**: Markdown descriptions in `agents/` directories
- **Skill files**: SKILL.md with frontmatter and supporting documentation
- **Command files**: Markdown with frontmatter defining command structure

## Version Management

### Plugin Versions
- Stored in both plugin manifests and marketplace.json
- Must follow semantic versioning
- Update documentation for version changes

### Marketplace Version
- Defined in `.claude-plugin/marketplace.json` metadata
- Increment when adding/removing plugins or breaking changes



## Plugin Component Development

### Commands
- Location: `commands/` directory
- Format: Markdown with YAML frontmatter
- Custom paths supported via plugin manifest

### Agents
- Location: `agents/` directory
- Format: Markdown with description and capabilities
- Claude invokes automatically based on task context

### Skills
- Location: `skills/` subdirectories
- Required: `SKILL.md` with frontmatter
- Optional: Supporting files, scripts, templates
- Model-invoked based on task matching

### Hooks
- Location: `hooks/hooks.json` or inline in plugin manifest
- Events: PreToolUse, PostToolUse, UserPromptSubmit, etc.
- Types: command, validation, notification

### MCP Servers
- Location: `.mcp.json` or inline in plugin manifest
- Format: Standard MCP server configuration
- Auto-start when plugin enabled