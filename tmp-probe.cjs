const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = Number(process.env.CDP_PORT || 9420);
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const START = process.argv[3] || "/admin";

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-p-"));
const chrome = spawn(
  CHROME,
  ["--headless=new", "--window-size=1440,1000", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu"],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const events = [];

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
  if (!target) throw new Error("no target");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let nextId = 1;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
      return;
    }
    if (d.method === "Runtime.exceptionThrown") {
      const x = d.params.exceptionDetails;
      events.push({ kind: "exception", text: (x.exception?.description || x.text || "").split("\n").slice(0, 6).join(" | ") });
    }
    if (d.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(d.params.type)) {
      events.push({ kind: d.params.type, text: (d.params.args || []).map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 700) });
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
  await send("Log.enable");

  await send("Page.navigate", { url: BASE + "/auth/login" });
  await sleep(3000);
  await evaluate(`(() => {
    const session = { token: ${JSON.stringify(TOKEN)}, tokenType: "Bearer", roles: ["buyer","admin"], activeRole: "admin",
      user: { id: "ea469813-e902-00b9-1bf4-a15e254ce82d", name: "Nadia Prameswari", email: "nadia@fashionku.id", role: "admin", roles: ["buyer","admin"], avatar: "https://picsum.photos/seed/52b1f4035f07c40b4e1bb9e4f3a1cd53/160/160", has_password: true, is_email_verified: true },
      storageScope: "window" };
    sessionStorage.setItem("marketku_window_auth_token", ${JSON.stringify(TOKEN)});
    sessionStorage.setItem("marketku_window_auth_session", JSON.stringify(session));
  })()`);
  await send("Page.navigate", { url: BASE + START });
  await sleep(8000);

  const snap = async () => {
    const raw = await evaluate(`JSON.stringify({
      path: location.pathname + location.search,
      rootLen: (document.getElementById("root")?.innerHTML || "").length,
      text: document.body.innerText.replace(/\\s+/g, " ").slice(0, 300),
      errorScreen: document.body.innerText.includes("Terjadi Kesalahan") || document.body.innerText.includes("Halaman gagal dimuat"),
      loading: document.body.innerText.trim() === "Memuat..."
    })`);
    try {
      return JSON.parse(raw);
    } catch {
      return { raw };
    }
  };

  console.log("INITIAL:", JSON.stringify(await snap()));

  if (process.env.SHOT) {
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("tmp-admin-shot.png", Buffer.from(shot.result.data, "base64"));
  }

  // Ambil daftar link sidebar admin
  const links = await evaluate(`JSON.stringify([...document.querySelectorAll('a[href^="/admin"]')].map(a => a.getAttribute("href")))`);
  console.log("LINKS:", links);

  let routes = [];
  try {
    routes = [...new Set(JSON.parse(links).filter((h) => h && h !== "/admin"))];
  } catch {}

  for (const href of routes) {
    const before = events.length;
    await evaluate(`(() => {
      const link = [...document.querySelectorAll('a[href="${href}"]')].find(a => a.offsetParent !== null) || document.querySelector('a[href="${href}"]');
      if (link) link.click();
      return !!link;
    })()`);
    await sleep(2500);
    const s = await snap();
    const fresh = events.slice(before);
    console.log(`\n=== ${href} -> ${s.path}`);
    console.log(`    errorScreen=${s.errorScreen} rootLen=${s.rootLen} text="${s.text}"`);
    if (fresh.length) console.log("    EVENTS:", JSON.stringify(fresh, null, 1));
  }

  console.log("\nALL EVENTS:", JSON.stringify(events, null, 1));
  ws.close();
  chrome.kill();
})().catch((e) => {
  console.error("FAIL", e);
  chrome.kill();
  process.exit(1);
});
