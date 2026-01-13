# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Andrena Claude Marketplace** - a curated collection of high-quality plugins, agents, skills, and tools for Claude Code. The repository serves as a centralized marketplace for discovering, installing, and managing Claude Code extensions.

## Architecture

### Marketplace Structure

```
andrena-claude-marketplace/
├── .claude-plugin/marketplace.json    # Core marketplace configuration
├── plugins/                           # All available plugins (see marketplace.json)
└── docs/                              # Comprehensive documentation
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
- **Version updates required**: ALWAYS bump version when making ANY changes to a plugin
  - Bug fixes (e.g., fixing hooks.json structure) → Increment PATCH (1.0.0 → 1.0.1)
  - New features or enhancements → Increment MINOR (1.0.1 → 1.1.0)
  - Breaking changes → Increment MAJOR (1.1.0 → 2.0.0)
- **Two files to update**:
  1. `plugins/[plugin-name]/plugin.json` - Update `version` field
  2. `.claude-plugin/marketplace.json` - Update `version` field in plugin entry
- **Commit message**: Include version bump in commit message (e.g., "Fix hooks.json structure and bump to v1.0.1")
- **Documentation**: Update plugin READMEs with version changes and changelog

## Documentation Structure

### Core Documentation
- `docs/plugin-marketplaces.md` - Complete marketplace usage and creation guide
- `docs/plugins.md` - Plugin system reference and schemas
- `docs/plugins-reference.md` - Detailed plugin configuration reference
- `docs/skills.md` - Skills authoring and management
- `docs/slash-commands.md` - Custom command creation
- `docs/sub-agents.md` - Subagent development and integration
- `docs/hooks.md` - Event hooks and automation
- `docs/hooks-guide.md` - Hooks quick start guide
- `docs/mcp.md` - MCP support and configuration
- `docs/cli-reference.md` - CLI commands reference
- `docs/discover-plugins.md` - Plugin discovery guide
- `docs/headless.md` - Headless mode documentation
- `docs/output-styles.md` - Output styling guide

### Best Practices
- `.llm/best-practices/claude-code-plugins.md` - **Comprehensive best practices for Claude Code plugin development** (Skills, Commands, Agents, Hooks, CLAUDE.md, and workflow patterns based on official Anthropic guidance)


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
- **Location**: `commands/` directory
- **Format**: Markdown with YAML frontmatter
- **Supported frontmatter**: `description`, `argument-hint`, `allowed-tools`, `model`, `context`, `agent`, `disable-model-invocation`, `hooks`
- **Features**: Positional arguments (`$1`, `$2`), all arguments (`$ARGUMENTS`), bash integration (`!`), file references (`@`), forked contexts
- **Custom paths** supported via plugin manifest

### Agents
- **Location**: `agents/` directory
- **Format**: Markdown with description and capabilities
- **Invocation**: Claude invokes automatically based on task context
- **Custom agents**: Can be used with forked contexts in Skills and Commands

### Skills
- **Location**: `skills/` subdirectories
- **Required**: `SKILL.md` with frontmatter
- **Supported frontmatter**: `name`, `description`, `allowed-tools`, `model`, `context`, `agent`, `hooks`, `user-invocable`, `disable-model-invocation`
- **Progressive disclosure**: Keep SKILL.md under 500 lines; use reference files for detailed documentation
- **Supporting files**: reference.md, examples.md, scripts/, templates/
- **Invocation**: Model-invoked based on description matching, slash command (`/skill-name`), or programmatic (`Skill` tool)
- **Subagent integration**: Custom subagents can access Skills via `skills` field

### Hooks
- **Location**: `hooks/hooks.json` or inline in plugin manifest
- **Events**: PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, SessionStart
- **Types**: `command` (bash execution), `prompt` (LLM-based evaluation)
- **Scoping**: Can be scoped to Skills or Commands with automatic cleanup
- **Features**: `once: true` for one-time execution, `matcher` for tool filtering
- **Important**: External `hooks/hooks.json` files require specific structure - see [hooks.md](./docs/hooks.md#plugin-hooks) for details

### MCP Servers
- **Location**: `.mcp.json` or inline in plugin manifest
- **Format**: Standard MCP server configuration
- **Auto-start**: Enabled when plugin is installed and enabled

## Best Practices

### Skill Development
- **Single purpose**: Each Skill addresses one specific capability
- **Clear descriptions**: Include what the Skill does AND when to use it (max 1024 chars)
- **Progressive disclosure**: Keep SKILL.md focused; reference detailed docs in separate files
- **Tool restrictions**: Use `allowed-tools` to limit scope when appropriate
- **Forked contexts**: Use `context: fork` for complex multi-step operations
- **Visibility control**: Use `user-invocable: false` for internal Skills

### Command Development
- **Intuitive naming**: Command names should clearly indicate functionality
- **Argument patterns**: Use `$1`, `$2` for structured input; `$ARGUMENTS` for flexible input
- **Tool permissions**: Be specific with `allowed-tools` for security
- **Hooks integration**: Use scoped hooks for validation or automation
- **Forked execution**: Use `context: fork` to isolate complex operations

### Plugin Architecture
- **Component organization**: Group related components logically
- **Manifest strategy**: Choose between `plugin.json` (simple) or `marketplace.json` definitions (complex)
- **Version management**: Update versions in both plugin manifest and marketplace.json
- **Documentation**: Maintain comprehensive README.md for each plugin