import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.cwd());
const srcRoot = path.join(root, "src");
const viteConfig = path.join(root, "vite.config.js");
const violations = [];
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return sourceExtensions.has(path.extname(entry.name)) ? [full] : [];
  });
}

for (const file of walk(srcRoot)) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replaceAll("\\", "/");

  if (/https?:\/\/(?:127\.0\.0\.1|localhost):8000\/api\//i.test(text)) {
    violations.push(`${relative}: hardcoded backend REST URL`);
  }

  if (/VITE_(?:API_BASE_URL|API_URL|BACKEND_URL|LARAVEL_BASE_URL)/.test(text)) {
    violations.push(`${relative}: direct REST base URL environment usage`);
  }

  if (/authEndpoint\s*:\s*[`'"]https?:\/\//i.test(text)) {
    violations.push(`${relative}: absolute websocket auth endpoint`);
  }
}

const viteText = fs.readFileSync(viteConfig, "utf8");
const required = [
  'VITE_DEV_BROWSER_HOST || "127.0.0.1"',
  'VITE_DEV_BROWSER_PORT || 5173',
  '"/api"',
  '"/storage"',
  '"/app"',
  '"http://127.0.0.1:8000"',
  '"http://127.0.0.1:8080"',
];

for (const marker of required) {
  if (!viteText.includes(marker)) {
    violations.push(`vite.config.js: missing ${marker}`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Local origin contract valid: browser uses canonical 127.0.0.1:5173, API/storage proxy to 8000, Reverb proxy to 8080.");
