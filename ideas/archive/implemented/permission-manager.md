---
name: permission-manager
description: Manage Claude Code permissions across local and global scopes. Use when promoting local permissions to global, listing permissions from any scope, comparing permission differences, or managing the global permissions allowlist. Keywords: permissions, promote, global, local, allowlist.
status: IMPLEMENTED
implementation: plugins/permission-manager/skills/permission-manager
date-implemented: 2025-01-18
---

# Permission Manager

**✅ IMPLEMENTED**: This idea has been implemented as a Skill in the `permission-manager` plugin.

## Overview

Comprehensive permission management for Claude Code across local and global scopes.

**Location**: `plugins/permission-manager/skills/permission-manager/`

## Implementation Details

- **Type**: Skill (model-invoked)
- **Plugin**: permission-manager (new plugin created)
- **Version**: 1.0.0
- **Command**: `/permission-manager`

### Features Implemented

1. **Promote local permissions to global** - Move project-specific permissions to global scope
2. **Compare permissions** - See differences between local and global allowlists
3. **List permissions** - View permissions from any scope, organized by type
4. **Sync permissions** - Copy all local permissions to global in one command
5. **Manage global** - Add/remove individual global permissions

### Files Created

- `plugins/permission-manager/plugin.json` - Plugin manifest
- `plugins/permission-manager/README.md` - Comprehensive documentation
- `plugins/permission-manager/skills/permission-manager/SKILL.md` - Skill definition
- `plugins/permission-manager/scripts/Add-GlobalPermission.ps1` - PowerShell utility
- `plugins/permission-manager/scripts/Get-Permissions.ps1` - PowerShell utility
- Updated `.claude-plugin/marketplace.json` with new plugin entry

### Marketplace Integration

The plugin has been added to the marketplace at `.claude-plugin/marketplace.json`:
```json
{
  "name": "permission-manager",
  "source": "./plugins/permission-manager",
  "description": "Manage Claude Code permissions across local and global scopes with promotion, comparison, and sync capabilities",
  "version": "1.0.0",
  "category": "utilities"
}
```

## Usage Examples

```bash
# Promote local permissions to global
/permission-manager promote C:/projects/my-app

# Compare local vs global permissions
/permission-manager compare C:/projects/my-app

# List all global permissions
/permission-manager list

# Add a specific global permission
/permission-manager add Bash(npm test:*)
```

## Notes

- The skill supports both global and local permission management
- Automatic deduplication prevents duplicate permissions
- PowerShell scripts included for programmatic access
- Safe operations with proper JSON formatting preserved
