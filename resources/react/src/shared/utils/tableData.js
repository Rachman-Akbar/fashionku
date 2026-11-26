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
  if (filterType === "range") {
    if (!filterValue) return true;
    const hasMin = filterValue.min !== undefined && filterValue.min !== null && String(filterValue.min).trim() !== "";
    const hasMax = filterValue.max !== undefined && filterValue.max !== null && String(filterValue.max).trim() !== "";
    const hasStatus = filterValue.status !== undefined && filterValue.status !== null && String(filterValue.status).trim() !== "";
    return !hasMin && !hasMax && !hasStatus;
  }
  if (Array.isArray(filterValue)) return filterValue.length === 0;
  if (filterValue === null || filterValue === undefined) return true;
  return String(filterValue).trim() === "";
}

/** Nilai yang dianggap kosong oleh tabel (null, undefined, string kosong, array kosong). */
export function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Normalisasi teks untuk perbandingan: trim, spasi dirapatkan, huruf kecil. */
export function normalizeFilterText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Ubah nilai apa pun menjadi angka, termasuk format mata uang Indonesia
 * ("Rp 1.500.000", "1.500,50"). Mengembalikan `null` bila bukan angka.
 */
export function parseNumericValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const raw = value.replace(/rp/gi, "").replace(/[\s\u00a0]/g, "").trim();
  if (raw === "" || !/^[-+]?\d[\d.,]*$/.test(raw)) return null;
  const sign = raw.startsWith("-") ? -1 : 1;
  const body = raw.replace(/^[-+]/, "");
  const lastDot = body.lastIndexOf(".");
  const lastComma = body.lastIndexOf(",");
  const lastSeparator = Math.max(lastDot, lastComma);
  if (lastSeparator === -1) return sign * Number(body);
  // "1.500.000" / "1.500.000,50" = pemisah ribuan + desimal opsional.
  if (/^\d{1,3}([.,]\d{3})+$/.test(body)) return sign * Number(body.replace(/[.,]/g, ""));
  const integerPart = body.slice(0, lastSeparator).replace(/[.,]/g, "");
  const decimalPart = body.slice(lastSeparator + 1).replace(/[.,]/g, "");
  const parsed = Number(`${integerPart || "0"}.${decimalPart || "0"}`);
  return Number.isFinite(parsed) ? sign * parsed : null;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

const MONTH_NAMES = {
  jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7,
  agu: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12,
};

/**
 * Normalisasi tanggal ke `yyyy-mm-dd` supaya "2026-02-01", "01/02/2026",
 * "1 Feb 2026", dan ISO timestamp bisa dibandingkan dengan format apa pun.
 */
export function toComparableDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  const iso = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[t\s].*)?$/i);
  if (iso) return `${iso[1]}-${pad2(iso[2])}-${pad2(iso[3])}`;
  const dmy = raw.match(/^(\d{1,2})[-/.]{1}(\d{1,2})[-/.]{1}(\d{4})(?:[t\s].*)?$/i);
  if (dmy) return `${dmy[3]}-${pad2(dmy[2])}-${pad2(dmy[1])}`;
  const named = raw.match(/^(\d{1,2})[\s-]([a-zA-Z]{3,})[\s-](\d{4})/);
  if (named) {
    const month = MONTH_NAMES[named[2].toLowerCase().slice(0, 3)];
    if (month) return `${named[3]}-${pad2(month)}-${pad2(named[1])}`;
  }
  return null;
}

const EMPTY_FILTER_TOKENS = new Set(["__empty__", "(kosong)", "kosong", "empty", "null"]);
const TRUE_TOKENS = new Set(["true", "1", "ya", "yes", "aktif", "active", "published", "dipakai"]);
const FALSE_TOKENS = new Set(["false", "0", "tidak", "no", "nonaktif", "non-active", "nonactive", "inactive", "draft"]);

function matchesSelectFilter(value, filterValue) {
  // Filter pilihan bisa berupa satu nilai (kompatibel dengan data lama) atau
  // array nilai dari checkbox multi-select ala Excel.
  const wantedValues = (Array.isArray(filterValue) ? filterValue : [filterValue])
    .map((item) => normalizeFilterText(item))
    .filter(Boolean);
  if (!wantedValues.length) return true;

  const candidates = new Set([
    normalizeFilterText(value),
    normalizeFilterText(formatTableValue(value)),
  ]);
  if (typeof value === "number") candidates.add(normalizeFilterText(String(value)));
  if (typeof value === "boolean") {
    candidates.add(value ? "ya" : "tidak");
    candidates.add(value ? "aktif" : "nonaktif");
  }

  return wantedValues.some((wanted) => {
    if (typeof value === "boolean") {
      if (TRUE_TOKENS.has(wanted)) return value === true;
      if (FALSE_TOKENS.has(wanted)) return value === false;
    }
    return candidates.has(wanted);
  });
}

function matchesTextFilter(value, filterValue) {
  const needle = normalizeFilterText(filterValue);
  if (!needle) return true;
  if (EMPTY_FILTER_TOKENS.has(needle)) return isEmptyValue(value);
  if (needle === "-") return isEmptyValue(value);

  const raw = normalizeFilterText(value);
  const formatted = normalizeFilterText(formatTableValue(value));
  if ((raw && raw.includes(needle)) || (formatted && formatted.includes(needle))) return true;

  const needleNumber = parseNumericValue(needle);
  const valueNumber = parseNumericValue(value);
  if (needleNumber !== null && valueNumber !== null && needleNumber === valueNumber) return true;

  const needleDate = toComparableDate(needle);
  if (needleDate) {
    const valueDate = toComparableDate(raw) ?? toComparableDate(formatted);
    if (valueDate && valueDate === needleDate) return true;
  }

  return false;
}

export function matchesColumnFilter(value, filterValue, filterType) {
  if (isColumnFilterEmpty(filterValue, filterType)) return true;
  if (filterType === "range") {
    const number = parseNumericValue(value);
    if (number === null) return false;
    const min = filterValue.min === "" || filterValue.min === undefined || filterValue.min === null ? null : parseNumericValue(filterValue.min);
    const max = filterValue.max === "" || filterValue.max === undefined || filterValue.max === null ? null : parseNumericValue(filterValue.max);
    if (min !== null && number < min) return false;
    if (max !== null && number > max) return false;
    return true;
  }
  if (filterType === "select") return matchesSelectFilter(value, filterValue);
  return matchesTextFilter(value, filterValue);
}

export function sortRowsBy(rows = [], sortBy, sortDirection, valueOf) {
  if (!sortBy || !rows.length) return rows;
  const direction = sortDirection === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const rawA = valueOf(a, sortBy);
    const rawB = valueOf(b, sortBy);
    const emptyA = isEmptyValue(rawA);
    const emptyB = isEmptyValue(rawB);
    // Baris tanpa nilai selalu di bawah agar tidak menyelip di antara angka.
    if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
    const numA = parseNumericValue(rawA);
    const numB = parseNumericValue(rawB);
    if (numA !== null && numB !== null && numA !== numB) return (numA - numB) * direction;
    const dateA = toComparableDate(rawA);
    const dateB = toComparableDate(rawB);
    if (dateA && dateB && dateA !== dateB) return dateA.localeCompare(dateB) * direction;
    return String(rawA).localeCompare(String(rawB), "id", { numeric: true, sensitivity: "base" }) * direction;
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
