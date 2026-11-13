# 00 — Analisis Celah (Gap Analysis)

> Dokumen ini memetakan **kondisi saat ini** Fashionku, **celah logika/keamanan**
> yang ditemukan, dan **status perbaikannya**. Menjadi dasar seluruh spesifikasi lain.

## 1. Metode

1. Recon statis seluruh `app/Domains/*` (domain-driven), `routes.php` per domain,
   migrasi, seeder, dan `resources/react/src`.
2. Menjalankan test suite (`php artisan test`) dan build frontend (`npm run build`).
3. Membandingkan hasil dengan [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt).

### Baseline

| Item | Sebelum | Sesudah (branch kerja) |
|---|---|---|
| `php artisan test` | 124 failed / 0 assertions (migrasi SQLite error) | **121 passed / 494 assertions** |
| `npm run build` | — | hijau (~34s) |

Penyebab utama kegagalan awal: migrasi `catalog_groups` + kolom `catalog_group_id`
yang tidak kompatibel dengan SQLite in-memory, dan alur login yang masih satu langkah
(sementara test sudah mengharapkan OTP 2 langkah).

## 2. Peta Domain

```
app/Domains
├── Admin/            Notification (service notifikasi admin)
├── Catalog/          Category, Product (+Attributes, Costing), Promotion, Media
├── Communication/    Conversations, Announcements
├── Finance/          Commission (fee config, settlement, withdrawal)
├── Identity/         Auth (OTP, device, session), User (role/permission)
├── Order/            Cart, Wishlist, Addresses, Ordering, Payment, Review, Voucher
├── Seller/           Stores, Stock, Inventory (bahan baku), Customers, Finance
├── Shared/           Codes (code patterns)
└── Support/          Tickets (Help)
```

Catatan penting: **tidak ada UI/route admin terpisah**. Panel `seller` di frontend
adalah panel operasional tunggal; admin memakai panel yang sama (lihat `06`).

## 3. Celah & Status Perbaikan

### 3.1 Kritis — sudah diperbaiki (`DONE`)

| ID | Celah | Dampak | Perbaikan |
|---|---|---|---|
| G-01 | Migrasi `create_catalog_tables` membuat `catalog_groups` + FK `catalog_group_id` yang tidak ada di desain final (single-store, kategori hierarkis) | Seluruh test gagal (SQLite), skema tidak konsisten | Tabel & kolom dihapus dari migrasi; migrasi drop baru dengan guard `hasTable`/`hasColumn` dan early-return SQLite |
| G-02 | `financial_transactions` dipakai model/request/service/resource tetapi **kolom `category` tidak ada di skema** | HTTP 500 saat membuat/menampilkan transaksi keuangan | Migrasi `2026_11_13_000300_add_category_to_financial_transactions.php` |
| G-03 | Login sukses **tidak** mencabut sesi lama → banyak sesi aktif | Akun bisa dipakai dari banyak perangkat tanpa kendali | `IssueApiTokenUseCase::revokeExistingSessions` (hapus semua token Sanctum + revoke device dalam transaksi) dipanggil `true` saat login password & Firebase |
| G-04 | Kegagalan kirim email OTP meng-invalidasi challenge dengan ID kosong (`invalidateByChallengeId('')`) → challenge valid ikut rusak/tak bisa dipakai | User tidak bisa verifikasi walau OTP valid | Invalidate memakai **challenge ID asli** |
| G-05 | Registrasi seller mandiri (`/auth/register-seller`, `registerStore`) menyalahi desain single-store | Duplikasi toko, permukaan serangan, UI onboarding mati | Route + use case + DTO + metode repo dihapus; test diperbarui |
| G-06 | `CONCAT_WS` (MySQL-only) di `EloquentCustomerRepository` → error di SQLite/test | Query pelanggan gagal di test & DB non-MySQL | Ekspresi alamat portabel (`addressTextExpression`) |
| G-07 | Email OTP dikirim sinkron padahal antrean produksi `database` | Login lambat / timeout saat SMTP lambat | `EmailVerificationMail implements ShouldQueue` (test memakai `Mail::queued`) |

### 3.2 Tinggi — desain perlu diperbaiki (`PARTIAL`/`TODO`)

