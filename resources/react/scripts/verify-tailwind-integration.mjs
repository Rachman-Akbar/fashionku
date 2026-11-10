import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const vitePath = path.join(root, "vite.config.js");
const globalCssPath = path.join(root, "src", "styles", "globals.css");
const mainPath = path.join(root, "src", "main.jsx");

const read = (file) => fs.readFileSync(file, "utf8");
const vite = read(vitePath);
const globalCss = read(globalCssPath);
const main = read(mainPath);

const checks = [
  [vite.includes('from "@tailwindcss/vite"') || vite.includes("from '@tailwindcss/vite'"), "vite.config.js belum mengimpor @tailwindcss/vite"],
  [/plugins\s*:\s*\[[\s\S]*tailwindcss\(\)/m.test(vite), "tailwindcss() belum terdaftar di plugins Vite"],
  [globalCss.includes('@import "tailwindcss"') || globalCss.includes("@import 'tailwindcss'"), "globals.css belum mengimpor Tailwind CSS"],
  [main.includes('import "./styles/globals.css"') || main.includes("import './styles/globals.css'"), "main.jsx belum mengimpor globals.css"],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);

if (failed.length > 0) {
  console.error("Tailwind integration invalid:");
  for (const message of failed) console.error(`- ${message}`);
  process.exit(1);
}

console.log("Tailwind integration valid: Vite plugin, global import, and React CSS entry are connected.");
