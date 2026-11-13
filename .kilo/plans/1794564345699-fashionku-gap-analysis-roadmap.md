# Fashionku — Analisis Celah, Specs Fitur, OTP Security, Import-by-Code & Roadmap

Status: final (siap implementasi)
Basis: `docs/ringkasan fitur.txt` + audit kode aktual (Laravel 12 DDD `app/Domains/*`, React 18 + Recharts, `phpoffice/phpspreadsheet`).

---

## 0. Temuan Audit (fakta dari kode)

### 0.1 Fitur yang HALAMAN-nya ada tapi CRUD backend-nya TIDAK ADA
| Modul | Frontend memanggil | Backend | Status |
|---|---|---|---|
| Banner | `GET/POST/PUT/DELETE /api/v1/catalog/banners`, `/catalog/banners/manage` | tidak ada controller/route | **404 — tombol apa pun gagal** |
| Showcase | — | tidak ada model/controller | **belum ada** |
| Daily Mission | hanya teks statis `checkoutVoucher.js:113` | tidak ada tabel/kode | **belum ada** |
| Semua import/export | `/api/v1/catalog/spreadsheets/{module}/{template,export,import/preview,import,bulk-delete}` | tidak ada controller/route (grep `spreadsheet` di `app/` = 0) | **404 — 12 modul UI mati** |
| Dashboard Admin (chart) | `app/Domains/Admin` hanya `Notification`; `/admin/*` route React tidak ada di `App.jsx` | — | **belum ada** |
| CRUD Category / CatalogGroup / Promotion oleh **admin** | route hanya `active.role:seller` / `active.role:admin` (promotion) | — | **admin tidak bisa CRUD category & catalog-group** |

### 0.2 Role: `admin` tidak pernah di-seed
`database/seeders/RolePermissionSeeder.php:48-66` hanya membuat `seller` dan `buyer`, lalu men-**disable semua role lain** (termasuk `admin`). Padahal 30+ route memakai `active.role:admin` (product, voucher, promotion, user, role, permission, finance/commission, settlement, withdrawal). Akibatnya seluruh jalur admin mustahil dipakai → inilah akar "seller & admin jadi 1 kesatuan".

### 0.3 Chart: diminta Chart.js, yang terpasang Recharts
`package.json:32` → `recharts ^3.10.1`; `chart.js`/`react-chartjs-2` **tidak ada**. `chartKit.jsx` (741 baris) + `ChartFrame.jsx` sudah matang dan dipakai di 4 tempat. Filter tanggal/bulan/tahun **hanya ada di Finance** (`FinanceChartPanel` → hanya `period`, tanpa tanggal eksplisit); Stock chart tidak punya filter waktu; halaman Laporan Penjualan & Produk belum ada.

### 0.4 Auth/OTP — sudah ada vs kurang
Sudah ada (solid): OTP 6 digit, `code_hash` (tidak plaintext), TTL 300s (register 600s), `MAX_ATTEMPTS=5`, rate limit issue 3/10 menit per (purpose,email,ip), `security_events` ter-log, device registry `user_devices` + `sanctum_token_id`, **OTP-verified account deletion sudah lengkap** (`AccountDeletionUseCase` + 3 endpoint).

Kurang:
1. **Force logout on new device: belum otomatis.** `IssueApiTokenUseCase:22` punya parameter `$revokeExistingTokens` tapi **semua call site memakai default `false`**. Hanya logout manual yang ada.
2. `RESEND_COOLDOWN_SECONDS = 60` dideklarasikan tapi **tidak pernah ditegakkan** (`OtpSecurityEngine::resend()` men-skip-nya).
3. **Tidak ada rate limit pada `verify()`** → brute force 6 digit dibatasi hanya 5x per baris OTP.
4. `EmailVerificationEngine` (dipakai reset password & change password) adalah engine **terpisah berbasis cache**: tanpa tabel, tanpa attempt limit, tanpa rate limit, tanpa purpose.
5. Fingerprint device hanya regex User-Agent; `os_version` selalu `'Unknown'`.
6. `AuthController::deleteAccount` memanggil `tokens()->delete()` **dua kali** (redundan, tidak berbahaya).

