# 06 — Penghapusan Fitur & Penggabungan Admin + Seller

> Dua pekerjaan besar: (1) membuang fitur yang tidak terpakai/menyimpang dari
> desain single-store, dan (2) menjadikan **admin = seller** sebagai satu role.

## 1. Fitur yang Dihapus

| Fitur | Alasan | Bukti/aksi | Status |
|---|---|---|---|
| **Registrasi seller mandiri** (`/auth/register-seller`, `registerStore`) | Single-store: toko dibuat saat instalasi/seeding, bukan oleh user | Route dihapus; `CreateStoreUseCase`, `RegisterSellerUseCase`, `RegisterSellerDTO` dihapus; `registerStore()` dihapus dari interface + Eloquent repo | `DONE` |
| **CatalogGroup** | Kategori final murni hierarkis 3 level; grouping di atas root tidak dipakai | Tabel `catalog_groups` + kolom `catalog_group_id` dihapus dari migrasi; migrasi drop baru; domain `Catalog/CatalogGroup` dihapus; `FashionCatalogSeeder` ditulis ulang | `DONE` |
| **Banner toko (seller)** | Fitur tidak dipakai; tabel `banners` sudah di-drop | `features/seller/banner/**` dihapus; route `/seller/banners` dihapus | `DONE` |
| **Showcase** | Tidak ada kode backend; hanya hook frontend | `useShowcases`/`useSaveShowcase`/`useDeleteShowcase` + key dihapus dari `advancedMarketplaceService.js` | `DONE` |
| **Onboarding seller mandiri** | Tidak relevan single-store | `SellerOnboardingPage.jsx`, `sellerOnboardingService.js`, `SellerOnboardingGuard.jsx` dihapus; diganti `SellerStoreGuard.jsx` | `DONE` |

Catatan: `banners.manage` tetap ada di daftar permission untuk kompatibilitas data lama,
meskipun fitur UI-nya sudah tidak ada.

## 2. Penggabungan Role Admin & Seller

### 2.1 Keputusan

- **Role bisnis kanonik = `admin`** (operator tunggal = pemilik toko/penjual).
- **`buyer`** tetap terpisah.
- **`seller`** dipertahankan sebagai **alias** di lapisan auth/middleware agar token
  dan rute lama tetap bekerja (backward compatible), tetapi **dinonaktifkan** sebagai role.

### 2.2 Kompatibilitas (Shim)

| Lapisan | Perilaku |
|---|---|
| `EnsureActiveRole` | `role=seller` lolos bila user punya role `admin`, baik lewat role maupun ability `active-role:admin` |
| `EnsureUserHasRole` | Sama: `seller` diterima untuk admin |
| `EnsureUserHasPermission` | Saat `activeRole=seller`, admin memakai permission role `admin` |
| `EloquentUserRepository::hasSellerAccess` | Admin dianggap memiliki akses seller bila toko tersedia/aktif |
| `LoginUserUseCase` / `LoginWithFirebaseUseCase` (`resolveRole`) | User admin dapat login sebagai `seller` (token `active-role:seller`) |
| `SwitchRoleUseCase` | `targetRole=seller` diizinkan untuk user admin |

### 2.3 Migrasi & Seeder

- Migrasi `2026_11_13_000200_merge_seller_role_into_admin.php`:
  - pastikan role `admin` ada & aktif,
  - tempelkan role `admin` ke semua user yang masih `seller` (tanpa duplikasi),
  - nonaktifkan role `seller`.
  - `down()` mengaktifkan kembali `seller` (relasi user tidak dikembalikan — admin adalah superset).
- `RolePermissionSeeder`: hanya `admin` + `buyer`; role lain di-`is_active=false`.
  - admin = permission operator toko + `users.manage`, `roles.manage`, `announcements.manage`.
- `FashionDemoSeeder`: memakai role `admin` (bukan `seller`).
- `FashionRealDataSeeder`: **dihapus** — seeder itu seluruhnya bertumpu pada tabel multi-toko
  (`stores`, `store_details`, `store_id`).

### 2.4 Rute & UI

- Rute backend tetap memakai `active.role:seller` (admin lolos) — **tidak** diubah massal,
  sehingga panel `seller` berfungsi untuk admin.
- Frontend: semua rute `/seller/*` memakai `roles={["seller","admin"]}`.
- `SellerStoreGuard` menggantikan onboarding guard: memastikan toko tersedia & tidak
  `suspended` sebelum panel dibuka.

## 3. Dampak & Kompatibilitas

- Token lama ber-ability `active-role:seller` milik user yang kini `admin` tetap valid
  (middleware menerima alias).
- Tidak ada perubahan path API publik.
- Data `user_roles` user seller dipindahkan (aditif) ke admin; tidak ada penghapusan relasi.

## 4. Rollout & Rollback

**Rollout**
1. Jalankan migrasi (`php artisan migrate`).
2. Jalankan `RolePermissionSeeder`.
3. (Opsional) re-seed demo.

**Rollback**
- `migrate:rollback` mengaktifkan kembali role `seller`.
- Karena admin adalah superset, user tidak kehilangan akses saat rollback.

## 5. Celah Tersisa

| ID | Celah | Rencana |
|---|---|---|
| G-14 | `SwitchRoleUseCase` menerbitkan token baru tanpa mencabut token lama | Panggil `IssueApiTokenUseCase` dengan `revokeExistingSessions=true` (sesuai kebijakan sesi tunggal) |
| — | `banners.manage` masih terdaftar meski fitur dihapus | Hapus pada pembersihan permission berikutnya (hati-hati data lama) |
| — | `database/upgrade-migrations` masih menyebut `catalog_group_id` | Arsip historis; biarkan atau tandai deprecated |

## 6. Acceptance Criteria

### AC-M1 — Admin mengakses panel seller
- **Given** user hanya ber-role `admin`, **When** membuka `/seller/products`,
- **Then** diizinkan (frontend & backend).

### AC-M2 — Alias role seller
- **Given** token `active-role:seller` milik admin, **When** memanggil endpoint `active.role:seller`,
- **Then** 200 (bukan 403).

### AC-M3 — Permission admin saat mode seller
- **Given** admin mode seller, **When** endpoint `permission:stock.manage`,
- **Then** diizinkan via permission role admin.

### AC-M4 — Registrasi seller mandiri hilang
- **Given** user login, **When** `POST /api/v1/identity/auth/register-seller`,
- **Then** 404.

### AC-M5 — Kategori tanpa group
- **Given** admin, **When** membuat kategori tanpa `catalog_group_id`, **Then** 201.

### AC-M6 — Seeder konsisten
- **Given** `db:seed`, **Then** user operator memakai role `admin`; role `seller` non-aktif.

## 7. Test Terkait

- `tests/Feature/Seller/StoreCrudTest.php` — route registrasi hilang + admin mengoperasikan panel seller.
- `tests/Feature/Catalog/CategoryCrudTest.php` — kategori tanpa catalog group.
- `tests/Feature/Auth/AuthTest.php` — login 2 langkah.
- Suite penuh: **121 passed / 494 assertions**.
