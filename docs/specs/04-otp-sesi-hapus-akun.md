# 04 — OTP, Kebijakan Sesi, dan Hapus Akun

> Cakupan: alur OTP, **sesi tunggal + force logout** saat login perangkat baru,
> dan **hapus akun terverifikasi OTP**. Banyak item di sini sudah `DONE`.

## 1. Mesin OTP (`OtpSecurityEngine`)

Parameter (konstanta di `app/Domains/Identity/Auth/Application/Services/OtpSecurityEngine.php`):

| Parameter | Nilai | Catatan |
|---|---|---|
| Panjang kode | 6 digit | `random_int`, disimpan sebagai hash |
| TTL | 300 detik (5 menit) | `DEFAULT_TTL_SECONDS` |
| Maks percobaan | 5 | Setelah itu challenge tidak valid |
| Cooldown resend | 60 detik | Resend mengganti OTP lama |
| Rate limit | 3 permintaan / 600 detik | per `email + purpose (+ ip)` |

### Purpose yang sah

`register`, `login`, `google_login`, `delete_account`, `remove_device`,
`change_email`, `change_password`, `sensitive_action`.

### Sifat keamanan

- Kode disimpan **hash** (`Hash::make`), bukan plaintext.
- Setiap issue/verify tercatat di `security_events` (`otp_issued`, `otp_verified`, `otp_verify_failed`).
- `issue()` meng-invalidasi OTP lama untuk `email+purpose` yang sama (kecuali `challenge_id` cocok).
- `verify()` mengunci baris (`lockForUpdate`), menaikkan `attempts` saat kode salah, dan
  meng-`consume` saat berhasil (`consumed_at` + `attempts = max`).
- OTP **sekali pakai** (reuse ditolak).

## 2. Alur Login 2 Langkah (password & Firebase)

```
POST /api/v1/identity/auth/password-login          -> 202 { challenge_id, ... }  (email OTP)
POST /api/v1/identity/auth/password-login/verify   -> 200 { access_token/api_token, ... }
POST /api/v1/identity/auth/password-login/resend   -> kirim ulang OTP login

POST /api/v1/identity/auth/firebase-login          -> 202 { challenge_id, ... }
POST /api/v1/identity/auth/firebase-login/verify   -> 200 { token }
POST /api/v1/identity/auth/firebase-login/resend   -> kirim ulang
```

Aturan:
- Langkah 1 hanya memvalidasi kredensial/Firebase dan menerbitkan OTP; **belum** memberi sesi.
- Langkah 2 memverifikasi OTP, lalu menerbitkan token dengan ability `active-role:{role}`.
- **Force logout** dijalankan pada langkah 2 (lihat §3).

### Registrasi

```
POST /auth/password-register        (opsional, langsung aktif)
POST /auth/register-with-otp        -> challenge_id (OTP register)
POST /auth/verify-registration-otp  -> akun aktif + token
POST /auth/resend-registration-otp
```

## 3. Kebijakan Sesi Tunggal & Force Logout (`DONE`)

**Kebijakan:** satu akun hanya boleh punya **satu sesi aktif**. Login sukses di
perangkat baru mencabut **semua** token & perangkat lama.

Implementasi di `IssueApiTokenUseCase::execute(..., revokeExistingSessions: true)`:

```
DB::transaction:
  hapus semua PersonalAccessToken milik user
  deviceManagement.logoutAllDevices(user)
  (lalu) terbitkan token baru + register device
```

Dipanggil `true` pada:
- `LoginUserUseCase` (login password langkah 2),
- `LoginWithFirebaseUseCase` (login Firebase langkah 2).

Dijalankan **setelah** OTP terverifikasi, sehingga penyerang tidak bisa memicu
logout massal hanya dengan menebak password.

### Manajemen Perangkat

| Aksi | Endpoint |
|---|---|
| Daftar perangkat | `GET /api/v1/identity/auth/devices` |
| Minta OTP hapus perangkat | `POST /api/v1/identity/auth/devices/{device_id}/request-removal-otp` |
| Hapus perangkat | `DELETE /api/v1/identity/auth/devices/{device_id}` |
| Logout sesi ini | `POST /api/v1/identity/auth/logout` |
| Logout perangkat lain | `POST /api/v1/identity/auth/logout-other-devices` |
| Logout semua perangkat | `POST /api/v1/identity/auth/logout-all-devices` |

