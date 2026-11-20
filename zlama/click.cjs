const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"; const PORT = 9338;
const TOKEN = process.argv[2]; const START = process.argv[3]; const PATTERN = process.argv[4];
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-click-"));
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
    if (m.method === "Runtime.consoleAPICalled") { const t = (m.params.args || []).map(a => a.value ?? a.description ?? "").join(" "); logs.push(`[${m.params.type}] ${t}`); } });
  await new Promise(r => ws.addEventListener("open", r));
  await send("Runtime.enable"); await send("Page.enable");
  const ev = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }); return r.exceptionDetails ? "ERR:" + r.exceptionDetails.exception?.description : r.result?.value; };
  await send("Page.navigate", { url: "http://127.0.0.1:8100/" }); await sleep(2500);
  await ev(`localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)}); 1`);
  await send("Page.navigate", { url: START }); await sleep(28000);
  console.log("click:", await ev(`(() => { const re = new RegExp(${JSON.stringify(PATTERN)}, 'i'); const hit = Array.from(document.querySelectorAll('button,a')).find(n => re.test(n.innerText.trim())); if (!hit) return 'NOT FOUND'; if (hit.disabled) return 'DISABLED: ' + hit.innerText; hit.click(); return 'clicked ' + hit.innerText.trim(); })()`));
  await sleep(15000);
  console.log("url:", await ev("location.href"));
  console.log("--- main text tail ---");
  console.log(await ev("(() => { const t=(document.querySelector('main')||document.body).innerText; const idx=t.search(/Tentukan|Pilih layanan|Pilih alamat/); return idx>=0 ? t.slice(Math.max(0,idx-120), idx+260) : 'NO VALIDATION MESSAGE; tail=' + t.slice(-400); })()"));
  console.log("--- logs ---"); console.log([...new Set(logs)].slice(0, 15).join("\n") || "(none)");
  ws.close(); chrome.kill();
})().catch(e => { console.error("FAIL:", e.message); chrome.kill(); process.exit(1); });
