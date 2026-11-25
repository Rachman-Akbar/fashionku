const excludedKeys = new Set([
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "createdAt",
  "updatedAt",
  "deletedAt",
]);

export function humanizeColumnKey(value = "") {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatTableValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (Array.isArray(value)) {
    if (!value.length) return "-";
    return value.map((item) => typeof item === "object" ? item.name || item.code || item.id || JSON.stringify(item) : item).join(", ");
  }
  if (typeof value === "object") {
    return value.name || value.code || value.label || JSON.stringify(value);
  }
  return String(value);
}

function toSnakeCase(key) {
  return String(key ?? "").replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(key) {
  return String(key ?? "").replace(/[-_]([a-zA-Z0-9])/g, (_, letter) => letter.toUpperCase());
}

export function resolveTableValue(row, columnKey) {
  if (!row || typeof row !== "object") return undefined;
  const scan = (source) => {
    if (!source || typeof source !== "object") return undefined;
    const find = (candidate) => {
      const value = source[candidate];
      return value !== undefined && value !== null && value !== "" ? value : undefined;
    };
    return find(columnKey) ?? find(toSnakeCase(columnKey)) ?? find(toCamelCase(columnKey));
  };
  return scan(row) ?? (row && typeof row === "object" ? scan(row.raw) : undefined);
}

// Kunci yang bukan data bisnis: identitas baris (id/uuid), relasi mentah,
// dan kolom internal tabel.
const DATABASE_IDENTIFIER_KEYS = new Set(["id", "uuid", "raw", "children", "pivot"]);

/** Normalisasi nama kolom agar `order_type` dan `orderType` dianggap sama. */
export function normalizeColumnKey(key) {
  return String(key ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * True untuk kolom identitas / foreign key. Halaman data admin menampilkan
 * semua kolom database kecuali kolom ID (termasuk `*_id` / `*Id`).
 */
export function isDatabaseIdentifierKey(key) {
  const value = String(key ?? "").trim();
  if (!value) return true;
  if (DATABASE_IDENTIFIER_KEYS.has(value)) return true;
  if (/_id$/.test(value) || /_uuid$/.test(value)) return true;
  // foreign key camelCase: orderId, productId
  return /[a-z0-9]Id$/.test(value);
}

/**
 * Bangun kolom tabel dari SEMUA kolom database yang ada pada data API
 * (termasuk kolom relasi hasil join/eager-load), kecuali kolom ID.
 *
 * Dipakai bersama `mergeColumns` sehingga kolom yang sudah punya render
 * khusus di halaman tetap menang, dan kolom yang belum pernah tampil
 * otomatis muncul dengan label dari nama kolomnya.
 */
export function buildDatabaseColumns(rows = [], { omit = [], labels = {} } = {}) {
  const omitted = new Set(omit.map(normalizeColumnKey));
  const keys = new Map();
  rows.forEach((row) => {
    const source = row && typeof row === "object" && row.raw && typeof row.raw === "object" ? row.raw : row;
    Object.keys(source || {}).forEach((key) => {
      if (isDatabaseIdentifierKey(key)) return;
      const normalized = normalizeColumnKey(key);
      if (omitted.has(normalized) || keys.has(normalized)) return;
      keys.set(normalized, key);
    });
  });
  return [...keys.values()].map((key) => ({
    key,
    rawKey: key,
    label: labels[key] || labels[normalizeColumnKey(key)] || humanizeColumnKey(key),
    defaultVisible: true,
  }));
}

export function buildRawColumns(rows = [], omittedKeys = []) {
  const omitted = new Set([...excludedKeys, ...omittedKeys]);
  const keys = new Set();
  rows.forEach((row) => {
    const source = row?.raw && typeof row.raw === "object" ? row.raw : row;
    Object.keys(source || {}).forEach((key) => {
      if (!omitted.has(key)) keys.add(key);
    });
  });
  return [...keys].map((key) => ({ key: `raw:${key}`, label: humanizeColumnKey(key), rawKey: key, defaultVisible: false }));
}

export function isColumnFilterEmpty(filterValue, filterType) {
  if (filterType === "range") return !filterValue || (filterValue.min === "" && filterValue.max === "");
  return filterValue === "" || filterValue === null || filterValue === undefined;
}

export function matchesColumnFilter(value, filterValue, filterType) {
  if (isColumnFilterEmpty(filterValue, filterType)) return true;
  if (filterType === "range") {
    const number = Number(value);
    if (Number.isNaN(number)) return false;
    if (filterValue.min !== "" && number < Number(filterValue.min)) return false;
    if (filterValue.max !== "" && number > Number(filterValue.max)) return false;
    return true;
  }
  if (filterType === "select") {
    const wanted = String(filterValue).toLowerCase();
    if (typeof value === "boolean") return value === (wanted === "true" || wanted === "active" || wanted === "ya" || wanted === "1");
    return String(value ?? "").toLowerCase() === wanted;
  }
  if (typeof value === "boolean") {
    const wanted = String(filterValue).toLowerCase();
    return value === (wanted === "true" || wanted === "active" || wanted === "ya" || wanted === "1");
  }
  return String(value ?? "").toLowerCase().includes(String(filterValue).toLowerCase());
}

export function sortRowsBy(rows = [], sortBy, sortDirection, valueOf) {
  if (!sortBy || !rows.length) return rows;
  const direction = sortDirection === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const rawA = valueOf(a, sortBy);
    const rawB = valueOf(b, sortBy);
    const numA = Number(rawA);
    const numB = Number(rawB);
    if (Number.isFinite(numA) && Number.isFinite(numB) && numA !== numB) return (numA - numB) * direction;
    return String(rawA ?? "").localeCompare(String(rawB ?? ""), "id") * direction;
  });
}

export function mergeColumns(baseColumns = [], rawColumns = []) {
  const normalizedBase = baseColumns.map((column) => ({
    ...column,
    rawKey: column.rawKey ?? String(column.key ?? "").replace(/^raw:/, ""),
  }));
  // Dedupe memakai nama ternormalisasi supaya `orderType` (kolom kurasi) dan
  // `order_type` (kolom database) tidak muncul dua kali.
  const baseRawKeys = new Set(
    normalizedBase
      .flatMap((column) => [column.rawKey, column.key])
      .filter(Boolean)
      .map(normalizeColumnKey),
  );
  return [
    ...normalizedBase,
    ...rawColumns.filter((column) => !baseRawKeys.has(normalizeColumnKey(column.rawKey ?? column.key))),
  ];
}
