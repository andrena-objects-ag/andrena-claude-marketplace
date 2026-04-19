# Create plugins

> Create custom plugins to extend Claude Code with skills, agents, hooks, and MCP servers.

Plugins let you extend Claude Code with custom functionality that can be shared across projects and teams. This guide covers creating your own plugins with skills, agents, hooks, and MCP servers.

Looking to install existing plugins? See [Discover and install plugins](/en/discover-plugins). For complete technical specifications, see [Plugins reference](/en/plugins-reference).

## When to use plugins vs standalone configuration

Claude Code supports two ways to add custom skills, agents, and hooks:

| Approach | Skill names | Best for |
| --- | --- | --- |
| **Standalone** (`.claude/` directory) | `/hello` | Personal workflows, project-specific customizations, quick experiments |
| **Plugins** (directories with `.claude-plugin/plugin.json`) | `/plugin-name:hello` | Sharing with teammates, distributing to community, versioned releases, reusable across projects |

**Use standalone configuration when**:

- You're customizing Claude Code for a single project
- The configuration is personal and doesn't need to be shared
- You're experimenting with skills or hooks before packaging them
- You want short skill names like `/hello` or `/deploy`

**Use plugins when**:

- You want to share functionality with your team or community
- You need the same skills/agents across multiple projects
- You want version control and easy updates for your extensions
- You're distributing through a marketplace
- You're okay with namespaced skills like `/my-plugin:hello` (namespacing prevents conflicts between plugins)

## Quickstart

This quickstart walks you through creating a plugin with a custom skill. You'll create a manifest (the configuration file that defines your plugin), add a skill, and test it locally using the `--plugin-dir` flag.

### Prerequisites

- Claude Code installed and authenticated

### Create your first plugin

You've successfully created and tested a plugin with these key components:

- **Plugin manifest** (`.claude-plugin/plugin.json`): describes your plugin's metadata
- **Skills directory** (`skills/`): contains your custom skills
- **Skill arguments** (`$ARGUMENTS`): captures user input for dynamic behavior

## Plugin structure overview

You've created a plugin with a skill, but plugins can include much more: custom agents, hooks, MCP servers, LSP servers, and background monitors.

| Directory | Location | Purpose |
| --- | --- | --- |
| `.claude-plugin/` | Plugin root | Contains `plugin.json` manifest (optional if components use default locations) |
| `skills/` | Plugin root | Skills as `<name>/SKILL.md` directories |
| `commands/` | Plugin root | Skills as flat Markdown files. Use `skills/` for new plugins |
| `agents/` | Plugin root | Custom agent definitions |
| `hooks/` | Plugin root | Event handlers in `hooks.json` |
| `.mcp.json` | Plugin root | MCP server configurations |
| `.lsp.json` | Plugin root | LSP server configurations for code intelligence |
| `monitors/` | Plugin root | Background monitor configurations in `monitors.json` |
| `bin/` | Plugin root | Executables added to the Bash tool's `PATH` while the plugin is enabled |
| `settings.json` | Plugin root | Default settings applied when the plugin is enabled |

## Develop more complex plugins

Once you're comfortable with basic plugins, you can create more sophisticated extensions.

### Add Skills to your plugin

Plugins can include Agent Skills to extend Claude's capabilities. Skills are model-invoked: Claude automatically uses them based on the task context.

Add a `skills/` directory at your plugin root with Skill folders containing `SKILL.md` files:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── code-review/
        └── SKILL.md
