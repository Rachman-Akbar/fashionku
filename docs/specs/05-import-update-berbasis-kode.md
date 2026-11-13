# 05 — Import Update Berbasis Kode

> Acuan: [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt) baris 18–22.
> **Prinsip wajib:** acuan pencocokan adalah **KODE yang terlihat user**,
> **bukan nama** produk/bahan, dan **bukan ID database** (ID tidak terlihat user).

Status backend: `TODO` (G-15) — endpoint `/api/v1/catalog/spreadsheets/*` belum ada.
Frontend sudah siap memanggilnya (`resources/react/src/shared/spreadsheet/spreadsheetService.js`).

## 1. Prinsip Desain

1. **Kode adalah kunci bisnis.** Setiap entitas yang dapat di-import memiliki kode
   yang dibuat dari pola (`CodePatternService`) dan ditampilkan ke user:
   - SKU produk → `sku`
   - Kode bahan baku → `material_code`
   - Nomor referensi stok → `stock_reference` / `material_reference`
   - Nomor referensi keuangan → `invoice_reference`
2. **Perubahan nama tidak merusak relasi.** Mengubah nama produk/bahan pada file
   import **tidak** memutus relasi ke order/stok/transaksi karena pencocokan
   memakai kode.
3. **ID database tidak pernah menjadi input.** ID hanya dipakai internal.
4. **Idempoten.** Import file yang sama dua kali tidak menggandakan data.
5. **Aman.** Import tidak mengubah harga jual aktif secara otomatis (kecuali kolom
   eksplisit), dan mencatat audit perubahan.

## 2. Peta Modul & Kunci

| Modul (path param) | Entitas | Kunci acuan | Kolom kode di file |
|---|---|---|---|
| `raw-material` | Bahan baku | `material_code` | `kode_bahan` |
| `product` | Produk (+varian) | `sku` | `sku` |
| `product-costing` | HPP & harga jual | `sku` | `sku` |
| `stock` | Stok produk | `sku` (+ `stock_reference` untuk mutasi) | `sku` |
| `raw-material-stock` | Stok bahan baku | `material_code` | `kode_bahan` |
| `income` / `expense` | Pemasukan/Pengeluaran | `invoice_reference` | `kode_transaksi` |
| `receivable` / `payable` | Piutang/Hutang | `invoice_reference` | `kode_transaksi` |
| `order` | Pesanan | `order_number` | `nomor_pesanan` |
| `promotion`, `voucher`, `review`, `customer`, `cost-impact` | lain-lain | kode/slug masing-masing | sesuai modul |

> Fokus permintaan: **bahan baku, product, stock, pemasukan & pengeluaran** (empat modul utama).

## 3. Kontrak Endpoint

Semua endpoint butuh `auth:sanctum`, `active.user`, `verified.email`,
`active.role:seller` (admin lolos), dan permission sesuai modul.

| Aksi | Method & Path |
|---|---|
| Unduh template | `GET /api/v1/catalog/spreadsheets/{module}/template` |
| Export data | `POST /api/v1/catalog/spreadsheets/{module}/export` (body `{ ids: [] }`) |
| Preview import | `POST /api/v1/catalog/spreadsheets/{module}/import/preview` (multipart: `file`, `import_mode`) |
| Import | `POST /api/v1/catalog/spreadsheets/{module}/import` (multipart: `file`, `import_mode`, `create_missing_relations`) |
| Bulk delete | `POST /api/v1/catalog/spreadsheets/{module}/bulk-delete` (body `{ ids: [] }`) |

### Mode Import (`import_mode`)

| Mode | Perilaku |
|---|---|
| `create` | Hanya membuat baris baru; kode yang sudah ada → error |
| `update` | Hanya memperbarui baris yang kodenya sudah ada; kode tak dikenal → error |
| `upsert` | Buat bila kode belum ada, perbarui bila sudah ada (**default untuk "import update"**) |

### Preview

`import/preview` mengembalikan (bentuk yang sudah diharapkan frontend):

```json
{
  "data": {
    "total_rows": 120,
    "valid_rows": 118,
    "invalid_rows": 2,
    "requires_confirmation": false,
    "can_continue": true,
    "missing_relations": [],
    "blocking_relations": []
  }
}
```

- `missing_relations` — relasi opsional yang bisa dibuat otomatis (`create_missing_relations=1`).
- `blocking_relations` — relasi wajib yang hilang; `can_continue=false`.

### Respons Import

- Jika **semua** sukses: JSON `{ success: true, data: { success_count, error_count } }`.
- Jika ada gagal: mengembalikan **file XLSX** berisi baris gagal + kolom alasan,
  dengan header `x-import-success-count`, `x-import-error-count`,
  `Content-Disposition: attachment`.
  (Perilaku ini sudah diasumsikan frontend.)

## 4. Algoritma Pencocokan (Berbasis Kode)

