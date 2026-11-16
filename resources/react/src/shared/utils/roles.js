/**
 * Marketplace single-store: satu-satunya operator toko adalah role `admin`.
 *
 * Role `seller` sudah digabungkan ke `admin`
 * (migrasi `2026_11_13_000200_merge_seller_role_into_admin`), tetapi token lama
 * dan data uji masih bisa memakai `active-role:seller`. Karena itu setiap
 * pemeriksaan "apakah sesi ini panel operator toko?" harus menerima keduanya.
 *
 * Tanpa helper ini, kondisi `activeRole === "seller"` tidak akan pernah bernilai
 * true di produksi sehingga query data toko/produk/pesanan tidak pernah
 * diaktifkan (halaman panel penjual tampil kosong).
 */
export function isOperatorRole(role) {
  const normalized = String(role || "").toLowerCase().trim();
  return normalized === "admin" || normalized === "seller";
}

export function isBuyerRole(role) {
  return String(role || "").toLowerCase().trim() === "buyer";
}