```

Each `SKILL.md` contains YAML frontmatter and instructions. Include a `description` so Claude knows when to use the skill:

```yaml
---
description: Reviews code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
---

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
```

After installing the plugin, run `/reload-plugins` to load the Skills. For complete Skill authoring guidance including progressive disclosure and tool restrictions, see [Agent Skills](/en/skills).

### Add LSP servers to your plugin

LSP (Language Server Protocol) plugins give Claude real-time code intelligence. If you need to support a language that doesn't have an official LSP plugin, you can create your own by adding an `.lsp.json` file to your plugin:

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

Users installing your plugin must have the language server binary installed on their machine.

For complete LSP configuration options, see [LSP servers](/en/plugins-reference#lsp-servers).

### Add background monitors to your plugin

Background monitors let your plugin watch logs, files, or external status in the background and notify Claude as events arrive. Claude Code starts each monitor automatically when the plugin is active, so you don't need to instruct Claude to start the watch.

Add a `monitors/monitors.json` file at the plugin root with an array of monitor entries:

```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log"
  }
]
```

Each stdout line from `command` is delivered to Claude as a notification during the session. For the full schema, including the `when` trigger and variable substitution, see [Monitors](/en/plugins-reference#monitors).

### Ship default settings with your plugin

Plugins can include a `settings.json` file at the plugin root to apply default configuration when the plugin is enabled. Currently, only the `agent` and `subagentStatusLine` keys are supported.

Setting `agent` activates one of the plugin's custom agents as the main thread, applying its system prompt, tool restrictions, and model. This lets a plugin change how Claude Code behaves by default when enabled.

```json
{
  "agent": "security-reviewer"
}
```

This example activates the `security-reviewer` agent defined in the plugin's `agents/` directory. Settings from `settings.json` take priority over `settings` declared in `plugin.json`. Unknown keys are silently ignored.

### Organize complex plugins

For plugins with many components, organize your directory structure by functionality. For complete directory layouts and organization patterns, see [Plugin directory structure](/en/plugins-reference#plugin-directory-structure).

### Test your plugins locally

Use the `--plugin-dir` flag to test plugins during development. This loads your plugin directly without requiring installation.

```bash
claude --plugin-dir ./my-plugin
```

When a `--plugin-dir` plugin has the same name as an installed marketplace plugin, the local copy takes precedence for that session. This lets you test changes to a plugin you already have installed without uninstalling it first. Marketplace plugins force-enabled by managed settings are the only exception and cannot be overridden.

As you make changes to your plugin, run `/reload-plugins` to pick up the updates without restarting. This reloads plugins, skills, agents, hooks, plugin MCP servers, and plugin LSP servers. Test your plugin components:

- Try your skills with `/plugin-name:skill-name`
- Check that agents appear in `/agents`
- Verify hooks work as expected

### Debug plugin issues

If your plugin isn't working as expected:

1. **Check the structure**: Ensure your directories are at the plugin root, not inside `.claude-plugin/`
2. **Test components individually**: Check each skill, agent, and hook separately
3. **Use validation and debugging tools**: See [Debugging and development tools](/en/plugins-reference#debugging-and-development-tools) for CLI commands and troubleshooting techniques

When your plugin is ready to share:

1. **Add documentation**: Include a `README.md` with installation and usage instructions
2. **Version your plugin**: Use semantic versioning in your `plugin.json`
3. **Create or use a marketplace**: Distribute through plugin marketplaces for easy installation
4. **Test with others**: Have team members test the plugin before wider distribution

Once your plugin is in a marketplace, others can install it using the instructions in [Discover and install plugins](/en/discover-plugins).

### Submit your plugin to the official marketplace

To submit a plugin to the official Anthropic marketplace, use one of the in-app submission forms:

- **Claude.ai**: claude.ai/settings/plugins/submit
- **Console**: platform.claude.com/plugins/submit

Once your plugin is listed, you can have your own CLI prompt Claude Code users to install it. See [Recommend your plugin from your CLI](https://code.claude.com/docs/en/recommend-your-plugin).

## Convert existing configurations to plugins

If you already have skills or hooks in your `.claude/` directory, you can convert them into a plugin for easier sharing and distribution.

### Migration steps

1. Create a new plugin directory with `.claude-plugin/plugin.json`
2. Copy your existing configurations to the plugin directory
3. Migrate hooks from `settings.json` to `hooks/hooks.json`
4. Load your plugin with `claude --plugin-dir ./my-plugin` to verify

### What changes when migrating

| Standalone (`.claude/`) | Plugin |
| --- | --- |
| Only available in one project | Can be shared via marketplaces |
| Files in `.claude/commands/` | Files in `plugin-name/commands/` |
| Hooks in `settings.json` | Hooks in `hooks/hooks.json` |
| Must manually copy to share | Install with `/plugin install` |

## Next steps

Now that you understand Claude Code's plugin system, here are suggested paths for different goals:

### For plugin users

- **Discover plugins**: Browse community marketplaces for useful tools
- **Team adoption**: Set up repository-level plugins for your projects
- **Marketplace management**: Learn to manage multiple plugin sources
- **Advanced usage**: Explore plugin combinations and workflows

### For plugin developers

- **Create your first marketplace**: [Plugin marketplaces](/en/plugin-marketplaces) guide
- **Advanced components**: Dive deeper into specific plugin components:
  - [Skills](/en/skills): skill development details
  - [Subagents](/en/sub-agents): agent configuration and capabilities
  - [Hooks](/en/hooks): event handling and automation
  - [MCP](/en/mcp): external tool integration
- **Distribution strategies**: Package and share your plugins effectively
- **Community contribution**: Consider contributing to community plugin collections

### For team leads and administrators

- **Repository configuration**: Set up automatic plugin installation for team projects
- **Plugin governance**: Establish guidelines for plugin approval and security review
- **Marketplace maintenance**: Create and maintain organization-specific plugin catalogs
- **Training and documentation**: Help team members adopt plugin workflows effectively

## See also

- [Plugin marketplaces](/en/plugin-marketplaces) - Creating and managing plugin catalogs
- [Plugins reference](/en/plugins-reference) - Complete technical specifications
- [Skills](/en/skills) - Skill development details
- [Subagents](/en/sub-agents) - Agent configuration and capabilities
- [Hooks](/en/hooks) - Event handling and automation
- [MCP](/en/mcp) - External tool integration
- [Settings](/en/settings) - Configuration options for plugins


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://code.claude.com/docs/llms.txt
