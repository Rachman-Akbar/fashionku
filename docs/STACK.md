# Fashionku — Tech Stack

Ringkasan seluruh framework, library, dan tooling yang dipakai project **fashionku**.
Semua versi di bawah diverifikasi dari `composer.json`, `composer.lock`, `package.json`,
`vite.config.js`, dan `.env` pada saat dokumen ini dibuat.

- Nama project: `fashionku/fashionku` — *Fashion marketplace fullstack (Laravel + React, monolith)*
- Environment lokal: **Laragon** (Windows), PHP CLI + Node CLI
- Terakhir diverifikasi: Laravel 13.40.0 · PHP 8.3.16 · Composer 2.8.6 · Node 25.2.1 · npm 11.6.2

---

## 1. Ringkasan Cepat

| Lapisan | Teknologi utama |
|---------|-----------------|
| Backend runtime | PHP 8.3 |
| Backend framework | Laravel 13 (monolith, arsitektur Domain-Driven Design) |
| Auth API | Laravel Sanctum 4 (token) + Firebase (OTP/identitas eksternal) |
| Database | MySQL (MariaDB/MySQL via Laragon) |
| Cache / Queue / Session | Driver `database` |
| Realtime | Laravel Reverb 1 (WebSocket, port 8080) |
| Frontend | React 18 (JSX, bukan TypeScript) |
| Build tool | Vite 7 + laravel-vite-plugin 2.1 |
| Styling | Tailwind CSS 4 |
| State/data | TanStack React Query 5 + Axios |
| Routing (SPA) | React Router 7 |
| Payment gateway | Midtrans Snap (`midtrans/midtrans-php`) |
| Test | PHPUnit 12 (backend) · Vitest 4 + Testing Library (frontend) |

---

## 2. Backend (PHP / Laravel)

### 2.1 Requirement & framework

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `php` | ^8.3 (terpasang 8.3.16, ZTS) | Runtime |
| `laravel/framework` | ^13.0 (terpasang **13.40.0**) | Framework utama |
| `laravel/tinker` | ^3.0 | REPL / debug di console |

### 2.2 Paket produksi (`require`)

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `laravel/sanctum` | ^4.3 | Token auth untuk API `/api/v1` |
| `laravel/reverb` | ^1.11 | WebSocket server (chat, notifikasi realtime) |
| `spatie/laravel-permission` | ^7.3 | Role & permission granular (`admin`, `buyer`, permission detail) |
| `kreait/firebase-php` | ^8.2 | Firebase Admin SDK (verifikasi ID token, FCM) |
| `kreait/laravel-firebase` | ^7.1 | Integrasi Firebase ke container Laravel |
| `midtrans/midtrans-php` | ^2.6 | Pembayaran via Midtrans Snap (token & callback) |
| `maatwebsite/excel` | ^4.0 | Import/export Excel |
| `phpoffice/phpspreadsheet` | ^5.9 | Engine spreadsheet (dipakai Maatwebsite / ekspor manual) |
| `staudenmeir/laravel-adjacency-list` | ^1.26 | Query kategori hierarkis (3 level) |

### 2.3 Paket development (`require-dev`)

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `phpunit/phpunit` | ^12.5.12 | Test runner |
| `nunomaduro/collision` | ^8.6 | Error reporting CLI yang rapi |
| `laravel/pint` | ^1.27 | Code style (PSR-12) — `composer format` |
| `laravel/pail` | ^1.2.5 | Tail log realtime |
| `barryvdh/laravel-debugbar` | * | Profiler (aktif saat `APP_DEBUG=true`) |
| `fakerphp/faker` | ^1.23 | Data palsu untuk factory/seeder |
| `mockery/mockery` | ^1.6 | Mocking di test |

### 2.4 Struktur backend (Domain-Driven Design)

Bukan struktur MVC default. Controller/model hidup di dalam domain:

```
app/
├─ Domains/
│  ├─ Admin/            Notification
│  ├─ Catalog/          Category, Media, Product (Application/Costing/Domain/Infrastructure/Presentation), Promotion, Spreadsheet
│  ├─ Communication/    Chat (realtime via Reverb)
│  ├─ Finance/
│  ├─ Identity/         Auth (OTP, Firebase), User
│  ├─ Order/            Addresses, Cart, Ordering, Payment, Review, Voucher
│  ├─ Seller/           Customers, Finance, Inventory, Schedule, Settings, Stock
│  ├─ Shared/           Codes, Excel, Infrastructure, Moderation, Presentation, Settings
│  ├─ Support/          Ticket
│  ├─ DomainServiceProvider.php
│  └─ routes.php        ← agregator route semua domain
├─ Http/                Controller base, middleware
├─ Infrastructure/
└─ Providers/
```

