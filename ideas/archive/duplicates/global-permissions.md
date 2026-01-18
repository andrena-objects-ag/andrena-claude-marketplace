---
name: global-permissions
description: Manage global Claude Code permissions in user settings.json. Use when adding permission patterns, listing current permissions, or managing Bash/Skill permission allowlists.
status: DUPLICATE
existing-feature: plugins/permission-manager - Comprehensive permission management with global permissions included
date-checked: 2025-01-18
---

# Global Permissions Manager

**ℹ️ DUPLICATE**: This functionality exists in the `permission-manager` plugin as part of its comprehensive permission management capabilities.

## Why This Is a Duplicate

The `permission-manager` plugin includes all features of `global-permissions` plus additional capabilities:

### Features Covered by permission-manager:

- ✅ **Add global permissions** - `permission-manager add <permission>`
- ✅ **List global permissions** - `permission-manager list`
- ✅ **Remove global permissions** - `permission-manager remove <permission>`

### Additional Features in permission-manager:

- ✅ **Promote local to global** - `permission-manager promote <path>`
- ✅ **Compare permissions** - `permission-manager compare <path>`
- ✅ **Sync permissions** - `permission-manager sync <path>`
- ✅ **List local permissions** - `permission-manager list local <path>`

## Implementation

The `permission-manager` plugin was implemented instead:
- **Plugin**: `plugins/permission-manager/`
- **Skill**: `plugins/permission-manager/skills/permission-manager/SKILL.md`
- **Version**: 1.0.0
- **Added to marketplace**: Yes (2025-01-18)

## Recommendation

Use the `/permission-manager` command instead. It provides:
- All global-permissions functionality
- Additional local/global scope management
- PowerShell scripts for programmatic access
- Comprehensive documentation

## Original Idea Content

The original `global-permissions` skill was simpler and focused only on managing `~/.claude/settings.json` permissions. The `permission-manager` implementation superseded it with a more comprehensive feature set.
