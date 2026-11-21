const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9351;
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-admin-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--window-size=1440,900",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
let nextId = 1;
const events = [];

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener("message", handler);
        if (data.error) reject(new Error(method + ": " + JSON.stringify(data.error)));
        else resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) return { __error: res.exceptionDetails.text + " " + (res.exceptionDetails.exception?.description || "") };
  return res.result?.value;
}

function attachListeners() {
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.method === "Runtime.exceptionThrown") {
      const d = data.params.exceptionDetails;
      events.push({ kind: "exception", text: (d.exception?.description || d.text || "").split("\n").slice(0, 4).join(" | ") });
    }
    if (data.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(data.params.type)) {
      events.push({
        kind: "console." + data.params.type,
        text: (data.params.args || []).map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 400),
      });
    }
    if (data.method === "Log.entryAdded" && data.params.entry.level === "error") {
      events.push({ kind: "log", text: String(data.params.entry.text).slice(0, 300) });
    }
  });
}

async function main() {
  let target = null;
  for (let i = 0; i < 60; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await sleep(250);
  }
  if (!target) throw new Error("no chrome target");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => {
    ws.onopen = r;
  });
  attachListeners();
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Page.enable");
  await send("Network.enable");

  await send("Page.navigate", { url: BASE + "/" });
  await sleep(2500);
  await evaluate(`localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)})`);
  await send("Page.navigate", { url: BASE + "/admin" });
  await sleep(6000);

  const snapshot = `(() => ({
    path: location.pathname + location.search,
    title: (document.querySelector("main h1, main h2, main h3")?.textContent || "").trim().slice(0, 60),
    body: (document.querySelector("main")?.innerText || "").replace(/\\s+/g, " ").slice(0, 160),
    errorScreen: document.body.innerText.includes("Terjadi Kesalahan") || document.body.innerText.includes("Halaman gagal dimuat"),
    tabs: [...document.querySelectorAll('[class*="rounded-t-md"], [class*="rounded-sm"]')].map((el) => el.textContent.trim()).slice(0, 20)
  }))()`;

  console.log("INITIAL:", JSON.stringify(await evaluate(snapshot), null, 2));

  const hrefs = await evaluate(
    `JSON.stringify([...document.querySelectorAll('a[href^="/admin"]')].map(a => a.getAttribute("href")))`,
  );
  console.log("LINKS:", hrefs);

  const routes = JSON.parse(hrefs || "[]").filter((h, i, arr) => arr.indexOf(h) === i);
  for (const href of routes) {
    const before = events.length;
    const clicked = await evaluate(`(() => {
      const link = [...document.querySelectorAll('a[href="${href}"]')].find(a => a.offsetParent !== null);
      if (!link) return "no-link";
      link.click();
      return "clicked";
    })()`);
    await sleep(2200);
    const state = await evaluate(snapshot);
    const newEvents = events.slice(before).filter((e) => e.kind !== "console.warning");
    console.log(`\n=== ${href} (${clicked}) -> ${state?.path}`);
    console.log("   errorScreen:", state?.errorScreen, "| title:", state?.title);
    console.log("   body:", state?.body);
    if (newEvents.length) console.log("   events:", JSON.stringify(newEvents, null, 1));
  }

  console.log("\nALL EVENTS:");
  console.log(JSON.stringify(events, null, 1));
  ws.close();
  chrome.kill();
}

main().catch((err) => {
  console.error("PROBE FAILED:", err);
  chrome.kill();
  process.exit(1);
});