```
untuk setiap baris:
  kode = normalisasi(kolom kode)         # trim, uppercase untuk SKU/kode bahan
  jika kode kosong -> error "kode wajib"
  existing = cariEntitas(kode, store_id)
  jika import_mode = create:
      jika existing -> error "kode sudah terdaftar"
      else -> buat
  jika import_mode = update:
      jika !existing -> error "kode tidak ditemukan"
      else -> perbarui
  jika import_mode = upsert:
      jika existing -> perbarui
      else -> buat
```

Aturan tambahan:
- **Scoping toko:** pencarian selalu dibatasi `store_id` operator (single-store = toko utama).
- **Unik per toko:** kode unik per toko; duplikat kode dalam satu file → baris kedua error.
- **Nama bukan kunci:** nama hanya untuk pembuatan entitas baru atau update atribut.
- **Relasi:** kategori/atribut dicari berdasarkan nama/slug; jika hilang dan
  `create_missing_relations=1`, dibuat otomatis; jika tidak, dilaporkan di `blocking_relations`.
- **Transaksi per baris** (atau batch dengan rollback baris gagal) agar sebagian sukses tetap tersimpan.
- **Audit:** setiap update dicatat (aktor, waktu, kolom berubah).

## 5. Kolom Template per Modul Utama

### 5.1 Bahan Baku (`raw-material`)
`kode_bahan*`, `nama*`, `satuan*`, `stok_awal`, `biaya_satuan`, `stok_minimum`, `aktif`.

### 5.2 Produk (`product`)
`sku*`, `nama*`, `kategori*`, `brand`, `deskripsi`, `status`, `harga`, `berat`, `aktif`,
serta kolom varian (`ukuran`, `warna`, `material`) bila produk bervarian.
`sku` adalah kunci; `nama` boleh berubah tanpa memutus relasi.

### 5.3 HPP & Harga Jual (`product-costing`)
`sku*`, `hpp`, `harga_jual`, `margin_persen`.

### 5.4 Stok Produk (`stock`)
`sku*`, `stok_tersedia`, `stok_reserved`, `stok_booked`, `stok_preorder`,
`alasan_penyesuaian`. Penyesuaian dicatat sebagai `stock_movements`.

### 5.5 Pemasukan/Pengeluaran (`income` / `expense`)
`kode_transaksi*`, `tanggal*`, `kategori`, `judul*`, `jumlah*`, `status`,
`jatuh_tempo`, `keterangan`. Kunci = `reference_number` (`invoice_reference`).

> `*` = wajib.

## 6. Integrasi Pola Kode

- Template menyertakan contoh kode sesuai pola aktif (`CodePatternService`).
- Bila user mengosongkan kode pada mode `create`, backend dapat **menggenerate**
  memakai pola (SKU/bahan/invoice) — namun mode `update`/`upsert` **wajib** kode eksplisit.
- Pola dapat diubah di `PUT /api/v1/shared/code-patterns`; preview di `POST .../preview`.

## 7. Acceptance Criteria

### AC-I1 — Update by kode, nama berubah
- **Given** produk `sku=KAOS-001` bernama "Kaos Basic" dan sudah direferensikan order,
- **When** import `update` mengubah nama menjadi "Kaos Premium" dengan `sku` sama,
- **Then** nama terbarui dan relasi order tetap utuh.

### AC-I2 — Bukan ID
- **Given** file tanpa kolom ID database,
- **When** import dijalankan,
- **Then** pencocokan tetap berhasil memakai kode.

### AC-I3 — Mode create menolak duplikat
- **Given** `sku` sudah ada, **When** mode `create`, **Then** baris error "kode sudah terdaftar".

### AC-I4 — Mode update menolak kode tak dikenal
- **Given** `sku` tidak ada, **When** mode `update`, **Then** baris error "kode tidak ditemukan".

### AC-I5 — Idempoten (upsert)
- **Given** file valid, **When** di-import dua kali mode `upsert`,
- **Then** jumlah baris tidak bertambah dan data konsisten.

### AC-I6 — Laporan error
- **Given** sebagian baris invalid, **When** import,
- **Then** baris sukses tersimpan, file XLSX error berisi baris gagal + alasan.

### AC-I7 — Scoping toko
- **Given** kode milik toko lain, **When** operator meng-import,
- **Then** tidak boleh menimpa data toko lain.

## 8. Rencana Implementasi (Backend)

1. Registrasi rute spreadsheet (modul → controller) dengan middleware & permission.
2. `SpreadsheetModuleRegistry` (module → entitas, kolom, validator, key).
3. Layanan template (generate XLSX header + contoh) & export (query + styling).
4. Layanan import: parser (PhpSpreadsheet), validasi, matcher berbasis kode, writer per baris.
5. Preview: dry-run memakai matcher yang sama tanpa menyimpan.
6. Laporan error: bangun XLSX baris gagal + header hitungan.
7. Bulk delete: hapus by ID yang dipilih (dibatasi store).
8. Test: unit matcher + feature per modul (create/update/upsert, error report, scoping).

> Prasyarat: registrasi endpoint bahan baku (G-16) dan domain Schedule (G-17) untuk modul terkait.
