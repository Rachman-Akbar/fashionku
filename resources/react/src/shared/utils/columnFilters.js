import {
  formatTableValue,
  isColumnFilterEmpty,
  matchesColumnFilter,
  resolveTableValue,
} from "./tableData";

/** Satu sumber label filter untuk kolom boolean. */
const BOOLEAN_OPTIONS = [
  { value: "true", label: "Ya" },
  { value: "false", label: "Tidak" },
];

function isNumericLike(value) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string" || value.trim() === "") return false;
  const trimmed = value.trim();
  // Tanggal ("2025-01-01", ISO timestamp) tetap difilter sebagai teks.
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return false;
  return Number.isFinite(Number(trimmed));
}

function isTemporalValue(value) {
  if (value instanceof Date) return true;
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}/.test(value.trim());
}

/**
 * Tentukan tipe filter untuk setiap kolom tabel:
 * - `select` bila kolom punya `options` atau seluruh nilainya boolean.
 * - `range` bila seluruh nilai numerik (harga, stok, jumlah).
 * - `text` untuk sisanya (termasuk tanggal).
 *
 * `column.filterType` / `column.filterable === false` selalu menang.
 */
export function buildColumnFilterConfig(columns = [], rows = [], getValue = resolveTableValue) {
  const types = {};
  const options = {};
  const samplesByKey = {};

  (Array.isArray(columns) ? columns : []).forEach((column) => {
    if (!column || !column.key || column.filterable === false) return;
    const key = String(column.key);
    const samples = (Array.isArray(rows) ? rows : [])
      .map((row) => getValue(row, key))
      .filter((value) => value !== undefined && value !== null && value !== "");
    samplesByKey[key] = samples;

    let type = column.filterType;
    if (!type) {
      if (Array.isArray(column.options) && column.options.length) type = "select";
      else if (samples.length && samples.every((value) => typeof value === "boolean")) type = "select";
      else if (samples.length && samples.every(isNumericLike)) type = "range";
      else type = "text";
    }
    types[key] = type;
  });

  Object.entries(types).forEach(([key, type]) => {
    if (type !== "select") return;
    const column = (Array.isArray(columns) ? columns : []).find((item) => String(item?.key) === key);
    if (Array.isArray(column?.options) && column.options.length) {
      options[key] = column.options;
      return;
    }
    const samples = samplesByKey[key] || [];
    if (samples.length && samples.every((value) => typeof value === "boolean")) {
      options[key] = BOOLEAN_OPTIONS;
      return;
    }
    const unique = [...new Set(samples.map((value) => formatTableValue(value)))].filter((value) => value !== "-");
    options[key] = unique
      .sort((left, right) => String(left).localeCompare(String(right), "id"))
      .map((value) => ({ value: String(value), label: String(value) }));
  });

  return { types, options };
}

/**
 * Saring baris berdasarkan filter kolom aktif (client-side). Dipakai halaman
 * yang memuat seluruh baris sekaligus (daftar tanpa paging) atau untuk kolom
 * database yang tidak punya parameter filter di API.
 */
export function filterRowsByColumnFilters(
  rows = [],
  filters = {},
  filterTypes = {},
  { getValue = resolveTableValue, includeKeys = null, excludeKeys = [] } = {},
) {
  const excluded = new Set(excludeKeys);
  const included = includeKeys ? new Set(includeKeys) : null;
  const active = Object.entries(filters || {}).filter(([key, value]) => {
    if (excluded.has(key)) return false;
    if (included && !included.has(key)) return false;
    return !isColumnFilterEmpty(value, filterTypes[key] || "text");
  });
  if (!active.length) return Array.isArray(rows) ? rows : [];
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    active.every(([key, value]) => matchesColumnFilter(getValue(row, key), value, filterTypes[key] || "text")),
  );
}

/** Susun opsi `select` unik dari data untuk kolom kategorikal. */
export function collectColumnFilterOptions(rows = [], columns = [], getValue = resolveTableValue) {
  return buildColumnFilterConfig(columns, rows, getValue).options;
}

export { isTemporalValue };
