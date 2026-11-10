import { useCallback, useEffect, useMemo, useState } from "react";

const COLUMNS_CHANGED_EVENT = "ziip:columns-changed";

function getStorageKey(key) {
  return key ? `ziip:table-columns:${key}` : "";
}

function getDefaultStorageKey(key) {
  return key ? `ziip:table-columns-default:${key}` : "";
}

function getKnownStorageKey(key) {
  return key ? `ziip:table-columns-known:${key}` : "";
}

function readStored(storageKey) {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function clearStored(storageKey) {
  if (!storageKey || typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignore storage errors
  }
}

function persistStored(storageKey, keys) {
  if (!storageKey || typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(keys);
    if (window.localStorage.getItem(storageKey) === serialized) return;
    window.localStorage.setItem(storageKey, serialized);
    window.dispatchEvent(new CustomEvent(COLUMNS_CHANGED_EVENT, { detail: { storageKey } }));
  } catch {
    // ignore storage errors
  }
}

function equalKeys(left, right) {
  return left.length === right.length && left.every((key, index) => key === right[index]);
}

function uniqueKeys(keys) {
  return [...new Set(keys)];
}

export function useColumnVisibility(columns = [], key = "") {
  const storageKey = getStorageKey(key);
  const defaultStorageKey = getDefaultStorageKey(key);
  const knownStorageKey = getKnownStorageKey(key);
  const columnKeys = useMemo(() => columns.map((column) => column.key), [columns]);
  const columnMap = useMemo(() => new Map(columns.map((column) => [column.key, column])), [columns]);
  const defaultKeys = useMemo(
    () => columns.filter((column) => column.defaultVisible !== false).map((column) => column.key),
    [columns],
  );

  const [knownKeys, setKnownKeys] = useState(() => readStored(knownStorageKey) || []);

  const sanitize = useCallback((keys) => {
    const allowed = new Set(columnKeys);
    const selected = (Array.isArray(keys) ? keys : []).filter((columnKey) => allowed.has(columnKey));
    const resolved = uniqueKeys(selected);
    if (!resolved.length) return [...defaultKeys];
    return resolved;
  }, [columnKeys, defaultKeys]);

  const [visibleKeys, setVisibleKeys] = useState(() => {
    const defaultOverride = readStored(defaultStorageKey);
    if (Array.isArray(defaultOverride) && defaultOverride.length) return sanitize(defaultOverride);
    return sanitize(readStored(storageKey) || defaultKeys);
  });

  useEffect(() => {
    setVisibleKeys((current) => {
      const resolved = sanitize(current);
      return equalKeys(current, resolved) ? current : resolved;
    });
  }, [sanitize]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return undefined;
    persistStored(storageKey, visibleKeys);
    return undefined;
  }, [storageKey, visibleKeys]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return undefined;
    const handler = (event) => {
      const changedKey = event?.detail?.storageKey;
      if (changedKey && changedKey !== storageKey) return;
      const stored = readStored(storageKey);
      if (!stored) return;
      setVisibleKeys((current) => {
        const resolved = sanitize(stored);
        return equalKeys(current, resolved) ? current : resolved;
      });
    };
    window.addEventListener(COLUMNS_CHANGED_EVENT, handler);
    return () => window.removeEventListener(COLUMNS_CHANGED_EVENT, handler);
  }, [storageKey, sanitize]);

  useEffect(() => {
    if (!knownStorageKey || typeof window === "undefined") return;
    persistStored(knownStorageKey, knownKeys);
  }, [knownKeys, knownStorageKey]);

  useEffect(() => {
    if (!columnKeys.length) return;
    const known = new Set(knownKeys);
    const added = columnKeys.filter((columnKey) => !known.has(columnKey));
    if (!added.length) return;
    setKnownKeys(columnKeys);
    setVisibleKeys((current) => {
      const next = [...current];
      added.forEach((columnKey) => {
        if (columnMap.get(columnKey)?.defaultVisible === false) return;
        if (next.includes(columnKey)) return;
        const definitionIndex = columnKeys.indexOf(columnKey);
        let insertAt = next.length;
        for (let index = definitionIndex - 1; index >= 0; index -= 1) {
          const position = next.indexOf(columnKeys[index]);
          if (position >= 0) {
            insertAt = position + 1;
            break;
          }
        }
        next.splice(insertAt, 0, columnKey);
      });
      return equalKeys(current, next) ? current : next;
    });
  }, [columnKeys, columnMap, knownKeys]);

  const toggleColumn = useCallback((columnKey) => {
    setVisibleKeys((current) => {
      if (current.includes(columnKey)) {
        if (current.length === 1) return current;
        return current.filter((keyValue) => keyValue !== columnKey);
      }
      return [...current, columnKey];
    });
  }, []);

  const setColumnOrder = useCallback((nextKeys) => {
    const sanitized = sanitize(Array.isArray(nextKeys) ? nextKeys : visibleKeys);
    setVisibleKeys(sanitized);
  }, [sanitize, visibleKeys]);

  const moveColumn = useCallback((sourceKey, targetKey) => {
    if (!sourceKey || !targetKey || sourceKey === targetKey) return;
    setVisibleKeys((current) => {
      const indexSource = current.indexOf(sourceKey);
      const indexTarget = current.indexOf(targetKey);
      if (indexSource < 0 || indexTarget < 0) return current;
      const next = [...current];
      next.splice(indexSource, 1);
      next.splice(indexTarget, 0, sourceKey);
      return next;
    });
  }, []);

  const showAll = useCallback(() => {
    setVisibleKeys((current) => (equalKeys(current, columnKeys) ? current : columnKeys));
  }, [columnKeys]);

  const applyAsDefault = useCallback(() => {
    if (!defaultStorageKey || typeof window === "undefined") return;
    window.localStorage.setItem(defaultStorageKey, JSON.stringify(visibleKeys));
  }, [defaultStorageKey, visibleKeys]);

  const reset = useCallback(() => {
    clearStored(storageKey);
    setVisibleKeys((current) => {
      const appliedDefault = readStored(defaultStorageKey);
      const target = Array.isArray(appliedDefault) && appliedDefault.length ? sanitize(appliedDefault) : defaultKeys;
      return equalKeys(current, target) ? current : target;
    });
  }, [defaultKeys, defaultStorageKey, sanitize, storageKey]);

  const visibleSet = useMemo(() => new Set(visibleKeys), [visibleKeys]);

  const orderedColumns = useMemo(
    () => visibleKeys.map((key) => columnMap.get(key)).filter(Boolean),
    [columnMap, visibleKeys],
  );

  return { visibleKeys, visibleSet, orderedColumns, toggleColumn, setColumnOrder, moveColumn, showAll, applyAsDefault, reset };
}