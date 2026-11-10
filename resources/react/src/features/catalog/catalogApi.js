import { apiClient } from "@/core/utils/apiClient";

const CATALOG_API_PREFIX = "/api/v1/catalog";

export function buildCatalogUrl(path, params = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") query.append(key, item);
      });
      return;
    }
    query.set(key, value);
  });

  const qs = query.toString();
  return `${CATALOG_API_PREFIX}${cleanPath}${qs ? `${cleanPath.includes("?") ? "&" : "?"}${qs}` : ""}`;
}

export async function catalogRequest(path, options = {}) {
  const {
    params,
    method = "GET",
    body,
    headers,
    signal,
  } = options;
  const normalizedMethod = String(method).toUpperCase();
  const url = buildCatalogUrl(path, params);
  const response = await apiClient.request({
    url,
    method: normalizedMethod,
    data: body,
    headers,
    signal,
  });

  return response.data;
}

export function unwrapData(payload) {
  if (payload?.data !== undefined) return payload.data;
  return payload;
}

export function unwrapCollection(payload) {
  const data = unwrapData(payload);
  if (Array.isArray(data)) return { items: data, meta: payload?.meta || null };
  if (Array.isArray(data?.data)) return { items: data.data, meta: data.meta || payload?.meta || data };
  if (Array.isArray(data?.items)) return { items: data.items, meta: data.meta || payload?.meta || data };
  if (Array.isArray(payload?.items)) return { items: payload.items, meta: payload.meta || payload };
  if (Array.isArray(payload)) return { items: payload, meta: null };
  return { items: [], meta: data || payload || null };
}

export function safeArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}
