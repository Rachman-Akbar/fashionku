import fs from "node:fs";

const checks = [
  ["src/App.jsx", 'const BuyerHelpPage = lazy(() => import("@/features/profile/help/pages/BuyerHelpPage"));'],
  ["src/App.jsx", 'const BuyerMissionsPage = lazy(() => import("@/features/profile/missions/pages/BuyerMissionsPage"));'],
  ["src/App.jsx", '<Route path="/profile/help" element={<BuyerHelpPage />} />'],
  ["src/App.jsx", '<Route path="/profile/missions" element={<BuyerMissionsPage />} />'],
  ["src/shared/layout/BuyerLayout.jsx", "<RouteOutletBoundary"],
  ["src/features/profile/ProfileLayout.jsx", "<RouteOutletBoundary"],
  ["src/features/admin/AdminLayout.jsx", "<RouteOutletBoundary"],
  ["src/features/seller/SellerLayout.jsx", "<RouteOutletBoundary"],
  ["src/features/admin/AdminLayout.jsx", "lg:grid-cols-[248px_minmax(0,1fr)]"],
  ["src/features/seller/SellerLayout.jsx", "lg:grid-cols-[248px_minmax(0,1fr)]"],
  ["src/features/profile/components/profileLayoutClasses.js", "overflow-x-hidden"],
  ["src/shared/layout/PanelHeader.jsx", "memo(PanelHeaderComponent)"],
];

const failures = [];
for (const [file, needle] of checks) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes(needle)) failures.push(`${file}: ${needle}`);
}

const buyerHelp = fs.readFileSync("src/features/profile/help/pages/BuyerHelpPage.jsx", "utf8");
const buyerMissions = fs.readFileSync("src/features/profile/missions/pages/BuyerMissionsPage.jsx", "utf8");
if (/User ID|Store ID/.test(buyerHelp)) failures.push("Buyer Help masih menampilkan ID internal.");
if (/ModuleFrame|DataGrid|FormModal/.test(buyerHelp)) failures.push("Buyer Help masih memakai komponen CRUD panel.");
if (/ModuleFrame|DataGrid|FormModal/.test(buyerMissions)) failures.push("Buyer Mission masih memakai komponen CRUD panel.");

if (failures.length) {
  console.error("Persistent layout contract failed:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Persistent layout contract valid.");
