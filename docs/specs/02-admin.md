# 02 — Spesifikasi Admin (Operator Tunggal = Seller)

> Cakupan: seluruh operasional toko dari sisi operator.
> Acuan: [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt) bagian **B. Admin**.

## 1. Konsep Inti

Fashionku adalah **marketplace single-store**. Karena itu:

- **Admin = Seller.** Satu role bisnis `admin` menjalankan penjualan **dan** operasional.
- Role warisan `seller` tetap dikenali sebagai **alias** di lapisan auth/middleware agar
  token & rute lama tidak rusak, tetapi tidak lagi menjadi role terpisah.
- Tidak ada pendaftaran seller mandiri; toko utama dibuat saat **instalasi/seeding**.
- Panel UI adalah panel `seller` (frontend `SellerLayout`) yang kini dapat diakses
  `roles={["seller","admin"]}`.

Detail penggabungan: lihat [`06-penghapusan-fitur-dan-merge.md`](./06-penghapusan-fitur-dan-merge.md).

### Dua Mode Penggunaan

1. **Berjualan saja** — kelola produk, voucher, promosi, order, ulasan, chat.
2. **Berjualan + operasional** — tambahan bahan baku/HPP, transaksi keuangan, stok, jadwal.

## 2. Matriks Peran & Permission

Role aktif: `admin`, `buyer`. (Role lain di-nonaktifkan oleh `RolePermissionSeeder`.)

| Permission | Deskripsi | admin | buyer |
|---|---|:--:|:--:|
| `products.manage` | Kelola produk & varian | ✅ | — |
| `promotions.manage` | Kelola promosi | ✅ | — |
| `vouchers.manage` | Kelola voucher | ✅ | — |
| `orders.view` | Lihat pesanan | ✅ | ✅ (milik sendiri) |
| `orders.manage` | Kelola pesanan | ✅ | — |
| `checkout.create` | Buat checkout | ✅ | ✅ |
| `reports.export` | Ekspor laporan | ✅ | — |
| `finance.manage` | Kelola keuangan toko | ✅ | — |
| `stock.manage` | Kelola stok & pergerakan | ✅ | — |
| `reviews.create` | Review milik sendiri | ✅ | ✅ |
| `reviews.manage` | Moderasi semua review | ✅ | — |
| `tickets.create` | Buat/balas Help | ✅ | ✅ |
| `tickets.manage` | Kelola seluruh Help | ✅ | — |
| `chat.use` | Percakapan | ✅ | ✅ |
| `announcements.manage` | Kirim pengumuman | ✅ | — |
| `users.manage` | Kelola pengguna | ✅ | — |
| `roles.manage` | Kelola peran & hak akses | ✅ | — |
| `banners.manage` | (warisan) banner | ✅ | — |

> `banners.manage` dipertahankan untuk kompatibilitas data lama; fitur banner sudah dihapus dari UI.

## 3. Manajemen Toko

| Aksi | Endpoint |
|---|---|
| Lihat pengaturan toko | `GET /api/v1/seller/store/manage` |
| Perbarui toko | `PUT/POST /api/v1/seller/store` |

- Satu user operator ↔ satu toko utama.
- Toko berstatus `suspended` memblokir panel (guard frontend `SellerStoreGuard`).
- Guard backend: `active.role:seller` (admin lolos), `seller.store.available`.

## 4. CRUD Kategori

| Aksi | Endpoint |
|---|---|
| List | `GET /api/v1/catalog/categories` |
| Manage list | `GET /api/v1/catalog/categories/manage` |
| Menu (publik) | `GET /api/v1/catalog/categories/menu` |
| Detail | `GET /api/v1/catalog/categories/{id}` |
| Buat | `POST /api/v1/catalog/categories` |
| Ubah | `PUT /api/v1/catalog/categories/{id}` |
| Hapus (soft) | `DELETE /api/v1/catalog/categories/{id}` |
| Quick-create relasi | `POST /api/v1/catalog/relations/categories/quick-create` |

- Hierarki maksimal **3 level**; `full_slug` otomatis.
- Nama unik per parent (`categories_parent_name_unique`).
- **CatalogGroup dihapus** — tidak ada lagi `catalog_group_id`.

