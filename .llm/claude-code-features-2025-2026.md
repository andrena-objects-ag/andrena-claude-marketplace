# Claude Code Features: 2025-2026 Timeline

Tracking Claude Code feature releases and updates from the official Anthropic changelog.

> Last updated: 2026-04-19
> Source: [Official Claude Code Changelog](https://docs.anthropic.com/en/docs/claude-code/changelog), [GitHub Releases](https://github.com/anthropics/claude-code/releases)

---

## Q2 2026 (April 2026)

### v2.1.111 (April 16, 2026)

**Claude Opus 4.7 released** with new `xhigh` effort level.

| Feature | Description |
|---------|-------------|
| **Claude Opus 4.7** | New model available with `xhigh` effort level between `high` and `max` |
| **Auto Mode for Opus 4.7** | Max subscribers can use auto mode with Opus 4.7 |
| **Interactive `/effort`** | `/effort` now opens an interactive slider with arrow-key navigation |
| **Auto (match terminal) theme** | Theme option that follows your terminal's dark/light mode |
| **`/ultrareview`** | Comprehensive code review via parallel multi-agent analysis in the cloud |
| **`/less-permission-prompts`** | Scans transcripts and proposes an allowlist to reduce permission prompts |
| **PowerShell tool (Windows)** | Progressive rollout of native PowerShell tool; opt in via `CLAUDE_CODE_USE_POWERSHELL_TOOL` |
| **Read-only glob patterns** | `ls *.ts` and `cd <dir> &&` commands no longer trigger permission prompts |
| **Plan file naming** | Plans named after your prompt instead of random words |

### v2.1.110 (April 15, 2026)

| Feature | Description |
|---------|-------------|
| **`/tui` command** | Switch to flicker-free fullscreen rendering within a conversation |
| **Push notification tool** | Mobile push notifications when Remote Control is enabled |
| **`/focus` command** | New command to toggle focus view (separate from `Ctrl+O` transcript toggle) |
| **`autoScrollEnabled` config** | Disable auto-scroll in fullscreen mode |
| **Editor context in `Ctrl+G`** | Option to show Claude's last response as commented context in external editor |

### v2.1.108 (April 14, 2026)

| Feature | Description |
|---------|-------------|
| **`ENABLE_PROMPT_CACHING_1H`** | Opt into 1-hour prompt cache TTL |
| **`/recap` command** | Provides context when returning to a session; configurable in `/config` |
| **Model discovers built-in commands** | Model can invoke `/init`, `/review`, `/security-review` via Skill tool |
| **`/undo` alias** | Alias for `/rewind` |

### v2.1.105 (April 13, 2026)

| Feature | Description |
|---------|-------------|
| **PreCompact hook support** | Hooks can now block compaction by exiting with code 2 |
| **Background monitors for plugins** | `monitors` manifest key for plugin background monitoring |
| **Skill description cap raised** | Listing cap raised from 250 to 1,536 characters |
| **`/proactive` alias** | Alias for `/loop` |
| **Stalled stream handling** | Streams abort after 5 minutes of no data and retry non-streaming |

### v2.1.101 (April 10, 2026)

| Feature | Description |
|---------|-------------|
| **`/team-onboarding`** | Generate teammate ramp-up guide from local Claude Code usage |
| **OS CA certificate trust** | Enterprise TLS proxies work without extra setup |
| **`/ultraplan` cloud env** | Auto-creates default cloud environment |
| **Per-model `/cost` breakdown** | Per-model and cache-hit cost breakdown for subscription users |

### v2.1.98 (April 9, 2026)

| Feature | Description |
|---------|-------------|
| **Interactive Vertex AI setup wizard** | Accessible from the login screen |
| **`CLAUDE_CODE_PERFORCE_MODE`** | Edit/Write/NotebookEdit fail on read-only files with a `p4 edit` hint |
| **Monitor tool** | Stream events from background scripts |
| **Subprocess sandboxing** | PID namespace isolation on Linux |
| **Interactive Bedrock setup wizard** | Added in v2.1.92 |

### v2.1.94 (April 7, 2026)

| Feature | Description |
|---------|-------------|
| **Mantle on Bedrock** | Set `CLAUDE_CODE_USE_MANTLE=1` for Amazon Bedrock powered by Mantle |
| **Default effort high** | Default effort changed to `high` for API-key, Bedrock/Vertex/Foundry, Team, Enterprise users |
| **`/release-notes` interactive** | Now an interactive version picker |

### v2.1.91 (April 2, 2026)

| Feature | Description |
|---------|-------------|
| **MCP tool result persistence override** | `_meta["anthropic/maxResultSizeChars"]` annotation (up to 500K) |
| **Plugin executables** | Plugins can ship executables under `bin/` |
| **Edit tool shorter anchors** | Reduced output tokens with shorter `old_string` anchors |

### v2.1.90 (April 1, 2026)

| Feature | Description |
|---------|-------------|
| **`/powerup`** | Interactive lessons teaching Claude Code features with animated demos |
| **`CLAUDE_CODE_NO_FLICKER`** | Flicker-free alt-screen rendering |
| **`"defer"` permission decision** | New `PreToolUse` hook decision type |

### v2.1.89 (April 1, 2026)

| Feature | Description |
|---------|-------------|
| **`PermissionDenied` hook** | Fires after auto mode classifier denials |
| **Named subagents in `@`** | Named subagents appear in `@` mention typeahead |
| **Thinking summaries disabled** | No longer generated by default in interactive sessions |

---

## Q1 2026 (January - March 2026)

### March 2026 Highlights

| Version | Date | Feature | Description |
|---------|------|---------|-------------|
| v2.1.85 | Mar 26 | **HTTP hooks** | Hooks can now call HTTP endpoints |
| v2.1.85 | Mar 26 | **Conditional `if` field for hooks** | Hooks can use permission rule syntax for conditions |
| v2.1.84 | Mar 26 | **PowerShell tool preview** | Opt-in PowerShell tool for Windows |
| v2.1.84 | Mar 26 | **`TaskCreated` hook** | New hook event for task creation |
| v2.1.84 | Mar 26 | **Deep links** | `claude-cli://` URLs open in preferred terminal |
| v2.1.83 | Mar 25 | **`managed-settings.d/`** | Drop-in directory for managed settings |
| v2.1.83 | Mar 25 | **`CwdChanged`/`FileChanged` hooks** | New hook events for directory and file changes |
| v2.1.83 | Mar 25 | **Transcript search** | Press `/` in transcript mode (`Ctrl+O`) to search |
| v2.1.83 | Mar 25 | **Agent `initialPrompt`** | Agents can auto-submit a first turn |
| v2.1.81 | Mar 20 | **`--bare` flag** | For scripted `-p` calls |
| v2.1.81 | Mar 20 | **`--channels` relay** | Channel servers can forward tool approval prompts |
| v2.1.80 | Mar 19 | **`effort` frontmatter** | Skills and slash commands support effort level |
| v2.1.78 | Mar 17 | **`StopFailure` hook** | New hook event for stop failures |
| v2.1.78 | Mar 17 | **`${CLAUDE_PLUGIN_DATA}`** | Variable for plugin persistent state |
| v2.1.78 | Mar 17 | **Line-by-line streaming** | Response text streams line-by-line as generated |
| v2.1.77 | Mar 17 | **`allowRead` sandbox** | Sandbox filesystem setting for read access |
| v2.1.77 | Mar 17 | **`/copy N`** | Copy Nth-latest assistant response |
| v2.1.77 | Mar 17 | **`/branch`** | Renamed from `/fork` (alias preserved) |
| v2.1.76 | Mar 14 | **MCP elicitation** | MCP servers can request structured input mid-task |
| v2.1.76 | Mar 14 | **`/effort` command** | Set model effort level interactively |
| v2.1.76 | Mar 14 | **`PostCompact` hook** | New hook event after context compaction |
| v2.1.75 | Mar 13 | **1M context for Opus 4.6** | Default for Max, Team, and Enterprise plans |
| v2.1.75 | Mar 13 | **`/color` command** | Color customization for all users |
| v2.1.73 | Mar 11 | **`modelOverrides` setting** | Map model picker entries to custom provider model IDs |
| v2.1.72 | Mar 10 | **`ExitWorktree` tool** | Leave a git worktree |
| v2.1.72 | Mar 10 | **Simplified effort levels** | Low/medium/high (removed `max`) |
| v2.1.71 | Mar 7 | **`/loop` command** | Run a prompt on a recurring interval |
| v2.1.71 | Mar 7 | **Cron scheduling** | Recurring prompts within a session |
| v2.1.69 | Mar 5 | **`/claude-api` skill** | Building applications with Claude API and SDK |
| v2.1.69 | Mar 5 | **`/reload-plugins`** | Reload plugins without restart |
| v2.1.69 | Mar 5 | **`${CLAUDE_SKILL_DIR}`** | Variable for skill directory paths |
| v2.1.69 | Mar 5 | **`InstructionsLoaded` hook** | New hook event after instructions load |
| v2.1.68 | Mar 4 | **Opus 4.6 medium effort default** | Max and Team subscribers get medium effort by default |
| v2.1.68 | Mar 4 | **"ultrathink" re-introduced** | Enables high effort for the next turn |
| v2.1.63 | Feb 28 | **`/simplify` and `/batch`** | New bundled slash commands |
| v2.1.63 | Feb 28 | **HTTP hooks** | Hook events can call HTTP endpoints |

### February 2026 Highlights

| Version | Date | Feature | Description |
|---------|------|---------|-------------|
| v2.1.59 | Feb 26 | **Auto-memory** | Claude automatically saves useful context to auto-memory; manage with `/memory` |
| v2.1.59 | Feb 26 | **`/copy` command** | Interactive picker to copy code blocks |
| v2.1.51 | Feb 24 | **Remote Control** | `claude remote-control` subcommand for external builds |
| v2.1.51 | Feb 24 | **Custom npm registries** | Plugins support custom npm registries and version pinning |
| v2.1.50 | Feb 20 | **`WorktreeCreate`/`WorktreeRemove` hooks** | Hook events for worktree lifecycle |
| v2.1.50 | Feb 20 | **`isolation: worktree` for agents** | Agent definitions support worktree isolation |
| v2.1.50 | Feb 20 | **`claude agents` CLI** | List all configured agents |
| v2.1.50 | Feb 20 | **Opus 4.6 fast mode** | Full 1M context window |
| v2.1.49 | Feb 19 | **`--worktree` (`-w`) flag** | Start Claude in an isolated git worktree |
| v2.1.49 | Feb 19 | **`Ctrl+F` kill agents** | Kill background agents with two-press confirmation |
| v2.1.49 | Feb 19 | **Agent `background: true`** | Agents can always run as background tasks |
| v2.1.49 | Feb 19 | **`ConfigChange` hook** | New hook event for configuration changes |
| v2.1.45 | Feb 17 | **Claude Sonnet 4.6** | New Sonnet model support |
| v2.1.41 | Feb 13 | **`claude auth` subcommands** | `login`, `status`, `logout` CLI subcommands |
| v2.1.41 | Feb 13 | **Windows ARM64** | Native binary support for win32-arm64 |
| v2.1.36 | Feb 7 | **Fast mode for Opus 4.6** | Fast mode available for Opus 4.6 |
| v2.1.32 | Feb 5 | **Claude Opus 4.6** | New Opus model available |
| v2.1.32 | Feb 5 | **Agent Teams** | Research preview multi-agent collaboration feature |
| v2.1.32 | Feb 5 | **Auto-memory** | Claude records and recalls memories automatically |
| v2.1.32 | Feb 5 | **Skill character budget scaling** | Budget scales with context window (2% of context) |
| v2.1.33 | Feb 6 | **`TeammateIdle`/`TaskCompleted` hooks** | Hook events for multi-agent workflows |
| v2.1.33 | Feb 6 | **`memory` frontmatter** | Agents support memory in frontmatter |

### January 2026 Highlights (v2.1.0 - v2.1.20)

| Version | Date | Feature | Description |
|---------|------|---------|-------------|
| v2.1.0 | Jan 7 | **Skill hot-reload** | Modify skills without restarting |
| v2.1.0 | Jan 7 | **`context: fork`** | Skills and slash commands in forked sub-agent context |
| v2.1.0 | Jan 7 | **`agent` field in skills** | Use custom agents with skills |
| v2.1.0 | Jan 7 | **`language` setting** | Configure Claude's response language |
| v2.1.0 | Jan 7 | **Shift+Enter** | Native multi-line input in iTerm2, WezTerm, Ghostty, Kitty |
| v2.1.0 | Jan 7 | **Wildcard Bash permissions** | Pattern matching for Bash tool permissions |
| v2.1.0 | Jan 7 | **`/teleport` and `/remote-env`** | Transfer sessions between devices |
| v2.1.0 | Jan 7 | **Hooks in frontmatter** | Skills and slash commands support hooks |
| v2.1.0 | Jan 7 | **`--tools` flag (interactive)** | Use `--tools` in interactive mode |
| v2.1.2 | Jan 9 | **Windows winget** | Windows Package Manager installations |
| v2.1.2 | Jan 9 | **OSC 8 hyperlinks** | Clickable file paths in terminals that support OSC 8 |
| v2.1.3 | Jan 9 | **Skills/commands merged** | Simplified model with unified slash commands and skills |
| v2.1.3 | Jan 9 | **Release channels** | `stable` or `latest` toggle in `/config` |
| v2.1.6 | Jan 13 | **`/config` search** | Search functionality in config menu |
| v2.1.6 | Jan 13 | **Nested skill discovery** | Automatic discovery from nested `.claude/skills` directories |
| v2.1.9 | Jan 16 | **`plansDirectory` setting** | Customize plan file storage location |
| v2.1.9 | Jan 16 | **`PreToolUse` additionalContext** | Hooks return additional context to model |
| v2.1.10 | Jan 17 | **`Setup` hook event** | Triggered via `--init`, `--init-only`, or `--maintenance` |
| v2.1.16 | Jan 22 | **Task management system** | New task management with dependency tracking |
| v2.1.16 | Jan 22 | **VS Code plugin management** | Native plugin management in VS Code |
| v2.1.18 | Jan 23 | **Customizable keybindings** | Run `/keybindings` to customize keyboard shortcuts |
| v2.1.20 | Jan 27 | **`--add-dir` CLAUDE.md loading** | Load CLAUDE.md files from additional directories |
| v2.1.20 | Jan 27 | **PR review status indicator** | Shows in prompt footer |

---

## Q4 2025 (October - December 2025)

### v2.0.0 (September 29, 2025)

| Feature | Description |
|---------|-------------|
| **Native VS Code Extension** | New extension with full IDE integration |
| **UI Overhaul** | Fresh design throughout the whole app |
| **`/rewind`** | Undo code changes via checkpoint rollback |
| **`/usage` command** | See plan limits and usage |
| **Tab thinking toggle** | Sticky across sessions |
| **Ctrl+R history search** | Searchable command history |
| **Claude Agent SDK** | Renamed from Claude Code SDK |
| **Dynamic subagents** | Add subagents with `--agents` flag |

### v2.0.12 (October 9, 2025)

**Plugin System Released** - Extend Claude Code with custom commands, agents, hooks, and MCP servers from marketplaces.

### v2.0.20 (October 16, 2025)

**Claude Skills** - Added support for Claude Skills system.

### October - November 2025 Highlights

| Version | Date | Feature |
|---------|------|---------|
| v2.0.10 | Oct 8 | Rewritten terminal renderer, `Ctrl-G` external editor, `PreToolUse` input modification |
| v2.0.17 | Oct 15 | Haiku 4.5 model option, Explore subagent |
| v2.0.19 | Oct 15 | Auto-background long-running bash commands |
| v2.0.21 | Oct 18 | `structuredContent` in MCP responses, `AskUserQuestion` tool |
| v2.0.24 | Oct 20 | Sandbox mode for BashTool on Linux & Mac |
| v2.0.28 | Oct 27 | Plan subagent, resumable subagents, `--max-budget-usd` SDK flag |
| v2.0.30 | Oct 30 | Prompt-based stop hooks |
| v2.0.43 | Nov 18 | `permissionMode` for agents, `tool_use_id` in hooks, `skills` frontmatter, `SubagentStart` hook |
| v2.0.45 | Nov 18 | Microsoft Foundry support, `PermissionRequest` hook |
| v2.0.51 | Nov 24 | **Claude Opus 4.5**, Claude Code for Desktop, Pro extra usage |

### December 2025 Highlights

| Version | Date | Feature |
|---------|------|---------|
| v2.0.58 | Dec 3 | Opus 4.5 for Pro subscribers |
| v2.0.60 | Dec 6 | Background agent support |
| v2.0.64 | Dec 10 | Auto-compacting instant, async agents/bash, `/stats`, named sessions, `.claude/rules/` |
| v2.0.67 | Dec 12 | Thinking mode default for Opus 4.5 |
| v2.0.70 | Dec 15 | Prompt suggestions, wildcard MCP tool permissions, 3x memory improvement |
| v2.0.71 | Dec 16 | New syntax highlighting engine for native build |
| v2.0.72 | Dec 17 | Claude in Chrome (Beta) |
| v2.0.74 | Dec 19 | LSP tool, expanded `/terminal-setup` support |

---

## Q3 2025 (July - September 2025)

### July 2025

| Version | Feature |
|---------|---------|
| v1.0.51 (Jul 11) | **Native Windows support** (requires Git for Windows) |
| v1.0.54 (Jul 19) | `UserPromptSubmit` hook, `argument-hint` in slash commands |
| v1.0.58 (Jul 23) | PDF reading support |
| v1.0.60 (Jul 24) | **Custom subagents** - Run `/agents` to get started |
| v1.0.62 (Jul 28) | `@`-mention typeahead for custom agents, `SessionStart` hook |

### August 2025

| Version | Feature |
|---------|---------|
| v1.0.71 (Aug 7) | Background commands (`Ctrl-B`), customizable status line |
| v1.0.81 (Aug 14) | Output styles (Explanatory, Learning) |
| v1.0.85 (Aug 19) | Status line cost info, `SessionEnd` hook |
| v1.0.90 (Aug 25) | Settings hot-reload (no restart required) |

### September 2025

| Version | Feature |
|---------|---------|
| v1.0.106 (Sep 5) | Windows path permission fixes |
| v1.0.115 (Sep 16) | Thinking mode visual improvements |
| v2.0.0 (Sep 29) | **Major release** - VS Code extension, Agent SDK, UI overhaul |

---

## Q2 2025 (April - June 2025)

### April 2025

| Version | Feature |
|---------|---------|
| v0.2.31 | Custom slash commands from `.claude/commands/` |
| v0.2.32 | Interactive MCP setup wizard (`claude mcp add`) |
| v0.2.34 | Vim bindings |
| v0.2.44 | Thinking mode (`think`, `think harder`, `ultrathink`) |
| v0.2.47 | `Tab` autocomplete, `Shift+Tab` auto-accept toggle, auto-compaction |
| v0.2.50 | MCP "project" scope (`.mcp.json`) |
| v0.2.53 | Web fetch tool |
| v0.2.54 | `#` memory shortcut, `Ctrl+R` full output, MCP SSE transport |
| v0.2.59 | Copy/paste images |
| v0.2.75 | `@`-mention files, drag images, queue messages, `--mcp-config` |

### May 2025

| Version | Feature |
|---------|---------|
| v0.2.93 (Apr 30) | `--continue` and `--resume` for conversation persistence |
| v0.2.96 (May 1) | Claude Max subscription support |
| v0.2.105 (May 8) | **Web search** capability |
| v0.2.107 (May 9) | CLAUDE.md file imports (`@path/to/file.md`) |
| v0.2.108 (May 13) | Real-time message steering while Claude works |
| v0.2.117 (May 17) | `--debug` mode, `cleanupPeriodDays` setting |
| v1.0.0 (May 22) | **General Availability** - Sonnet 4, Opus 4 |

### June 2025

| Version | Feature |
|---------|---------|
| v1.0.11 (Jun 4) | Claude Pro subscription support |
| v1.0.18 (Jun 9) | `--add-dir`, streaming input, detailed MCP display |
| v1.0.23 (Jun 16) | **TypeScript SDK** and **Python SDK** released |
| v1.0.28 (Jun 24) | Streamable HTTP MCP, remote MCP OAuth, MCP resource `@`-mentions |

---

## Hook System Reference

### Hook Types

| Type | Description |
|------|-------------|
| `command` | Execute shell/bash scripts deterministically |
| `prompt` | Use LLM evaluation for context-aware decisions |
| `http` | Call HTTP endpoints (added v2.1.63) |

### Hook Event Types

| Event | When It Fires | Can Block | Added |
|-------|---------------|-----------|-------|
| `PreToolUse` | Before tool execution | Yes | v1.0.38 |
| `PostToolUse` | After tool completes | No | v1.0.38 |
| `UserPromptSubmit` | After user submits prompt | Yes | v1.0.54 |
| `PermissionRequest` | When permission dialog appears | Yes | v2.0.45 |
| `PermissionDenied` | After auto mode classifier denial | No | v2.1.89 |
| `Stop` | When Claude finishes responding | No | v1.0.38 |
| `SubagentStart` | When subagent begins | No | v2.0.43 |
| `SubagentStop` | When subagent completes | No | v1.0.41 |
| `StopFailure` | When stop fails | No | v2.1.78 |
| `SessionStart` | When session begins | No | v1.0.62 |
| `SessionEnd` | When session ends | No | v1.0.85 |
| `Setup` | Via `--init`/`--init-only`/`--maintenance` | No | v2.1.10 |
| `PreCompact` | Before context compression | Yes (exit code 2) | v1.0.48 |
| `PostCompact` | After context compaction | No | v2.1.76 |
| `InstructionsLoaded` | After instructions load | No | v2.1.69 |
| `ConfigChange` | On configuration change | No | v2.1.49 |
| `WorktreeCreate` | When worktree created | No | v2.1.50 |
| `WorktreeRemove` | When worktree removed | No | v2.1.50 |
| `CwdChanged` | When working directory changes | No | v2.1.83 |
| `FileChanged` | When file changes | No | v2.1.83 |
| `TaskCreated` | When task is created | No | v2.1.84 |
| `TaskCompleted` | When task completes | No | v2.1.33 |
| `TeammateIdle` | When agent teammate goes idle | No | v2.1.33 |
| `Elicitation` | MCP elicitation request | No | v2.1.76 |
| `ElicitationResult` | MCP elicitation result | No | v2.1.76 |

---

## Model Timeline

| Date | Model | Notes |
|------|-------|-------|
| May 22, 2025 | Sonnet 4, Opus 4 | v1.0.0 GA release |
| Jul 31, 2025 | Opus 4.1 | v1.0.69 |
| Sep 29, 2025 | Sonnet 4.5 | Default model in v2.0.0 |
| Nov 24, 2025 | Opus 4.5 | v2.0.51, Desktop launch |
| Dec 3, 2025 | Opus 4.5 for Pro | v2.0.58 |
| Feb 5, 2026 | Opus 4.6 | v2.1.32, agent teams, auto-memory |
| Feb 17, 2026 | Sonnet 4.6 | v2.1.45 |
| Apr 16, 2026 | Opus 4.7 | v2.1.111, xhigh effort level |

---

## Version Timeline Summary

| Date | Version | Milestone |
|------|---------|-----------|
| Apr 2, 2025 | v0.2.x | Custom slash commands, MCP, Vim bindings, auto-compaction |
| Apr 30, 2025 | v0.2.93 | Session resume and continue |
| May 8, 2025 | v0.2.105 | Web search capability |
| May 22, 2025 | v1.0.0 | **General Availability** - Sonnet 4, Opus 4 |
| Jun 16, 2025 | v1.0.23 | TypeScript and Python SDK |
| Jun 30, 2025 | v1.0.38 | Hooks system released |
| Jul 11, 2025 | v1.0.51 | Native Windows support |
| Jul 24, 2025 | v1.0.60 | Custom subagents |
| Aug 7, 2025 | v1.0.71 | Background commands, status line |
| Sep 29, 2025 | v2.0.0 | **v2.0** - VS Code extension, Agent SDK, UI overhaul |
| Oct 9, 2025 | v2.0.12 | **Plugin System** released |
| Oct 16, 2025 | v2.0.20 | **Claude Skills** support |
| Oct 20, 2025 | v2.0.24 | Sandbox mode for BashTool |
| Nov 18, 2025 | v2.0.43 | Advanced hooks (permissionMode, tool_use_id, SubagentStart) |
| Nov 24, 2025 | v2.0.51 | **Opus 4.5**, Claude Code for Desktop |
| Dec 6, 2025 | v2.0.60 | Background agents |
| Dec 10, 2025 | v2.0.64 | Auto-compacting, `.claude/rules/`, named sessions |
| Jan 7, 2026 | v2.1.0 | **v2.1** - Skill hot-reload, forked context, language setting |
| Jan 9, 2026 | v2.1.3 | Skills and slash commands merged |
| Jan 22, 2026 | v2.1.16 | Task management system |
| Jan 23, 2026 | v2.1.18 | Customizable keybindings |
| Feb 5, 2026 | v2.1.32 | **Opus 4.6**, agent teams, auto-memory |
| Feb 19, 2026 | v2.1.49 | `--worktree` flag, agent worktree isolation |
| Feb 20, 2026 | v2.1.50 | WorktreeCreate/Remove hooks, `claude agents` CLI |
| Feb 26, 2026 | v2.1.59 | Auto-memory, `/copy` command |
| Mar 5, 2026 | v2.1.69 | `/claude-api` skill, `/reload-plugins`, `InstructionsLoaded` hook |
| Mar 7, 2026 | v2.1.71 | `/loop` command, cron scheduling |
| Mar 13, 2026 | v2.1.75 | 1M context for Opus 4.6 |
| Mar 14, 2026 | v2.1.76 | MCP elicitation, `/effort`, PostCompact hook |
| Mar 17, 2026 | v2.1.78 | Line-by-line streaming, `StopFailure` hook |
| Mar 25, 2026 | v2.1.83 | `managed-settings.d/`, transcript search, `CwdChanged`/`FileChanged` hooks |
| Apr 1, 2026 | v2.1.89-90 | `/powerup`, `NO_FLICKER`, `"defer"` hook decision |
| Apr 13, 2026 | v2.1.105 | PreCompact hook blocking, background monitors |
| Apr 15, 2026 | v2.1.110 | `/tui` fullscreen, push notifications, `/focus` |
| Apr 16, 2026 | v2.1.111 | **Opus 4.7**, xhigh effort, `/ultrareview`, PowerShell tool |
| Apr 18, 2026 | v2.1.114 | Latest release |

---

## Sources

- [Claude Code Changelog (Official)](https://docs.anthropic.com/en/docs/claude-code/changelog)
- [Claude Code GitHub Releases](https://github.com/anthropics/claude-code/releases)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
