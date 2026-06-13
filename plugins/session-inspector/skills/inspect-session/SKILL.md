---
name: inspect-session
description: Inspect and analyze agent session transcripts from Claude Code, Codex CLI, or Copilot CLI. Use when debugging stopped agents, checking what an agent did, diagnosing "no response" sessions, or extracting summaries from session files.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Session Inspector

Analyze agent session transcripts across three CLI tools. Each stores session data differently:

| Agent | Location | Format |
|-------|----------|--------|
| Claude Code | `~/.claude/projects/` | JSONL per session, dir per working directory |
| Codex CLI | `~/.codex/sessions/YYYY/MM/DD/` | JSONL per session, `{ timestamp, type, payload }` envelope |
| Copilot CLI | `~/.copilot/session-state/<uuid>/` | `events.jsonl` per session |

## Quick Analysis Script

Run the bundled `analyze-session.mjs` for any agent's session files. The script
ships with this plugin — reference it via `${CLAUDE_PLUGIN_ROOT}` so the path
resolves regardless of the current working directory:

```bash
# Analyze the latest session for an agent (claude | codex | copilot)
node "${CLAUDE_PLUGIN_ROOT}/scripts/analyze-session.mjs" --agent claude --latest

# Auto-detect agent + pick the most recent session across all three
node "${CLAUDE_PLUGIN_ROOT}/scripts/analyze-session.mjs" --agent auto --latest

# Analyze a specific file (agent auto-detected from content if --agent auto)
node "${CLAUDE_PLUGIN_ROOT}/scripts/analyze-session.mjs" --agent codex "path/to/session.jsonl"

# Analyze by Claude session LOCATOR — "<projects-folder>/<session-id>" or a bare
# "<session-id>". This is the form a statusline can show and a user can paste
# ("check what issues <paste> has"); it resolves under ~/.claude/projects/.
node "${CLAUDE_PLUGIN_ROOT}/scripts/analyze-session.mjs" --agent claude "F--projects-myapp/28ddc5d5-6dd2-4f62-a6d1-adbdea490e79"

# List recent sessions for an agent
node "${CLAUDE_PLUGIN_ROOT}/scripts/analyze-session.mjs" --agent claude --list
```

When the user pastes such a locator and asks to "check what issues it has", pass
it straight to the script as the path argument — no need to reconstruct the full
`~/.claude/projects/...jsonl` path.

Output includes: model, duration, turns, tool usage, commands run, files
modified, agent messages, and errors.

## Fleet analysis — across MANY sessions

`analyze-session.mjs` debugs **one** session. For aggregate, time-scoped questions across your whole session history — "what burned the most tokens", "which tools fail most", "what did I ask yesterday" — do **not** loop the single-session analyzer. Three bundled fan-out scripts answer these directly. Each stat-filters by file mtime FIRST, then parses only the in-window files (no N+1 scan), and supports `--json`.

```bash
# Token / cost sinks — rank what consumed the most across sessions (last 7d default)
node scripts/token-sinks.mjs                 # by session, ranked by estimated USD cost
node scripts/token-sinks.mjs --by project    # also: day | model | provider | session
node scripts/token-sinks.mjs --days 14 --top 30 --provider claude --sort tokens

# Failed tool calls — what's failing / what agents are fighting (last 7d default)
node scripts/tool-failures.mjs               # by tool, ranked by failure count
node scripts/tool-failures.mjs --by error    # cluster by normalized error signature (best for root-causing)
node scripts/tool-failures.mjs --sort rate --min 15   # highest failure RATE among tools with >=15 calls

# Human prompts — what you actually typed (default: yesterday, local time)
node scripts/user-prompts.mjs                # human-typed prompts only (automated traffic filtered)
node scripts/user-prompts.mjs --today
node scripts/user-prompts.mjs --days 7 --tree   # hierarchical Project → Day → Chat
```

Coverage and caveats:
- **token-sinks** — Claude (per-assistant-turn `usage`) + Codex (cumulative `token_count`). Cost ranking prices cache-read at ~0.1x and cache-write at ~1.25x, so cost is the *true* sink ranking (raw token counts are dominated by cheap cache-read). Codex tokens are counted but not costed (different provider → `$0.00`); non-Anthropic models routed through Claude Code fall back to opus pricing (over-estimate — spot them with `--by model`). Pricing constants live at the top of the script.
- **tool-failures** — Claude failure = a `tool_result` with `is_error:true` (mapped to its tool via `tool_use_id`); Codex failure = a `function_call_output` showing a nonzero `Exit code: N` (mapped via `call_id`). `--by error` normalizes paths/numbers/quotes into a signature so identical failures cluster.
- **user-prompts** — extracts only HUMAN-typed prompts; filters tool_results, sidechain/subagent turns, meta entries, harness `<task-notification>`/`<bash-stdout>` echoes, session handoffs, and bare UI slash commands (`/clear`, `/model`). Date scoping uses each ENTRY's own local-time timestamp (a session can span midnight); mtime is only the pre-filter. Covers Claude + Codex.