### 0.5 Order / Booking / Pre-Order — celah paling berbahaya
1. **Booking memotong ketersediaan 2x.** `StockMovementService::resolveReservationDimensions():581` mengembalikan `['reserved','booked']` untuk booking, dan `reserveCheckout():124-125` menambah **kedua** kolom. Karena `available = stock − reserved − booked` (`:578`), booking N unit mengurangi `2N` dari stok jual.
2. **Pre-order tanpa kuota → pre-order tak terbatas.** `reserveCheckout` menulis hanya `stock_preorder`, dan `stock_preorder` **tidak** masuk rumus `available`. Selama `stock === 0` dan `allows_preorder`, setiap order berikutnya lolos; satu-satunya batas `max_order_qty` (default 999999).
3. **`stock_preorder` bocor saat cancel.** Cabang committed-preorder di `releaseOrderItems:488-501` hanya menulis ledger, tidak mengurangi `stock_preorder` (hanya `releasePreorderCommit:437` saat `completed`).
4. **Order manual mengunci di luar transaksi.** `CreateManualOrderUseCase:89-93` `lockForUpdate` sebelum `DB::transaction` di `:185` → lock tidak berefek; dua order manual paralel bisa oversell.
5. **Pemanggilan HTTP Midtrans di dalam transaksi** (`CreateOrderUseCase:305-313`) sambil memegang row lock `product_variants` → lock lama; timeout Midtrans me-rollback order valid.
6. **Webhook Midtrans tidak idempoten & tidak mengunci order.** `HandleMidtransWebhookUseCase` membaca order tanpa `lockForUpdate` (`:46`), dan selalu menimpa status. Replay `settlement` setelah `refund` mengembalikan order ke `paid/processing`; `expire` terlambat bisa membatalkan order yang sudah dibayar + mengembalikan stok.
7. `payments.order_number` **tanpa unique index**; `EloquentPaymentRepository::save` memakai `updateOrCreate` (SELECT→INSERT/UPDATE) → baris payment ganda pada webhook konkuren.
8. `payment_method` ditimpa `payment_type` Midtrans (`:68`) → guard `paymentMethod === 'midtrans'` (`UpdateOrderStatusUseCase:48`) berhenti berlaku setelah webhook.
9. **COD & transfer_manual tidak pernah ditandai `paid`.** `AutoOrderIncomeService` tetap mencatat income seller untuk order yang belum dibayar.
10. **Voucher: tidak ada `usage_per_user`, tidak ada cek kepemilikan, `used_count` naik saat order dibuat (bukan saat bayar) dan tidak pernah turun** → satu user bisa pakai kode yang sama tanpa batas; order belum bayar membakar kuota voucher.
11. **Cart: read-modify-write seluruh agregat.** `EloquentCartRepository::save` menghapus semua cart item yang tidak ada di memori (`:63-65`) tanpa lock → dua request paralel saling menghapus item. `createNewCart` juga bisa duplicate-key.
12. Cart & shipping quote memakai `stock` mentah, bukan `available` → checkout sering gagal di akhir.
13. **Tidak ada job/scheduler pelepas reservasi** (`routes/console.php` hanya `inspire`) → `stock_reserved` dari checkout yang ditinggalkan tidak pernah kembali.
14. `orders.preorder_release_at` & `orders.scheduled_at` disimpan tapi **tidak pernah dibaca** (tidak ada reminder/auto-release). Booking: tidak ada DP/deposit, tidak ada slot kapasitas.
15. `CreateOrderRequest` menolak `ambil_sendiri`/pickup dan membatasi `payment_method` ke `in:midtrans,transfer_manual,cod`, padahal use case mendukung pickup + `tunai_toko` → alur pickup tidak terjangkau via HTTP.
16. Dead code: `ProcessPaymentUseCase` + `ProcessPaymentRequest` (tidak pernah di-route, memakai raw `insert` yang akan menduplikasi payment).

### 0.5.1 Status duplikasi kode yang harus dihindari
Jangan membuat use case/service baru untuk: OTP, device registry, account deletion, Midtrans signature, voucher engine, code pattern (`CodePatternService::unique`), stock movement ledger. Semuanya sudah ada — **perbaiki dan sambungkan**, jangan tulis ulang.

---

## 1. Keputusan Arsitektur (sudah diputuskan, jangan diamputasi ulang)

