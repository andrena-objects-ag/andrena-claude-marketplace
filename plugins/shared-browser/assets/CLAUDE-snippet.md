## Shared browser session (CDP)

We share one Chrome instance. The user launches it with `start-chrome-dev`
(remote debugging on port **9222**, dedicated `.chrome-dev-profile`) and logs
into whatever sites are relevant. The agent attaches **read-only** over CDP via
`tools/cdp.js` — it inspects the same tabs the user sees, reuses their login,
and probes the live DOM. Closing the CDP wrapper detaches; it never closes the
user's Chrome.

```bash
node tools/cdp.js pages                        # list open tabs
node tools/cdp.js eval "<url-substr>" "<js>"   # eval in the matching tab (page context: fetch, cookies, DOM)
node tools/cdp.js shot "<url-substr>" [out]    # screenshot (CDP; works on SPAs)
node tools/cdp.js info "<url-substr>"          # url + title of the matching tab
```

Override the endpoint with `CDP_ENDPOINT` (default `http://127.0.0.1:9222`).

### How we work together with it
- **Discuss the current view.** The user points at a page they're on; the agent
  dumps `document.body.innerText`, element classes/aria-labels, or a screenshot
  to ground the conversation in what's actually rendered.
- **Infer implementation from the live session.** `eval` runs in the page's main
  world, so the page's own `fetch` (with cookies) reaches its backend APIs —
  discover real endpoints and response shapes instead of guessing.
- **Probe before you build.** Inspect selectors, then write code, then re-check
  against the live page.

### Rules
- **Never close or navigate the user's tabs** unless asked. Open your own tab if
  you need to navigate somewhere (and reuse it).
- **Don't trigger destructive / side-effecting actions** (submitting a form that
  spends quota, sending a message, deleting). Verify everything *up to* the
  action programmatically — element found, value set, target located — then stop
  and let the user click the real thing. Restore page state after probing.
- **Credentials live in the profile.** `.chrome-dev-profile/` is gitignored;
  treat it as secret. Don't print cookies/tokens you read via `eval`.
