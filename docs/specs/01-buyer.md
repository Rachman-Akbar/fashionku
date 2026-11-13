# 01 — Spesifikasi Buyer

> Cakupan: alur pembeli dari penemuan produk sampai ulasan dan chat.
> Acuan: [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt) bagian **A. Buyer**.

## 1. Persona & Prinsip

- **Buyer** — pengguna terdaftar dengan role `buyer` (dapat juga memegang role
  `admin` bila akun operator, tetapi konteks dokumen ini adalah sisi belanja).
- Marketplace **single-store**: semua produk berasal dari satu toko utama.
- Semua endpoint butuh autentikasi kecuali katalog publik (produk, kategori, promosi, voucher publik).

## 2. Peta Fitur

| Fitur | Ringkasan | Status |
|---|---|---|
| List Product | Daftar produk publik + filter/pencarian + paginasi | `DONE` |
| Category | Kategori hierarkis 3 level + produk per kategori | `DONE` |
| Voucher | Voucher publik + klaim voucher | `DONE` |
| Promotion | Daftar promosi | `DONE` |
| Cart | Tambah/ubah/hapus item keranjang | `DONE` |
| Wishlist | Tambah/hapus/daftar wishlist | `DONE` |
| Checkout General | Order normal | `DONE` |
| Checkout Booking | Order dengan jadwal kirim/pickup | `PARTIAL` (kapasitas slot belum divalidasi) |
| Checkout Preorder | Order barang belum tersedia | `PARTIAL` (kapasitas preorder belum dipakai) |
| Order History | Riwayat & detail order | `DONE` |
| Rate & Review | Ulasan produk setelah order selesai | `DONE` |
| Chat | Percakapan buyer ↔ toko/admin | `DONE` |

## 3. Discovery

### 3.1 List Product

- Endpoint: `GET /api/v1/catalog/products`, `GET /api/v1/catalog/products/{id}`,
  `GET /api/v1/catalog/products/slug/{slug}`, `GET /api/v1/catalog/products/{productId}/variants`.
- Hanya menampilkan produk `status = published`, `is_active = true`, belum dihapus.
- Mendukung pencarian kata kunci, filter kategori, urutan (terbaru/harga/terpopuler), paginasi.
- Hanya varian dengan stok tersedia **atau** `allows_preorder = true` yang dapat dibeli.

### 3.2 Category (hierarkis 3 level)

- Endpoint: `GET /api/v1/catalog/categories`, `.../menu`, `.../path/{path}`, `.../path/{path}/products`.
- Struktur: level 1 (root) → level 2 → level 3 (leaf). `full_slug` = path bertingkat, mis. `pakaian/pakaian-pria/kaos`.
- **CatalogGroup dihapus** (lihat [`06`](./06-penghapusan-fitur-dan-merge.md)); tidak ada grouping di atas root.

### 3.3 Voucher & Promotion

- Voucher publik: `GET /api/v1/order/vouchers`, `GET /api/v1/order/vouchers/{id}`.
- Voucher milik user: `GET /api/v1/order/vouchers/mine`; klaim: `POST /api/v1/order/vouchers/{id}/claim`.
- Promosi: `GET /api/v1/catalog/promotions`.

## 4. Cart & Wishlist

### 4.1 Cart

| Aksi | Endpoint |
|---|---|
| Lihat keranjang | `GET /api/v1/order/carts` |
| Tambah item | `POST /api/v1/order/carts/items` |
| Ubah qty | `PATCH /api/v1/order/carts/items/{productVariantId}` |
| Hapus 1 item | `DELETE /api/v1/order/carts/items/{productVariantId}` |
| Kosongkan | `DELETE /api/v1/order/carts` |

Aturan:
- Satu keranjang aktif per user.
- Qty tidak boleh melebihi `max_order_qty` varian.
- Menambah varian yang sama menambahkan qty (bukan baris baru).

### 4.2 Wishlist

| Aksi | Endpoint |
|---|---|
| Lihat | `GET /api/v1/order/wishlist` |
| Tambah | `POST /api/v1/order/wishlist` |
| Hapus | `DELETE /api/v1/order/wishlist/{productId}` |

## 5. Checkout

### 5.1 Alur Umum

1. Pilih item (dari cart atau langsung `items[]`).
2. Isi/ pilih alamat (`POST /api/v1/order/addresses`, `resolve-destination`).
3. Ambil opsi kirim: `POST /api/v1/order/orderings/shipping-options`.
4. Buat order: `POST /api/v1/order/orderings` dengan `order_type` ∈ {`normal`, `preorder`, `booking`}.
5. Pembayaran via Midtrans; notifikasi: `POST /api/v1/order/payments/midtrans/notification`.

### 5.2 Tipe Order — Aturan Target

| Tipe | Pemicu | Validasi wajib | Perilaku stok |
|---|---|---|---|
| `normal` | Default | Stok tersedia ≥ qty | Kurangi `stock` |
| `booking` | Buyer memilih jadwal | `scheduled_at` **wajib**; **kapasitas slot tersedia** | Tambah `stock_booked`; rilis saat selesai/batal |
| `preorder` | Stok fisik tidak cukup **atau** buyer memilih preorder yang diizinkan | Produk `allows_preorder = true`; **kapasitas `stock_preorder` tersedia**; `preorder_release_at` **wajib** | Tambah `stock_preorder` |

