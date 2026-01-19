# Hooks Augmentation Skill

> **Status**: IMPLEMENTED | **Created**: 2026-01-19 | **Implemented**: 2026-01-19 | **Category**: Development & Security

## Implementation

**✅ IMPLEMENTED**: This idea has been implemented as the **Hooks Creator skill** in the `skill-command-creator` plugin.

**Location**: `plugins/skill-command-creator/skills/hooks-creator/SKILL.md`

**Plugin Version**: skill-command-creator v1.1.0

## What Was Implemented

The Hooks Creator skill provides comprehensive guidance for:

1. **Hook Configuration** - All hook types (PreToolUse, PostToolUse, Stop, SubagentStop, UserPromptSubmit, Notification, PreCompact, SessionStart)
2. **Security Patterns** - Examples for blocking dangerous commands, protecting sensitive files, input validation
3. **Workflow Automation** - Auto-formatting, linting, git operations, notifications
4. **Quality Assurance** - Test validation, TODO/FIXME checks, completion requirements
5. **External Script Architecture** - Proper directory structure and `$CLAUDE_PROJECT_DIR` usage
6. **Exit Code Control Flow** - Blocking vs warning behavior for each hook type
7. **JSON Decision Control** - Advanced approval/block/reason patterns

## How to Use

Simply mention hooks when working with Claude Code:

```
I need to set up a PreToolUse hook to block dangerous commands like rm -rf
```

The Hooks Creator skill will automatically activate and provide:
- Proper hook configuration syntax
- Working script examples
- Security best practices
- Testing and debugging guidance

## Problem Statement (Original)

Claude Code's latest versions support hooks in slash commands, agents, and skills. The `PreToolUse`, `PostToolUse`, and `Stop` hooks are particularly powerful for:

1. **Security enforcement** - Block dangerous operations before they execute
2. **Workflow automation** - Automatically format, validate, or process after tool execution
3. **Quality assurance** - Ensure tasks complete properly before stopping

However, there's a lack of comprehensive, practical examples showing how to properly use these hooks. Developers need guidance on:

- Proper hook syntax and configuration
- Externalizing hook scripts (vs inline commands)
- Security patterns and best practices
- Common automation workflows

## Inspiration & References

This skill is inspired by several excellent resources:

- **[IndyDevDan's YouTube Content](https://www.youtube.com/@IndyDevDan)** - Practical hooks examples for indie developers, including security validation and workflow automation
- **[disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)** - Comprehensive hook lifecycle examples with UV single-file scripts architecture
- **[Claude Code Hooks Guide](https://code.claude.com/docs/en/hooks-guide)** - Official documentation with basic examples
- **[Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)** - Security considerations for hooks

## Solution Concept

Create a **Hooks Augmentation Skill** that provides:

### 1. Comprehensive Hook Examples

**PreToolUse Hook Examples**:
- Security validation (block dangerous commands like `rm -rf`, `sudo rm`, accessing `.env`)
- Parameter validation and sanitization
- Permission checking before sensitive operations
- Logging and auditing of tool usage

**PostToolUse Hook Examples**:
- Auto-formatting code after edits (prettier, black, etc.)
- Running linters and showing feedback
- Git operations (auto-add, status checks)
- Notification systems (slack, discord, email)
- Result validation and error handling

**Stop Hook Examples**:
- Ensuring tests pass before completing
- Validating all files are saved
- Checking for TODO/FIXME comments
- Running final validation checks
- Generating completion summaries

### 2. External Script Architecture

Demonstrate proper script externalization patterns:

```
.claude/
├── hooks/
│   ├── pre_tool_use/
│   │   ├── security-check.sh
│   │   ├── parameter-validator.py
│   │   └── audit-logger.sh
│   ├── post_tool_use/
│   │   ├── auto-format.sh
│   │   ├── lint-runner.sh
│   │   └── git-status.sh
│   └── stop/
│       ├── test-validator.py
│       └── completion-check.sh
└── settings.json
```

### 3. Security Best Practices

Based on community research (IndyDevDan, security blogs):

- Input validation and sanitization
- Whitelisting vs blacklisting approaches
- Exit code patterns for blocking vs warning
- Environment variable handling
- Sensitive file protection
- Audit logging

### 4. Configuration Patterns

Show proper hook configuration in `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/pre_tool_use/security-check.sh",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/post_tool_use/auto-format.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if tests pass and no critical TODOs remain"
          }
        ]
      }
    ]
  }
}
```

## Key Features

1. **Skill-based invocation** - Can be called as `/hooks-augment` or invoked automatically when working with hooks
2. **Template generation** - Generate hook script templates for common use cases
3. **Validation tools** - Check hook syntax and configuration
4. **Best practices guide** - Comprehensive documentation with examples
5. **Security patterns** - Industry-standard security approaches
6. **Multi-language support** - Examples in Bash, Python, and Node.js

## Use Cases

- **Security-conscious teams** - Prevent accidental data loss or security breaches
- **Development workflow automation** - Auto-format, lint, and validate on every operation
- **Quality assurance** - Ensure code quality standards are met
- **Compliance logging** - Audit trails for all operations
- **Team onboarding** - Teach best practices through working examples

## Technical Requirements

1. **Compatibility** - Claude Code v2.0.43+ (advanced hook features)
2. **Skill Frontmatter**:
   ```yaml
   ---
   name: hooks-augmentation
   description: Expert guidance for creating, configuring, and using Claude Code hooks with security best practices and workflow automation patterns
   allowed-tools: Read, Write, Edit, Bash
   ---
   ```

3. **Supporting Files**:
   - `examples/pre-tool-use/` - Security validation examples
   - `examples/post-tool-use/` - Automation examples
   - `examples/stop/` - Quality assurance examples
   - `templates/` - Reusable hook script templates
   - `reference.md` - Complete hook reference

## Success Criteria

- [ ] Comprehensive examples for all major hook types
- [ ] Clear documentation on externalizing scripts
- [ ] Security patterns from community experts
- [ ] Working, tested examples
- [ ] Templates for common workflows
- [ ] Validation tools for hook configuration
- [ ] Integration with existing marketplace plugins

## Related Marketplace Plugins

- **Permission Manager** - For managing hook permissions across scopes
- **Documentation Learner** - For capturing hook patterns as they're discovered
- **Best Practices Advisor** - For keeping hook examples updated with latest Claude Code versions

## Next Steps

1. Research additional community examples (GitHub repos, blogs, videos)
2. Create working hook script examples covering security, automation, and QA
3. Build template generator for common hook patterns
4. Write comprehensive documentation with real-world scenarios
5. Create validation tool for hook configuration
6. Test across different Claude Code versions
7. Publish to marketplace

---

**Sources:**
- [Get started with Claude Code hooks](https://code.claude.com/docs/en/hooks-guide)
- [Hooks reference - Claude Code Docs](https://code.claude.com/docs/en/hooks)
- [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [Claude Code Security Best Practices](https://www.backslash.security/blog/claude-code-security-best-practices)
- [IndyDevDan YouTube Channel](https://www.youtube.com/@IndyDevDan)
