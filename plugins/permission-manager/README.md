# Permission Manager

> Manage Claude Code permissions across local and global scopes with promotion, comparison, and sync capabilities.

## Features

- **Promote permissions** - Move local project permissions to global scope
- **Compare permissions** - See differences between local and global allowlists
- **List permissions** - View permissions from any scope, organized by type
- **Sync permissions** - Copy all local permissions to global in one command
- **Manage global** - Add/remove individual global permissions

## Installation

### From Claude Marketplace

```bash
/permission-manager install
```

### Manual Installation

Clone or copy this skill to your skills directory:

```bash
# Personal skills
cp -r permission-manager ~/.claude/skills/

# Project skills
cp -r permission-manager .claude/skills/
```

## Usage

### Promote Local Permissions to Global

Move project-specific permissions to your global allowlist:

```bash
/permission-manager promote C:/projects/my-app
```

The skill will:
1. Read local `.claude/settings.json` from the project
2. Compare with global `~/.claude/settings.json`
3. Show you which permissions are new
4. Add only the new permissions (no duplicates)

### Compare Local vs Global

See the difference between project and global permissions:

```bash
/permission-manager compare C:/projects/my-app
```

Output shows:
- **Only in local**: Permissions that could be promoted
- **Only in global**: Permissions specific to your global config
- **In both**: Shared permissions

### List Permissions

View permissions from any scope:

```bash
# List global permissions
/permission-manager list

# List local permissions
/permission-manager list local C:/projects/my-app
```

### Sync All Permissions

Copy all local permissions to global in one command:

```bash
/permission-manager sync C:/projects/my-app
```

### Add/Remove Global Permissions

```bash
# Add a permission
/permission-manager add Bash(git fetch:*)

# Remove a permission
/permission-manager remove Bash(npm test:*)
```

## Permission Types

Permissions are stored as strings in these formats:

| Type | Format | Example |
|------|--------|---------|
| Bash | `Bash(<pattern>)` | `Bash(git fetch:*)` |
| Skill | `Skill(<name>:<action>)` | `Skill(my-skill:action)` |
| MCP | `mcp__<server>__<action>` | `mcp__chrome-devtools__click` |

## File Locations

| Scope | Location |
|-------|----------|
| Global | `~/.claude/settings.json` |
| Local | `<project>/.claude/settings.json` |

## Scripts

Programmatic access via PowerShell scripts:

```powershell
# Add a global permission
.\scripts\Add-GlobalPermission.ps1 -Permission "Bash(git fetch:*)"

# List permissions
.\scripts\Get-Permissions.ps1 -Scope global
.\scripts\Get-Permissions.ps1 -Scope local -Path "C:\projects\my-app"
```

## Requirements

- Windows PowerShell 5.1 or PowerShell 7+
- Write access to `~/.claude/settings.json`
- Read access to project `.claude/settings.json` files

## How It Works

### Permission Precedence

When both local and global permissions exist, **local takes precedence**. This means:
- Local permissions can grant additional access for a project
- Global permissions provide baseline access across all projects
- Removing a global permission doesn't affect local overrides

### Deduplication

The skill automatically prevents duplicate permissions:
- Case-sensitive string comparison
- Skips existing permissions during promotion
- Preserves original formatting

### Safe Operations

- Existing permissions are never removed unless explicitly requested
- Settings files maintain proper JSON formatting (2-space indentation)
- Original settings structure is preserved

## Examples

### Scenario: Setting Up a New Project

After creating a new project with specific permission needs:

```bash
# 1. Check what permissions the project uses
/permission-manager list local C:/projects/new-project

# 2. Promote useful permissions to global
/permission-manager promote C:/projects/new-project

# 3. Verify the global list
/permission-manager list
```

### Scenario: Cleaning Up Redundant Local Files

After promoting permissions, you may want to remove local files:

```bash
# 1. Compare to confirm everything is synced
/permission-manager compare C:/projects/my-app

# 2. If all permissions are global, remove local file
rm C:/projects/my-app/.claude/settings.json
```

## Troubleshooting

### Permission Not Working After Promotion

1. Check the permission syntax is correct
2. Verify the global settings file was updated
3. Restart Claude Code to reload permissions

### "Settings file not found" Error

- For global: Ensure `~/.claude/settings.json` exists
- For local: Check the project path contains `.claude/settings.json`

### Duplicate Permissions

The skill automatically skips duplicates. If you see duplicates in the file, you can manually remove them - the skill will clean up on next write.

## Version History

### 1.0.0 (2025-01-18)
- Initial release
- Promote, compare, sync, list, add, and remove operations
- PowerShell scripts for programmatic access

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.
