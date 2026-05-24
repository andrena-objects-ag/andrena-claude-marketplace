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

Save and run `scripts/analyze-session.mjs` for any agent's session files:

```bash
# Analyze a Claude session
node scripts/analyze-session.mjs --agent claude --latest

# Analyze a Codex session
node scripts/analyze-session.mjs --agent codex --latest

# Analyze a Copilot session
node scripts/analyze-session.mjs --agent copilot --latest

# Analyze a specific file
node scripts/analyze-session.mjs --agent codex "path/to/session.jsonl"

# List sessions for an agent
node scripts/analyze-session.mjs --agent codex --list
node scripts/analyze-session.mjs --agent copilot --list
```

Output includes: model, duration, turns, tool usage, commands run, files modified, agent messages, and errors.

## Claude Code Sessions

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