Setiap sub-domain besar mengikuti pola **Application → Domain → Infrastructure → Presentation**
(contoh: `app/Domains/Order/Ordering/*`).

### 2.5 Routing API

- Entry point: `routes/api.php` → hanya me-*require* `app/Domains/routes.php`
- Semua route domain dibungkus prefix `/api/v1`
- Health check: `GET /api/` → `{"message":"UKOMP API is running.","version_prefix":"/api/v1"}`
- Channel broadcast: `routes/channels.php` · Web: `routes/web.php` (Blade shell untuk SPA) · Console: `routes/console.php`

---

## 3. Frontend (React)

### 3.1 Runtime & build

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `react` / `react-dom` | ^18.3.1 | UI library (**JSX murni, tanpa TypeScript**) |
| `vite` | ^7.0.4 | Dev server + bundler |
| `laravel-vite-plugin` | 2.1.0 | Integrasi manifest Vite ↔ Blade |
| `@vitejs/plugin-react` | ^4.6.0 | Fast Refresh JSX |
| `@tailwindcss/vite` | ^4.1.11 | Plugin Tailwind v4 (tanpa `tailwind.config.js` lama) |
| `tailwindcss` | ^4.1.11 | Utility-first CSS |
| `axios` | ^1.10.0 | HTTP client ke `/api/v1` |

### 3.2 Library aplikasi

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `react-router-dom` | ^7.18.4 | Routing SPA |
| `@tanstack/react-query` | ^5.101.2 | Server-state, cache, mutation |
| `@radix-ui/react-slot`, `@radix-ui/react-separator` | ^1.2 / ^1.1 | Primitive UI headless (dasar komponen shadcn-style) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | ^0.7 / ^2.1 / ^3.3 | Variant komponen + merge class |
| `lucide-react` | ^0.525.0 | Icon set |
| `sweetalert2` | ^11.26.25 | Dialog/konfirmasi/alert |
| `chart.js` + `react-chartjs-2` + `chartjs-adapter-date-fns` | ^4.6 / ^5.3 / ^3.0 | Grafik dashboard & laporan |
| `date-fns` | ^4.4.0 | Manipulasi tanggal |
| `leaflet` | ^1.9.4 | Peta (alamat, ongkir berbasis jarak) |
| `laravel-echo` + `pusher-js` | ^2.4 / ^8.6 | Klien WebSocket ke Reverb |
| `firebase` | ^11.10.0 | Auth client (login Firebase/OTP) |
| `html2canvas` | ^1.4.1 | Screenshot/ekspor elemen jadi gambar (invoice/laporan) |

### 3.3 Tooling frontend

| Paket | Versi | Fungsi |
|-------|-------|--------|
| `vitest` | ^4.1.11 | Test runner (`npm test`) |
| `jsdom` | ^29.1.1 | DOM environment untuk Vitest |
| `@testing-library/react`, `.../user-event`, `.../jest-dom` | ^16.3 / ^14.6 / ^7.0 | Test komponen |
| `eslint` + `@eslint/js` + `eslint-plugin-react` + `react-hooks` + `react-refresh` | ^9.39 / dst | Lint (`npm run lint`) |
| `@babel/core`, `@babel/preset-react`, `@babel/eslint-parser` | ^8.0 | Parser JSX untuk ESLint |

> Catatan: `free-pi-cli` saat ini terdaftar di `dependencies` `package.json`. Itu CLI tooling,
> bukan kebutuhan runtime aplikasi — sebaiknya dipindah ke `devDependencies` atau dicopot
> dari project agar tidak menambah bundle/dependency graph.

### 3.4 Struktur frontend

```
resources/
├─ react/src/
│  ├─ main.jsx           ← entry point (input Vite)
│  ├─ App.jsx            ← root router/layout
│  ├─ assets/  core/  shared/  styles/  test/
│  └─ features/
│     ├─ admin/          dashboard & manajemen
│     ├─ advanced/       fitur lanjutan
│     ├─ auth/           login, registrasi, OTP
│     ├─ catalog/        produk, kategori, varian
│     ├─ communication/  chat, notifikasi
│     ├─ order/          cart, checkout, pesanan, pembayaran
│     ├─ profile/        akun & alamat
│     └─ seller/         panel penjual (stok, keuangan, jadwal)
├─ views/               Blade shell (mount SPA)
├─ css/  js/
```

