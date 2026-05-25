# Shared browser — deeper patterns

Reference material for working through the `tools/cdp.js` bridge once it's set
up. Loaded on demand; the core workflow is in [SKILL.md](SKILL.md).

## The bridge, in one paragraph

`tools/cdp.js` uses `playwright-core`'s `connectOverCDP` to attach to the
Chrome you launched with `--remote-debugging-port=9222`. It enumerates the open
tabs, picks one by URL substring, and runs an action. `browser.close()` only
**detaches** the CDP connection — your Chrome (and its tabs/login) stays open.
Everything runs against your real session, so cookies, `localStorage`, and
same-origin `fetch` all work.

## Reading the current view

```bash
# What's on the page right now
node tools/cdp.js eval "<host>" "document.body.innerText.slice(0,3000)"

# Structure: buttons, their labels and classes
node tools/cdp.js eval "<host>" "[...document.querySelectorAll('button')].slice(0,20).map(b=>({t:b.textContent.trim(),a:b.getAttribute('aria-label'),c:b.className})).filter(x=>x.t||x.a)"

# A screenshot (PNG via raw CDP — works on SPAs that never go network-idle)
node tools/cdp.js shot "<host>" view.png
```

`eval` returns the value of the expression. Objects are JSON-stringified.
For async work, use an IIFE that returns a Promise:
```bash
node tools/cdp.js eval "<host>" "(async()=>{ /* ... */ return result })()"
```

## Discovering backend endpoints from the live session

Because `eval` runs in page context, the page's own `fetch` reaches its API with
the user's credentials. Two ways to find endpoints:

```bash
# 1. What has the page already requested? (resource timing — no new calls)
node tools/cdp.js eval "<host>" "[...new Set(performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\\/api\\//.test(u)))]"

# 2. Call one and read the shape (cookies sent automatically)
node tools/cdp.js eval "<host>" "(async()=>{const r=await fetch('/api/whatever',{credentials:'include'});return r.status+' :: '+(await r.text()).slice(0,800)})()"
```

If an endpoint returns 401 with cookies, it may need a Bearer token the SPA
holds — look for it in `localStorage` or a session endpoint (e.g. many apps
expose `/api/auth/session` returning an `accessToken`), then replay it in the
`fetch` headers. Don't print the token itself.

## Interacting (carefully)

You can drive the page through Playwright via small evals, but prefer the
lightest thing that proves your point.

- **React/Vue-controlled inputs** ignore a plain `.value =`. Use the native
  setter then dispatch an input event:
  ```js
  const set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value').set;
  set.call(el, 'text'); el.dispatchEvent(new Event('input',{bubbles:true}));
  ```
- **Hover-only / `:hover` overlays** won't appear from synthetic events reliably;
  if you need them, that's a sign to ask the user to hover, or to screenshot the
  default state.

## Verify, but don't trigger destructive actions

Many flows end in a side effect: submitting (spends a quota / sends a message),
deleting, paying. **Stop before the irreversible step.** Confirm everything up to
it programmatically — the element exists, the value is set, the target button is
found and enabled — then hand off to the user to click the real thing. After
probing, restore state (close a dialog you opened, clear text you typed) so you
leave the tab as you found it.

## Keeping out of the user's way

- Pick tabs by a specific URL substring so you act on the intended page.
- If you must navigate, open your **own** tab (via a short Playwright script that
  `connectOverCDP` + `context.newPage()`), reuse it, and close only that tab.
- A reaped/closed dedicated tab is fine to recreate; the user's tabs are not
  yours to touch.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `could not connect to Chrome at …` | Chrome not started with `--remote-debugging-port`, wrong port, or it isn't running. Re-run `start-chrome-dev`. |
| `no open tab matching "…"` | The substring matched nothing — run `pages` to see open URLs. |
| `playwright-core is not installed` | `npm install --save-dev playwright-core`. |
| Screenshot blank on an SPA | Use `shot` (raw CDP capture) rather than Playwright's idle-waiting screenshot; the page may never reach network-idle. |
| Endpoint 401 with cookies | Needs a Bearer token; read it from `localStorage` / a session endpoint and add an `Authorization` header in the `fetch`. |
