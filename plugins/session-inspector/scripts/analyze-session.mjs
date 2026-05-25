#!/usr/bin/env node
/**
 * Analyze agent session JSONL files from Claude Code, Codex CLI, or Copilot CLI.
 *
 * Usage:
 *   node analyze-session.mjs --agent claude --latest
 *   node analyze-session.mjs --agent codex "path/to/session.jsonl"
 *   node analyze-session.mjs --agent copilot --list
 *   node analyze-session.mjs --agent auto "path/to/session.jsonl"
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, resolve } from "path";
import { homedir } from "os";

// ── Parsers ──────────────────────────────────────────────────────────────

// Handles BOTH Claude session formats:
//  1. On-disk transcript (~/.claude/projects/*.jsonl): identity fields
//     (sessionId, cwd, gitBranch) are top-level on every record; model and
//     token usage live under `message` on each `assistant` record; there is no
//     `system/init` or `result` line.
//  2. Stream-json (`claude -p --output-format stream-json`): a `system`/`init`
//     event carries model/session_id/cwd, and a final `result` event carries
//     cumulative usage + cost.
function parseClaudeSession(lines) {
  const stats = { model: "", sessionId: "", cwd: "", gitBranch: "", turns: 0, toolCalls: 0, toolNames: {}, commands: [], userMessages: [], assistantMessages: [], stopReason: "", startTime: "", endTime: "", inputTokens: 0, outputTokens: 0, totalCostUsd: 0, errors: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let obj; try { obj = JSON.parse(trimmed); } catch { continue; }
    const ts = obj.timestamp; if (ts) { if (!stats.startTime) stats.startTime = ts; stats.endTime = ts; }

    // Identity: top-level on transcript records, or on the stream-json init event.
    if (!stats.sessionId) stats.sessionId = obj.sessionId || obj.session_id || "";
    if (!stats.cwd && obj.cwd) stats.cwd = obj.cwd;
    if (!stats.gitBranch && obj.gitBranch) stats.gitBranch = obj.gitBranch;

    if (obj.type === "system" && obj.subtype === "init") {        // stream-json
      if (obj.model) stats.model = obj.model;
    } else if (obj.type === "user") {
      const content = obj.message?.content;
      if (typeof content === "string" && content.trim()) stats.userMessages.push(content.trim());
      else if (Array.isArray(content)) {
        for (const b of content) { if (b.type === "text" && b.text?.trim()) { stats.userMessages.push(b.text.trim()); break; } }
      }
    } else if (obj.type === "assistant") {
      stats.turns++;
      const m = obj.message || {};
      if (!stats.model && m.model) stats.model = m.model;          // on-disk transcript
      if (m.stop_reason) stats.stopReason = m.stop_reason;
      for (const block of (m.content || [])) {
        if (block.type === "text" && block.text?.trim()) stats.assistantMessages.push(block.text.trim());
        if (block.type === "tool_use") { stats.toolCalls++; stats.toolNames[block.name] = (stats.toolNames[block.name] || 0) + 1; }
      }
      // Transcript format has no `result` line — accumulate usage per assistant
      // turn. Includes cache tokens so the "in" figure reflects real context.
      const u = m.usage;
      if (u) {
        stats.inputTokens += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        stats.outputTokens += (u.output_tokens || 0);
      }
    } else if (obj.type === "result") {                           // stream-json: authoritative totals
      const u = obj.usage || obj;
      if (u.input_tokens != null) stats.inputTokens = u.input_tokens;
      if (u.output_tokens != null) stats.outputTokens = u.output_tokens;
      stats.totalCostUsd = obj.total_cost_usd || obj.cost_usd || stats.totalCostUsd;
      if (obj.subtype === "error" || obj.is_error) stats.errors.push(obj.result || "error");
    }
  }
  return stats;
}

function parseCodexSession(lines) {
  const stats = { model: "", sessionId: "", cwd: "", cliVersion: "", turns: 0, toolCalls: 0, toolNames: {}, commands: [], userMessages: [], assistantMessages: [], patchesApplied: [], webSearches: [], inputTokens: 0, outputTokens: 0, startTime: "", endTime: "" };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let obj; try { obj = JSON.parse(trimmed); } catch { continue; }
    const ts = obj.timestamp; if (ts) { if (!stats.startTime) stats.startTime = ts; stats.endTime = ts; }
    const payload = obj.payload || {};

    if (obj.type === "session_meta") {
      stats.sessionId = payload.id || ""; stats.cwd = payload.cwd || ""; stats.cliVersion = payload.cli_version || "";
    } else if (obj.type === "turn_context") {
      if (payload.model) stats.model = payload.model;
    } else if (obj.type === "event_msg") {
      const mt = payload.type;
      if (mt === "user_message" && payload.message) stats.userMessages.push(payload.message);
      else if (mt === "agent_message" && payload.message) { if (!stats.assistantMessages) stats.assistantMessages = []; stats.assistantMessages.push(payload.message); }
      else if (mt === "task_started") stats.turns++;
      else if (mt === "token_count" && payload.info?.total_token_usage) {
        stats.inputTokens = payload.info.total_token_usage.input_tokens || 0;
        stats.outputTokens = payload.info.total_token_usage.output_tokens || 0;
      } else if (mt === "patch_apply_end") {
        stats.patchesApplied.push(...Object.keys(payload.changes || {}));
      } else if (mt === "web_search_end") {
        stats.webSearches.push(payload.query || "");
      }
    } else if (obj.type === "response_item") {
      const ri = payload.type;
      if (ri === "function_call") {
        stats.toolCalls++; stats.toolNames[payload.name] = (stats.toolNames[payload.name] || 0) + 1;
        let parsed = {}; try { parsed = JSON.parse(payload.arguments || "{}"); } catch {}
        if (payload.name === "shell_command" && parsed.command) stats.commands.push(parsed.command);
      } else if (ri === "custom_tool_call") {
        stats.toolCalls++; stats.toolNames[payload.name] = (stats.toolNames[payload.name] || 0) + 1;
      }
    }
  }
  return stats;
}

function parseCopilotSession(lines) {
  const stats = { model: "", sessionId: "", copilotVersion: "", cwd: "", branch: "", turns: 0, toolCalls: 0, toolNames: {}, commands: [], userMessages: [], assistantMessages: [], hooks: 0, shutdownType: "", totalApiDurationMs: 0, linesAdded: 0, linesRemoved: 0, filesModified: [], startTime: "", endTime: "" };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let obj; try { obj = JSON.parse(trimmed); } catch { continue; }
    const ts = obj.timestamp;
    if (ts && (!stats.endTime || ts > stats.endTime)) stats.endTime = ts;
    const data = obj.data || {};

    if (obj.type === "session.start") {
      stats.sessionId = data.sessionId || ""; stats.copilotVersion = data.copilotVersion || "";
      stats.cwd = data.context?.cwd || ""; stats.branch = data.context?.branch || "";
      stats.startTime = data.startTime || ts || "";
    } else if (obj.type === "session.model_change") {
      stats.model = data.newModel || stats.model;
    } else if (obj.type === "user.message") {
      stats.userMessages.push(data.content || "");
    } else if (obj.type === "assistant.turn_start") {
      stats.turns++;
    } else if (obj.type === "assistant.message") {
      if (data.content) stats.assistantMessages.push(data.content);
      if (data.model && !stats.model) stats.model = data.model;
      for (const tr of (data.toolRequests || [])) {
        stats.toolCalls++; stats.toolNames[tr.name] = (stats.toolNames[tr.name] || 0) + 1;
        if (tr.name === "shell" && tr.arguments?.command) stats.commands.push(tr.arguments.command);
      }
    } else if (obj.type === "hook.start") {
      stats.hooks++;
    } else if (obj.type === "session.shutdown") {
      stats.shutdownType = data.shutdownType || "";
      stats.totalApiDurationMs = data.totalApiDurationMs || 0;
      stats.linesAdded = data.codeChanges?.linesAdded || 0;
      stats.linesRemoved = data.codeChanges?.linesRemoved || 0;
      stats.filesModified = data.codeChanges?.filesModified || [];
    }
  }
  return stats;
}

// ── Auto-detect agent type from file content ─────────────────────────────

function detectAgentType(lines) {
  // Scan beyond the first lines: transcripts often start with metadata records
  // (file-history-snapshot, summary) before the first content record.
  let scanned = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (++scanned > 20) break;
    let obj; try { obj = JSON.parse(trimmed); } catch { continue; }
    // Copilot: { type: "session.start", data: { sessionId, copilotVersion } }
    if (obj.type === "session.start" && obj.data?.copilotVersion) return "copilot";
    if (obj.type === "assistant.message" && obj.data?.messageId) return "copilot";
    // Codex: { timestamp, type: "session_meta" | "response_item", payload: {...} }
    if (obj.type === "session_meta" && (obj.payload?.cli_version || obj.payload?.model_provider)) return "codex";
    if (obj.type === "response_item") return "codex";
    // Claude stream-json: { type: "system", subtype: "init" }
    if (obj.type === "system" && obj.subtype === "init") return "claude";
    // Claude on-disk transcript: per-record sessionId + a message envelope
    if ((obj.type === "user" || obj.type === "assistant") && obj.sessionId && obj.message) return "claude";
    if (obj.type === "assistant" && obj.message?.content) return "claude";
  }
  return "unknown";
}

// ── Formatting ───────────────────────────────────────────────────────────

function formatDuration(sec) {
  if (!sec || sec < 0) return "?";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function trunc(str, max = 300) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function printClaudeSummary(stats) {
  const duration = stats.startTime && stats.endTime
    ? formatDuration(Math.round((new Date(stats.endTime) - new Date(stats.startTime)) / 1000))
    : "?";
  console.log(`Session:    ${stats.sessionId ? stats.sessionId.slice(0, 8) + "..." : "?"}`);
  console.log(`Model:      ${stats.model || "?"}`);
  console.log(`CWD:        ${stats.cwd || "?"}`);
  if (stats.gitBranch) console.log(`Branch:     ${stats.gitBranch}`);
  console.log(`Duration:   ${duration}`);
  console.log(`Stop:       ${stats.stopReason || "(running / no response)"}`);
  console.log(`Tokens:     ${formatTokens(stats.inputTokens)} in / ${formatTokens(stats.outputTokens)} out`);
  if (stats.totalCostUsd > 0) console.log(`Cost:       $${stats.totalCostUsd.toFixed(4)}`);
}

function printCodexSummary(stats) {
  const duration = stats.startTime && stats.endTime
    ? formatDuration(Math.round((new Date(stats.endTime) - new Date(stats.startTime)) / 1000))
    : "?";
  console.log(`Session:    ${stats.sessionId.slice(0, 8)}...`);
  console.log(`Model:      ${stats.model}`);
  console.log(`CWD:        ${stats.cwd}`);
  console.log(`CLI:        v${stats.cliVersion}`);
  console.log(`Duration:   ${duration}`);
  console.log(`Tokens:     ${formatTokens(stats.inputTokens)} in / ${formatTokens(stats.outputTokens)} out`);
  if (stats.patchesApplied.length) console.log(`Patches:    ${stats.patchesApplied.length} applied`);
  if (stats.webSearches.length) console.log(`Searches:   ${stats.webSearches.length}`);
}

function printCopilotSummary(stats) {
  const duration = stats.startTime
    ? formatDuration(Math.round((new Date(stats.endTime || stats.startTime) - new Date(stats.startTime)) / 1000))
    : "?";
  console.log(`Session:    ${stats.sessionId.slice(0, 8)}...`);
  console.log(`Model:      ${stats.model}`);
  console.log(`Copilot:    v${stats.copilotVersion}`);
  console.log(`CWD:        ${stats.cwd}`);
  console.log(`Branch:     ${stats.branch}`);
  console.log(`Duration:   ${duration} (API: ${formatDuration(Math.round(stats.totalApiDurationMs / 1000))})`);
  console.log(`Shutdown:   ${stats.shutdownType || "(running)"}`);
  if (stats.linesAdded || stats.linesRemoved) {
    console.log(`Changes:    +${stats.linesAdded}/-${stats.linesRemoved} lines in ${stats.filesModified.length} files`);
  }
}

function printCommon(stats) {
  console.log(`Turns:      ${stats.turns}`);
  console.log(`Tool calls: ${stats.toolCalls}`);

  if (stats.userMessages.length) {
    console.log(`\n${"─".repeat(40)}\nUSER MESSAGES\n${"─".repeat(40)}`);
    for (const m of stats.userMessages) console.log(`  → ${trunc(m, 200)}`);
  }

  if (stats.toolCalls) {
    console.log(`\n${"─".repeat(40)}\nTOOL USAGE\n${"─".repeat(40)}`);
    for (const [name, count] of Object.entries(stats.toolNames).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${name}: ${count} calls`);
    }
  }

  if (stats.commands?.length) {
    console.log(`\n${"─".repeat(40)}\nCOMMANDS\n${"─".repeat(40)}`);
    for (const c of stats.commands) console.log(`  $ ${trunc(c, 120)}`);
  }

  if (stats.assistantMessages.length) {
    console.log(`\n${"─".repeat(40)}\nAGENT MESSAGES (last 5)\n${"─".repeat(40)}`);
    for (const m of stats.assistantMessages.slice(-5)) { console.log(`  ${trunc(m)}`); console.log(); }
  }
}

// ── Session Discovery ────────────────────────────────────────────────────

function discoverClaudeSessions() {
  const dir = join(homedir(), ".claude", "projects");
  if (!existsSync(dir)) return [];
  const sessions = [];
  for (const d of readdirSync(dir)) {
    const full = join(dir, d);
    if (!statSync(full).isDirectory()) continue;
    for (const f of readdirSync(full)) {
      if (!f.endsWith(".jsonl")) continue;
      const fp = join(full, f);
      sessions.push({ path: fp, name: `${d}/${f}`, size: statSync(fp).size, modified: statSync(fp).mtime });
    }
  }
  return sessions.sort((a, b) => b.modified - a.modified);
}

function discoverCodexSessions() {
  const dir = join(homedir(), ".codex", "sessions");
  if (!existsSync(dir)) return [];
  const sessions = [];
  function walk(d) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const s = statSync(full);
      if (s.isDirectory()) walk(full);
      else if (entry.endsWith(".jsonl")) {
        sessions.push({ path: full, name: entry, size: s.size, modified: s.mtime });
      }
    }
  }
  walk(dir);
  return sessions.sort((a, b) => b.modified - a.modified);
}

function discoverCopilotSessions() {
  const dir = join(homedir(), ".copilot", "session-state");
  if (!existsSync(dir)) return [];
  const sessions = [];
  for (const d of readdirSync(dir)) {
    const full = join(dir, d);
    if (!statSync(full).isDirectory()) continue;
    const eventsFile = join(full, "events.jsonl");
    if (existsSync(eventsFile)) {
      sessions.push({ path: eventsFile, name: d, size: statSync(eventsFile).size, modified: statSync(full).mtime });
    } else {
      sessions.push({ path: null, name: d, size: 0, modified: statSync(full).mtime });
    }
  }
  return sessions.sort((a, b) => b.modified - a.modified);
}

// ── Locator resolution ───────────────────────────────────────────────────
// Accept a Claude session "locator" as shown in a statusline — either
// "<projects-folder>/<session-id>" (the form copy-pasted between agents) or a
// bare "<session-id>" — and resolve it to the transcript path under
// ~/.claude/projects/. Falls back to the literal arg so readFileSync reports a
// clear error if nothing matches.
function resolveSessionPath(p) {
  if (existsSync(p)) return p;
  const abs = resolve(p);
  if (existsSync(abs)) return abs;
  const base = join(homedir(), ".claude", "projects");
  const norm = p.replace(/\\/g, "/");
  for (const cand of [join(base, norm), join(base, norm + ".jsonl")]) {
    if (existsSync(cand)) return cand;
  }
  // Bare "<session-id>": search each project folder for "<id>.jsonl".
  if (!norm.includes("/") && existsSync(base)) {
    const fname = norm.endsWith(".jsonl") ? norm : norm + ".jsonl";
    for (const d of readdirSync(base)) {
      const f = join(base, d, fname);
      if (existsSync(f)) return f;
    }
  }
  return p;
}

// ── Main ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let agentType = "auto";
let filePath = null;
let doList = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--agent" && args[i + 1]) { agentType = args[++i]; }
  else if (args[i] === "--list") { doList = true; }
  else if (args[i] === "--latest") { /* handled below */ }
  else if (!args[i].startsWith("-")) { filePath = args[i]; }
}

