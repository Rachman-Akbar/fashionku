import { useMemo } from "react";

function pruneByKeys(value, keys) {
  if (Array.isArray(value)) return value.map((item) => pruneByKeys(item, keys));
  if (value && typeof value === "object") {
    const output = {};
    Object.keys(value).forEach((key) => {
      if (!keys.includes(key)) output[key] = pruneByKeys(value[key], keys);
    });
    return output;
  }
  return value;
}

function pruneUnknownKeys(value, allowedKeys) {
  if (Array.isArray(value)) return value.map((item) => pruneUnknownKeys(item, allowedKeys));
  if (value && typeof value === "object") {
    const output = {};
    allowedKeys.forEach((key) => {
      if (key in value) output[key] = pruneUnknownKeys(value[key], allowedKeys);
    });
    return output;
  }
  return value;
}

function toComparableNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeNumericKeys(value, numericKeys) {
  if (Array.isArray(value)) return value.map((item) => normalizeNumericKeys(item, numericKeys));
  if (value && typeof value === "object") {
    const output = {};
    Object.keys(value).forEach((key) => {
      const next = value[key];
      output[key] = numericKeys.includes(key) && (next === null || next === undefined || typeof next !== "object")
        ? toComparableNumber(next)
        : normalizeNumericKeys(next, numericKeys);
    });
    return output;
  }
  return value;
}

const NO_NUMERIC_KEYS = [];

export function useFormDirty(pristine, current, options = {}) {
  const { volatileKeys = [], compareKeys = null, numericKeys = NO_NUMERIC_KEYS } = options;
  return useMemo(() => {
    if (!pristine || !current) return false;
    const prepare = (value) => normalizeNumericKeys(
      pruneByKeys(compareKeys ? pruneUnknownKeys(value, compareKeys) : value, volatileKeys),
      numericKeys,
    );
    return JSON.stringify(prepare(pristine)) !== JSON.stringify(prepare(current));
  }, [pristine, current, volatileKeys, compareKeys, numericKeys]);
}
