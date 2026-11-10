import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const expect = (condition, message) => checks.push({ condition, message });

const cartContext = read("src/features/order/cart/context/CartContext.jsx");
const cartRow = read("src/features/order/cart/components/CartItemRow.jsx");
const productCard = read("src/features/catalog/product/components/ProductCard.jsx");
const checkout = read("src/features/order/ordering/pages/CheckoutPage.jsx");
const app = read("src/App.jsx");
const category = read("src/features/catalog/category/components/CategoryDropdown.jsx");

expect(cartContext.includes("queryClient.setQueryData(CART_KEY"), "Cart quantity harus optimistic");
expect(cartContext.includes("QUANTITY_SYNC_DELAY"), "Cart quantity harus memakai sync delay ringan");
expect(cartRow.includes("active:scale-90"), "Tombol quantity harus memiliki feedback interaksi");
expect(productCard.includes("hasSingleVariant"), "Product card harus mendeteksi single/default variant");
expect(productCard.includes("goDirectCheckout"), "Product card single variant harus bisa lanjut langsung");
expect(app.includes('path="/checkout/*"'), "Checkout route harus mendukung preview page");
expect(checkout.includes('isPreviewPage = location.pathname.endsWith("/preview")'), "Preview harus berupa halaman checkout/preview");
expect(!checkout.includes("setPreviewOpen("), "Preview tidak boleh memakai modal state");
expect(checkout.includes("Membuat Pesanan..."), "Tombol checkout harus punya loading pembuatan pesanan");
expect(checkout.includes("Membuka Pembayaran..."), "Tombol checkout harus punya loading pembayaran");
expect(category.includes("useState(VOUCHER_GROUP_KEY)"), "Mega menu kategori harus membuka Voucher sebagai halaman utama");
expect(category.includes("const nextGroup = requestedExists ? requested : VOUCHER_GROUP_KEY"), "Fallback mega menu harus Voucher");

const failed = checks.filter((check) => !check.condition);
for (const check of checks) {
  console.log(`${check.condition ? "PASS" : "FAIL"} ${check.message}`);
}

if (failed.length) {
  process.exit(1);
}

console.log("Buyer cart and checkout flow contract valid.");