## 4. Hapus Akun Terverifikasi OTP (`DONE`)

```
POST   /api/v1/identity/auth/account/request-deletion-otp
POST   /api/v1/identity/auth/account/resend-deletion-otp
DELETE /api/v1/identity/auth/account        (body: code)
```

`AccountDeletionUseCase`:

1. `requestDeletionOtp` — tolak bila akun tidak aktif/banned; terbitkan OTP
   `delete_account`; kirim email.
2. `deleteAccount` — `verifyAndConsume` OTP; lalu dalam **satu transaksi**:
   - `revokeAllTokens` (hapus semua token Sanctum),
   - `revokeAllDevices`,
   - `anonymizeUserData` (email → `deleted_{id}@deleted.local`, nama → "Deleted User",
     `firebase_uid`/`avatar`/`password` dikosongkan, `is_active=false`, `banned_at=now`),
   - `userRepository->delete` (soft/hard delete).
3. `resendDeletionOtp` — terbitkan ulang OTP.

> OTP `delete_account` bersifat sekali pakai; reuse/expired/kode salah ditolak dan dicatat.

## 5. Perbaikan yang Sudah Dilakukan

| ID | Masalah | Perbaikan |
|---|---|---|
| G-03 | Login sukses tidak mencabut sesi lama | `revokeExistingSessions` di `IssueApiTokenUseCase`, dipanggil `true` saat login |
| G-04 | Kirim email gagal meng-invalidasi challenge dengan ID kosong | Invalidate memakai **challenge ID asli** |
| G-07 | Email OTP dikirim sinkron | `EmailVerificationMail implements ShouldQueue` |

## 6. Celah Tersisa

| ID | Celah | Rencana |
|---|---|---|
| G-14 | `SwitchRoleUseCase` menerbitkan token baru **tanpa** mencabut token lama → dua sesi aktif | Panggil `revokeExistingSessions` / cabut token lama saat ganti role |
| — | Resend tidak memakai cooldown 60 detik (hanya rate limit) | Pertimbangkan cooldown eksplisit di UI/endpoint |
| — | Email OTP produksi memakai `QUEUE_CONNECTION=database` → butuh worker `queue:work` | Dokumentasikan di `RUN_MANUAL.md` / supervisor |

## 7. Acceptance Criteria

### AC-O1 — Login 2 langkah
- **Given** kredensial benar, **When** `password-login`, **Then** 202 + `challenge_id` (tanpa token).
- **Given** `challenge_id` + kode benar, **When** `password-login/verify`, **Then** 200 + token.

### AC-O2 — Force logout
- **Given** user punya token aktif di perangkat A,
- **When** login sukses (langkah 2) di perangkat B,
- **Then** token A tidak valid lagi; hanya token B aktif.

### AC-O3 — OTP sekali pakai
- **Given** OTP sudah dipakai, **When** diverifikasi lagi, **Then** ditolak.

### AC-O4 — Batas percobaan
- **Given** 5 kode salah, **When** mencoba lagi, **Then** challenge dianggap tidak valid.

### AC-O5 — Hapus akun
- **Given** user login, **When** `request-deletion-otp` lalu `DELETE /account` dengan kode benar,
- **Then** akun dianonimkan + dihapus, semua token & perangkat dicabut.
- **Given** kode salah/kedaluwarsa/dipakai ulang, **Then** ditolak.

### AC-O6 — Isolasi challenge
- **Given** dua challenge berbeda, **When** verifikasi dengan `challenge_id` salah,
- **Then** ditolak (tidak tercampur).

## 8. Test Terkait

- `tests/Feature/Auth/AuthTest.php` (login 2 langkah)
- `tests/Feature/Auth/AccountDeletionTest.php` (hapus akun + OTP)
- `tests/Feature/Auth/OtpSecurityEngineTest.php`
- `tests/Feature/Auth/RegisterWithOtpTest.php`, `EmailVerificationTest.php`, `DeviceManagementTest.php`