- **D1. Seller dan Admin adalah satu kesatuan.** Folder `app/Domains/Seller` dan `app/Domains/Admin` dipisah hanya untuk menghindari pencampuran kode; secara perilaku, user dengan role aktif `admin` mendapat seluruh hak `seller` (dan sebaliknya untuk toko sendiri). Tidak ada duplikasi logika. Yang berbeda hanya *scope data*: `admin` = lintas toko, `seller` = toko sendiri.
- **D2. Role `admin` di-seed ulang** (lihat §4.1), dan setiap route `active.role:seller` ditambah `admin` — atau lebih baik: satu middleware `active.role:seller,admin` + policy scope di controller. Pola yang sudah dipakai benar: `role:seller,admin` pada `Stock`/`Finance`/`Inventory`.
- **D3. Chart.js dipasang dan `chartKit` di-port ke Chart.js**, bukan dua library berdampingan. Recharts dihapus setelah porting selesai (kurangi bundle, satu sumber kebenaran).
- **D4. Import/Export memakai `phpoffice/phpspreadsheet`** (sudah ada di `composer.json`) — jangan tambah `maatwebsite/excel`.
- **D5. Import update beracuan KODE, bukan nama, bukan ID.** Kode: `product_variants.sku` (produk) dan `raw_materials.code` (bahan baku). Keduanya sudah unik per toko di DB.
- **D6. `available` dirumuskan satu tempat** (satu helper domain), dipakai cart, shipping quote, checkout, manual order, UI.
- **D7. Uang & stok selalu dalam satu transaksi**, dengan `lockForUpdate` di dalam transaksi dan lock diurutkan by id untuk cegah deadlock. Panggilan HTTP eksternal (Midtrans) **keluar** dari transaksi.
- **D8. Tidak menulis modul baru yang duplikatif**; lengkapi yang setengah jadi lebih dulu (§0.1).

---

## 2. Analisis Celah & Solusi (per area)

### 2.1 Pre-Order
Masalah: kuota tak terbatas, `stock_preorder` tidak membatasi apa pun, `preorder_release_at` mati.
Solusi:
- Tambah kolom `products.preorder_limit` (0 = tanpa batas) dan `products.preorder_lead_days` (opsional).
- `available_for_preorder = max(0, preorder_limit − stock_preorder)`; tolak jika `0 < limit <= stock_preorder`.
- `stock_preorder` **masuk** perhitungan ketersediaan pra-order (bukan `available` reguler).
- Saat `preorder_release_at` tiba: command terjadwal `preorder:release-due` memindahkan item ke `processing` dan mengosongkan `stock_preorder` (idempoten via `stock_movements.movement_key`).
- Cancel order preorder yang sudah dibayar: kurangi `stock_preorder` dan tulis ledger `preorder-cancelled` (menutup celah §0.5.3).

### 2.2 Booking
Masalah: double-deduct ketersediaan; tidak ada DP; `scheduled_at` mati.
Solusi:
- Booking **hanya** menambah `stock_booked` (bukan `reserved`). `available = stock − reserved − booked` tetap benar; booking N unit memotong tepat N.
- Tambah kapasitas slot: `booking_slots` (store_id, start_at, end_at, capacity, booked_count) atau — lebih sederhana untuk fashion — pakai `max_order_qty` per toko + tanggal. Putuskan: gunakan `booking_slots` hanya jika pickup/delivery terjadwal benar-benar dijual; jika tidak, cukup `scheduled_at` + validasi tidak boleh > 90 hari.
- DP opsional: `orders.deposit_amount` + `orders.deposit_status`; jika `deposit_amount > 0`, order masuk `pending` sampai DP dibayar. Midtrans menerima `gross_amount = deposit_amount` pada transaksi pertama.
- `scheduled_at` dibaca: command `order:remind-schedule` (H-1) mengirim notifikasi + chat; `order:auto-cancel-schedule` membatalkan booking yang tidak dibayar.

### 2.3 Manajemen Stok Operasional
Masalah: reservasi tidak kedaluwarsa; order manual tidak aman; `adjust` tidak mencatat dimensi dengan benar; HPP tidak terpengaruh konsisten.
Solusi:
- Command `stock:release-stale-reservations` (jalan tiap 15 menit) — order `pending`/belum bayar lebih tua dari 24 jam → `cancelled` + lepas reserved/booked/preorder.
- `CreateManualOrderUseCase`: pindahkan `lockForUpdate` **ke dalam** `DB::transaction`, kunci `whereIn(id, $variantIds)->orderBy('id')`.
- `StockMovementService::adjust` wajib menerima `stock_dimension` eksplisit (default `available`) dan menolak penyesuaian negatif yang melebihi saldo dimensi tersebut.
- Setiap perubahan stok memicu `ProductCostingService::refreshForProduct` bila resep HPP tersedia (sudah ada untuk bahan baku; samakan untuk produk).