**Perbaikan yang dibutuhkan (G-10..G-13):**

- **G-10** Preorder harus mempertimbangkan `stock_preorder` (kapasitas), bukan hanya
  `stock = 0`. Jika `stock` habis dan `allows_preorder` benar tetapi kapasitas
  `stock_preorder` habis → tolak dengan pesan jelas.
- **G-11** Booking harus memvalidasi kapasitas jadwal (tabel `schedules`), bukan
  sekadar `scheduled_at` terisi. Tolak jika slot penuh.
- **G-12** Jangan konversi diam-diam booking + stok kurang menjadi preorder. Bila
  konflik, tolak dan minta buyer memilih ulang.
- **G-13** `preorder_release_at` wajib saat tipe `preorder` (validasi request + domain).

### 5.3 Penentuan Tipe (kondisi saat ini)

`CreateOrderUseCase::resolveOrderType()`:
- Menghitung `available = stock - stock_reserved - stock_booked` (min 0).
- Jika `qty > available` dan `stock === 0` dan `allows_preorder` → `preorder`.
- Jika `qty > available` dan `stock > 0` → error "stok tidak mencukupi".
- Booking hanya divalidasi setelah loop, yaitu bila **tidak** ada kebutuhan preorder.

### 5.4 Voucher & Biaya

- Voucher divalidasi terhadap subtotal, minimal belanja, masa berlaku, kuota, dan kepemilikan.
- Biaya layanan per kategori diambil dari `admin_fee_configs` (lihat `02`).
- Ongkos kirim dihitung `ShippingCostCalculator` berdasarkan opsi kirim terpilih.

## 6. Order History

| Aksi | Endpoint |
|---|---|
| Daftar order | `GET /api/v1/order/orderings` |
| Detail | `GET /api/v1/order/orderings/{id}` |
| Batal | `POST /api/v1/order/orderings/{id}/cancel` |

- Buyer hanya melihat order miliknya.
- Status order mengikuti state machine (lihat `02-admin.md` §Monitoring).

## 7. Rate & Review

| Aksi | Endpoint |
|---|---|
| Ulasan produk (publik) | `GET /api/v1/order/products/{productId}/reviews` |
| Ulasan saya | `GET /api/v1/order/reviews` |
| Buat | `POST /api/v1/order/reviews` |
| Ubah | `PUT /api/v1/order/reviews/{id}` |
| Hapus | `DELETE /api/v1/order/reviews/{id}` |

- Hanya buyer yang pernah menyelesaikan order atas produk tersebut yang boleh mengulas.
- Satu ulasan per item order.

## 8. Chat

| Aksi | Endpoint |
|---|---|
| Daftar percakapan | `GET /api/v1/communication/conversations` |
| Buat percakapan | `POST /api/v1/communication/conversations` |
| Detail | `GET /api/v1/communication/conversations/{id}` |
| Kirim pesan | `POST /api/v1/communication/conversations/{id}/messages` |
| Tandai dibaca | `PATCH /api/v1/communication/conversations/{id}/read` |

- Realtime via Echo/Pusher (frontend `RealtimeChatPage`).
- Buyer dapat membuka Help/tiket: `GET/POST /api/v1/support/tickets`, `.../{id}/replies`.

## 9. Acceptance Criteria

### AC-B1 — Tambah ke cart
- **Given** buyer login dan varian stok tersedia,
- **When** `POST /order/carts/items` dengan qty ≤ `max_order_qty`,
- **Then** item masuk keranjang; qty bertambah bila varian sama.

### AC-B2 — Checkout normal
- **Given** item dengan stok cukup,
- **When** checkout `order_type=normal`,
- **Then** order dibuat dan stok berkurang.

### AC-B3 — Preorder saat stok habis
- **Given** produk `allows_preorder=true`, `stock=0`, `stock_preorder>0`,
- **When** checkout `order_type=preorder` dengan `preorder_release_at`,
- **Then** order dibuat sebagai preorder dan `stock_preorder` berkurang.

### AC-B4 — Preorder ditolak saat kapasitas habis
- **Given** `stock=0` dan `stock_preorder=0`,
- **When** checkout preorder,
- **Then** ditolak dengan pesan kapasitas preorder habis.

### AC-B5 — Booking wajib jadwal & kapasitas
- **Given** jadwal dengan kapasitas tersisa,
- **When** checkout `order_type=booking` dengan `scheduled_at`,
- **Then** order booking dibuat dan slot terpakai.
- **When** `scheduled_at` kosong atau slot penuh, **Then** ditolak.

### AC-B6 — Review hanya setelah order selesai
- **Given** order berstatus selesai,
- **When** buyer membuat review,
- **Then** review tersimpan; sebaliknya ditolak.

## 10. Non-Fungsional

- Respons API konsisten `{ success, message, data }`.
- Paginasi standar (`per_page`, `page`).
- Semua endpoint buyer dilindungi `auth:sanctum`, `active.user`, `verified.email`.
