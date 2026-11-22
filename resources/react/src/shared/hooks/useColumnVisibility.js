import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function getOrderStorageKey(key) {
  return key ? `ziip:table-columns-order:${key}` : "";
}

function getDefaultOrderStorageKey(key) {
  return key ? `ziip:table-columns-order-default:${key}` : "";
}

function readStored(storageKey) {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return Array.isArray(parsed) ? parsed.map(String) : null;
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

/**
 * Urutan kanonik (semua kolom, tampil maupun disembunyikan).
 *
 * Urutan ini dipakai bersama oleh tabel dan dropdown "Pilih kolom" sehingga
 * posisi baris di dropdown tidak pernah berpindah saat kolom dicentang atau
 * dilepas. Key yang tidak dikenal dibuang, key baru ditaruh di akhir supaya
 * panjangnya selalu sama dengan daftar kolom.
 */
function sanitizeOrder(order, columnKeys) {
  const allowed = new Set(columnKeys);
  const seen = new Set();
  const resolved = [];
  (Array.isArray(order) ? order : []).forEach((key) => {
    const value = String(key);
    if (!allowed.has(value) || seen.has(value)) return;
    seen.add(value);
    resolved.push(value);
  });
  columnKeys.forEach((key) => {
    if (!seen.has(key)) resolved.push(key);
  });
  return resolved;
}

/**
 * Tempelkan urutan kolom yang tampil (`visibleOrder`) ke urutan kanonik tanpa
 * memindahkan kolom yang sedang disembunyikan: slot milik kolom tampil diisi
 * ulang sesuai urutan baru, kolom tersembunyi tetap di posisinya.
 */
function mergeVisibleOrder(baseOrder, visibleOrder) {
  const visible = uniqueKeys((Array.isArray(visibleOrder) ? visibleOrder : []).map(String));
  const visibleSet = new Set(visible);
  const queue = [...visible];
  const merged = [];
  baseOrder.forEach((key) => {
    if (visibleSet.has(key)) {
      const next = queue.shift();
      if (next !== undefined) merged.push(next);
      return;
    }
    merged.push(key);
  });
  queue.forEach((key) => merged.push(key));
  return uniqueKeys(merged);
}

export function useColumnVisibility(columns = [], key = "") {
  const storageKey = getStorageKey(key);
  const defaultStorageKey = getDefaultStorageKey(key);
  const knownStorageKey = getKnownStorageKey(key);
  const orderStorageKey = getOrderStorageKey(key);
  const defaultOrderStorageKey = getDefaultOrderStorageKey(key);
  const columnKeys = useMemo(() => columns.map((column) => String(column.key)), [columns]);
  const columnMap = useMemo(() => new Map(columns.map((column) => [String(column.key), column])), [columns]);
  const defaultKeys = useMemo(
    () => columns.filter((column) => column.defaultVisible !== false).map((column) => String(column.key)),
    [columns],
  );

  const [knownKeys, setKnownKeys] = useState(() => readStored(knownStorageKey) || []);

  const sanitize = useCallback((keys) => {
    const allowed = new Set(columnKeys);
    const selected = (Array.isArray(keys) ? keys : []).map(String).filter((columnKey) => allowed.has(columnKey));
    const resolved = uniqueKeys(selected);
    if (!resolved.length) return [...defaultKeys];
    return resolved;
  }, [columnKeys, defaultKeys]);

  // Urutan tampil + urutan kanonik dihitung sekali saat mount, lalu disimpan
  // terpisah: `ziip:table-columns:<key>` (kolom tampil) dan
  // `ziip:table-columns-order:<key>` (urutan semua kolom).
  const initialRef = useRef(null);
  if (!initialRef.current) {
    const defaultOverride = readStored(defaultStorageKey);
    const storedVisible = Array.isArray(defaultOverride) && defaultOverride.length ? defaultOverride : (readStored(storageKey) || defaultKeys);
    const visibleInit = sanitize(storedVisible);
    const defaultOrder = readStored(defaultOrderStorageKey);
    const storedOrder = readStored(orderStorageKey);
    // Urutan kanonik yang tersimpan dipakai apa adanya (jangan ditimpa urutan
    // kolom tampil, kalau tidak hasil drag & drop hilang saat halaman dimuat).
    const sourceOrder = storedOrder?.length ? storedOrder : (defaultOrder?.length ? defaultOrder : columnKeys);
    initialRef.current = {
      visibleKeys: visibleInit,
      fullOrder: sanitizeOrder(sourceOrder, columnKeys),
    };
  }

  const [visibleKeys, setVisibleKeys] = useState(initialRef.current.visibleKeys);
  const [fullOrder, setFullOrder] = useState(initialRef.current.fullOrder);

  // Kolom tampil selalu mengikuti urutan kanonik.
  const orderVisible = useCallback((keys, order) => {
    const set = new Set(keys);
    const ordered = order.filter((columnKey) => set.has(columnKey));
    return ordered.length === keys.length ? ordered : keys;
  }, []);

  useEffect(() => {
    setFullOrder((current) => {
      const resolved = sanitizeOrder(current, columnKeys);
      return equalKeys(current, resolved) ? current : resolved;
    });
  }, [columnKeys]);

  // Urutan berubah (drag & drop) → urutan kolom tampil ikut menyesuaikan.
  useEffect(() => {
    setVisibleKeys((current) => {
      const resolved = orderVisible(current, fullOrder);
      return equalKeys(current, resolved) ? current : resolved;
    });
  }, [fullOrder, orderVisible]);

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
    if (!orderStorageKey || typeof window === "undefined") return undefined;
    persistStored(orderStorageKey, fullOrder);
    return undefined;
  }, [orderStorageKey, fullOrder]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return undefined;
    const handler = (event) => {
      const changedKey = event?.detail?.storageKey;
      if (changedKey && changedKey !== storageKey && changedKey !== orderStorageKey) return;
      // Hanya baca ulang penyimpanan yang benar-benar berubah, supaya event
      // milik urutan tidak menimpa perubahan urutan kolom tampil (dan sebaliknya).
      if (!changedKey || changedKey === orderStorageKey) {
        const storedOrder = readStored(orderStorageKey);
        if (storedOrder?.length) {
          setFullOrder((current) => {
            const resolved = sanitizeOrder(storedOrder, columnKeys);
            return equalKeys(current, resolved) ? current : resolved;
          });
        }
      }
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
  }, [columnKeys, orderStorageKey, sanitize, storageKey]);

  useEffect(() => {
    if (!knownStorageKey || typeof window === "undefined") return;
    persistStored(knownStorageKey, knownKeys);
  }, [knownKeys, knownStorageKey]);

  // Kolom baru (mis. kolom dinamis dari API) disisipkan dekat tetangganya
  // sesuai urutan definisi, bukan selalu di akhir.
  useEffect(() => {
    if (!columnKeys.length) return;
    const known = new Set(knownKeys);
    const added = columnKeys.filter((columnKey) => !known.has(columnKey));
    if (!added.length) return;
    setKnownKeys(columnKeys);
    setFullOrder((current) => {
      const next = [...current];
      added.forEach((columnKey) => {
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
    setVisibleKeys((current) => {
      const next = [...current];
      added.forEach((columnKey) => {
        if (columnMap.get(columnKey)?.defaultVisible === false) return;
        if (next.includes(columnKey)) return;
        next.push(columnKey);
      });
      return equalKeys(current, next) ? current : next;
    });
  }, [columnKeys, columnMap, knownKeys]);

  const toggleColumn = useCallback((columnKey) => {
    const target = String(columnKey);
    setVisibleKeys((current) => {
      if (current.includes(target)) {
        if (current.length === 1) return current;
        return current.filter((keyValue) => keyValue !== target);
      }
      // Disisipkan pada posisi kanoniknya supaya urutan tabel/dropdown stabil.
      const nextSet = new Set([...current, target]);
      const ordered = fullOrder.filter((keyValue) => nextSet.has(keyValue));
      return ordered.length === nextSet.size ? ordered : [...current, target];
    });
  }, [fullOrder]);

  const setColumnOrder = useCallback((nextKeys) => {
    const sanitized = sanitize(Array.isArray(nextKeys) ? nextKeys : visibleKeys);
    setFullOrder((current) => {
      const merged = mergeVisibleOrder(current, sanitized);
      return equalKeys(current, merged) ? current : merged;
    });
    setVisibleKeys(sanitized);
  }, [sanitize, visibleKeys]);

  /**
   * Pindahkan satu kolom (boleh kolom yang sedang disembunyikan) ke posisi
   * kolom lain. Dipakai drag & drop di dropdown "Pilih kolom" maupun di header
   * tabel, sehingga keduanya selalu memakai urutan yang sama.
   */
  const moveColumn = useCallback((sourceKey, targetKey) => {
    const source = String(sourceKey || "");
    const target = String(targetKey || "");
    if (!source || !target || source === target) return;
    setFullOrder((current) => {
      if (!current.includes(source)) return current;
      const next = [...current];
      next.splice(next.indexOf(source), 1);
      const targetIndex = next.indexOf(target);
      if (targetIndex < 0) next.push(source);
      else next.splice(targetIndex, 0, source);
      return equalKeys(current, next) ? current : next;
    });
  }, []);

  /** Sinkronkan urutan kolom tampil (mis. hasil drag header tabel) ke kanonik. */
  const syncVisibleOrder = useCallback((nextVisibleKeys) => {
    const visible = uniqueKeys((Array.isArray(nextVisibleKeys) ? nextVisibleKeys : []).map(String));
    if (!visible.length) return;
    setFullOrder((current) => {
      const merged = mergeVisibleOrder(current, visible);
      return equalKeys(current, merged) ? current : merged;
    });
  }, []);

  const showAll = useCallback(() => {
    setVisibleKeys((current) => {
      const next = fullOrder.filter((columnKey) => columnMap.has(columnKey));
      return equalKeys(current, next) ? current : next;
    });
  }, [columnMap, fullOrder]);

  const applyAsDefault = useCallback(() => {
    if (!defaultStorageKey || typeof window === "undefined") return;
    window.localStorage.setItem(defaultStorageKey, JSON.stringify(visibleKeys));
    if (defaultOrderStorageKey) window.localStorage.setItem(defaultOrderStorageKey, JSON.stringify(fullOrder));
  }, [defaultOrderStorageKey, defaultStorageKey, fullOrder, visibleKeys]);

  const reset = useCallback(() => {
    clearStored(storageKey);
    clearStored(orderStorageKey);
    const appliedOrder = readStored(defaultOrderStorageKey);
    const nextOrder = appliedOrder?.length ? sanitizeOrder(appliedOrder, columnKeys) : [...columnKeys];
    setFullOrder(nextOrder);
    setVisibleKeys((current) => {
      const appliedDefault = readStored(defaultStorageKey);
      const target = appliedDefault?.length ? orderVisible(sanitize(appliedDefault), nextOrder) : orderVisible(defaultKeys, nextOrder);
      return equalKeys(current, target) ? current : target;
    });
  }, [columnKeys, defaultOrderStorageKey, defaultKeys, orderStorageKey, orderVisible, sanitize, storageKey]);

  const visibleSet = useMemo(() => new Set(visibleKeys), [visibleKeys]);

  const orderedColumns = useMemo(
    () => visibleKeys.map((columnKey) => columnMap.get(columnKey)).filter(Boolean),
    [columnMap, visibleKeys],
  );

  // Semua kolom dalam urutan kanonik — dipakai dropdown "Pilih kolom" supaya
  // posisi barisnya sama dengan posisi kolom yang tampil di tabel.
  const allColumns = useMemo(
    () => fullOrder.map((columnKey) => columnMap.get(columnKey)).filter(Boolean),
    [columnMap, fullOrder],
  );

  return {
    visibleKeys,
    visibleSet,
    orderedColumns,
    allColumns,
    allColumnKeys: fullOrder,
    toggleColumn,
    setColumnOrder,
    moveColumn,
    syncVisibleOrder,
    showAll,
    applyAsDefault,
    reset,
  };
}