## Claude Code Sessions

Claude has **two JSONL schemas**, and the analyzer handles both:

- **On-disk transcript** (`~/.claude/projects/*.jsonl`, what this system stores):
  identity fields (`sessionId`, `cwd`, `gitBranch`) are **top-level on every
  record**; the model is `message.model` and token usage is `message.usage`
  (including `cache_creation_input_tokens` / `cache_read_input_tokens`) on each
  `assistant` record. There is **no** `system/init` or `result` line.
- **Stream-json** (`claude -p --output-format stream-json`): a
  `{type:"system",subtype:"init"}` event carries model/session_id/cwd, and a
  final `{type:"result"}` event carries cumulative `usage` + `total_cost_usd`.

The analyzer captures identity/model/tokens from whichever schema a file uses;
the on-disk "in" token figure includes cached input, so it can be large.

### Directory structure

Claude maps each working directory to a session dir by replacing path separators with `--`:
- `C:\projects\my-app` -> `C--projects--my-app`
- `C:\worktrees\feature-123-desc` -> `C--worktrees-feature-123-desc`

Multiple `.jsonl` files = multiple sessions. Sort by `LastWriteTime` descending for latest.

### Event types

| Type | Description |
|------|-------------|
| `system` (subtype: `init`) | Session start: model, sessionId, cwd, tools |
| `user` | User/tool-result messages |
| `assistant` | Assistant response with content array (text, thinking, tool_use blocks) |
| `result` | Final result with cost/duration, stop_reason |

### stop_reason values

| stop_reason | Meaning |
|-------------|---------|
| `end_turn` | Normal completion |
| `tool_use` | Interrupted mid-tool (still running or killed) |
| `stop_sequence` | Often auth failure or rate limit |
| `max_tokens` | Hit token limit |
| *(absent)* | Session has prompt but no response — agent never replied |

### Manual inspection commands

```powershell
# List all session dirs for worktrees
Get-ChildItem "$env:USERPROFILE\.claude\projects" -Directory |
  Where-Object { $_.Name -like "*--worktrees*" } |
  Sort-Object Name |
  ForEach-Object {
    $files = Get-ChildItem $_.FullName -Filter "*.jsonl" | Sort-Object LastWriteTime -Descending
    $latest = $files | Select-Object -First 1
    $size = if ($latest) { "$([math]::Round($latest.Length/1KB))KB" } else { "-" }
    "  $($files.Count) sessions  latest: $size  $($_.Name.Substring(0,[math]::Min(60,$_.Name.Length)))"
  }

# Read the last assistant message
$file = "PATH\TO\session.jsonl"
$lines = Get-Content $file -Tail 80
$lastAssistant = $null
foreach ($line in $lines) {
  $obj = $line | ConvertFrom-Json -ErrorAction SilentlyContinue
  if ($obj -and $obj.type -eq "assistant") { $lastAssistant = $obj }
}
$lastAssistant.message.content |
  Where-Object { $_.type -eq "text" } |
  Select-Object -First 1 -ExpandProperty text
```

## Codex CLI Sessions

### Event types

Each line is `{ timestamp, type, payload }`. Key types:

| Type | Payload subtypes / contents |
|------|----------------------------|
| `session_meta` | id, cwd, model_provider, cli_version, base_instructions |
| `event_msg` | `user_message`, `agent_message`, `task_started`, `task_complete`, `token_count`, `patch_apply_end`, `web_search_end`, `context_compacted` |
| `response_item` | `message` (assistant text), `reasoning` (encrypted), `function_call`, `function_call_output`, `custom_tool_call`, `custom_tool_call_output`, `tool_search_call`, `web_search_call` |
| `turn_context` | model, cwd, approval_policy, sandbox_policy |
| `compacted` | Context window compaction |

### Manual inspection

