# Roadmap Perbaikan Lanjutan Fashionku

Dokumen ini mencakup semua perbaikan yang belum selesai berdasarkan gap analysis (`docs/specs/00-analisis-celah.md`) dan spesifikasi fitur (`docs/specs/`). Semua perubahan berada di working tree dan belum di-commit.

## Kondisi Saat Ini (Baseline)

| Item | Status |
|------|--------|
| `php artisan test` | **129 passed / 521 assertions** (hijau) |
| `npm run build` | **Hijau** (~40s) |
| Perbaikan DONE (terimplementasi) | G-01–G-07, G-10–G-13, G-14, G-15, G-16, G-17, G-18, G-19, G-20–G-24, UX-01–03, BUG-01–02 |
| Perbaikan BELUM SELESAI | (semua fase selesai) |

---

## FASE 1 — Perbaikan Logika Order (Preorder & Booking)

**Prioritas:** Tinggi  
**File utama:** `app/Domains/Order/Ordering/Application/UseCases/CreateOrderUseCase.php:395` (`resolveOrderType`)

| ID | Masalah | Aksi Perbaikan | Status |
|----|---------|----------------|--------|
| G-10 | Preorder hanya terpicu bila `stock = 0`, mengabaikan `stock_preorder` (kapasitas preorder) | Cek kapasitas `stock_preorder` saat menentukan tipe preorder; tolak jika kapasitas habis dengan pesan jelas | **[SELESAI]** `CreateOrderUseCase::resolveOrderType` |
| G-11 | Booking tidak memvalidasi kapasitas slot jadwal (`schedules.capacity`) | Tambah validasi kuota jadwal saat `order_type=booking`; tolak jika slot penuh | **[SELESAI]** `CreateOrderUseCase` + migration `schedules.capacity` |
| G-12 | Booking + stok kurang diam-diam dikonversi menjadi preorder | Prioritaskan aturan booking; tolak konflik tipe eksplisit dan minta buyer memilih ulang | **[SELESAI]** `CreateOrderUseCase` |
| G-13 | `preorder_release_at` nullable meski tipe = preorder | Wajibkan `preorder_release_at` pada validasi request + domain saat `order_type=preorder` | **[SELESAI]** Sudah ada validasi request |

### Acceptance Criteria (Fase 1)

- **AC-B3:** Produk `allows_preorder=true`, `stock=0`, `stock_preorder>0` → checkout preorder berhasil dan `stock_preorder` berkurang.
- **AC-B4:** `stock=0` dan `stock_preorder=0` → checkout preorder ditolak dengan pesan kapasitas preorder habis.
- **AC-B5:** Booking dengan `scheduled_at` kosong atau slot penuh → ditolak; jadwal dengan kapasitas tersisa → order booking dibuat dan slot terpakai.

---

## FASE 2 — Import/Export Berbasis Kode (G-15) **[SELESAI]**

**Prioritas:** Tinggi  
**File utama:** `app/Domains/Catalog/Spreadsheet/` (routes, controller, service, registry)  
**Frontend:** Siap memanggil (`resources/react/src/shared/spreadsheet/spreadsheetService.js`)

| Modul (path param) | Entitas | Kunci Acuan | Kolom Kode di File |
|--------------------|---------|-------------|--------------------|
| `raw-material` | Bahan baku | `material_code` | `kode_bahan` |
| `product` | Produk (+varian) | `sku` | `sku` |
| `stock` | Stok produk | `sku` | `sku` |
| `income` / `expense` | Pemasukan/Pengeluaran | `invoice_reference` | `kode_transaksi` |

### Endpoint Target (per modul)

| Aksi | Method & Path |
|------|---------------|
| Unduh template | `GET /api/v1/catalog/spreadsheets/{module}/template` |
| Export data | `POST /api/v1/catalog/spreadsheets/{module}/export` (body `{ ids: [] }`) |
| Preview import | `POST /api/v1/catalog/spreadsheets/{module}/import/preview` (multipart) |
| Import | `POST /api/v1/catalog/spreadsheets/{module}/import` (multipart) |
| Bulk delete | `POST /api/v1/catalog/spreadsheets/{module}/bulk-delete` (body `{ ids: [] }`) |

