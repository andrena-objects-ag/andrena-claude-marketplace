# Connect Claude Code to tools via MCP

> Learn how to connect Claude Code to your tools with the Model Context Protocol.

## What is MCP

Model Context Protocol (MCP) connects Claude Code to external tools and data sources. MCP is an open source standard for AI-tool integrations. MCP servers give Claude Code access to your tools, databases, and APIs.

With MCP servers connected, you can ask Claude Code to:

- **Implement features from issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub."
- **Analyze monitoring data**: "Check Sentry and Statsig to check the usage of the feature described in ENG-4521."
- **Query databases**: "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database."
- **Integrate designs**: "Update our standard email template based on the new Figma designs that were posted in Slack"
- **Automate workflows**: "Create Gmail drafts inviting these 10 users to a feedback session about the new feature."

## Add MCP servers

### Interactive mode

Use `claude mcp add` to launch an interactive wizard that walks you through configuring a server:

```bash
claude mcp add
```

### Direct stdio server

Add a local stdio server by specifying the transport and command:

```bash
# Basic syntax
claude mcp add <name> --transport stdio -- <command> [args...]

# Real example: Add Airtable server
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

### HTTP server

HTTP servers are the recommended option for connecting to remote MCP servers:

```bash
# Basic syntax
claude mcp add --transport http <name> <url>

# Real example: Connect to Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Example with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### From JSON configuration

Add an MCP server directly from a JSON string:

```bash
# Basic syntax
claude mcp add-json <name> '<json>'

# Example: Adding an HTTP server with JSON configuration
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# Example: Adding a stdio server with JSON configuration
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'
```

### Import from Claude Desktop

Import MCP servers already configured in Claude Desktop:

```bash
claude mcp add-from-claude-desktop
```

After running the command, you'll see an interactive dialog that allows you to select which servers to import.

**Note**: This feature only works on macOS and Windows Subsystem for Linux (WSL). Use the `--scope user` flag to add servers to your user configuration.

### Managing your servers

Once configured, you can manage your MCP servers with these commands:

```bash
# List all configured servers
claude mcp list

# Get details for a specific server
claude mcp get github

# Remove a server
claude mcp remove github

# Reset project-scoped server approval choices
claude mcp reset-project-choices

# (within Claude Code) Check server status
/mcp
```

## Scopes

MCP servers can be configured at three different scope levels:

### Local scope (default)

Local-scoped servers are stored in `~/.claude.json` under your project's path. These servers remain private to you and are only accessible when working within the current project directory.

```bash
# Add a local-scoped server (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### Project scope

Project-scoped servers enable team collaboration by storing configurations in a `.mcp.json` file at your project's root directory. This file is designed to be checked into version control, ensuring all team members have access to the same MCP tools and services.

```bash
# Add a project-scoped server
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

The resulting `.mcp.json` file follows a standardized format:

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

For security reasons, Claude Code prompts for approval before using project-scoped servers from `.mcp.json` files. If you need to reset these approval choices, use the `claude mcp reset-project-choices` command.

### User scope

User-scoped servers are stored in `~/.claude.json` and provide cross-project availability, making them available across all projects on your machine while remaining private to your user account.

```bash
# Add a user server
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### Choosing the right scope

- **Local scope**: Personal servers, experimental configurations, or sensitive credentials specific to one project
- **Project scope**: Team-shared servers, project-specific tools, or services required for collaboration
- **User scope**: Personal utilities needed across multiple projects, development tools, or frequently used services

### Scope hierarchy and precedence

When servers with the same name exist at multiple scopes, the system resolves conflicts by prioritizing local-scoped servers first, followed by project-scoped servers, and finally user-scoped servers.

## Transport types

- **stdio**: Local process communication. Stdio servers run as local processes on your machine and are ideal for tools that need direct system access or custom scripts.
- **HTTP/SSE**: Remote server communication. HTTP servers are the recommended option for connecting to remote MCP servers.

```bash
# Add a remote SSE server
claude mcp add --transport sse <name> <url>

# Real example: Connect to Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

**Windows Users**: On native Windows (not WSL), local MCP servers that use `npx` require the `cmd /c` wrapper:

```bash
claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
```

## Environment variable expansion in `.mcp.json`

Claude Code supports environment variable expansion in `.mcp.json` files, allowing teams to share configurations while maintaining flexibility for machine-specific paths and sensitive values like API keys.

**Supported syntax:**

- `${VAR}` - Expands to the value of environment variable `VAR`
- `${VAR:-default}` - Expands to `VAR` if set, otherwise uses `default`

