// Diagnosa scroll horizontal tabel admin: elemen yang overflow, apakah bisa
// di-scroll (wheel + drag), dan apakah header tabel ikut bergeser.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = Number(process.env.CDP_PORT || 9466);
const BASE = "http://127.0.0.1:8000";
const TOKEN = process.argv[2];
const ROUTES = (process.argv[3] || "/admin/products,/admin/users,/admin/orders,/admin/categories").split(",");

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-hs-"));
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
  if (!target) throw new Error("no target");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let nextId = 1;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const d = JSON.parse(e.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
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

  await send("Page.navigate", { url: BASE + "/auth/login" });
  await sleep(3000);
  await evaluate(`(() => {
    const session = { token: ${JSON.stringify(TOKEN)}, tokenType: "Bearer", roles: ["buyer","admin"], activeRole: "admin",
      user: { id: "ea469813-e902-00b9-1bf4-a15e254ce82d", name: "Nadia Prameswari", email: "nadia@fashionku.id", role: "admin", roles: ["buyer","admin"], avatar: "https://picsum.photos/seed/52b1f4035f07c40b4e1bb9e4f3a1cd53/160/160", has_password: true, is_email_verified: true },
      storageScope: "window" };
    sessionStorage.setItem("marketku_window_auth_token", ${JSON.stringify(TOKEN)});
    sessionStorage.setItem("marketku_window_auth_session", JSON.stringify(session));
  })()`);

  const SCAN = `JSON.stringify((() => {
    const main = document.querySelector("main");
    if (!main) return { err: "no main" };
    const all = [...main.querySelectorAll("*")];
    const overflowing = all.filter((el) => el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0).map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className).slice(0, 90),
      cw: el.clientWidth,
      sw: el.scrollWidth,
      pos: getComputedStyle(el).position,
      ox: getComputedStyle(el).overflowX,
    }));
    const wide = overflowing.filter((o) => o.sw - o.cw > 20);
    const mainBox = main.getBoundingClientRect();
    return {
      path: location.pathname,
      main: { cw: main.clientWidth, sw: main.scrollWidth, ox: getComputedStyle(main).overflowX },
      wide,
      // posisi elemen pertama yang bisa dijadikan target scroll (di dalam area terlihat)
      sample: wide.length ? (() => {
        const el = all.find((e) => e.scrollWidth > e.clientWidth + 20 && e.clientWidth > 0);
        const b = el.getBoundingClientRect();
        return { cls: String(el.className).slice(0, 70), x: Math.round(b.left + Math.min(200, b.width / 2)), y: Math.round(b.top + Math.min(60, b.height / 2)) };
      })() : null,
    };
  })())`;

  const readState = `JSON.stringify((() => {
    const main = document.querySelector("main");
    const nodes = [...main.querySelectorAll("*")].filter((el) => el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0);
    return nodes.map((el) => ({
      cls: String(el.className).slice(0, 60),
      cw: el.clientWidth, sw: el.scrollWidth, sl: Math.round(el.scrollLeft),
      top: Math.round(el.getBoundingClientRect().top),
    }));
  })())`;

  const state = async () => {
    const raw = await evaluate(readState);
    try { return JSON.parse(raw); } catch { return raw; }
  };

  for (const route of ROUTES) {
    await send("Page.navigate", { url: BASE + route });
    let scan = null;
    for (let i = 0; i < 20; i += 1) {
      await sleep(1000);
      scan = await evaluate(SCAN);
      if (scan && !scan.err && scan.wide && scan.wide.length) break;
    }
    console.log(`\n=== ${route}`);
    console.log("  scan:", JSON.stringify(scan, null, 1));
    if (!scan?.sample) { console.log("  -> tidak ada elemen overflow"); continue; }

    const { x, y } = scan.sample;
    const before = await state();

    // 1) Wheel horizontal (event trusted lewat CDP) tepat di atas tabel.
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x, y, deltaX: 200, deltaY: 0, modifiers: 0 });
    await sleep(600);
    const afterWheel = await state();

    // 2) Drag kiri-kanan dengan tombol kiri di atas tabel.
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none", buttons: 0 });
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1 });
    for (let i = 1; i <= 8; i += 1) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: x - i * 25, y, button: "left", buttons: 1 });
      await sleep(30);
    }
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: x - 200, y, button: "left", buttons: 0, clickCount: 1 });
    await sleep(600);
    const afterDrag = await state();

    console.log("  before :", JSON.stringify(before));
    console.log("  wheel  :", JSON.stringify(afterWheel));
    console.log("  drag   :", JSON.stringify(afterDrag));
  }

  ws.close();
  chrome.kill();
})().catch((e) => {
  console.error("FAIL", e);
  chrome.kill();
  process.exit(1);
});
