import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { invalidateCatalogQueries } from "@/features/catalog/application/cache/catalogQueryClient";

function normalizeCategory(row = {}) {
  return {
    id: Number(row.id || 0),
    catalogGroupId: Number(row.catalog_group_id || 0),
    catalogGroupName: row.catalog_group_name || "",
    parentId: row.parent_id ? Number(row.parent_id) : null,
    name: row.name || "",
    rawName: row.name || "",
    slug: row.slug || "",
    fullSlug: row.full_slug || "",
    level: Number(row.level || 1),
    depth: Math.max(0, Number(row.level || 1) - 1),
    isActive: Boolean(row.is_active ?? true),
  };
}

function normalizeCatalogGroup(row = {}) {
  return {
    id: Number(row.id || 0),
    name: row.name || "",
    slug: row.slug || "",
    isActive: Boolean(row.is_active ?? true),
  };
}


function normalizeProductAttribute(row = {}) {
  return {
    id: Number(row.id || 0),
    name: row.name || "",
    slug: row.slug || "",
    type: row.type || "text",
  };
}
export async function quickCreateCategory(name, options = {}) {
  const response = await apiClient.post("/api/v1/catalog/relations/categories/quick-create", {
    name,
    catalog_group_name: options.catalogGroupName || null,
    parent_category_name: options.parentCategoryName || null,
  });
  return normalizeCategory(unwrapApiData(response.data));
}

export async function quickCreateCatalogGroup(name) {
  const response = await apiClient.post("/api/v1/catalog/relations/catalog-groups/quick-create", { name });
  return normalizeCatalogGroup(unwrapApiData(response.data));
}


export async function quickCreateProductAttribute(name, type = "text") {
  const response = await apiClient.post("/api/v1/catalog/products/attributes", { name, type });
  return normalizeProductAttribute(unwrapApiData(response.data));
}
function invalidateRelations(queryClient) {
  invalidateCatalogQueries("categories");
  invalidateCatalogQueries("catalog-groups");
  queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "catalog-groups"] });
  queryClient.invalidateQueries({ queryKey: ["seller", "products", "categories"] });
  queryClient.invalidateQueries({ queryKey: ["catalog", "categories"] });
  queryClient.invalidateQueries({ queryKey: ["catalog", "catalog-groups"] });
}

export function useQuickCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, catalogGroupName, parentCategoryName }) => quickCreateCategory(name, { catalogGroupName, parentCategoryName }),
    onSuccess: () => invalidateRelations(queryClient),
  });
}

export function useQuickCreateCatalogGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quickCreateCatalogGroup,
    onSuccess: () => invalidateRelations(queryClient),
  });
}


export function useQuickCreateProductAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, type = "text" }) => quickCreateProductAttribute(name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "products", "attributes"] });
      queryClient.invalidateQueries({ queryKey: ["catalog", "product-attributes"] });
    },
  });
}
export function getRelationQuickCreateError(error) {
  return getApiMessage(error, "Data relasi gagal dibuat.");
}
