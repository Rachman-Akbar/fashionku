const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9342;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-profile-"));
const chrome = spawn(CHROME, ["--headless=new", "--window-size=1440,900", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "http://127.0.0.1:8000/"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, nextId = 100;
const messages = [];

function evaluate(expression) {
  const id = nextId++;
  return new Promise((resolve) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) { ws.removeEventListener("message", handler); resolve(data.result?.result?.value); }
      if (data.method === "Runtime.exceptionThrown") messages.push("[exception] " + (data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text));
      if (data.method === "Runtime.consoleAPICalled") messages.push("[console] " + (data.params.args || []).map((a) => a.value ?? a.description).join(" "));
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method: "Runtime.evaluate", params: { expression, returnByValue: true, awaitPromise: true } }));
  });
}

async function main() {
  let target = null;
  for (let i = 0; i < 40; i += 1) {
    try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); target = list.find((t) => t.type === "page"); if (target) break; } catch {}
    await sleep(250);
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });
  ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
  await sleep(15000);
  console.log("BODY:", (await evaluate("document.body.innerText") || "").replace(/\s+/g, " ").slice(0, 300));
  console.log("BUTTONS:", await evaluate("JSON.stringify([...document.querySelectorAll('button')].map(b => (b.textContent || '').trim()).filter(Boolean).slice(0, 20))"));

  console.log("OPEN:", await evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.textContent || '').trim().toLowerCase().includes('kategori'));
    if (!btn) return 'no button';
    btn.click();
    return 'clicked';
  })()`));
  await sleep(2500);
  console.log("GROUP_CLICK:", await evaluate(`(() => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.textContent || '').trim().toLowerCase() === 'pakaian');
    if (!btn) return 'no group';
    btn.click();
    return 'clicked';
  })()`));
  await sleep(2500);

  console.log("LAYOUT:", await evaluate(`(() => {
    const headings = [...document.querySelectorAll('h3')].filter(h => (h.textContent || '').trim());
    const tops = headings.map(h => ({ text: h.textContent.trim(), top: Math.round(h.getBoundingClientRect().top), left: Math.round(h.getBoundingClientRect().left) }));
    return JSON.stringify({ count: headings.length, tops });
  })()`));
  console.log("BOUNDARY:", await evaluate("document.body.innerText.includes('Halaman gagal dimuat')"));
  console.log("MESSAGES:", messages.join("\n") || "(none)");
  ws.close();
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await sleep(300); chrome.kill(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} });