### 2.4 Import Update berbasis Kode
Lihat §5 (skema & validasi lengkap).

### 2.5 Pembayaran & Voucher
- Webhook: kunci order (`lockForUpdate`) di awal, cek state machine (`payments.status` + `orders.payment_status`), tolak transisi ilegal (mis. `expire` setelah `settlement`), balas 200 pada duplikat agar Midtrans tidak retry.
- Verifikasi ulang ke Midtrans (`GET /v2/{order_id}/status`) untuk status selain `capture` — cegah payload palsu bila signature bocor.
- Simpan `payment_method` asli di `orders.payment_method`, pindahkan `payment_type` Midtrans ke `payments.method_detail`.
- `payments.order_number` diberi unique index (migration) + `upsert` atomik.
- COD/transfer_manual: endpoint seller/admin `POST /orders/{id}/confirm-payment` yang menandai `paid` + audit; income seller hanya dicatat setelah `payment_status = paid`.
- Voucher: tambah `usage_per_user` (default 1) dan `user_vouchers` cek kepemilikan; `used_count` dipindah ke saat `paid` (dan dikembalikan saat cancel/expire).

### 2.6 Cart
- Ubah `EloquentCartRepository::save` menjadi operasi per-item (upsert item yang berubah saja), hapus "delete all not in memory".
- Bungkus mutasi cart dalam transaksi + `lockForUpdate` pada `carts`.
- `AddCartItemRequest`: tambah `exists:product_variants,id` dan `max:999`.
- Cart & shipping quote memakai `available` (helper domain D6).

---

## 3. Rancangan OTP (sudah ada sebagian — lengkapi)

### 3.1 Force Logout on New Device Login
Aturan: satu sesi aktif per akun; login baru di device baru mencabut sesi lama. Berlaku untuk `password-login`, `firebase-login`, dan `switch-role`.
Langkah:
1. `POST /auth/password-login` → validasi email/password → `OtpSecurityEngine::issue(purpose: login)`.
2. `POST /auth/password-login/verify` → verifikasi OTP (attempt & cooldown ditegakkan).
3. Tentukan fingerprint device: `device_id` dari client (uuid tersimpan di localStorage) + hash UA; simpan di `user_devices.metadata.device_fingerprint`.
4. Cek `user_devices` untuk `device_fingerprint` yang sama dengan status `active`:
   - **Dikenal** → terbitkan token baru, perbarui `last_active_at`.
   - **Baru** → dalam satu transaksi: `personal_access_tokens` milik user di-`delete`, semua `user_devices` di-`markAsRevoked('new_device_login')`, catat `security_events` (`new_device_login`, severity `warning`), lalu terbitkan token + `registerDevice`.
5. `IssueApiTokenUseCase::execute(..., revokeExistingTokens: true)` dipakai oleh jalur login (bukan `switch-role`).
6. Device lama menerima 401 pada request berikutnya (token hilang). Frontend `apiClient` sudah mengarahkan ke login saat 401 — verifikasi perilaku ini.
7. Sediakan pengecualian: `config('auth.single_session.enabled')` (default true) dan allow-list `trusted_devices` agar device yang sudah diverifikasi tidak terus ter-logout bila user login ulang dari device yang sama (fingerprint sama → tidak dianggap baru).

Edge case yang wajib ditangani:
- Dua login paralel dari device berbeda → yang terakhir menang; beri tahu device pertama lewat `security_events` + email "sesi baru terdeteksi".
- Fingerprint hilang (UA berubah setelah update browser) → jangan langsung logout; gunakan `device_id` client sebagai kunci utama, UA sebagai pelengkap.
- Logout-all-devices harus menghapus `user_devices` aktif juga.

