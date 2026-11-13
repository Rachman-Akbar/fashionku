# 03 — Chart.js + Filter Tanggal/Bulan/Tahun

> Acuan: [`../ringkasan fitur.txt`](../ringkasan%20fitur.txt) baris 24–30.
> Permintaan eksplisit: **gunakan Chart.js**, dan **filter tanggal, bulan, tahun**
> harus mengubah data yang ditampilkan (auto-refresh).

## 1. Kebutuhan

1. Diagram pada halaman berikut memakai **Chart.js**:
   - **Dashboard Admin**
   - **Finance**
   - **Stock**
   - **Laporan Penjualan dan Produk**
2. Setiap halaman menyediakan filter **tanggal**, **bulan**, dan **tahun**.
3. Perubahan filter **otomatis** memuat ulang data (tanpa reload halaman).
4. Data yang divisualisasikan adalah data **hasil filter**.

Status saat ini: `PARTIAL` — chart sudah ada tetapi memakai **Recharts**, dan filter
belum seragam (baru `period` di Finance + Dashboard). Belum ada halaman Laporan Penjualan/Produk.

## 2. Arsitektur Chart Saat Ini

Abstraksi chart terpusat di:

- `resources/react/src/shared/components/charts/chartKit.jsx` — wrapper Recharts yang
  mengekspor komponen siap pakai:
  - `SeriesBarList` (batang horizontal/kolom/stacked/garis/area)
  - `DailyCashflowBars` (arus kas harian: `income`, `expense`)
  - `OrderRevenueBars` (tren: `orders`, `revenue`)
  - `DonutChart` (donut/pie/bar list)
  - `StatCard`, `InteractiveLegend`, `SeriesLegend`, `legendDot`
- `resources/react/src/shared/components/charts/ChartFrame.jsx` — kerangka chart
  (switcher tipe, mode fokus/fullscreen, empty state, legend).

Konsumen saat ini:

| Halaman | Komponen | Chart |
|---|---|---|
| Dashboard Admin (`SellerDashboardPage.jsx`) | `OrderRevenueBars`, `StatCard` | Tren order & pendapatan |
| Finance (`FinanceChartPanel.jsx`) | `DailyCashflowBars`, `SeriesBarList`, `StatCard` | Arus kas & kategori |
| Stock (`StockChartTab.jsx`) | `SeriesBarList`, `StatCard` | Pergerakan/nilai stok |
| Laporan Penjualan/Produk | — | **belum ada** |

## 3. Rencana Migrasi ke Chart.js

**Prinsip: jaga API publik `chartKit.jsx` tetap sama**, ganti mesin render internal
ke Chart.js. Dengan begitu konsumen (`StockChartTab`, `FinanceChartPanel`,
`SellerDashboardPage`, dan halaman laporan baru) **tidak perlu diubah**.

Langkah:
1. Tambah dependensi `chart.js` (dan opsional `react-chartjs-2`).
2. Registrasi komponen Chart.js yang dipakai (`BarElement`, `LineElement`,
   `PointElement`, `ArcElement`, `CategoryScale`, `LinearScale`, `Tooltip`,
   `Legend`, `Filler`).
3. Implementasi ulang di dalam `chartKit.jsx` (nama & props ekspor dipertahankan):
   - `SeriesBarList` → `Chart` tipe `bar`/`line`.
   - `DailyCashflowBars` → line/bar multi-series.
   - `OrderRevenueBars` → mixed bar+line (dual axis).
   - `DonutChart` → `doughnut`/`pie`.
   - `InteractiveLegend`/`StatCard` → tetap (murni DOM).
4. `ChartFrame.jsx` tetap sebagai kerangka (switcher/fullscreen/empty).
5. Hapus `recharts` dari `package.json` setelah semua konsumen pindah.
6. Pastikan chunk `chartKit`/`vendor-charts` tetap ter-split (Vite) agar bundle ramping.

> Alternatif: menambah wrapper baru `chartjsKit.jsx` dan migrasi bertahap per halaman,
> lalu hapus Recharts. Direkomendasikan pendekatan "swap internal" agar minim risiko.

## 4. Filter Seragam (Tanggal/Bulan/Tahun)

### 4.1 Kontrak Query Standar

Semua endpoint chart menerima parameter berikut:

