# Claude Code Features: 2025-2026 Timeline

Tracking Claude Code feature releases and updates discovered through research.

> Last updated: 2026-02-24
> Research sources: Web search, official documentation, GitHub releases

---

## Q1 2026 (January - February 2026)

### v2.1 Major Release (January 7, 2026)

**The largest single update in Claude Code history** - 1,096 code commits merged.

#### New Features (30+)

| Feature | Description |
|---------|-------------|
| **Skills Hot Reload** | Modify skill files in `~/.claude/skills` or `.claude/skills` without restarting |
| **Shift+Enter Multi-line Input** | Native line breaks in iTerm2, WezTerm, Ghostty, Kitty terminals |
| **`/teleport` Command** | Transfer conversations between devices (work ↔ home) with seamless debugging continuity |
| **Multi-language Configuration** | `language` setting in settings.json for persistent localized responses |
| **Wildcard Tool Permissions** | System-wide tool authorization without repetitive approvals |
| **Vim Operation Extensions** | Enhanced Vim-style terminal operations |
| **Undo Functionality** | `Esc+Esc` or `/rewind` for checkpoint-based undo |
| **Background Tasks** | `Ctrl+B` for running tasks in background |
| **Session Migration** | Remote session synchronization and backup |
| **PreToolUse/PostToolUse Hooks** | New hook system for custom tool workflows |
| **Isolated Sub-agent Context** | Better context management for complex agent interactions |
| **Real-time Reasoning Visualization** | Visual feedback during complex operations |

#### Performance Improvements
- **50% overall performance improvement**
- **3x memory usage reduction** for large conversations
- **40+ bug fixes** including security patches
- **10+ performance optimizations**

#### Upgrade Command
```bash
npm update -g @anthropic-ai/claude-code
# or
npm install -g @anthropic-ai/claude-code@2.1.4
```

### February 2026

| Feature | Description |
|---------|-------------|
| **Claude Code Security Module** (Feb 20) | Automated scanning for business logic defects and access control issues |
| **Native Git Worktree Support** (Feb 21) | Parallel AI agent development with complete isolation |
| **Market Growth** | 4% of all GitHub public commits; 134,646 daily code commits |

#### Git Worktree Support (February 21, 2026)

**Native Git Worktree integration** - A major breakthrough for parallel AI agent development.

| Feature | Description |
|---------|-------------|
| **Parallel Agent Execution** | Multiple AI agents run simultaneously in the same repository with zero conflicts |
| **Complete Code Isolation** | Each agent gets its own dedicated worktree workspace |
| **CLI Command** | `claude --worktree` or `claude --worktree custom-name` |
| **Tmux Integration** | `--tmux` parameter for dedicated Tmux sessions |
| **Desktop Support** | Visual toggle in Code tab under "worktree mode" |
| **Sub-Agent Support** | Complex tasks split into parallel sub-agents, each in independent worktrees |
| **VCS Compatibility** | Git (native), Mercurial, Perforce, SVN via "worktree hooks" |
| **Auto-Naming** | Let Claude auto-name worktrees or provide custom names |
| **Storage Location** | Default: `~/.claude-worktrees` |

**Agent Configuration:**
```yaml
# Agent frontmatter with worktree isolation
isolation: worktree
```

**Benefits:**
- Zero-conflict parallel development
- Multiple agents can modify the same files simultaneously
- Safe testing without affecting main development branch
- Ideal for large-scale refactoring and code migration
- Recommended: 3-5 simultaneous worktrees for maximum productivity |

---

## Q4 2025 (October - December 2025)

### v2.0 Major Release (October 7, 2025)

| Feature | Description |
|---------|-------------|
| **VS Code Extension (Beta)** | Native VS Code Marketplace integration with real-time code modification display |
| **Checkpoints System** | Automatic code state saving; `/rewind` or double Esc for rollback |
| **Enhanced Terminal UI** | Searchable command history (Ctrl+R), better state visibility |
| **Subagents** | Delegation of specialized tasks to dedicated AI agents |
| **Hooks** | Event-driven automation (PreToolUse, PostToolUse, SessionStart, Stop, etc.) |
| **Background Tasks** | Long-running processes without blocking |
| **Usage Tracking** | `/usage` command to monitor API usage |
| **Claude Sonnet 4.5** | Default model integration |
| **Claude Agent SDK** | Access to underlying infrastructure for custom agents |