### 3.2 OTP-Verified Account Deletion (sudah ada, perkuat)
Alur final:
1. `POST /auth/account/request-deletion-otp` → `OtpPurpose::DELETE_ACCOUNT`, TTL 300s, rate limit 3/jam per user (bukan per IP saja).
2. Email berisi kode; `security_events` mencatat `account_deletion_requested`.
3. `DELETE /auth/account` dengan `{ otp_code }`:
   - `verifyAndConsume` (sudah ada);
   - tolak jika user masih punya `sub_orders` berstatus `processing|shipped` atau saldo Hutang/Piutang aktif (jangan hapus data finansial; set `banned_at` + `is_active=false` dan minta selesaikan transaksi);
   - dalam satu transaksi: revoke tokens, revoke devices, anonimkan (`AccountDeletionUseCase::anonymizeUserData` — sudah ada), soft delete;
   - hapus baris OTP yang belum consumed.
4. Hapus pemanggilan `tokens()->delete()` ganda di `AuthController::deleteAccount`.
5. Rate limit tambahan pada `verify()`: cache key `otp_verify_limit:{email}:{ip}`, 10 percobaan / 15 menit.

---

## 4. Spesifikasi Fitur (setelah perbaikan)

### 4.1 Seller & Admin sebagai satu kesatuan
- Seeder: tambah role `admin` (`is_active = true`) + permission set admin (semua `seller` + `users.manage`, `roles.manage`, `reports.export`, `announcements.manage`, `promotions.manage`, `banners.manage`).
- `EnsureActiveRole`: untuk `role:seller`, `admin` juga lolos (dengan `active-role:admin` di token). `EnsureUserHasPermission`: `admin` selalu true.
- Frontend: `ProtectedRoute roles={["seller"]}` → `["seller","admin"]`; navigasi admin memakai `/admin/*` yang mengarah ke komponen seller yang sama dengan `portal="admin"`.
- Scope data: controller seller memakai `ResolvesSellerStoreContext`; untuk admin, `store_id` diambil dari query param dan divalidasi.

### 4.2 Discovery (buyer)
- List Product, Catalog Group, Category, Voucher: sudah ada. Tambah: filter harga, ukuran, warna, rating; sort; paginasi cursor.
- Validasi: slug unik, category tidak boleh self-parent, max depth 3 (cek `CategoryHierarchyPolicy`).

### 4.3 Order (General / Booking / Pre-Order)
Aturan bisnis:
- `normal`: butuh `available >= qty`.
- `booking`: butuh `available - qty >= 0` (hanya `stock_booked`), wajib `scheduled_at`, opsional DP.
- `preorder`: butuh `allows_preorder` dan `stock_preorder + qty <= preorder_limit` (jika limit > 0).
- Semua: `max_order_qty` per varian; satu order hanya boleh satu toko per sub-order (sudah); voucher satu per order.
Validasi request: `order_type in:normal,preorder,booking`, `address_id` tidak wajib untuk pickup, `payment_method in:midtrans,transfer_manual,cod,tunai_toko`.

### 4.4 Operasional Seller
- CRUD Materials, HPP, Transaksi, Stock, Schedule — sudah ada; lengkapi Schedule dengan `recurrence` yang sudah ada di migration tetapi belum dipakai di UI.
- Retur/pembatalan: `cancel` mengembalikan stok sesuai dimensi; refund dicatat sebagai `payments.status=refunded` (jangan hapus baris payment).

### 4.5 Chart & Filter Waktu (wajib)
Empat halaman, satu komponen filter bersama:
- `DashboardAdmin`, `Finance`, `Stock`, `LaporanPenjualanProduk`.
- Filter: preset (Hari ini / 7 hari / Bulan ini / Tahun ini / Kustom) + `start_date` + `end_date` + granularity (harian/bulanan). Kirim sebagai query param ke endpoint agregasi; chart hanya membaca respons (tidak agregasi di klien).
- Endpoint baru (satu pola):
  - `GET /admin/dashboard/summary?start_date&end_date&granularity`
  - `GET /admin/reports/sales?start_date&end_date&granularity&store_id`
  - `GET /admin/reports/products?start_date&end_date&store_id`
  - `GET /admin/stock/summary?start_date&end_date`
  - `GET /seller/stock/summary?start_date&end_date` (sudah ada `stock-movements` dengan `date_from/date_to`; tambah agregasi).
