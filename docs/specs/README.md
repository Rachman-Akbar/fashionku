# Fashionku — Spesifikasi Fitur (docs/specs)

Kumpulan spesifikasi hasil analisis, pengerasan (hardening), dan perancangan
ulang **Fashionku** — marketplace fashion **single-store** berbasis
Laravel (API) + React (SPA).

Spesifikasi ini adalah turunan dari [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt)
dan menjadi acuan tunggal untuk pengembangan berikutnya.

## Daftar Isi

| # | Dokumen | Isi |
|---|---|---|
| 00 | [`00-analisis-celah.md`](./00-analisis-celah.md) | Analisis celah: kondisi saat ini, gap logika/keamanan, status perbaikan, prioritas |
| 01 | [`01-buyer.md`](./01-buyer.md) | Spesifikasi alur & fitur Buyer (discovery, cart/wishlist, checkout, order, review, chat) |
| 02 | [`02-admin.md`](./02-admin.md) | Spesifikasi Admin/operator tunggal (= seller): CRUD, operasional, monitoring, import/export |
| 03 | [`03-chart-filter.md`](./03-chart-filter.md) | Chart.js + filter tanggal/bulan/tahun interaktif (Dashboard, Finance, Stock, Laporan) |
| 04 | [`04-otp-sesi-hapus-akun.md`](./04-otp-sesi-hapus-akun.md) | OTP, kebijakan sesi tunggal, force logout, hapus akun terverifikasi OTP |
| 05 | [`05-import-update-berbasis-kode.md`](./05-import-update-berbasis-kode.md) | Import update berbasis **kode** (bukan nama/ID DB) untuk bahan baku, product, stock, pemasukan/pengeluaran |
| 06 | [`06-penghapusan-fitur-dan-merge.md`](./06-penghapusan-fitur-dan-merge.md) | Penghapusan fitur tak terpakai + penggabungan role admin & seller |

## Cara Membaca

- **Status** ditandai dengan label berikut:
  - `DONE` — sudah diimplementasikan di branch kerja saat ini (belum di-commit).
  - `PARTIAL` — sebagian sudah ada, sebagian menjadi backlog.
  - `TODO` — masih backlog (belum ada kode).
- **Acceptance Criteria** ditulis dalam format Given/When/Then dan menjadi dasar test.
- Semua endpoint mengikuti prefix `/api/v1` dan pembungkus respons
  `{ success, message, data }` (kecuali endpoint `auth` yang mengembalikan token di root).

## Ringkasan Kondisi

- Test suite backend: **121 passed / 494 assertions** (`php artisan test`, SQLite in-memory).
- Frontend: `npm run build` hijau.
- Semua perubahan pada spesifikasi ini berada di working tree dan **belum di-commit**.

## Konvensi

- Bahasa dokumentasi: Bahasa Indonesia.
- Satu topik = satu file `.md` di folder ini.
- Referensi kode memakai path relatif dari root proyek.