```powershell
# List recent Codex sessions
Get-ChildItem "$env:USERPROFILE\.codex\sessions" -Recurse -Filter "*.jsonl" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 10 |
  ForEach-Object {
    "  $($_.LastWriteTime.ToString('yyyy-MM-dd HH:mm'))  $([math]::Round($_.Length/1KB))KB  $($_.Name.Substring(0,[math]::Min(60,$_.Name.Length)))"
  }

# Parse Codex session tail
$file = "PATH\TO\codex-session.jsonl"
$lines = Get-Content $file -Tail 60
$agentMsgs = 0; $lastText = ""; $toolCalls = 0
foreach ($line in $lines) {
  try { $obj = $line | ConvertFrom-Json } catch { continue }
  if ($obj.type -eq "event_msg" -and $obj.payload.type -eq "agent_message") {
    $lastText = $obj.payload.message; $agentMsgs++
  }
  if ($obj.type -eq "response_item" -and $obj.payload.type -eq "function_call") {
    $toolCalls++
  }
}
Write-Output "Agent msgs: $agentMsgs  Tool calls: $toolCalls  Last: $lastText"
```

## Copilot CLI Sessions

### Session structure

Copilot stores sessions under `~/.copilot/session-state/<uuid>/`:
- `events.jsonl` — full session transcript
- `workspace.yaml` — metadata (session id, cwd, branch, task name)

### Event types in `events.jsonl`

| Type | Description |
|------|-------------|
| `session.start` | Session init: sessionId, copilotVersion, context (cwd, branch) |
| `session.model_change` | Model switch: newModel |
| `system.message` | System prompt (can be very long) |
| `user.message` | User prompt: content |
| `assistant.turn_start` / `assistant.turn_end` | Turn boundaries |
| `assistant.message` | Agent response: content, model, toolRequests |
| `tool.execution_start` / `tool.execution_complete` | Tool calls: toolCallId, toolName, arguments, result |
| `hook.start` / `hook.end` | Hook execution: hookType, success |
| `system.notification` | Background notifications (shell completed, etc.) |
| `session.shutdown` | End: shutdownType, totalApiDurationMs, codeChanges |

### Manual inspection

```powershell
# List Copilot sessions
Get-ChildItem "$env:USERPROFILE\.copilot\session-state" -Directory |
  Sort-Object LastWriteTime -Descending |
  ForEach-Object {
    $eventsFile = Join-Path $_.FullName "events.jsonl"
    $hasEvents = Test-Path $eventsFile
    $size = if ($hasEvents) { "$([math]::Round((Get-Item $eventsFile).Length/1KB))KB" } else { "(no events)" }
    "  $($_.LastWriteTime.ToString('yyyy-MM-dd HH:mm'))  $size  $($_.Name)"
  }

# Parse Copilot session tail
$file = "PATH\TO\events.jsonl"
$lines = Get-Content $file -Tail 30
$agentMsgs = 0; $lastText = ""; $toolCalls = 0
foreach ($line in $lines) {
  try { $obj = $line | ConvertFrom-Json } catch { continue }
  if ($obj.type -eq "assistant.message" -and $obj.data.content) {
    $lastText = $obj.data.content; $agentMsgs++
  }
  if ($obj.type -eq "tool.execution_start" -and $obj.data.toolName) {
    $toolCalls++
  }
}
Write-Output "Agent msgs: $agentMsgs  Tool calls: $toolCalls  Last: $lastText"
```

### Process logs

`~/.copilot/logs/process-<timestamp>-<pid>.log` has structured logs for MCP loading, model requests, and errors:

```powershell
Get-ChildItem "$env:USERPROFILE\.copilot\logs" -Filter "*.log" |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1 |
  ForEach-Object { Get-Content $_.FullName | Where-Object { $_ -match "\[ERROR\]|Skipping|Workspace initialized" } }
```

## Tips

- **Never read a large JSONL without tailing** — some files are 1-2MB+. Use `Get-Content -Tail N` or the analysis script.
- Each JSONL line is self-contained; parse line-by-line with `ConvertFrom-Json -ErrorAction SilentlyContinue`.
- For **Claude**: `ai-title`, `queue-operation`, `attachment` entries are metadata — only `user` and `assistant` carry content.
- For **Codex**: every line wraps in `{ timestamp, type, payload }`. The `response_item` subtype is in `payload.type`.
- For **Copilot**: every line has `{ type, data, id, timestamp, parentId }`. Events link via `parentId`.
- Sessions with very few lines and no assistant content = process started but exited before the model responded. Check for auth errors or process kills.
