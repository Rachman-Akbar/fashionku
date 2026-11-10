import { clearCatalogCache } from "@/features/catalog/infrastructure/cache/catalogCacheStore";

export function buildCatalogCacheKey(method, url) {
  return `${String(method || "GET").toUpperCase()}:${url}`;
}

export async function runCatalogQuery(_key, loader) {
  return loader();
}

export function invalidateCatalogQueries(match = "") {
  clearCatalogCache(match);
}
