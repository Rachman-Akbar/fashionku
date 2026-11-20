const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"; const PORT = 9336;
const TOKEN = process.argv[2]; const URL = process.argv[3];
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-net-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "--window-size=1440,1200", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reqs = new Map(); const logs = [];
(async () => {
  let page;
  for (let i = 0; i < 40; i++) { await sleep(250); try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); page = t.find(x => x.type === "page"); if (page) break; } catch {} }
  const ws = new WebSocket(page.webSocketDebuggerUrl); let id = 0; const pending = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); return; }
    if (m.method === "Network.requestWillBeSent") reqs.set(m.params.requestId, { url: m.params.request.url, status: null });
    if (m.method === "Network.responseReceived") { const r = reqs.get(m.params.requestId); if (r) r.status = m.params.response.status; }
    if (m.method === "Network.loadingFailed") { const r = reqs.get(m.params.requestId); if (r) { r.status = "FAILED " + m.params.errorText; } }
    if (m.method === "Log.entryAdded") logs.push(`[log ${m.params.entry.level}] ${m.params.entry.text} ${m.params.entry.url || ""}`);
    if (m.method === "Runtime.exceptionThrown") logs.push("[exception] " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === "Runtime.consoleAPICalled") { const t = (m.params.args || []).map(a => a.value ?? a.description ?? "").join(" "); if (["error","assert"].includes(m.params.type)) logs.push("[console.error] " + t); }
  });
  await new Promise(r => ws.addEventListener("open", r));
  await send("Runtime.enable"); await send("Page.enable"); await send("Network.enable"); await send("Log.enable");
  await send("Page.navigate", { url: "http://127.0.0.1:8000/" }); await sleep(2500);
  await send("Runtime.evaluate", { expression: `localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)}); 1` });
  await send("Page.navigate", { url: URL }); await sleep(15000);
  const bad = [...reqs.values()].filter(r => r.status === null || typeof r.status === "string" ? true : r.status >= 400);
  console.log("--- suspicious requests ---");
  console.log(bad.map(r => `${r.status} ${r.url}`).join("\n") || "(none)");
  console.log("--- total requests:", reqs.size);
  const main = await send("Runtime.evaluate", { expression: "(document.querySelector('main')||document.body).innerText.slice(0,600)", returnByValue: true });
  console.log("--- main text ---"); console.log(main.result.value);
  console.log("--- errors ---"); console.log([...new Set(logs)].slice(0,20).join("\n") || "(none)");
  ws.close(); chrome.kill();
})().catch(e => { console.error("FAIL:", e.message); chrome.kill(); process.exit(1); });