- Ganti implementasi chart ke Chart.js: `chart.js` + `react-chartjs-2`; `chartKit.jsx` menyediakan `Line`, `Bar`, `Doughnut` dengan API sama seperti sekarang (`SeriesBarList`, `DailyCashflowBars`, `OrderRevenueBars`, `DonutChart`, `StatCard`) sehingga halaman pemakai tidak berubah.
- Hapus Recharts setelah semua pemakaian berpindah (cek `grep recharts`).

---

## 5. Import Update berbasis Kode — skema & validasi

### 5.1 Prinsip
- Kunci update = **kode yang terlihat user**: `sku` (produk/varian) dan `code` (bahan baku).
- Kode bersifat **immutable** setelah dibuat. Jika user ingin mengganti kode, gunakan aksi "rename kode" eksplisit (audit), bukan import.
- `import_mode`: `create` (hanya baris baru), `update` (hanya kode yang sudah ada), `upsert` (default; keduanya).
- Setiap baris menghasilkan satu hasil: `created | updated | skipped | error`. Tidak ada update parsial yang menggantung — transaksi per-batch, laporan per-baris.
- Format file: `.xlsx` dengan 3 sheet: `README` (petunjuk), `DATA` (data), `ERROR` (opsional, diisi backend saat gagal).

### 5.2 Modul & kolom kunci
| Modul | Kunci | Kolom wajib | Kolom opsional | Menolak perubahan |
|---|---|---|---|---|
| Bahan baku (`raw-material`) | `code` | `code`, `name`, `unit` | `minimum_stock`, `is_active` | `stock` (gunakan modul stok), `average_cost` |
| Product (`product`) | `sku` | `sku`, `name`, `category_path` atau `category_id` | `brand`, `price`, `status`, `is_active` | `stock` (gunakan modul stok) |
| Stock (`stock`) | `sku` | `sku`, `delta` | `movement_type`, `unit_cost`, `occurred_at` | `name` (hanya identifikasi) |
| Pengeluaran (`expense`) | `reference_number` | `date`, `amount`, `description` | `counterparty_email`, `category` | — |
| Pemasukan (`income`) | `reference_number` | `date`, `amount`, `description` | `order_number`, `counterparty_email` | — |
| Pengeluaran/Pemasukan lain (hutang/piutang) | `reference_number` | `date`, `amount`, `type` | `paid_amount` (read-only di import) | `paid_amount` (gunakan aksi Bayar) |

### 5.3 Aturan validasi (semua modul)
1. **Header check**: nama kolom harus sama persis (case-insensitive, trim). Header tidak dikenal → tolak seluruh file.
2. **Kode kosong** pada `create` → error; pada `update`/`upsert` → error (tidak boleh menebak dari nama).
3. **Kode tidak ditemukan** pada `update` → error `UNKNOWN_CODE` (jangan auto-create).
4. **Kode duplikat di dalam file** → error pada baris kedua dan seterusnya (`DUPLICATE_IN_FILE`).
5. **Kode duplikat di DB milik toko lain** → error `CODE_TAKEN` (`sku` unik per `store_id`, `code` unik per `store_id`).
6. **Nama produk duplikat di toko yang sama** → error `NAME_TAKEN` (produk punya unique `store_id,name`).
7. **Perubahan nama diperbolehkan** pada `upsert` (nama bukan kunci) — inilah tujuan fitur ini.
8. **Tipe & rentang**: `price >= 0`, `delta` integer ≠ 0, `amount > 0`, `date` valid dan tidak boleh > hari ini untuk kategori tertentu, `unit` harus ada di daftar izin.
9. **Relasi**: `category_path` harus ada (atau `create_missing_relations=1` untuk membuat kategori), `order_number` harus ada jika `counterparty_email` diisi.
10. **Batas ukuran**: maks 5.000 baris/file, maks 5 MB; baris di atas batas → tolak file.
11. **Mode aman**: `create` menolak kode yang sudah ada; `update` menolak kode yang tidak ada; `upsert` melakukan keduanya.
12. **Dry-run**: `POST .../import/preview` mengembalikan `{total_rows, valid_rows, error_rows, duplicates_in_file, missing_relations, blocking_relations, sample_errors[]}` tanpa menulis apa pun.
13. **Hasil**: `POST .../import` mengembalikan header `X-Import-Success-Count`, `X-Import-Error-Count` (sudah dibaca frontend `spreadsheetService.js:128-129`) + file `.xlsx` berisi baris gagal bila ada error. Jika semua sukses → JSON.
14. **Audit**: setiap import menulis `import_batches` (user, modul, mode, total, sukses, gagal, file_hash, waktu) dan setiap perubahan menulis `created_by`/`updated_by` (sudah ada concern `TracksUserChanges`).

