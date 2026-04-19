#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Smart Hooks Runner – reads config from $CLAUDE_PROJECT_DIR and runs checks
// ---------------------------------------------------------------------------

const EXIT_PASS = 0;
const EXIT_BLOCK = 2;

// ── Helpers ────────────────────────────────────────────────────────────────

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve("{}"));
  });
}

function safeParseJSON(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}

function matchFilePatterns(filePath, patterns) {
  if (!patterns || patterns.length === 0) return true;
  for (const pattern of patterns) {
    const regexStr = pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");
    const re = new RegExp("^" + regexStr + "$", "i");
    if (re.test(filePath)) return true;
  }
  return false;
}

function getProjectDir() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function getConfigPath() {
  return path.join(getProjectDir(), ".claude", "hooks", "smart-hooks-config.json");
}

function loadConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) return null;
  const raw = fs.readFileSync(configPath, "utf8");
  return safeParseJSON(raw);
}

// ── Check runner ───────────────────────────────────────────────────────────

function runCheck(check, filePath) {
  if (!check.enabled) return { passed: true, skipped: true };

  let command = check.command;
  if (filePath && command.includes("{file}")) {
    command = command.replace(/\{file\}/g, filePath);
  }

  const timeout = (check.timeout || 30) * 1000;

  try {
    execSync(command, {
      cwd: getProjectDir(),
      timeout,
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf8",
      shell: true,
      windowsHide: true,
    });
    return { passed: true };
  } catch (err) {
    const stdout = (err.stdout || "").trim();
    const stderr = (err.stderr || "").trim();
    const output = [stdout, stderr].filter(Boolean).join("\n");
    return {
      passed: false,
      output: output || err.message,
      exitCode: err.status,
    };
  }
}

// ── Event handlers ─────────────────────────────────────────────────────────

function handlePostToolUse(hookInput, config) {
  const checks = (config.hooks && config.hooks.PostToolUse) || [];
  if (checks.length === 0) return EXIT_PASS;

  const filePath = hookInput.tool_input && hookInput.tool_input.file_path;

  if (!filePath) return EXIT_PASS;

  let anyBlocking = false;

  for (const check of checks) {
    if (!matchFilePatterns(filePath, check.filePatterns)) continue;
    if (!check.enabled) continue;

    const result = runCheck(check, filePath);

    if (!result.passed) {
      if (check.blocking) {
        anyBlocking = true;
        const msg = `[smart-hooks] ${check.name}: FAILED`;
        blockingReasons.push(msg);
        console.error(msg);
        if (result.output) {
          const output = result.output.split("\n").slice(0, 20).join("\n");
          console.error(output);
          blockingReasons.push(output);
        }
      } else {
        // Non-blocking: print to stdout (visible in verbose mode)
        console.log(`[smart-hooks] ${check.name}: FAILED (non-blocking)`);
        if (result.output) {
          console.log(result.output.split("\n").slice(0, 10).join("\n"));
        }
      }
    }
  }

  return anyBlocking ? EXIT_BLOCK : EXIT_PASS;
}

function handleStop(hookInput, config) {
  // Infinite loop prevention: Claude Code sets stop_hook_active when
  // it is already continuing as a result of a previous Stop hook.
  if (hookInput.stop_hook_active) return EXIT_PASS;

  const checks = (config.hooks && config.hooks.Stop) || [];
  if (checks.length === 0) return EXIT_PASS;

  const enabledChecks = checks.filter((c) => c.enabled);
  if (enabledChecks.length === 0) return EXIT_PASS;

  let anyBlocking = false;

  for (const check of enabledChecks) {
    const result = runCheck(check, null);

    if (!result.passed) {
      if (check.blocking) {
        anyBlocking = true;
        console.error(`[smart-hooks] ${check.name}: FAILED`);
        if (result.output) {
          console.error(result.output.split("\n").slice(0, 20).join("\n"));
        }
      } else {
        console.log(`[smart-hooks] ${check.name}: FAILED (non-blocking)`);
        if (result.output) {
          console.log(result.output.split("\n").slice(0, 10).join("\n"));
        }
      }
    } else {
      console.log(`[smart-hooks] ${check.name}: PASSED`);
    }
  }

  return anyBlocking ? EXIT_BLOCK : EXIT_PASS;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const eventType = process.argv[2];

  if (!eventType || !["PostToolUse", "Stop"].includes(eventType)) {
    console.error("Usage: smart-hooks-runner.js <PostToolUse|Stop>");
    console.error("Reads hook input from stdin, config from .claude/hooks/smart-hooks-config.json");
    process.exit(EXIT_BLOCK);
  }

  const config = loadConfig();
  if (!config) {
    // No config file → silent no-op
    process.exit(EXIT_PASS);
  }

  const stdinText = await readStdin();
  const hookInput = safeParseJSON(stdinText);

  let exitCode;
  if (eventType === "PostToolUse") {
    exitCode = handlePostToolUse(hookInput, config);
  } else {
    exitCode = handleStop(hookInput, config);
  }

  process.exit(exitCode);
}

main().catch(() => process.exit(EXIT_PASS));
