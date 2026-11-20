// Flow driver: walks the buyer checkout flow in headless Chrome via CDP.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9334;
const TOKEN = process.argv[2];
const START = process.argv[3] || "http://127.0.0.1:8100/cart?tab=cart";

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-flow-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--disable-gpu",
  "--window-size=1440,1100",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logs = [];
let shotIndex = 0;

async function main() {
  let page;
  for (let i = 0; i < 40; i += 1) {
    await sleep(250);
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      page = targets.find((t) => t.type === "page");
      if (page) break;
    } catch {}
  }
  if (!page) throw new Error("CDP not reachable");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  ws.addEventListener("message", (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      return;
    }
    if (msg.method === "Runtime.consoleAPICalled") {
      const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? "").join(" ");
      if (["error", "assert"].includes(msg.params.type)) logs.push(`[console.${msg.params.type}] ${text}`);
    }
    if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails;
      logs.push(`[exception] ${d.exception?.description || d.text}`);
    }
  });

  await new Promise((r) => ws.addEventListener("open", r));
  await send("Runtime.enable");
  await send("Page.enable");

  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) return `ERR: ${res.exceptionDetails.exception?.description}`;
    return res.result?.value;
  };

  const snap = async (label) => {
    shotIndex += 1;
    const file = `docs/flow-${String(shotIndex).padStart(2, "0")}-${label}.png`;
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
    console.log(`-- screenshot ${file}`);
  };

  const summary = async (label) => {
    const url = await evaluate("location.href");
    const buttons = await evaluate(
      "Array.from(document.querySelectorAll('button,a')).map(e=>e.innerText.trim()).filter(Boolean).slice(0,40).join(' | ')",
    );
    const errText = await evaluate(
      "document.body.innerText.includes('gangguan tak terduga') ? 'ERROR BOUNDARY VISIBLE' : 'ok'",
    );
    const h1 = await evaluate("Array.from(document.querySelectorAll('h1,h2')).map(e=>e.innerText.trim()).filter(Boolean).slice(0,6).join(' / ')");
    console.log(`\n== ${label}\nurl: ${url}\nstate: ${errText}\nheadings: ${h1}\ncontrols: ${buttons}`);
    await snap(label);
  };

  const clickByText = async (pattern) => {
    const expr = `(() => {
      const re = new RegExp(${JSON.stringify(pattern)}, 'i');
      const nodes = Array.from(document.querySelectorAll('button,a'));
      const hit = nodes.find(n => re.test(n.innerText.trim()));
      if (!hit) return 'NOT FOUND';
      hit.click();
      return 'clicked: ' + hit.innerText.trim();
    })()`;
    return evaluate(expr);
  };

  await send("Page.navigate", { url: "http://127.0.0.1:8100/" });
  await sleep(2500);
  await evaluate(`localStorage.setItem("marketku_auth_token", ${JSON.stringify(TOKEN)}); 1`);
  await send("Page.navigate", { url: START });
  await sleep(25000);
  await summary("01-cart");

  console.log("\n>> checkout click:", await clickByText("checkout|bayar|lanjut"));
  await sleep(25000);
  await summary("02-checkout");

  console.log("\n>> next click:", await clickByText("lanjut|review|periksa|selanjutnya"));
  await sleep(20000);
  await summary("03-review");

  console.log("\n>> confirm click:", await clickByText("konfirmasi|buat pesanan|pesan sekarang|bayar"));
  await sleep(25000);
  await summary("04-after-confirm");

  console.log("\n=== CONSOLE ERRORS ===");
  console.log([...new Set(logs)].slice(0, 25).join("\n") || "(none)");

  ws.close();
  chrome.kill();
}

main().catch((e) => { console.error("FLOW FAILED:", e.message); chrome.kill(); process.exit(1); });
