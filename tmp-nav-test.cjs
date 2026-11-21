const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9412;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-t-"));
const chrome = spawn(CHROME, ["--headless=new","--window-size=1440,900",`--remote-debugging-port=${PORT}`,`--user-data-dir=${profile}`,"--no-first-run","--disable-gpu"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  let target=null;
  for (let i=0;i<60;i++){ try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target=l.find(t=>t.type==="page"); if(target) break; } catch {} await sleep(250); }
  console.log("targets:", JSON.stringify(target && {url: target.url, type: target.type}));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  const send = (id, method, params) => { ws.send(JSON.stringify({id, method, params})); return new Promise(res => { const h = e => { const d = JSON.parse(e.data); if (d.id===id){ ws.removeEventListener("message",h); res(d);} }; ws.addEventListener("message",h); }); };
  console.log(await send(1, "Page.enable", {}));
  const r = await send(2, "Page.navigate", {url: "http://127.0.0.1:8000/admin"});
  console.log("nav:", JSON.stringify(r));
  await sleep(4000);
  const r2 = await send(3, "Runtime.evaluate", {expression: "location.href + ' | ' + document.body.innerText.slice(0,200)", returnByValue: true});
  console.log("eval:", JSON.stringify(r2));
  ws.close(); chrome.kill();
})();
