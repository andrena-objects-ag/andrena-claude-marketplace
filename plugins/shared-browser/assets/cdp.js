#!/usr/bin/env node
/*
 * cdp.js — talk to a running Chrome over the DevTools Protocol.
 * --------------------------------------------------------------
 * Connects to a Chrome you launched with --remote-debugging-port (see the
 * start-chrome-dev script) using playwright-core's connectOverCDP. It attaches
 * to your REAL, logged-in browser session and NEVER closes it — closing the
 * wrapper only detaches. This is the bridge that lets an agent inspect the same
 * page you're looking at, reuse your cookies/login, and probe selectors.
 *
 * Usage:
 *   node tools/cdp.js pages                        # list open tabs (url list)
 *   node tools/cdp.js eval "<url-substr>" "<js>"   # eval JS in the matching tab (page context)
 *   node tools/cdp.js shot "<url-substr>" [out]    # screenshot the matching tab (PNG, no idle wait)
 *   node tools/cdp.js info "<url-substr>"          # url + title of the matching tab
 *
 * "<url-substr>" picks the first open tab whose URL contains that substring
 * (omit / empty ⇒ first tab). `eval` runs in the page's main world, so the
 * page's fetch, cookies, localStorage and DOM are all available — ideal for
 * reading the current view and testing same-origin requests.
 *
 * Env: CDP_ENDPOINT (default http://127.0.0.1:9222)
 */
const fs = require("fs");

let chromium;
try {
  ({ chromium } = require("playwright-core"));
} catch {
  console.error("ERROR: playwright-core is not installed. Run:  npm install playwright-core");
  process.exit(1);
}

const CDP = process.env.CDP_ENDPOINT || "http://127.0.0.1:9222";

function pickPage(browser, substr) {
  const pages = browser.contexts().flatMap((c) => c.pages());
  const match = substr ? pages.find((p) => p.url().includes(substr)) : pages[0];
  if (!match) {
    throw new Error(`no open tab matching "${substr || ""}". Open tabs:\n` + (pages.map((p) => "  " + p.url()).join("\n") || "  (none)"));
  }
  return match;
}

(async () => {
  const [cmd, a, b] = process.argv.slice(2);
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP);
  } catch (e) {
    console.error(`ERROR: could not connect to Chrome at ${CDP}.\n` + "Start it with the start-chrome-dev script (it needs --remote-debugging-port).\n" + "Detail: " + e.message);
    process.exit(1);
  }
  try {
    if (cmd === "pages") {
      const pages = browser.contexts().flatMap((c) => c.pages());
      console.log(pages.map((p) => p.url()).join("\n") || "(no open tabs)");
    } else if (cmd === "eval") {
      const page = pickPage(browser, a);
      const result = await page.evaluate((src) => eval(src), b);
      console.log(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
    } else if (cmd === "shot") {
      const page = pickPage(browser, a);
      const out = b || "_cdp-shot.png";
      // Raw CDP capture: works on SPAs that never reach network-idle.
      const session = await page.context().newCDPSession(page);
      const { data } = await session.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(out, Buffer.from(data, "base64"));
      console.log("saved " + out);
    } else if (cmd === "info") {
      const page = pickPage(browser, a);
      console.log(JSON.stringify({ url: page.url(), title: await page.title() }, null, 2));
    } else {
      console.log('commands: pages | eval "<url-substr>" "<js>" | shot "<url-substr>" [out] | info "<url-substr>"');
    }
  } finally {
    await browser.close(); // detaches CDP; does NOT close your Chrome
  }
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