## 5. CRUD Produk

| Aksi | Endpoint |
|---|---|
| List produk (admin) | `GET /api/v1/catalog/admin/products` |
| Buat produk | `POST /api/v1/catalog/admin/products` |
| Ubah produk | `PUT /api/v1/catalog/admin/products/{id}` |
| Hapus produk | `DELETE /api/v1/catalog/admin/products/{id}` |
| List produk (seller) | `GET /api/v1/catalog/seller/products` |
| Buat/ubah/hapus (seller) | `POST/PUT/DELETE /api/v1/catalog/seller/products...` |
| Varian | `.../{productId}/variants` (+ `/{variantId}`) |
| Atribut produk | `GET/POST/PUT/DELETE /api/v1/catalog/products/attributes` |
| Costing/HPP | `GET/PUT /api/v1/catalog/{admin,seller}/products/{productId}/costing` |
| Upload media | `POST /api/v1/catalog/media/images` |

- Field varian mencakup `sku`, `stock`, `stock_reserved`, `stock_booked`, `stock_preorder`,
  `max_order_qty`, harga, berat/dimensi.
- Produk memiliki `allows_preorder` (menentukan kelayakan preorder).
- SKU dipakai sebagai **kode acuan import** (lihat [`05`](./05-import-update-berbasis-kode.md)).

## 6. CRUD Promosi & Voucher

| Aksi | Endpoint |
|---|---|
| Promosi list/manage | `GET /api/v1/catalog/promotions`, `/manage` |
| Buat/ubah/hapus promosi | `POST/PUT/DELETE /api/v1/catalog/promotions...` |
| Promosi (seller) | `GET/POST /api/v1/seller/promotions`, `PUT/DELETE /{id}` |
| Voucher admin | `GET /api/v1/order/vouchers/admin/manage/list`, `POST/PUT/DELETE /api/v1/order/vouchers/admin...` |
| Voucher seller | `GET /api/v1/order/vouchers/seller/manage/list`, `POST/PUT/DELETE /api/v1/order/vouchers/seller...` |

## 7. CRUD Pengguna & Peran

| Aksi | Endpoint | Permission |
|---|---|---|
| List/buat/detail/ubah/hapus user | `GET/POST/PUT/DELETE /api/v1/identity/users...` | `users.manage` |
| Cari user via email | `GET /api/v1/identity/users/email/{email}` | `users.manage` |
| List/buat/ubah/hapus role | `GET/POST/PUT/DELETE /api/v1/identity/roles...` | `roles.manage` |
| List permission | `GET /api/v1/identity/permissions` | `roles.manage` |

## 8. Operasional

### 8.1 Bahan Baku & HPP (`TODO` — G-16)

> Route file `app/Domains/Seller/Inventory/Presentation/routes.php` **belum diregistrasi**
> di `app/Domains/Seller/routes.php`, sehingga endpoint di bawah ini belum aktif.

| Aksi | Endpoint target |
|---|---|
| List bahan baku | `GET /api/v1/seller/inventory/materials` |
| Buat/ubah/hapus | `POST/PUT/DELETE /api/v1/seller/inventory/materials...` |
| Sesuaikan stok bahan | `POST /api/v1/seller/inventory/materials/{id}/stock` |
| Pergerakan bahan | `GET /api/v1/seller/inventory/material-movements` |
| Dampak biaya | `GET /api/v1/seller/inventory/cost-impacts` |

- Bahan baku memiliki **kode** (mis. `BB-001`) sebagai acuan import.
- HPP produk diturunkan dari komposisi bahan + biaya produksi (costing).

### 8.2 Transaksi Keuangan

| Aksi | Endpoint |
|---|---|
| Dashboard | `GET /api/v1/seller/finance/dashboard` |
| Cashflow | `GET /api/v1/seller/finance/dashboard/cashflow` |
| Tren order | `GET /api/v1/seller/finance/dashboard/order-trend` |
| List/buat/detail/ubah/hapus transaksi | `GET/POST/GET/PUT/DELETE /api/v1/seller/finance...` |
| Catat/riwayat pembayaran | `PATCH/GET /api/v1/seller/finance/{id}/payments` |
| Hutang/piutang | `GET /api/v1/seller/finance/hutang-piutang/{summary,aging,type,type/export}` |

