const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"; const PORT = 9337;
const TOKEN = process.argv[2];
const URLS = process.argv.slice(3);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-verify-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "--window-size=1440,1300", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
(async () => {
  let page;
  for (let i = 0; i < 40; i++) { await sleep(250); try { const t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); page = t.find(x => x.type === "page"); if (page) break; } catch {} }
  const ws = new WebSocket(page.webSocketDebuggerUrl); let id = 0; const pending = new Map();
  const send = (m, p = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); return; }
    if (m.method === "Runtime.exceptionThrown") logs.push("[exception] " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === "Runtime.consoleAPICalled") { const t = (m.params.args || []).map(a => a.value ?? a.description ?? "").join(" "); if (["error","assert"].includes(m.params.type)) logs.push("[console.error] " + t); } });
  await new Promise(r => ws.addEventListener("open", r));
  await send("Runtime.enable"); await send("Page.enable");
  await send("Page.navigate", { url: "http://127.0.0.1:8100/" }); await sleep(2500);
  await send("Runtime.evaluate", { expression: `localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)}); 1` });

  let n = 0;
  for (const url of URLS) {
    n += 1;
    await send("Page.navigate", { url }); await sleep(30000);
    const r = await send("Runtime.evaluate", { expression: "JSON.stringify({url: location.href, text: (document.querySelector('main')||document.body).innerText.slice(0,900)})", returnByValue: true });
    const v = JSON.parse(r.result.value);
    console.log(`\n######## ${n}) requested ${url}\nfinal url: ${v.url}\n---- text ----\n${v.text}`);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`docs/verify-${n}.png`, Buffer.from(shot.data, "base64"));
  }
  console.log("\n---- errors ----\n" + ([...new Set(logs)].slice(0, 12).join("\n") || "(none)"));
  ws.close(); chrome.kill();
})().catch(e => { console.error("FAIL:", e.message); chrome.kill(); process.exit(1); });