**Expansion locations:** Environment variables can be expanded in:

- `command` - The server executable path
- `args` - Command-line arguments
- `env` - Environment variables passed to the server
- `url` - For HTTP server types
- `headers` - For HTTP server authentication

**Example with variable expansion:**

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

If a required environment variable is not set and has no default value, Claude Code will fail to parse the config.

## OAuth authentication

Many cloud-based MCP servers require authentication. Claude Code supports OAuth 2.0 for secure connections.

To authenticate with a remote MCP server:

1. Add the server that requires authentication:

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

2. Use the `/mcp` command within Claude Code to authenticate:

```
> /mcp
```

Then follow the steps in your browser to login.

Authentication tokens are stored securely and refreshed automatically. Use "Clear authentication" in the `/mcp` menu to revoke access.

## MCP output limits

When MCP tools produce large outputs, Claude Code helps manage the token usage to prevent overwhelming your conversation context:

- **Warning threshold**: Claude Code displays a warning when any MCP tool output exceeds 10,000 tokens
- **Configurable limit**: Adjust the maximum allowed MCP output tokens using the `MAX_MCP_OUTPUT_TOKENS` environment variable
- **Default max**: The default maximum is 25,000 tokens

```bash
# Set a higher limit for MCP tool outputs
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

This is particularly useful when working with MCP servers that query large datasets, generate detailed reports, or process extensive log files.

## MCP resources

MCP servers can expose resources that you can reference using @ mentions, similar to how you reference files.

1. Type `@` in your prompt to see available resources from all connected MCP servers. Resources appear alongside files in the autocomplete menu.
2. Use the format `@server:protocol://resource/path` to reference a resource:

```
> Can you analyze @github:issue://123 and suggest a fix?
```

Resources are automatically fetched and included as attachments when referenced. Resource paths are fuzzy-searchable in the @ mention autocomplete.

## MCP prompts as slash commands

MCP servers can expose prompts that become available as slash commands in Claude Code.

1. Type `/` to see all available commands, including those from MCP servers. MCP prompts appear with the format `/mcp__servername__promptname`.
2. Execute a prompt without arguments:

```
> /mcp__github__list_prs
```

3. Execute a prompt with arguments (space-separated after the command):

```
> /mcp__github__pr_review 456
```

MCP prompts are dynamically discovered from connected servers. Server and prompt names are normalized (spaces become underscores).

## Enterprise MCP

For organizations that need centralized control over MCP servers, Claude Code supports enterprise-managed MCP configurations. This allows IT administrators to:

- **Control which MCP servers employees can access**: Deploy a standardized set of approved MCP servers across the organization
- **Prevent unauthorized MCP servers**: Optionally restrict users from adding their own MCP servers
- **Disable MCP entirely**: Remove MCP functionality completely if needed

### managed-mcp.json

System administrators can deploy a `managed-mcp.json` file for centralized control:

- macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
- Linux and WSL: `/etc/claude-code/managed-mcp.json`
- Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

The file uses the same format as a standard `.mcp.json` file:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### allowedMcpServers / deniedMcpServers

Administrators can also control which MCP servers users are allowed to configure using allowlists and denylists in the managed settings file.

Each entry can restrict servers by:

1. **By server name** (`serverName`): Matches the configured name of the server
2. **By command** (`serverCommand`): Matches the exact command and arguments used to start stdio servers

```json
{
  "allowedMcpServers": [
    { "serverName": "github" },
    { "serverName": "sentry" },
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] }
  ],
  "deniedMcpServers": [
    { "serverName": "dangerous-server" },
    { "serverCommand": ["npx", "-y", "unapproved-package"] }
  ]
}
```

Command arrays must match exactly (both the command and all arguments in the correct order).

**Allowlist behavior**:
- `undefined` (default): No restrictions
- Empty array `[]`: Complete lockdown
- List of entries: Users can only configure servers that match

**Denylist behavior**:
- `undefined` (default): No servers are blocked
- Empty array `[]`: No servers are blocked
- List of entries: Specified servers are explicitly blocked across all scopes

The denylist takes absolute precedence. If a server matches a denylist entry, it will be blocked even if it is on the allowlist.

## Use Claude Code as MCP server

You can use Claude Code itself as an MCP server that other applications can connect to:

```bash
claude mcp serve
```

You can use this in Claude Desktop by adding this configuration to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

If the `claude` command is not in your system's PATH, specify the full path to the executable in the `command` field.
