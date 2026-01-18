---
name: permission-manager
description: Manage Claude Code permissions across local and global scopes. Use when promoting local permissions to global, listing permissions from any scope, comparing permission differences, or managing the global permissions allowlist. Keywords: permissions, promote, global, local, allowlist.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Permission Manager

Comprehensive permission management for Claude Code across local and global scopes.

## Overview

Claude Code permissions can be managed at two levels:
- **Global permissions** (`~/.claude/settings.json`) - Available across all projects
- **Local permissions** (`.claude/settings.json`) - Project-specific overrides

This skill provides tools to:
- Promote local permissions to global
- List permissions from any scope
- Compare permission differences
- Add/remove global permissions

## When This Skill Activates

User invokes via `/permission-manager` command with arguments:
- `promote <path>` - Promote local permissions from a project to global
- `list [global|local <path>]` - List permissions from specified scope
- `compare <path>` - Compare local vs global permissions
- `add <permission>` - Add a permission pattern to global allow list
- `remove <permission>` - Remove a permission pattern from global
- `sync <path>` - Sync all local permissions to global

## Instructions

### Promoting Local Permissions

1. Find the local `.claude/settings.json` file in the specified project path
2. Read both local and global settings files
3. Extract `permissions.allow` arrays from both files
4. Identify permissions in local that are not in global
5. Present differences to user for confirmation
6. Add selected permissions to global allow list (with deduplication)
7. Report the results

Example:
```
/permission-manager promote C:/projects/my-app
```

### Listing Permissions

1. Determine target scope (global by default, or local with path)
2. Read the appropriate settings file
3. Extract and display the `permissions.allow` array
4. Group by type (Bash, Skill, MCP) for readability

Example:
```
/permission-manager list
/permission-manager list local C:/projects/my-app
```

### Comparing Permissions

1. Read both local and global settings files
2. Extract `permissions.allow` arrays from both
3. Display permissions organized by category:
   - **Only in local**: Candidates for promotion
   - **Only in global**: Global-specific permissions
   - **In both**: Shared permissions

Example:
```
/permission-manager compare C:/projects/my-app
```

### Adding Global Permissions

1. Parse the permission argument from the user's request
2. Read `~/.claude/settings.json`
3. Parse the JSON content
4. Check if `permissions.allow` array exists (create if needed)
5. Check for duplicates (case-sensitive string comparison)
6. If not a duplicate, append the new permission
7. Write back with proper formatting (2-space indentation)
8. Report the result

Example:
```
/permission-manager add Bash(git fetch:*)
```

### Syncing Permissions

1. Read local and global settings files
2. Add all local permissions to global (with deduplication)
3. Report sync results

Example:
```
/permission-manager sync C:/projects/my-app
```

## Permission Format

Permissions are stored as strings matching these patterns:
- `Bash(<command_pattern>)` - Bash command permissions
- `Skill(<skill_name>:<action>)` - Skill invocation permissions
- `mcp__<server>__<action>` - MCP tool permissions

## Usage Examples

```bash
# Promote local permissions to global
/permission-manager promote C:/projects/my-app

# Compare local vs global permissions
/permission-manager compare C:/projects/my-app

# List all global permissions
/permission-manager list

# List local permissions
/permission-manager list local C:/projects/my-app

# Sync all local permissions to global
/permission-manager sync C:/projects/my-app

# Add a specific global permission
/permission-manager add Bash(npm test:*)

# Remove a global permission
/permission-manager remove Bash(npm test:*)
```

## File Locations

- **Global settings**: `~/.claude/settings.json` (or `$HOME/.claude/settings.json`)
- **Local settings**: `<project>/.claude/settings.json`

## Requirements

- Write access to `~/.claude/settings.json`
- Read access to project `.claude/settings.json` files

## Notes

- Duplicate permissions are automatically skipped
- Settings files are preserved with proper formatting (2-space indentation)
- Existing permissions are never removed unless explicitly requested
- Local permissions take precedence over global when both exist

## Scripts

Utility scripts are available in the [scripts/](../../scripts/) directory for programmatic access.
