# Fashionku — Fashion Marketplace (Monolith)

Project gabungan antara **fashion-api** (Laravel) dan **fashion-frontend** (React) menjadi satu project monolith fullstack.

---

## Arsitektur

```
fashionku/
├── app/                        ← Laravel app (Domain-Driven Design)
│   └── Domains/
│       ├── Admin/              ← Notifikasi admin
│       ├── Catalog/            ← Produk, kategori, banner, promosi
│       ├── Communication/      ← Chat realtime
│       ├── Finance/            ← Komisi
│       ├── Identity/           ← Auth, user
│       ├── Order/              ← Cart, checkout, pembayaran, review
│       ├── Seller/             ← Toko, stok, inventori, keuangan
│       ├── Shared/             ← Kode bersama (moderasi, kode pola)
│       └── Support/            ← Tiket bantuan
├── resources/
│   ├── react/                  ← Source React SPA
│   │   ├── src/
│   │   │   ├── features/       ← Fitur-fitur per domain (catalog, seller, auth, …)
│   │   │   ├── shared/         ← Komponen, layout, hooks bersama
│   │   │   ├── core/           ← API client, realtime, utilities
│   │   │   ├── App.jsx         ← Root React + React Router
│   │   │   └── main.jsx        ← Entry point Vite
│   │   └── public/             ← Asset statis frontend
│   └── views/
│       └── app.blade.php       ← Shell Blade yang memuat React SPA
├── routes/
│   ├── api.php                 ← Semua endpoint REST API (/api/v1/...)
│   └── web.php                 ← Catch-all → app.blade.php (React SPA)
├── database/                   ← Migrations, seeders, SQL dump
├── vite.config.js              ← Build config (laravel-vite-plugin + react)
├── package.json                ← Dependency npm (React + tooling)
└── composer.json               ← Dependency PHP (Laravel + paket)
```

---

## Fitur

### Buyer
- Katalog produk, kategori, catalog group, promosi, toko
- Order: produk umum, booking, pre-order, produk digital
- Keranjang belanja & wishlist
- Riwayat order & review produk
- Chat dengan seller
- Bantuan (Help) ke admin

### Seller
- Registrasi toko & onboarding
- CRUD: banner, produk, showcase, voucher, promosi
- Operasional: bahan baku, HPP, transaksi, stok, jadwal
- Import / Export laporan & master data
- Manajemen review, order, stok, transaksi
- Chat dengan buyer
- Dekorasi toko

### Admin
**Marketplace:**
- CRUD kategori, catalog group, promosi, voucher, daily mission, user
- Banned & approved, kelola pulsa

**Monitoring:**
- Diagram perbandingan performa toko

---

## Setup & Menjalankan

### Prasyarat
- PHP 8.3+
- Composer
- Node.js 20+
- MySQL / MariaDB
- (Opsional) Laravel Reverb untuk realtime chat

### 1. Install dependency

```bash
composer install
npm install
```

### 2. Setup environment

```bash
# Salin .env (sudah tersedia) lalu generate key
php artisan key:generate
```

Edit `.env`:
```
DB_DATABASE=fashionku
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Setup database

```bash
# Jalankan migrasi
php artisan migrate

# Seed data awal (opsional)
php artisan db:seed

# Atau import SQL dump langsung
# mysql -u root fashionku < database/marketplaceku.sql
```

### 4. Buat symlink storage

```bash
php artisan storage:link
```

### 5. Jalankan development server

Gunakan dua terminal:

**Terminal 1 — Laravel:**
```bash
php artisan serve
```

**Terminal 2 — Vite (React):**
```bash
npm run dev
```

Buka browser: **http://127.0.0.1:5173**

> React berjalan di port 5173, API di-proxy ke Laravel port 8000 secara otomatis oleh Vite.

### 6. Build untuk production

```bash
npm run build
php artisan optimize
```

Setelah build, semua aset dikompilasi ke `public/build/`. Laravel melayani langsung dari `public/`.

---

## Teknologi

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 13, PHP 8.3 |
| Frontend | React 18, Vite 7, TailwindCSS 4 |
| Auth | Laravel Sanctum + Firebase (optional) |
| Realtime | Laravel Reverb + Echo + Pusher.js |
| Pembayaran | Midtrans |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Database | MySQL |
| Cache | Database (dapat diganti Redis) |

---

## Struktur Route API

Semua API endpoint berada di `/api/v1/`:

| Domain | Prefix | Keterangan |
|--------|--------|------------|
| Auth | `/api/v1/auth/...` | Login, register, Firebase |
| Catalog | `/api/v1/products/...` | Produk, kategori, banner |
| Order | `/api/v1/orders/...` | Cart, checkout, pembayaran |
| Seller | `/api/v1/seller/...` | Dashboard, stok, toko |
| Support | `/api/v1/tickets/...` | Tiket bantuan |
| Communication | `/api/v1/chat/...` | Chat realtime |
| Finance | `/api/v1/commission/...` | Komisi marketplace |

---

## Catatan Pengembangan

- Frontend React berada di `resources/react/src/` dan menggunakan alias `@` untuk import.
- Blade template `resources/views/app.blade.php` hanya bertugas memuat bundle React.
- Semua navigasi halaman ditangani React Router (client-side routing).
- CORS dan Sanctum sudah dikonfigurasi untuk mendukung mode SPA cookie-based auth.
# fashionku
