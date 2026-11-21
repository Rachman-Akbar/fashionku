const { spawn } = require("node:child_process");
const fs = require("node:fs"); const os = require("node:os"); const path = require("node:path");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = Number(process.env.PORT || 9441);
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const START = process.argv[3] || "/admin";
const WAIT = Number(process.argv[4] || 15000);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-d-"));
const chrome = spawn(CHROME, ["--headless=new","--window-size=1440,1000",`--remote-debugging-port=${PORT}`,`--user-data-dir=${profile}`,"--no-first-run","--disable-gpu"], { stdio: "ignore" });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  let target=null;
  for (let i=0;i<60;i++){ try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target=l.find(t=>t.type==="page"); if(target) break; } catch {} await sleep(250); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let nextId = 1; const pending = new Map();
  ws.addEventListener("message", (e) => { const d = JSON.parse(e.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
  const send = (method, params={}) => { const id = nextId++; ws.send(JSON.stringify({id, method, params})); return new Promise(res => pending.set(id, res)); };
  const evaluate = async (expression) => { const r = await send("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true}); return r.result?.result?.value; };
  await send("Runtime.enable"); await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.__errs = [];
    window.addEventListener("error", (e) => window.__errs.push("window.error: " + (e.message || "") + " @" + (e.filename || "") + ":" + (e.lineno||"")));
    window.addEventListener("unhandledrejection", (e) => window.__errs.push("unhandledrejection: " + (e.reason && (e.reason.stack || e.reason.message) || String(e.reason)).slice(0,600)));
    const orig = console.error;
    console.error = function(...a) { window.__errs.push("console.error: " + a.map(x => (x && x.stack) || String(x)).join(" ").slice(0, 800)); return orig.apply(this, a); };
  `});
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*fonts.googleapis.com*", "*picsum.photos*", "*fonts.gstatic.com*"] });
  await send("Page.navigate", {url: BASE + "/auth/login"});
  await sleep(4000);
  console.log("step2 url:", await evaluate("location.href"), "root:", await evaluate("(document.getElementById('root')||{}).innerHTML?.length"), "state:", await evaluate("document.readyState"));
  await evaluate(`(() => {
    const session = { token: ${JSON.stringify(TOKEN)}, tokenType: "Bearer", roles: ["buyer","admin"], activeRole: "admin",
      user: { id: "ea469813-e902-00b9-1bf4-a15e254ce82d", name: "Nadia Prameswari", email: "nadia@fashionku.id", role: "admin", roles: ["buyer","admin"], has_password: true, is_email_verified: true },
      storageScope: "window" };
    sessionStorage.setItem("marketku_window_auth_token", ${JSON.stringify(TOKEN)});
    sessionStorage.setItem("marketku_window_auth_session", JSON.stringify(session));
  })()`);
  console.log("storage set:", await evaluate("JSON.stringify(Object.keys(sessionStorage))"));
  await send("Page.navigate", {url: BASE + START});
  await sleep(4000);
  console.log("step3 url:", await evaluate("location.href"), "root:", await evaluate("(document.getElementById('root')||{}).innerHTML?.length"), "state:", await evaluate("document.readyState"));
  await sleep(WAIT);
  console.log("URL:", await evaluate("location.href"));
  console.log("READY:", await evaluate("document.readyState"));
  console.log("BODY TEXT:", await evaluate("document.body.innerText.replace(/\s+/g,' ').slice(0,500)"));
  console.log("ERRORS:", JSON.stringify(await evaluate("window.__errs"), null, 1));
  const shot = await send("Page.captureScreenshot", {format:"png"});
  fs.writeFileSync("tmp-admin-shot.png", Buffer.from(shot.result.data, "base64"));
  ws.close(); chrome.kill();
})().catch(e => { console.error("FAIL", e); chrome.kill(); process.exit(1); });