- Kolom `category` (mis. `penjualan`, `bahan_baku`, `operasional`, `gaji`) **baru ditambahkan** (G-02).
- Setiap transaksi punya `reference_number` sebagai **kode acuan import**.
- Pemasukan otomatis dari order selesai (`AutoOrderIncomeService`, idempotent per store+order).

### 8.3 Stok

| Aksi | Endpoint |
|---|---|
| Pergerakan stok | `GET /api/v1/seller/stock/movements` |
| Penyesuaian stok | `POST /api/v1/seller/stock/adjustments` |

- Dimensi stok: `stock` (available), `stock_reserved`, `stock_booked`, `stock_preorder`.
- `StockMovementService` menolak stok negatif dan delta nol.

### 8.4 Jadwal / Schedule (`TODO` — G-17)

- Tabel `schedules` (dengan dukungan kanban) sudah ada, tetapi **belum ada domain/route/UI**.
- Target: CRUD jadwal produksi/pengiriman/pickup + kapasitas slot yang dipakai booking.

## 9. Import + Export

Lihat spesifikasi penuh di [`05-import-update-berbasis-kode.md`](./05-import-update-berbasis-kode.md).

- Frontend sudah memanggil `/api/v1/catalog/spreadsheets/{module}/{template,export,import,import/preview,bulk-delete}`.
- **Backend belum ada** (G-15) → status `TODO`.
- Prinsip: **acuan adalah KODE**, bukan nama produk maupun ID database.

## 10. Monitoring

| Area | Endpoint |
|---|---|
| Order (per toko) | `GET /api/v1/order/orderings/stores/{storeId}`, `.../{id}`, `PATCH .../{id}/status` |
| Order manual | `POST /api/v1/order/orderings/manual` |
| Ulasan | `GET /api/v1/order/reviews`, `PUT/DELETE /api/v1/order/reviews/{id}` |
| Stok | `GET /api/v1/seller/stock/movements` |
| Transaksi | `GET /api/v1/seller/finance` |
| Pelanggan | `GET/POST/PATCH/DELETE /api/v1/seller/customers...` |
| Tiket/Help | `GET /api/v1/support/tickets...`, `PATCH .../{id}/status` |
| Notifikasi admin | domain `Admin/Notification` |

### State Machine Order (ringkas)

`pending → paid → processing → shipped → completed` (plus `cancelled`, `refunded`).
Transisi divalidasi di `OrderingController::updateStatus` / use case terkait.

## 11. Chat Buyer

- Admin membalas percakapan buyer melalui `Communication` (endpoint sama dengan buyer).
- Pengumuman: `POST /api/v1/communication/announcements` (`announcements.manage`).

## 12. Acceptance Criteria

### AC-A1 — Admin mengelola toko
- **Given** user ber-role `admin`, **When** `PUT /seller/store`, **Then** data toko tersimpan.

### AC-A2 — Admin mengakses panel seller
- **Given** admin tanpa role `seller`, **When** membuka `/seller/*`, **Then** diizinkan
  (middleware `active.role:seller` menerima admin).

### AC-A3 — Kategori tanpa group
- **Given** admin, **When** membuat kategori tanpa `catalog_group_id`, **Then** berhasil.

### AC-A4 — Kelola user & role
- **Given** permission `users.manage`, **When** `POST /identity/users`, **Then** user dibuat.

### AC-A5 — Bahan baku (setelah G-16)
- **Given** route diregistrasi, **When** `GET /seller/inventory/materials`, **Then** 200.

### AC-A6 — Import berbasis kode (setelah G-15)
- **Given** file import dengan kolom kode, **When** diunggah, **Then** baris dicocokkan
  berdasarkan kode dan di-update tanpa mengubah referensi lain meski nama berubah.

## 13. Non-Fungsional

- Semua endpoint admin dilindungi `auth:sanctum`, `active.user`, `verified.email`, `active.role:seller`, dan `permission:*` yang relevan.
- Operasi tulis dibungkus transaksi DB dan dicatat (`TracksUserChanges`).