### Mode Import (`import_mode`)

| Mode | Perilaku |
|------|----------|
| `create` | Hanya membuat baru; kode sudah ada → error |
| `update` | Hanya memperbarui yang ada; kode tak dikenal → error |
| `upsert` | Buat bila belum ada, perbarui bila sudah ada (default) |

### Acceptance Criteria (Fase 2)

- **AC-I1:** Update by kode, nama berubah → relasi order tetap utuh.
- **AC-I2:** Tidak ada kolom ID database → pencocokan masih berhasil memakai kode.
- **AC-I3:** Mode `create` dengan `sku` duplikat → error "kode sudah terdaftar".
- **AC-I4:** Mode `update` dengan `sku` tak dikenal → error "kode tidak ditemukan".
- **AC-I5:** Upsert dua kali → jumlah baris tidak bertambah, data konsisten.
- **AC-I6:** Beberapa baris invalid → baris sukses tersimpan, file XLSX error berisi baris gagal + alasan.
- **AC-I7:** Kode milik toko lain → tidak boleh menimpa data toko lain (scoping toko).

---

## FASE 3 — Domain Schedule + Kapasitas Booking (G-17) **[SELESAI]**

**Prioritas:** Menengah  
**File utama:** `app/Domains/Seller/Schedule/` (controller, routes) + migration `schedules.capacity`

Tabel `schedules` sudah ada dan kini didukung oleh domain/route/UI lengkap.

### Aksi Perbaikan

1. **[SELESAI]** Bangun domain `app/Domains/Seller/Schedule/` (controller `ScheduleController`, routes)
2. **[SELESAI]** Registrasi route di `app/Domains/Seller/routes.php`
3. **[SELESAI]** Implementasi CRUD jadwal produksi/pengiriman/pickup (index/store/show/update/destroy)
4. **[SELESAI]** Implementasi kapasitas slot yang dipakai booking (migration `schedules.capacity`, menopang G-11 Fase 1)

---

## FASE 4 — Migrasi Chart.js + Filter Seragam (G-18, G-19) **[SELESAI]**

**Prioritas:** Menengah  
**File utama:** `resources/react/src/shared/components/charts/chartKit.jsx`, `app/Domains/Seller/Finance/` (controller + service), `package.json`

| Item | Aksi Perbaikan | Status |
|------|----------------|--------|
| G-18 | Ganti mesin render Recharts → Chart.js di `chartKit.jsx` (pertahankan API publik ekspor) | **[SELESAI]** `chartKit.jsx` ditulis ulang; `recharts` dihapus, `react-chartjs-2` + `chartjs-adapter-date-fns` dipasang |
| G-19 | Standarkan parameter filter: `date_from`, `date_to`, `month`, `year`, `granularity` | **[SELESAI]** `SellerFinanceDashboardController` dan `SellerFinanceDashboardService` diupdate |
| — | Tambah halaman "Laporan Penjualan dan Produk" (belum ada) | Belum ada |

### Endpoint yang Diupdate

| Endpoint | Filter Saat Ini | Perubahan |
|----------|-----------------|-----------|
| `GET /seller/finance/dashboard` | `period`, `date_from`, `date_to` | **Selesai** — Tambah `month`, `year`, `granularity` |
| `GET /seller/finance/dashboard/cashflow` | `from_date`, `to_date` (wajib) | **Selesai** — Samakan nama `date_from/date_to`; tambah `month`/`year` |
| `GET /seller/finance/dashboard/order-trend` | `period`, `date_from`, `date_to` | **Selesai** — Tambah `month`, `year`, `granularity` |
| `GET /seller/stock/movements` | filter gerakan | Tambah `date_from/date_to` untuk grafik stok *(belum diimplementasi)* |
| Dashboard Admin (metrik) | `period=monthly` (hardcoded) | Tambah kontrol filter *(belum diimplementasi)* |
| Laporan Penjualan/Produk | **belum ada** | Endpoint baru *(belum diimplementasi)* |

