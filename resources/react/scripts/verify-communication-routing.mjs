import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assertions = [];

function check(condition, message) {
  assertions.push({ condition, message });
}

const apiClient = read("src/core/utils/apiClient.js");
const communicationApi = read("src/features/communication/communicationApi.js");
const vite = read("vite.config.js");
const main = read("src/main.jsx");
const canonical = read("src/core/utils/canonicalDevOrigin.js");

check(/API_BASE_URL\s*=\s*["']{2}/.test(apiClient), "apiClient harus same-origin");
check(communicationApi.includes('const COMMUNICATION_API_PREFIX = "/api/v1/communication"'), "prefix Communication harus /api/v1/communication");
check(vite.includes('"/api"'), "Vite harus memiliki proxy /api");
check(vite.includes('http://127.0.0.1:8000'), "target default backend harus 127.0.0.1:8000");
check(main.includes("ensureCanonicalDevOrigin"), "main.jsx harus menjalankan canonical dev origin");
check(canonical.includes('target.hostname = canonicalHost'), "localhost harus diarahkan ke canonical host");

const sourceRoot = path.join(root, "src");
const directBackendUrls = [];

function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(js|jsx|ts|tsx)$/.test(entry.name)) continue;
    const content = fs.readFileSync(full, "utf8");
    if (/https?:\/\/(127\.0\.0\.1|localhost):8000\/api\//.test(content)) {
      directBackendUrls.push(path.relative(root, full));
    }
  }
}

scan(sourceRoot);
check(directBackendUrls.length === 0, `tidak boleh ada direct backend API: ${directBackendUrls.join(", ")}`);

const failed = assertions.filter((item) => !item.condition);
if (failed.length) {
  for (const item of failed) console.error(`FAIL: ${item.message}`);
  process.exit(1);
}

for (const item of assertions) console.log(`OK: ${item.message}`);
