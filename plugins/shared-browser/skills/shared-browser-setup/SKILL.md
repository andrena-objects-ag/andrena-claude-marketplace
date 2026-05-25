---
name: shared-browser-setup
description: "Initialize a shared, persisted Chrome session that Claude and the user both access over the Chrome DevTools Protocol (CDP). Sets up a remote-debugging Chrome (dedicated profile), a tools/cdp.js bridge, and the collaboration workflow so Claude can inspect the same live, logged-in page the user is looking at, reuse their session, and infer implementation from real DOM/network state. Use when setting up browser inspection, a shared/live browser session, remote debugging, a CDP bridge, or 'let Claude see my browser' in a project."
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Shared Browser Setup

Bootstrap a project so Claude and the user collaborate through **one shared
Chrome instance**: the user launches Chrome with remote debugging and logs into
their sites; Claude attaches read-only over CDP to inspect the very page the
user is on, reuse their login, and probe live DOM + network state.

This is **not** Playwright/automation driving a throwaway browser. It attaches
to the user's **real, persisted, logged-in** session — the value is the *shared
view* and *inferring implementation from a session you both have access to*.

Plugin assets live under `${CLAUDE_PLUGIN_ROOT}/assets/`:
`cdp.js`, `start-chrome-dev.ps1`, `start-chrome-dev.sh`, `CLAUDE-snippet.md`.

## Setup workflow

Run these steps in the current project. Detect the OS (Windows → PowerShell +
`.ps1`; macOS/Linux → bash + `.sh`) and adapt commands accordingly.

### 1. Check prerequisites
- **Node.js**: `node --version` (needed to run the CDP bridge). If missing, tell
  the user to install it and stop.
- **Google Chrome / Chromium** installed.

### 2. Install playwright-core
The bridge depends only on `playwright-core` (no browser download — it attaches
to the user's Chrome). Prefer the project's existing package manager.
- If a `package.json` exists: `npm install --save-dev playwright-core`
  (or the pnpm/yarn equivalent the repo uses).
- If not, create a minimal one first (`npm init -y`) then install, OR install at
  a workspace level — ask the user if unsure.

### 3. Copy the bridge + launch scripts into the project
- Copy `${CLAUDE_PLUGIN_ROOT}/assets/cdp.js` → `tools/cdp.js`.
- Copy the launch script for the user's OS into the project root:
  - Windows → `start-chrome-dev.ps1`
  - macOS/Linux → `start-chrome-dev.sh` (then `chmod +x start-chrome-dev.sh`).
- Copy whichever launch script(s) match; copying both is fine for cross-OS teams.

### 4. Gitignore the browser profile
Add to `.gitignore` (create if absent):
```
# Dedicated Chrome profile for the shared CDP browser (holds login cookies)
.chrome-dev-profile/
_cdp-shot.png
```
The profile holds real login cookies — it must never be committed.

### 5. Document the workflow in the project
Append the contents of `${CLAUDE_PLUGIN_ROOT}/assets/CLAUDE-snippet.md` to the
project's `CLAUDE.md` (create the file if it doesn't exist). This records the
commands and the safety rules so future sessions follow them.

### 6. Have the USER launch Chrome and log in
Launching Chrome and signing in is the user's job (their credentials). Tell them
to run, in this session, so the output is captured:
- Windows: `! ./start-chrome-dev.ps1`
- macOS/Linux: `! ./start-chrome-dev.sh`
Then log into the relevant sites in that Chrome window and leave it open.

### 7. Verify the bridge
Once Chrome is up and the user has a tab open:
```bash
node tools/cdp.js pages
```
Expect a list of open tab URLs. If it errors with "could not connect", confirm
Chrome was started by the script (it needs `--remote-debugging-port=9222`) and
that nothing else holds the port. Override with `CDP_ENDPOINT` if needed.

Setup is done. From here, use the collaboration workflow below.

## Collaboration workflow (how to actually use it)

- **Ground the conversation in the live view.** When the user references a page,
  read it: `node tools/cdp.js eval "<host>" "document.body.innerText.slice(0,3000)"`
  or grab element classes / aria-labels / a screenshot (`shot`).
- **Infer implementation from the session.** `eval` runs in the page's main
  world, so the page's own `fetch` (cookies included) reaches its backend — use
  it to discover real API endpoints and response shapes:
  `node tools/cdp.js eval "<host>" "(async()=>{const r=await fetch('/api/...',{credentials:'include'});return r.status+' '+(await r.text()).slice(0,500)})()"`
- **Probe → build → re-verify** against the live page.

For deeper patterns (reading SPA state, finding endpoints, React-controlled
inputs, screenshots, and the verify-but-don't-trigger discipline), see
[reference.md](reference.md).

## Safety (always)
- **Never close or navigate the user's tabs.** Open your own tab to navigate.
- **Never trigger destructive / quota-spending actions.** Verify up to the
  action, then let the user perform it. Restore page state after probing.
- **Treat the profile as secret.** Don't print cookies/tokens read via `eval`.
