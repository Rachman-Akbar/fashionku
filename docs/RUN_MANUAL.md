# Menjalankan Fashionku (manual, port terpisah)

Aplikasi dibuka lewat **Laravel** (bukan `http://127.0.0.1:5173/`). Port `:5173` hanya server aset/HMR Vite.

## Opsi A — Tanpa HMR (paling sederhana, tidak perlu Vite jalan)
Cukup 1 terminal:
```powershell
cd "c:\laragon\www\New folder\fashionku"
php artisan serve --host=127.0.0.1 --port=8000
```
Buka: **http://127.0.0.1:8000/**

- Memakai aset dari `public/build` (hasil `npm run build`). Build sudah tersedia.
- Setelah ubah kode React/JS/CSS, jalankan (terminal terpisah, kapan pun): `npm run build` lalu refresh.

## Opsi B — Dengan HMR (2 terminal, manual, port tidak bentrok)
**Terminal 1 (Laravel/app, port 8000):**
```powershell
cd "c:\laragon\www\New folder\fashionku"
php artisan serve --host=127.0.0.1 --port=8000
```

**Terminal 2 (Vite assets/HMR, port 5173):**
```powershell
cd "c:\laragon\www\New folder\fashionku"
npm run dev
```

Lalu di `.env` set:
```env
VITE_USE_DEV_SERVER=true
```
dan `php artisan config:clear`/`php artisan view:clear` (atau restart artisan serve) bila perlu, kemudian buka **http://127.0.0.1:8000/** (tetap lewat Laravel).

> `VITE_USE_DEV_SERVER=false` (default) = selalu load `public/build` sehingga `php artisan serve` tetap menampilkan aplikasi meskipun Vite/5173 tidak jalan. Ini mencegah blank page akibat `public/hot` nyangkut.

## Firebase / Google Login (MySQL utama, Firebase untuk Google + UID)
Alur yang dipakai:
1. React (`VITE_FIREBASE_*`) login Google via Firebase Auth → dapat **Firebase ID token**.
2. Frontend kirim token ke backend: `POST /api/v1/identity/auth/firebase-login` (Bearer = Firebase ID token, body: `role`, `device_name`).
3. Backend verifikasi token dengan **Firebase Admin** (`kreait/laravel-firebase`), ambil `uid`/`email`/profil, lalu **sinkron ke MySQL** (`users.firebase_uid`, dll.) via `syncFromFirebase` dan mengembalikan **Sanctum token** aplikasi.

Yang wajib:
- `VITE_FIREBASE_*` + `VITE_FIREBASE_MEASUREMENT_ID` di `.env` (sudah terisi untuk project `fashionku`).
- `FIREBASE_AUTH_ENABLED=true`.
- **`FIREBASE_CREDENTIALS`** = path absolut/relatif ke **service account JSON** (Firebase Console → Project settings → Service accounts → Generate new private key). Simpan file di luar repo publik (mis. `storage/app/firebase-service-account.json`, jangan commit). Contoh:
  ```env
  FIREBASE_CREDENTIALS=storage/app/firebase-service-account.json
  ```
- Setelah ubah `.env`: `php artisan config:clear`.

Tanpa `FIREBASE_CREDENTIALS`, login email/password (MySQL) tetap jalan; Google login akan gagal verifikasi server (503/401 dengan pesan jelas).

## Catatan
- Jangan akses `http://127.0.0.1:5173/` langsung; itu bukan entry aplikasi monolith.
- Alternatif: vhost Laragon yang root ke `fashionku/public`.
- Realtime butuh `php artisan reverb:start` (terminal terpisah) + `BROADCAST_CONNECTION=reverb`.