### 5.4 Skema validasi (contoh konkret, PHP)
```php
// app/Domains/Shared/Spreadsheet/Import/Validator/ProductImportValidator.php
final class ProductImportValidator
{
    public function rules(): array
    {
        return [
            'sku'           => ['required','string','max:100','regex:/^[A-Za-z0-9._-]+$/'],
            'name'          => ['required','string','max:255'],
            'category_path' => ['nullable','string','max:500'],
            'brand'         => ['nullable','string','max:120'],
            'price'         => ['nullable','numeric','min:0','max:999999999'],
            'status'        => ['nullable','in:draft,published,archived'],
            'is_active'     => ['nullable','boolean'],
        ];
    }

    public function validateRow(array $row, int $storeId, string $mode, array $existingSkus): RowResult
    {
        // 1. cek duplikat dalam file
        if (isset($existingSkus[$row['sku']])) return RowResult::error($row, 'DUPLICATE_IN_FILE', ...);
        // 2. mode
        $exists = in_array($row['sku'], $this->knownSkus, true);
        if ($mode === 'create' && $exists) return RowResult::error($row,'SKU_EXISTS',...);
        if ($mode === 'update' && !$exists) return RowResult::error($row,'UNKNOWN_CODE',...);
        // 3. validasi field
        $validated = Validator::make($row, $this->rules())->validate(); // lempar ValidationException -> error row
        // 4. relasi
        $categoryId = $this->resolveCategory($row['category_path'] ?? null, $storeId, $createMissing);
        // 5. nama unik per toko (kecuali baris ini sendiri saat update)
        if ($this->nameTaken($row['name'], $storeId, $existingId)) return RowResult::error($row,'NAME_TAKEN',...);
        return RowResult::updateOrCreate([...]);
    }
}
```
Pola yang sama dipakai untuk bahan baku (`code`), stok (`sku` + `delta`), dan finance (`reference_number`).

### 5.5 Endpoint (mengganti yang hilang)
```
GET    /api/v1/catalog/spreadsheets/{module}/template
POST   /api/v1/catalog/spreadsheets/{module}/export        { ids?: int[] }
POST   /api/v1/catalog/spreadsheets/{module}/import/preview (multipart: file, import_mode, create_missing_relations)
POST   /api/v1/catalog/spreadsheets/{module}/import         (multipart, response blob atau json)
POST   /api/v1/catalog/spreadsheets/{module}/bulk-delete    { ids: int[] }
```
Middleware: `auth:sanctum`, `active.user`, `verified.email`, `role:seller,admin`, `permission:stock.manage` (stok) / `products.manage` (produk) / `finance.manage` (finance) / `stock.manage` (bahan baku). Modul selalu di-scope ke toko aktif.

---

## 6. Roadmap pengerjaan (urut, setiap langkah harus bisa diuji)

### Fase 1 — Fondasi (tidak ada fitur baru, hanya membuka jalan)
1. Seed role `admin` + permission admin; verifikasi `php artisan db:seed --class=RolePermissionSeeder` idempoten.
2. `EnsureActiveRole`/`EnsureUserHasPermission`: admin setara seller.
3. Tambah `available` helper tunggal di domain `ProductVariant` + pakai di cart, shipping, checkout, manual order.
4. Migration: `products.preorder_limit`, `products.preorder_lead_days`, `orders.deposit_amount`, `orders.deposit_status`, `payments.order_number` unique, `vouchers.usage_per_user`, `import_batches`.
5. Verifikasi: `php artisan migrate`, `php artisan test`.

### Fase 2 — Keamanan OTP & sesi
6. `IssueApiTokenUseCase::execute(revokeExistingTokens: true)` pada jalur login; fingerprint device; `security_events`.
7. Tambahkan rate limit pada `verify()` + tegakkan resend cooldown.
8. Hapus double `tokens()->delete()`; rate limit deletion OTP.
9. Tes: login dua device → device pertama 401; brute force OTP → 429/403; delete account tanpa OTP → gagal.