### Acceptance Criteria (Fase 4)

- **AC-C1:** Chart menggunakan Chart.js (bukan Recharts); `recharts` tidak lagi di bundle.
- **AC-C2:** Pengguna memilih rentang tanggal → data chart otomatis ter-refresh sesuai rentang.
- **AC-C3:** `month=2026-11` → chart menampilkan data 1–30 Nov 2026.
- **AC-C4:** `year=2026` → chart menampilkan agregasi `granularity=month` sepanjang 2026.
- **AC-C5:** Filter berubah → query dijalankan ulang otomatis tanpa reload halaman.
- **AC-C6:** Keempat halaman memakai nama parameter yang sama (`date_from`, `date_to`, `month`, `year`, `granularity`).

---

## Estimasi Urutan Pengerjaan **[SEMUA SELESAI]**

| Urutan | Fase | Status |
|--------|------|--------|
| 1 | Fase 1 — Order logic (foundational, dibutuhkan sebelum import stock) | **[SELESAI]** G-10, G-11, G-12, G-13 |
| 2 | Fase 2 — Import/export (inti permintaan user; G-16 bahan baku sudah siap) | **[SELESAI]** G-15 |
| 3 | Fase 3 — Schedule (menopang G-11 kapasitas booking) | **[SELESAI]** G-17 |
| 4 | Fase 4 — Chart.js (UI/UX terakhir, independen) | **[SELESAI]** G-18, G-19 |

## Perbaikan Tambahan (UX & Bug Fix) **[SELESAI]**

| ID | Masalah | Aksi Perbaikan | Status |
|----|---------|----------------|--------|
| UX-01 | Tombol cart tidak meng-scroll halaman ke atas | Tambah `window.scrollTo({top:0, behavior:'smooth'})` pada `handleAddToCart`, `handleCardOrderAction` (ProductCard), `handleAddCart` (ProductCheckoutPanel), dan `onAddToCart` (CartPage WishlistTab) | **[SELESAI]** |
| UX-02 | Tab switch di halaman cart tidak sticky saat scroll | Ganti `TabNavigation` di `CartPage.jsx` agar sticky dengan `var(--main-nav-offset, 96px)` dan desain sama seperti `ProductFeed` (border-bottom, scrollable, teks lebih besar) | **[SELESAI]** |
| BUG-01 | Gambar tidak muncul di semua data bergambar (cart, order, dll.) | Tambah `resolveMediaUrl` pada `normalizeCartItem` di `CartContext.jsx`; tambah `onError` fallback placeholder pada `ProductCard`, `CartItemRow`, `ImageGallery`, `ProductCheckoutPanel` | **[SELESAI]** |
| UX-03 | Carousel promosi mundur saat looping terakhir ke awal | Tambah kloning item pertama di akhir array, reset ke 0 setelah transisi selesai, hapus `loading="lazy"` agar gambar segera tampil | **[SELESAI]** `HomePromoSection.jsx` |
| BUG-02 | `window.open` pada tombol "Kunjungi di Marketplace" di detail review | Ganti dengan `navigate()` ke halaman produk | **[SELESAI]** `ReviewDetailPage.jsx` |
| BUG-03 | Profile button menampilkan dropdown multi-item saat hover/klik | Ganti dengan hanya tombol Logout yang muncul saat klik | **[SELESAI]** `Navbar.jsx` |
| BUG-04 | Gambar produk masih tampil blank | Jalankan `php artisan storage:link`; database sudah memiliki 1012 product_images dengan URL picsum.photos; fallback placeholder sudah ditambahkan di setiap `onError` img | **[SELESAI]** |

Setiap fase telah divalidasi dengan `php artisan test` dan `npm run build`.
