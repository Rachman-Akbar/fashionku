import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const apiClient = read("src/core/utils/apiClient.js");
const communicationApi = read("src/features/communication/communicationApi.js");
const viteConfig = read("vite.config.js");
const main = read("src/main.jsx");

const checks = [
  [apiClient.includes('export const API_BASE_URL = ""'), "apiClient harus same-origin"],
  [communicationApi.includes('COMMUNICATION_API_PREFIX = "/api/v1/communication"'), "prefix Communication harus /api/v1/communication"],
  [!communicationApi.includes("127.0.0.1:8000"), "Communication frontend tidak boleh hardcode port 8000"],
  [viteConfig.includes('"/api"'), "Vite harus memiliki proxy /api"],
  [viteConfig.includes('DEFAULT_BACKEND_TARGET = "http://127.0.0.1:8000"'), "Vite backend target harus Laravel 8000"],
  [main.includes("ensureCanonicalDevOrigin"), "Frontend harus menormalkan host development"],
];

const failed = checks.filter(([ok]) => !ok);

for (const [ok, label] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
}

if (failed.length) {
  process.exitCode = 1;
} else {
  console.log("Communication proxy contract valid.");
}