### November-December 2025 Enhancements

| Feature | Description |
|---------|-------------|
| **MCP 2025-11 Compliance** (Nov 12) | Full support: version negotiation, async jobs, registry integration |
| **Skills Hot-Reload** | Modify skills without restarting |
| **Multi-language Support** | `language` setting for persistent language config |
| **Auto-continuation** | Automatic continuation when hitting output token limits |
| **Shift+Enter Support** | Native line breaks in terminals |
| **Flexible Slash Commands** | Trigger slash command completion anywhere in text |
| **Memory Optimization** | 3x reduction in memory usage for large conversations |
| **JetBrains Plugin** | Official IDE integration |
| **Chrome Browser Control (Beta)** | Browser automation for frontend debugging |

---

## Q3 2025 (July - September 2025)

### July 2025

| Feature | Description |
|---------|-------------|
| **Subagents Feature** (July 24) | Specialized AI assistants with independent context windows and custom prompts |
| **Restricted Tool Permissions** | Fine-grained control over subagent tool access |
| **Specialized Roles** | Code-reviewer, architect, performance tester agents |

### August 2025

| Feature | Description |
|---------|-------------|
| **Asynchronous Parallel Execution** | Multi-threaded development capabilities |
| **Independent Git Working Trees** | Prevent conflicts during parallel operations |
| **Real-time Feedback** | Issue detection during development |

### September 2025

| Feature | Description |
|---------|-------------|
| **Opus 4.5 Model** | Enhanced reasoning with thinking mode; adaptive controls (ultrathink, medium, high, max) |
| **MCP Protocol Enhancements** | Playwright automation, PostgreSQL connectivity, Slack integration |
| **Checkpoints Feature** (Sept 30) | Save progress and one-click rollback |
| **LSP Integration** | Function reference lookup from 8.2s to 0.3s |

---

## Hook System Details

### Hook Types

#### Command-Based Hooks (`type: "command"`)
Execute shell/bash scripts deterministically:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

#### Prompt-Based Hooks (`type: "prompt"`)
Use LLM evaluation for context-aware decisions:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if this file modification is safe and follows coding standards"
          }
        ]
      }
    ]
  }
}
```

### Hook Event Types

| Event | When It Fires | Can Block |
|-------|---------------|-----------|
| `PreToolUse` | Before tool execution | Yes |
| `PostToolUse` | After tool completes | No |
| `UserPromptSubmit` | After user submits prompt | Yes |
| `PermissionRequest` | When permission dialog appears | Yes |
| `Stop` | When Claude finishes responding | No |
| `SubagentStop` | When subagent completes | No |
| `SessionStart` | When session begins | No |
| `PreCompact` | Before context compression | No |

---

## Version Timeline Summary

| Date | Milestone |
|------|-----------|
| July 24, 2025 | Subagents feature released |
| August 2025 | Backend task management system |
| September 29, 2025 | Claude Sonnet 4.5 integration |
| September 30, 2025 | Checkpoints feature |
| October 7, 2025 | Claude Code v2.0 major release |
| November 12, 2025 | MCP 2025-11 specification compliance |
| January 7, 2026 | Claude Code v2.1 major release (1,096 commits) |
| February 20, 2026 | Security Module release |
| February 21, 2026 | Native Git Worktree support |

---

## Sources

- [Claude Code GitHub Repository](https://github.com/anthropics/claude-code)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [MCP 2025-11 Specification](https://modelcontextprotocol.io)
- [Anthropic Blog](https://www.anthropic.com)
- [everything-claude-code Plugin](https://github.com/affaan-m/everything-claude-code)
- [QQ News - Claude Code Worktree Release](https://news.qq.com)
- [InfoQ - Claude Code Desktop Preview](https://www.infoq.cn)
