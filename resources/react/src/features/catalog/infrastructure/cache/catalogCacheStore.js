import { CATALOG_PERSIST_PREFIX } from "@/features/catalog/domain/cache/catalogCacheConfig";

const memoryStore = new Map();
const inFlightStore = new Map();

function now() {
  return Date.now();
}

function canUseStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}


function clearLegacyCatalogStorage() {
  if (!canUseStorage()) return;

  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith("kishamarket_catalog_cache_v2:")) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    return;
  }
}

clearLegacyCatalogStorage();

function storageKey(key) {
  return `${CATALOG_PERSIST_PREFIX}:${key}`;
}

function cloneValue(value) {
  if (value === undefined || value === null) return value;
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

function isFresh(entry) {
  return entry && Number(entry.expiresAt || 0) > now();
}

export function getCachedCatalogValue(key) {
  const memoryEntry = memoryStore.get(key);

  if (isFresh(memoryEntry)) {
    return cloneValue(memoryEntry.value);
  }

  if (memoryEntry) {
    memoryStore.delete(key);
  }

  if (!canUseStorage()) return undefined;

  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return undefined;

    const entry = JSON.parse(raw);

    if (!isFresh(entry)) {
      window.localStorage.removeItem(storageKey(key));
      return undefined;
    }

    memoryStore.set(key, entry);
    return cloneValue(entry.value);
  } catch {
    return undefined;
  }
}

export function setCachedCatalogValue(key, value, ttl, persist = false) {
  const entry = {
    value: cloneValue(value),
    expiresAt: now() + ttl,
  };

  memoryStore.set(key, entry);

  if (persist && canUseStorage()) {
    try {
      window.localStorage.setItem(storageKey(key), JSON.stringify(entry));
    } catch {
      return;
    }
  }
}

export function getCatalogInFlight(key) {
  return inFlightStore.get(key);
}

export function setCatalogInFlight(key, promise) {
  inFlightStore.set(key, promise);
  promise.then(
    () => inFlightStore.delete(key),
    () => inFlightStore.delete(key)
  );
  return promise;
}

export function clearCatalogCache(match = "") {
  Array.from(memoryStore.keys()).forEach((key) => {
    if (!match || key.includes(match)) memoryStore.delete(key);
  });

  Array.from(inFlightStore.keys()).forEach((key) => {
    if (!match || key.includes(match)) inFlightStore.delete(key);
  });

  if (!canUseStorage()) return;

  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (!key.startsWith(`${CATALOG_PERSIST_PREFIX}:`)) return;
      if (!match || key.includes(match)) window.localStorage.removeItem(key);
    });
  } catch {
    return;
  }
}
