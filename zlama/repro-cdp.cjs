// Repro helper: drive headless Chrome via CDP to capture console errors.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
const TOKEN = process.argv[2];
const TARGET_URL = process.argv[3] || "http://127.0.0.1:8000/cart?tab=order&orderId=133";

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-prof-"));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--window-size=1400,1000",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function listTargets() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  return res.json();
}

async function main() {
  let page;
  for (let i = 0; i < 40; i += 1) {
    await sleep(250);
    try {
      const targets = await listTargets();
      page = targets.find((t) => t.type === "page");
      if (page) break;
    } catch { /* not up yet */ }
  }
  if (!page) throw new Error("Chrome CDP not reachable");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  ws.addEventListener("message", (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
      return;
    }
    if (msg.method === "Runtime.consoleAPICalled") {
      const text = (msg.params.args || [])
        .map((a) => a.value ?? a.description ?? a.unserializableValue ?? "")
        .join(" ");
      logs.push(`[console.${msg.params.type}] ${text}`);
      if (text.includes("ErrorBoundary") || text.includes("Uncaught") || text.includes("Minified React")) logs.push(`[console.${msg.params.type}] ${text}`);
    }
    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      logs.push(`[exception] ${d.exception?.description || d.text}`);
    }
    if (msg.method === "Log.entryAdded") {
      const e = msg.params.entry;
      if (e.level === "error") logs.push(`[log.error] ${e.text} ${e.url || ""}`);
    }
  });

  await new Promise((resolve) => ws.addEventListener("open", resolve));
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Page.enable");
  await send("Network.enable");

  // Prime origin then set auth token.
  await send("Page.navigate", { url: "http://127.0.0.1:8000/" });
  await sleep(2500);
  await send("Runtime.evaluate", {
    expression: `localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)}); "ok"`,
  });

  await send("Page.navigate", { url: TARGET_URL });
  await sleep(20000);

  const bodyText = await send("Runtime.evaluate", {
    expression: "document.body.innerText.slice(0, 1200)",
    returnByValue: true,
  });

  console.log("=== URL:", TARGET_URL);
  console.log("=== LOGS ===");
  console.log(logs.filter(Boolean).slice(0, 40).join("\n") || "(none)");
  console.log("=== BODY TEXT ===");
  console.log(String(bodyText.result?.value || "").slice(0, 1200));

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("docs/repro-order-133.png", Buffer.from(shot.data, "base64"));
  console.log("=== screenshot: docs/repro-order-133.png");

  ws.close();
  chrome.kill();
}

main().catch((err) => {
  console.error("REPRO FAILED:", err.message);
  chrome.kill();
  process.exit(1);
});
