const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9411;
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const START = process.argv[3] || "/admin";

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-dump-"));
const chrome = spawn(
  CHROME,
  ["--headless=new", "--window-size=1440,900", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"],
  { stdio: ["ignore", "pipe", "pipe"] },
);

chrome.stderr.on("data", d => process.stderr.write("[chrome-err] "+d));
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
  const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (res.exceptionDetails) return { __error: res.exceptionDetails.text + " " + (res.exceptionDetails.exception?.description || "") };
  return res.result?.value;
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
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.method === "Runtime.exceptionThrown") {
      const d = data.params.exceptionDetails;
      events.push({ kind: "exception", text: (d.exception?.description || d.text || "").split("\n").slice(0, 6).join(" | ") });
    }
    if (data.method === "Runtime.consoleAPICalled" && data.params.type !== "debug") {
      events.push({ kind: data.params.type, text: (data.params.args || []).map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 600) });
    }
  });
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });

  console.log("step1 target:", target.webSocketDebuggerUrl); await send("Page.navigate", { url: BASE + "/" });
  await sleep(3000);
  await evaluate(`localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)})`);
  await send("Page.navigate", { url: BASE + START });
  await sleep(7000);

  const info = await evaluate(`JSON.stringify({
    url: location.href,
    readyState: document.readyState,
    storage: Object.keys(localStorage),
    rootHtmlLength: (document.getElementById("root")?.innerHTML || "").length,
    bodyText: document.body.innerText.slice(0, 2000)
  }, null, 2)`);
  console.log(info);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(process.cwd(), "tmp-admin-shot.png"), Buffer.from(shot.data, "base64"));
  console.log("\nEVENTS:\n" + JSON.stringify(events, null, 1));
  ws.close();
  chrome.kill();
}

main().catch((e) => { console.error("FAIL", e); chrome.kill(); process.exit(1); });