| ID | Celah | Dampak | Rencana |
|---|---|---|---|
| G-10 | **Logika tipe order**: preorder hanya terpicu bila `product_variants.stock = 0`, mengabaikan `stock_preorder` (kapasitas preorder) | Preorder tidak bisa dijual saat stok fisik tersedia sebagian; kapasitas preorder tak terpakai | Lihat [`01-buyer.md`](./01-buyer.md) §Checkout: gunakan `stock_preorder`, tolak bila kapasitas habis |
| G-11 | **Booking tanpa cek kapasitas slot**: `scheduledAt` hanya wajib diisi, tidak ada validasi kuota/jadwal (`schedules.capacity` tak dipakai) | Over-booking jadwal kirim/pickup | Tambah validasi kapasitas + kunci jadwal |
| G-12 | **Booking + stok kurang** diam-diam dikonversi menjadi `preorder` (cek `$needsPreorder` mendahului cek `booking`) | Buyer memesan booking tetapi menerima preorder tanpa persetujuan | Prioritaskan aturan booking; tolak konflik tipe eksplisit |
| G-13 | `preorder_release_at` **nullable** meski tipe = preorder | Tanggal rilis tak jelas di UI/notifikasi | Wajibkan bila tipe preorder (validasi request + domain) |
| G-14 | `SwitchRoleUseCase` menerbitkan token baru **tanpa** mencabut token lama | Sesi ganda saat ganti role | Cabut token lama (kebijakan sesi tunggal) |
| G-15 | Endpoint **import/export spreadsheet** (`/api/v1/catalog/spreadsheets/*`) dipanggil frontend tetapi **tidak ada di backend** | Tombol import/export gagal (404) | Implementasi penuh — lihat [`05-import-update-berbasis-kode.md`](./05-import-update-berbasis-kode.md) |
| G-16 | Endpoint **bahan baku** (`seller/inventory/*`) ada di `routes.php` tetapi **tidak diregistrasi** di `Seller/routes.php` | Fitur bahan baku/HPP tak dapat diakses | Registrasi + lengkapi CRUD (lihat [`02-admin.md`](./02-admin.md)) |
| G-17 | Tabel `schedules` (dengan kanban) ada, tetapi **tidak ada domain/route/UI** | Fitur jadwal operasional mati | Bangun domain Schedule + UI |
| G-18 | **Chart.js** belum dipakai; chart memakai **Recharts** | Tidak sesuai permintaan | Migrasi ke Chart.js + filter tanggal/bulan/tahun — lihat [`03-chart-filter.md`](./03-chart-filter.md) |
| G-19 | Kontrak filter dashboard keuangan hanya `period=daily\|weekly\|monthly\|yearly` + `date_from/date_to`; tidak ada kontrak eksplisit **bulan/tahun** untuk semua halaman chart | Filter tidak seragam antar halaman | Standarkan kontrak `date_from`/`date_to` + `granularity` — lihat `03` |

### 3.3 Menengah — kebersihan & konsistensi (`DONE`/`TODO`)

| ID | Celah | Status |
|---|---|---|
| G-20 | Role ganda `admin` + `seller` untuk satu operator | `DONE` — digabung ke `admin`, `seller` jadi alias (lihat [`06`](./06-penghapusan-fitur-dan-merge.md)) |
| G-21 | Seeder membuat user `seller`; role `seller` di-nonaktifkan | `DONE` — seeder memakai `admin`; migrasi memindahkan user seller → admin |
| G-22 | Fitur `banners` (tabel sudah di-drop) & `showcases` masih direferensikan frontend | `DONE` — halaman/route/service banner & showcase dihapus |
| G-23 | Onboarding seller mandiri + banner seller | `DONE` — dihapus, diganti `SellerStoreGuard` (cek toko tersedia & tidak suspended) |
| G-24 | `CatalogGroup` masih ada di file `database/upgrade-migrations` | `TODO` — dokumen migrasi historis, dibiarkan sebagai arsip |

## 4. Prioritas Lanjutan (Backlog)

Urut prioritas yang direkomendasikan:

1. **G-16** Registrasi + lengkapi endpoint bahan baku (bahan baku/HPP) — prasyarat import bahan baku.
2. **G-15** Import/export berbasis kode (4 modul) — inti permintaan.
3. **G-10..G-13** Perbaikan logika order (preorder/booking).
4. **G-18/G-19** Migrasi Chart.js + filter seragam.
5. **G-17** Domain Schedule + kapasitas booking (menopang G-11).
6. **G-14** Cabut token saat switch role.

## 5. Referensi Kode Kunci

| Area | Path |
|---|---|
| Force logout | `app/Domains/Identity/Auth/Application/UseCases/IssueApiTokenUseCase.php` |
| Login + OTP | `app/Domains/Identity/Auth/Application/UseCases/LoginUserUseCase.php` |
| Middleware role | `app/Domains/Identity/User/Infrastructure/Middleware/EnsureActiveRole.php` |
| Merge role | `database/migrations/2026_11_13_000200_merge_seller_role_into_admin.php` |
| Kategori (drop group) | `database/migrations/2026_11_13_000100_drop_catalog_groups_table.php` |
| Finance category | `database/migrations/2026_11_13_000300_add_category_to_financial_transactions.php` |
| Logika order | `app/Domains/Order/Ordering/Application/UseCases/CreateOrderUseCase.php` |
| Stok | `app/Domains/Seller/Stock/Application/Services/StockMovementService.php` |
| Frontend routes | `resources/react/src/App.jsx` |