Alias import: `@` → `resources/react/src`.

---

## 4. Konfigurasi environment (`.env`)

Nilai yang dipakai saat ini (tanpa kredensial):

| Key | Nilai | Keterangan |
|-----|-------|-----------|
| `APP_ENV` | `local` | |
| `DB_CONNECTION` | `mysql` | MySQL Laragon |
| `SESSION_DRIVER` | `database` | Tabel `sessions` |
| `CACHE_STORE` | `database` | Tabel `cache` |
| `QUEUE_CONNECTION` | `database` | Tabel `jobs` |
| `BROADCAST_CONNECTION` | `reverb` | WebSocket |
| `REVERB_SCHEME` | `http` | Dev lokal tanpa TLS |
| `FILESYSTEM_DISK` | `public` | Upload gambar produk → `storage/app/public` |
| `MAIL_MAILER` | `smtp` | OTP email |

Tambahan (dipakai `vite.config.js`): `VITE_DEV_BROWSER_HOST`, `VITE_DEV_BROWSER_PORT`,
`VITE_DEV_BACKEND_TARGET`, `VITE_DEV_REVERB_TARGET`.

---

## 5. Port & alur dev

| Proses | Port | Perintah |
|--------|------|----------|
| Laravel HTTP | 8000 | `php artisan serve` |
| Reverb WebSocket | 8080 | `php artisan reverb:start --debug` |
| Vite dev server | 5173 | `npm run dev` |
| Queue worker | — | `php artisan queue:listen --tries=1 --timeout=0` |

`composer dev` menjalankan keempatnya paralel via `concurrently`.

Proxy Vite (`vite.config.js`):

| Path | Target | Catatan |
|------|--------|---------|
| `/api` | `http://127.0.0.1:8000` | API Laravel |
| `/storage` | `http://127.0.0.1:8000` | File publik |
| `/app` | `http://127.0.0.1:8080` | WebSocket Reverb (`ws: true`) |

Skrip bantu Windows: `start-dev.ps1` / `stop-dev.ps1`.

---

## 6. Perintah penting

```bash
# setup awal
composer setup              # composer install + .env + key + migrate + npm install + build

# development
composer dev                # serve + reverb + queue + vite (sekali jalan)
npm run dev                 # Vite saja
php artisan reverb:start --debug

# build produksi
npm run build               # output ke public/build (manualChunks sudah dipisah per vendor)

# kualitas kode
composer format             # Pint (auto-fix)
composer format:check       # Pint --test
npm run lint                # ESLint
npm run lint:fix

# test
composer test               # config:clear + php artisan test
npm test                    # vitest run
```

---

## 7. Strategi bundling produksi

`vite.config.js` memecah bundle manual per vendor (`chunkSizeWarningLimit: 600`, sourcemap off):

`vendor-react` · `vendor-router` · `vendor-firebase` · `vendor-query` · `vendor-radix` ·
`vendor-http` · `vendor-realtime` · `vendor-leaflet` · `vendor-canvas` · `vendor-charts`

Tujuannya agar halaman yang tidak memakai Firebase/peta/chart tidak ikut mengunduh chunk besar.

---

## 8. Integrasi eksternal

| Layanan | Dipakai untuk | Sisi |
|---------|---------------|------|
| Firebase (Auth/FCM) | Login/OTP, push notification | Backend (Admin SDK) + Frontend (SDK v11) |
| Midtrans Snap | Pembayaran pesanan, callback status | Backend |
| Laravel Reverb (self-hosted) | Chat & notifikasi realtime | Backend + Frontend (Echo/Pusher protocol) |
| SMTP | Email OTP & notifikasi | Backend |

---

## 9. Ringkasan versi runtime

```
PHP            8.3.16 (ZTS)
Composer       2.8.6
Laravel        13.40.0
Node           25.2.1
npm            11.6.2
React          18.3.1
Vite           7.x
Tailwind CSS   4.x
MySQL          via Laragon
```

Untuk skema database lengkap dan detail API per domain, lihat [`ARCHITECTURE.md`](./ARCHITECTURE.md).


