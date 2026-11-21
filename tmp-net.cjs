const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9431;
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const START = process.argv[3] || "/admin";
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-n-"));
const chrome = spawn(CHROME, ["--headless=new","--window-size=1440,1000",`--remote-debugging-port=${PORT}`,`--user-data-dir=${profile}`,"--no-first-run","--disable-gpu"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = [];
(async () => {
  let target=null;
  for (let i=0;i<60;i++){ try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target=l.find(t=>t.type==="page"); if(target) break; } catch {} await sleep(250); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let nextId = 1; const pending = new Map();
  ws.addEventListener("message", (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
    if (d.method === "Runtime.exceptionThrown") log.push("EXC: " + ((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || "").split("\n").slice(0,5).join(" | ")));
    if (d.method === "Runtime.consoleAPICalled") log.push("CONSOLE." + d.params.type + ": " + (d.params.args||[]).map(a=>a.value ?? a.description ?? "").join(" ").slice(0,400));
    if (d.method === "Network.responseReceived") { const r = d.params.response; if (r.status >= 400) log.push("HTTP " + r.status + " " + r.url.slice(0,120)); }
    if (d.method === "Network.loadingFailed") log.push("LOADFAIL " + d.params.errorText + " " + (d.params.requestId));
  });
  const send = (method, params={}) => { const id = nextId++; ws.send(JSON.stringify({id, method, params})); return new Promise(res => pending.set(id, res)); };
  const evaluate = async (expression) => { const r = await send("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true}); return r.result?.result?.value; };
  await send("Runtime.enable"); await send("Page.enable"); await send("Network.enable");
  await send("Page.navigate", {url: BASE + "/auth/login"});
  await sleep(2500);
  await evaluate(`(() => {
    const session = { token: ${JSON.stringify(TOKEN)}, tokenType: "Bearer", roles: ["buyer","admin"], activeRole: "admin",
      user: { id: "ea469813-e902-00b9-1bf4-a15e254ce82d", name: "Nadia Prameswari", email: "nadia@fashionku.id", role: "admin", roles: ["buyer","admin"], has_password: true, is_email_verified: true },
      storageScope: "window" };
    sessionStorage.setItem("marketku_window_auth_token", ${JSON.stringify(TOKEN)});
    sessionStorage.setItem("marketku_window_auth_session", JSON.stringify(session));
  })()`);
  await send("Page.navigate", {url: BASE + START});
  await sleep(10000);
  console.log("URL:", await evaluate("location.href"));
  console.log("ROOT LEN:", await evaluate("(document.getElementById('root')||{}).innerHTML?.length"));
  console.log("ROOT HTML START:", (await evaluate("(document.getElementById('root')||{}).innerHTML?.slice(0,600)")));
  console.log("LOG:\n" + log.join("\n"));
  const shot = await send("Page.captureScreenshot", {format:"png"});
  fs.writeFileSync("tmp-admin-shot.png", Buffer.from(shot.result.data, "base64"));
  ws.close(); chrome.kill();
})().catch(e => { console.error("FAIL", e); chrome.kill(); process.exit(1); });