const isLatest = args.includes("--latest");

if (doList) {
  let sessions;
  if (agentType === "claude") sessions = discoverClaudeSessions();
  else if (agentType === "codex") sessions = discoverCodexSessions();
  else if (agentType === "copilot") sessions = discoverCopilotSessions();
  else {
    console.log("Specify --agent claude|codex|copilot with --list");
    process.exit(1);
  }
  console.log(`Found ${sessions.length} ${agentType} sessions\n`);
  for (const s of sessions.slice(0, 20)) {
    const size = s.size ? `${(s.size / 1024).toFixed(0)}KB` : "(no events)";
    console.log(`  ${s.modified.toISOString().slice(0, 16)}  ${size}  ${s.name.slice(0, 60)}`);
  }
  process.exit(0);
}

if (!filePath && !isLatest) {
  console.log("Usage: node analyze-session.mjs --agent <claude|codex|copilot|auto> [--list|--latest|<path>]");
  process.exit(1);
}

if (isLatest && !filePath) {
  let sessions;
  if (agentType === "claude") sessions = discoverClaudeSessions();
  else if (agentType === "codex") sessions = discoverCodexSessions();
  else if (agentType === "copilot") sessions = discoverCopilotSessions();
  else {
    // auto: try all, pick most recent
    const all = [
      ...discoverClaudeSessions().map(s => ({ ...s, agent: "claude" })),
      ...discoverCodexSessions().map(s => ({ ...s, agent: "codex" })),
      ...discoverCopilotSessions().filter(s => s.path).map(s => ({ ...s, agent: "copilot" })),
    ].sort((a, b) => b.modified - a.modified);
    if (!all.length) { console.error("No sessions found."); process.exit(1); }
    agentType = all[0].agent;
    filePath = all[0].path;
    console.log(`Auto-detected: ${agentType} session from ${all[0].modified.toISOString().slice(0, 16)}\n`);
  }
  if (!filePath) {
    if (!sessions?.length) { console.error("No sessions found."); process.exit(1); }
    const withPath = sessions.filter(s => s.path);
    if (!withPath.length) { console.error("No sessions with transcript files."); process.exit(1); }
    filePath = withPath[0].path;
  }
}

const resolvedPath = resolveSessionPath(filePath);
const content = readFileSync(resolvedPath, "utf-8");
const lines = content.split("\n");

if (agentType === "auto") {
  agentType = detectAgentType(lines);
  console.log(`Detected agent type: ${agentType}\n`);
}

const sep = "=".repeat(60);
console.log(sep);
console.log(`${agentType.toUpperCase()} SESSION SUMMARY`);
console.log(sep + "\n");

let stats;
switch (agentType) {
  case "claude":
    stats = parseClaudeSession(lines);
    printClaudeSummary(stats);
    break;
  case "codex":
    stats = parseCodexSession(lines);
    printCodexSummary(stats);
    break;
  case "copilot":
    stats = parseCopilotSession(lines);
    printCopilotSummary(stats);
    break;
  default:
    console.log("Could not detect agent type. Use --agent claude|codex|copilot");
    process.exit(1);
}

printCommon(stats);
console.log(sep);