### Fase 3 — Order, Booking, Pre-Order
10. Booking hanya `stock_booked`; preorder limit; `preorder:release-due`; `stock:release-stale-reservations`.
11. `CreateManualOrderUseCase`: lock di dalam transaksi.
12. Midtrans keluar dari transaksi; webhook idempotent + lock + state machine; `payment_method` tidak ditimpa.
13. Konfirmasi pembayaran manual (COD/transfer) + income hanya saat paid.
14. Voucher: `usage_per_user`, cek kepemilikan, `used_count` saat paid, pengembalian saat cancel.
15. Cart: operasi per item + transaksi + validasi request.
16. Tes: paralel checkout tidak oversell; cancel preorder mengembalikan `stock_preorder`; webhook replay tidak mengubah status.

### Fase 4 — Import/Export + CRUD yang hilang
17. Domain `Shared/Spreadsheet`: `SpreadsheetReader` (PhpSpreadsheet), `Validator`, `RowResult`, `ImportBatch`, `ExportBuilder`.
18. Implementasikan 5 endpoint untuk 12 modul: `product`, `product-costing`, `stock`, `raw-material`, `raw-material-stock`, `cost-impact` (export-only), `income`, `expense`, `receivable`, `payable`, `order` (export-only), `customer`, `review`, `voucher`, `promotion`, `banner`.
19. CRUD Banner (tabel `banners` sudah ada, controller belum) + `GET /catalog/banners/manage`.
20. Category & CatalogGroup: izinkan `admin` (tambah grup route admin).
21. Showcase + Daily Mission: putuskan apakah masuk MVP; jika ya, buat migration + CRUD sederhana mengikuti pola CatalogGroup.
22. Tes: import produk dengan rename → SKU tetap, nama berubah; import update dengan kode tidak dikenal → baris error; import duplikat dalam file → error; mode `create` dengan SKU ada → error.

### Fase 5 — Visualisasi Chart.js
23. `npm i chart.js react-chartjs-2`; port `chartKit.jsx` ke Chart.js (API sama).
24. Endpoint agregasi dengan `start_date`/`end_date`/`granularity` untuk dashboard admin, finance, stock, sales report, product report.
25. Komponen `DateRangeFilter` bersama (preset + kustom) dipakai di 4 halaman.
26. Hapus Recharts + `recharts` dari `package.json` setelah semua halaman terverifikasi.
27. Tes: ganti filter → request baru dengan param benar; grafik kosong saat tidak ada data; timezone konsisten (simpan `date` di DB, kirim ISO).

### Fase 6 — Verifikasi menyeluruh
28. `php artisan test`, `npm run test`, `npm run lint`, `npm run build`.
29. Uji manual per checklist: setiap modul CRUD (create → read → update → delete) untuk peran buyer, seller, admin.
30. Pastikan setiap halaman chart memuat data terfilter (bukan data statis).

---

## 7. Risiko & mitigasi
| Risiko | Mitigasi |
|---|---|
| Role `admin` tiba-tiba aktif → data toko terlihat lintas toko | Admin hanya lewat `/admin/*`; policy scope wajib `store_id` eksplisit; audit log. |
| Force logout membuat user mobile ter-logout tiap update app | Kunci utama `device_id` client, bukan UA. |
| Import besar mengunci tabel | Batch 500 baris, transaksi per batch, `upsert` + index unik. |
| Perubahan `available` memengaruhi order berjalan | Hitung ulang hanya untuk order `pending`; order `processing` tidak diubah. |
| Chart.js menambah bundle | Tree-shake: hanya daftarkan controller yang dipakai (`LineController`, `BarController`, `DoughnutController`). |
| Recharts dihapus terlalu cepat | Hapus setelah grep `recharts` = 0 di `resources/react`. |

## 8. Definition of Done
- Setiap modul di §0.1 punya CRUD backend + route + tes.
- Pre-order, booking, dan general order punya aturan kuota yang konsisten dan teruji.
- Import update hanya bergerak berdasarkan kode; rename aman; duplikat dan kode tak dikenal ditolak per baris.
- Login di device baru mencabut sesi lama; penghapusan akun wajib OTP.
- Empat halaman chart memakai Chart.js dan filter tanggal/bulan/tahun yang benar-benar mengubah data.
- `php artisan test` dan `npm run test` hijau; `npm run build` sukses.