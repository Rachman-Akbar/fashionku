const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = Number(process.env.PORT || 9451);
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const ROUTES = (process.argv[3] || "").split(",").filter(Boolean);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-nav-"));
const chrome = spawn(CHROME, ["--headless=new", "--window-size=1440,1000", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let target = null;
  for (let i = 0; i < 60; i += 1) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = l.find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await sleep(250);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let nextId = 1;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  });
  const send = (method, params = {}) => {
    const id = nextId++;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res) => pending.set(id, res));
  };
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) return { __error: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text };
    return r.result?.result?.value;
  };

  await send("Runtime.enable");
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*fonts.googleapis.com*", "*picsum.photos*", "*fonts.gstatic.com*"] });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__errs = [];
      window.addEventListener("error", (e) => window.__errs.push("window.error: " + (e.message || "") + " @" + (e.filename || "")));
      window.addEventListener("unhandledrejection", (e) => window.__errs.push("rejection: " + String((e.reason && (e.reason.stack || e.reason.message)) || e.reason).slice(0, 500)));
      const orig = console.error;
      console.error = function(...a) { window.__errs.push("console.error: " + a.map(x => (x && x.stack) || String(x)).join(" ").slice(0, 600)); return orig.apply(this, a); };
    `,
  });

  await send("Page.navigate", { url: BASE + "/auth/login" });
  await sleep(5000);
  await evaluate(`(() => {
    const session = { token: ${JSON.stringify(TOKEN)}, tokenType: "Bearer", roles: ["buyer","admin"], activeRole: "admin",
      user: { id: "ea469813-e902-00b9-1bf4-a15e254ce82d", name: "Nadia Prameswari", email: "nadia@fashionku.id", role: "admin", roles: ["buyer","admin"], has_password: true, is_email_verified: true },
      storageScope: "window" };
    sessionStorage.setItem("marketku_window_auth_token", ${JSON.stringify(TOKEN)});
    sessionStorage.setItem("marketku_window_auth_session", JSON.stringify(session));
  })()`);

  const waitForPanel = async (limit = 30000) => {
    const start = Date.now();
    while (Date.now() - start < limit) {
      const ok = await evaluate(`document.body.innerText.includes("PANEL ADMIN") || document.body.innerText.includes("Administrasi")`);
      if (ok) return true;
      await sleep(500);
    }
    return false;
  };

  const snap = async () => {
    const raw = await evaluate(`JSON.stringify({
      path: location.pathname + location.search,
      text: document.body.innerText.replace(/\\s+/g, " ").slice(0, 200),
      card: (document.querySelector("main")?.innerText || "").replace(/\\s+/g, " ").slice(0, 180),
      errorScreen: document.body.innerText.includes("Terjadi Kesalahan") || document.body.innerText.includes("Halaman gagal dimuat"),
      spinner: document.body.innerText.includes("Memuat..."),
      tabsActive: [...document.querySelectorAll("button")].filter(b => /bg-rose-500|bg-slate-700/.test(b.className)).map(b => b.textContent.trim()),
    })`);
    try { return JSON.parse(raw); } catch { return { raw }; }
  };

  await send("Page.navigate", { url: BASE + "/admin" });
  const ready = await waitForPanel();
  console.log("PANEL READY:", ready, JSON.stringify(await snap()));

  const links = await evaluate(`JSON.stringify([...document.querySelectorAll('a[href^="/admin"]')].map(a => a.getAttribute("href")))`);
  console.log("LINKS:", links);

  const targets = ROUTES.length ? ROUTES : ["/admin", "/admin/orders", "/admin/products", "/admin/categories", "/admin/stock", "/admin/users", "/admin/cashflow", "/admin/chat"];

  for (const href of targets) {
    const before = (await evaluate("window.__errs.length")) || 0;
    const clicked = await evaluate(`(() => {
      const link = [...document.querySelectorAll('a[href="${href}"]')][0];
      if (link) { link.click(); return "link"; }
      return "none";
    })()`);
    await sleep(3500);
    const s = await snap();
    const errs = JSON.parse((await evaluate(`JSON.stringify(window.__errs.slice(${before}))`)) || "[]");
    console.log(`\n=== href=${href} clicked=${clicked}`);
    console.log("   ->", JSON.stringify(s));
    if (errs.length) console.log("   ERRS:", JSON.stringify(errs, null, 1));
  }

  const shot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("tmp-admin-shot.png", Buffer.from(shot.result.data, "base64"));
  ws.close();
  chrome.kill();
})().catch((e) => {
  console.error("FAIL", e);
  chrome.kill();
  process.exit(1);
});
