# Reusable Data Header & Filter (Excel-like, sticky, mode-independent)

Satu sistem header filter untuk semua menu data admin. Header dirender **sekali**
di luar percabangan mode tampilan, jadi tidak pernah ter-unmount saat pengguna
berpindah **Table → Grid → Chart**. Filter yang dipilih langsung menyaring data
di ketiga mode karena semuanya membaca satu sumber data (`sortedRows`).

## Komponen & tanggung jawab

| File | Tanggung jawab |
| --- | --- |
| `shared/components/data-view/useDataView.js` | Satu sumber kebenaran: state filter + sort, deteksi tipe filter, `filteredRows` / `sortedRows`. |
| `shared/components/data-view/DataViewHeader.jsx` | Header kolom sticky + baris filter. Tidak tahu apa pun soal body. |
| `shared/components/data-view/DataView.jsx` | Orkestrator generik: header selalu di atas, body berganti sesuai `viewMode`. |
| `shared/components/crud/TableHeaderFilter.jsx` | Popover per kolom: sort A–Z/Z–A, cari teks, checkbox multi-select nilai unik. |
| `shared/utils/tableData.js` | `matchesColumnFilter` / `isColumnFilterEmpty` / `sortRowsBy` (mendukung nilai tunggal **dan** array). |
| `features/advanced/components/DataGrid.jsx` | Implementasi existing (7 halaman) yang sekarang memakai lapisan di atas. |

### Aturan arsitektur (penting)

```
DataView / DataGrid
├── <DataViewHeader />        ← SELALU dirender, di luar if viewMode
└── {viewMode === "list"  ? <TableBody rows={sortedRows} />  : null}
    {viewMode === "grid"  ? <CardGrid  rows={sortedRows} />  : null}
    {viewMode === "chart" ? <Chart     rows={sortedRows} />  : null}
```

Jangan menaruh header di dalam cabang `if (viewMode === ...)`: React akan
melepas DOM header saat mode berganti (popover tertutup, scroll horizontal
reset, animasi berkedip). Jangan juga menaruh state filter di masing-masing view.

## 1. Pakai `DataView` untuk halaman baru (paling singkat)

```jsx
import { DataView } from "@/shared/components/data-view";
import { OrdersTable } from "./OrdersTable";
import { OrdersCard } from "./OrdersCard";
import { OrdersChart } from "./OrdersChart";

const columns = [
  { key: "invoice", label: "Invoice" },
  { key: "customer", label: "Pelanggan" },
  { key: "status", label: "Status", filterType: "select" }, // opsi otomatis dari nilai unik
  { key: "total", label: "Total", filterType: "range", align: "right" },
  { key: "created_at", label: "Tanggal" },
];

export function OrdersPage({ rows, viewMode }) {
  return (
    <DataView
      columns={columns}
      rows={rows}
      viewMode={viewMode}
      emptyText="Belum ada pesanan."
      renderTable={({ rows: filtered }) => <OrdersTable rows={filtered} />}
      renderGrid={({ rows: filtered }) => <OrdersCard rows={filtered} />}
      renderChart={({ rows: filtered }) => <OrdersChart rows={filtered} />}
    />
  );
}
```

`ctx` yang diterima setiap render prop:

```js
{ rows, filteredRows, allRows, columns, emptyText, isFiltering,
  activeFilterCount, activeFilterKeys, columnFilters, filterConfig,
  sortBy, sortDirection }
```

## 2. Integrasi ke `DataGrid` (halaman yang sudah ada)

Cukup kirim `columns`, `rows`, `viewMode`, dan body tambahan:

```jsx
<DataGrid
  columns={columns}
  rows={rows}
  viewMode={viewMode}             // "list" | "grid" | "chart"
  card={ordersCard}               // dipakai mode grid
  chart={(filtered, meta) => <OrdersChart rows={filtered} meta={meta} />}
  storageKey="orders.main"        // simpan lebar/urutan kolom
/>
```

`chart` boleh berupa node **atau** fungsi `(rows, meta) => node`. Gunakan bentuk
fungsi agar grafik ikut tersaring oleh filter header.

## 3. Menambah filter baru tanpa menulis logika

Cukup tambahkan metadata pada definisi kolom:

```js
{
  key: "status",
  label: "Status",
  filterType: "select",        // "text" | "select" | "range"
  options: [                   // opsional; kosong = ambil nilai unik otomatis
    { value: "lunas", label: "Lunas" },
    { value: "pending", label: "Pending" },
  ],
  valueOf: (row) => row.payment_status ?? "-", // nilai turunan untuk filter/sort
  filterable: false,           // matikan filter untuk kolom aksi/gambar
  align: "right",
}
```

- `select` kini **multi-select checkbox** dengan pencarian dan “Pilih semua”.
  Nilainya berupa array (`["lunas","pending"]`); semua terpilih = tanpa filter.
- Filter `text` mencari substring (angka & tanggal ikut dinormalisasi).
- Filter `range` memakai `{ min, max }`.
- Sorting A–Z/Z–A dilakukan dari header yang sama pada semua tipe.

## 4. State sharing / API eksternal

Bila halaman memakai filter server-side, ambil nilai tunggal dengan normalizer:

```js
const first = (v) => (Array.isArray(v) ? v[0] : v);
const status = first(columnFilters.status);
```

Contoh nyata: `features/seller/product/pages/SellerProductsPage.jsx`.

## 5. Checklist integrasi

1. Definisikan `columns` (key, label, `filterType`, `options`, `valueOf`).
2. Pilih `DataView` (halaman baru) atau `DataGrid` (existing).
3. Pastikan **ketiga** render prop / body memakai `rows` dari `ctx`, bukan
   `allRows`.
4. Pastikan header tidak berada di dalam `if (viewMode ...)`.
5. Tambahkan test seperti `DataGrid.filterHeader.test.jsx`:
   header tidak remount, filter tetap aktif setelah ganti mode, chart menerima
   baris terfilter.

## Catatan sticky

Header memakai `position: sticky` dengan `top: var(--list-toolbar-h, 0px)`
(diisi `useStickyToolbarHeight`). Wrapper sticky berada **di luar** kontainer
scroll horizontal; kontainer dalam memakai `overflow-x: auto` +
`overflow-y: clip` agar header menempel ke scroll halaman, bukan ke scrollport
tabel.
