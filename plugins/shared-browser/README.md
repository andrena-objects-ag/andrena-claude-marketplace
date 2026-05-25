# 🌐 Shared Browser (CDP)

**Type**: Plugin with Skill | **Category**: Utilities & Development

Set up a **shared, persisted Chrome session** that Claude and you both access
over the Chrome DevTools Protocol (CDP). You launch Chrome with remote debugging
and log into your sites; Claude attaches **read-only** to inspect the very page
you're looking at, reuse your login, and infer implementation from the live DOM
and network state.

This is deliberately **not** automation driving a throwaway browser. The value
is the *shared view* and a *persisted, logged-in session you both have access
to* — point Claude at a page you're on and discuss/inspect it together.

## What it does

Invoke the skill (`/shared-browser-setup`, or just ask Claude to "set up a shared
browser") and it scaffolds, into the current project:

- **`tools/cdp.js`** — the CDP bridge (depends only on `playwright-core`):
  - `node tools/cdp.js pages` — list open tabs
  - `node tools/cdp.js eval "<url-substr>" "<js>"` — eval in the tab's page
    context (its `fetch`, cookies, `localStorage`, DOM)
  - `node tools/cdp.js shot "<url-substr>" [out]` — screenshot (works on SPAs)
  - `node tools/cdp.js info "<url-substr>"` — url + title
- **`start-chrome-dev.ps1` / `start-chrome-dev.sh`** — launch Chrome with
  `--remote-debugging-port=9222` and a dedicated `.chrome-dev-profile`.
- A **`.gitignore`** entry for the profile (it holds login cookies).
- A **workflow + safety section appended to your `CLAUDE.md`** so future
  sessions follow the same conventions.

## Installation

```bash
/plugin install shared-browser@andrena-marketplace
```

Then, in any project:

```
/shared-browser-setup
```

## How you work with it

- **Ground the conversation in the live view** — Claude reads the page text,
  element labels/classes, or a screenshot of what you're actually seeing.
- **Infer implementation from the session** — because `eval` runs in page
  context, the page's own `fetch` (with your cookies) reaches its backend, so
  Claude discovers real endpoints and response shapes instead of guessing.
- **Probe → build → re-verify** against the live page.

## Safety model

- Claude **never closes or navigates your tabs** (it opens its own if needed).
- Claude **stops before destructive / quota-spending actions** — it verifies up
  to the action, then hands off the click to you, and restores page state after
  probing.
- The `.chrome-dev-profile/` holds real credentials and is gitignored; tokens
  read via `eval` are not printed.

## Requirements

- Node.js (to run the bridge)
- Google Chrome / Chromium
- `playwright-core` (the skill installs it; no browser download — it attaches to
  your Chrome)

---

**Version**: 1.0.0 · MIT
