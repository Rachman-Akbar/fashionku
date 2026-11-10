import { useQuery } from "@tanstack/react-query";
import { publicQueryOptions } from "@/core/api/publicQueryOptions";
import { catalogRequest, unwrapCollection, unwrapData } from "@/features/catalog/catalogApi";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBoolean(value, fallback = true) {
  if (value === undefined || value === null) return fallback;
  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;
  return Boolean(value);
}

export function normalizeCatalogGroup(group = {}) {
  const id = group.id ?? group.catalog_group_id ?? group.catalogGroupId ?? null;
  const name = group.name || group.title || group.nama || "Catalog Group";
  const slug = group.slug || slugify(name);
  const key = String(id ?? slug);

  return {
    id,
    key,
    name,
    slug,
    sort_order: Number(group.sort_order ?? group.sortOrder ?? 0),
    is_active: normalizeBoolean(group.is_active ?? group.isActive, true),
    categories: Array.isArray(group.categories) ? group.categories : [],
    raw: group,
  };
}

export async function getCatalogGroups(params = {}) {
  const payload = await catalogRequest("/catalog-groups", { params });
  const { items } = unwrapCollection(payload);

  return {
    data: Array.isArray(items) ? items.map(normalizeCatalogGroup) : [],
    meta: null,
    raw: payload,
  };
}

export async function getCatalogGroupById(id) {
  const payload = await catalogRequest(`/catalog-groups/${id}`);
  return normalizeCatalogGroup(unwrapData(payload));
}

export async function getCatalogGroupBySlug(slug) {
  const payload = await catalogRequest(`/catalog-groups/slug/${encodeURIComponent(slug)}`);
  return normalizeCatalogGroup(unwrapData(payload));
}

export const catalogGroupKeys = {
  list: (params = {}) => ["catalog", "catalog-groups", params],
};

export function useCatalogGroups(params = {}, options = {}) {
  return useQuery({
    queryKey: catalogGroupKeys.list(params),
    queryFn: () => getCatalogGroups(params),
    ...publicQueryOptions,
    ...options,
  });
}