| Param | Tipe | Deskripsi |
|---|---|---|
| `date_from` | `YYYY-MM-DD` | Awal rentang (inklusif) |
| `date_to` | `YYYY-MM-DD` | Akhir rentang (inklusif) |
| `month` | `YYYY-MM` | Filter satu bulan (alternatif `date_from/date_to`) |
| `year` | `YYYY` | Filter satu tahun |
| `granularity` | `day` \| `month` \| `year` | Tingkat agregasi sumbu-X |

Aturan:
- Jika `date_from`/`date_to` diberikan, keduanya dipakai (dan `date_to >= date_from`).
- Jika `month`/`year` diberikan tanpa rentang, server menurunkan rentang otomatis.
- `granularity` menentukan bucket: harian, bulanan, atau tahunan.
- Respons menyertakan `range` (yang benar-benar dipakai) agar UI dapat menampilkan periode.

### 4.2 Perilaku UI

- Tiga kontrol: **Tanggal** (date range picker), **Bulan** (month picker), **Tahun** (year picker).
- Mengubah salah satu memicu refetch otomatis (React Query `queryKey` menyertakan filter).
- Pilihan saling menyesuaikan: memilih Bulan mengisi rentang tanggal bulan tsb; memilih Tahun mengisi rentang tahun.
- Menampilkan label periode aktif, mis. "1–30 Nov 2026".

### 4.3 Endpoint Terkait (kondisi saat ini)

| Endpoint | Filter saat ini | Perubahan |
|---|---|---|
| `GET /seller/finance/dashboard` | `period`, `date_from`, `date_to` | Tambah `month`, `year`, `granularity` |
| `GET /seller/finance/dashboard/cashflow` | `from_date`, `to_date` (wajib) | Samakan nama `date_from/date_to`; tambah `month`/`year` |
| `GET /seller/finance/dashboard/order-trend` | `period`, `date_from`, `date_to` | Tambah `month`, `year`, `granularity` |
| `GET /seller/stock/movements` | filter gerakan | Tambah `date_from/date_to` untuk grafik stok |
| Dashboard Admin (metrik) | `period=monthly` (hardcoded) | Tambah kontrol filter |
| Laporan Penjualan/Produk | **belum ada** | Endpoint baru |

## 5. Halaman "Laporan Penjualan dan Produk" (`TODO`)

Belum ada halaman. Target:

- Grafik penjualan (omzet & jumlah order) per periode terpilih.
- Grafik produk terlaris (top N) dan kontribusi kategori.
- Ekspor laporan (CSV/XLSX) sesuai filter aktif (`reports.export`).
- Endpoint usulan: `GET /api/v1/seller/reports/sales`, `GET /api/v1/seller/reports/products`.

## 6. Acceptance Criteria

### AC-C1 — Chart.js
- **Given** halaman Dashboard/Finance/Stock/Laporan,
- **When** dirender,
- **Then** chart menggunakan Chart.js (bukan Recharts), dan `recharts` tidak lagi di bundle.

### AC-C2 — Filter tanggal
- **Given** pengguna memilih rentang tanggal,
- **When** filter diterapkan,
- **Then** data chart otomatis ter-refresh sesuai rentang.

### AC-C3 — Filter bulan
- **Given** pengguna memilih `month=2026-11`,
- **When** filter diterapkan,
- **Then** chart menampilkan data 1–30 Nov 2026.

### AC-C4 — Filter tahun
- **Given** pengguna memilih `year=2026`,
- **When** filter diterapkan,
- **Then** chart menampilkan agregasi `granularity=month` sepanjang 2026.

### AC-C5 — Auto-refresh
- **Given** filter berubah,
- **When** state filter diperbarui,
- **Then** query dijalankan ulang otomatis tanpa reload halaman.

### AC-C6 — Konsistensi kontrak
- **Given** keempat halaman,
- **When** memakai filter,
- **Then** semua memakai nama parameter yang sama (`date_from`, `date_to`, `month`, `year`, `granularity`).

## 7. Non-Fungsional

- Grafik responsif dan tetap terbaca di layar kecil.
- Mode fokus/fullscreen & switcher tipe dipertahankan.
- Aksesibilitas: `role="img"`/`aria-label` pada canvas chart.
- Tidak ada regresi pada build (`npm run build` hijau) dan ukuran chunk wajar.
