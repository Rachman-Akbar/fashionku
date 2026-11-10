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
  const baseRawKeys = new Set(normalizedBase.flatMap((column) => [column.rawKey]).filter(Boolean));
  return [...normalizedBase, ...rawColumns.filter((column) => !baseRawKeys.has(column.rawKey))];
}
