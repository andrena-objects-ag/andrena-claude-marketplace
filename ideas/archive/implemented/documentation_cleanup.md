---
description: analyse the docs and split into modules, create claude code skill/commands where applicable
status: IMPLEMENTED
implementation: plugins/documentation-learner/commands/learn.md
date-implemented: 2026-01-13
---

# Documentation Cleanup

**IMPLEMENTED**: This idea has been implemented as an enhancement to the `/learn` command in the `documentation-learner` plugin.

## Implementation Details

The `/learn` command now supports a `--analyze-docs` flag that:

1. **Scans documentation locations**: docs/, CLAUDE.md, README.md, .llm/, markdown files
2. **Analyzes structure**: Lists files, counts lines, reads headers
3. **Detects issues**:
   - Duplicates (similar names or overlapping content)
   - Large files (>300 lines that could be split)
   - Content overlap between files
   - Missing structure
4. **Identifies modularization opportunities**:
   - Sections that could become skills or commands
   - Patterns that could be extracted as components
5. **Generates actionable recommendations** with specific remediation steps

## Usage

```bash
/learn --analyze-docs
```

## Files Modified

- `plugins/documentation-learner/commands/learn.md` - Added --analyze-docs mode
- `plugins/documentation-learner/plugin.json` - Version bump needed to 1.2.0
- `.claude-plugin/marketplace.json` - Version bump needed to 1.2.0

analyse the docs and split into modules, create claude code skill/commands where applicable
