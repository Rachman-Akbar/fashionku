import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getCategories } from "@/features/catalog/category/services/categoryService";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toBoolean } from "@/core/utils/boolean";
import { invalidateCatalogQueries } from "@/features/catalog/application/cache/catalogQueryClient";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { beginOptimisticEntityUpdate, mergeOptimisticValues, rollbackOptimisticEntityUpdate } from "@/shared/utils/optimisticQueryData";

export const sellerProductKeys = {
  all: ["seller", "products"],
  list: (params = {}) => ["seller", "products", "list", params],
  categories: ["seller", "products", "categories"],
  attributes: ["seller", "products", "attributes"],
};

function normalizeImage(image = {}) {
  return {
    id: image.id ?? image.url,
    url: resolveMediaUrl(image.url || image.image_url || ""),
    altText: image.alt_text || image.altText || "",
    isPrimary: Boolean(image.is_primary ?? image.isPrimary),
    sortOrder: Number(image.sort_order ?? image.sortOrder ?? 0),
  };
}

function normalizeVariant(variant = {}) {
  return {
    id: variant.id ? Number(variant.id) : null,
    sku: variant.sku || "",
    name: variant.name || "",
    price: Number(variant.price || 0),
    stock: Number(variant.stock || 0),
    poStock: Number(variant.po_stock ?? variant.poStock ?? 0),
    maxOrderQty: Number(
      variant.max_order_qty ?? variant.maxOrderQty ?? 0,
    ) || 999999,
    minStock: Number(variant.min_stock ?? variant.minStock ?? 0),
    isDefault: Boolean(variant.is_default ?? variant.isDefault),
    values: (variant.values || []).map((value) => ({
      attributeId: Number(value.attribute_id || value.attribute?.id || 0),
      attributeName: value.attribute?.name || "",
      value: value.value || "",
    })),
  };
}

export function normalizeSellerProduct(row = {}) {
  const variants = (row.variants || []).map(normalizeVariant);
  const images = (row.images || []).map(normalizeImage);
  const defaultVariant = variants.find((variant) => variant.isDefault) || variants[0] || {};
  const categoryIds = (row.category_ids || row.categories || [])
    .map((category) => Number(category?.id ?? category))
    .filter(Boolean);
  const stock = Number(row.stock ?? defaultVariant.stock ?? 0);
  const poStock = Number(row.po_stock ?? defaultVariant.poStock ?? 0);
  const maxOrderQty = Number(
    row.max_order_qty ?? row.maxOrderQty ?? defaultVariant.maxOrderQty ?? 0,
  ) || 999999;
  const minStock = Number(row.min_stock ?? row.minStock ?? defaultVariant.minStock ?? 0);

  return {
    id: Number(row.id || 0),
    storeId: Number(row.store_id || row.storeId || row.store?.id || 0),
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    brand: row.brand || "",
    categoryId: Number(row.primary_category_id || categoryIds[0] || 0),
    categoryIds,
    sku: row.sku || defaultVariant.sku || "",
    price: Number(row.price ?? defaultVariant.price ?? 0),
    stock,
    poStock,
    maxOrderQty,
    minStock,
    totalStock: stock + poStock,
    status: row.status || "draft",
    isActive: toBoolean(row.is_active, true),
    thumbnail: resolveMediaUrl(row.thumbnail || images.find((image) => image.isPrimary)?.url || images[0]?.url || ""),
    images,
    variants,
    mode: variants.length > 1 || variants.some((variant) => variant.values.length) ? "variant" : "simple",
    raw: row,
  };
}

function normalizePagination(payload) {
  const source = payload?.data?.data ?? payload?.data ?? payload ?? {};
  const rows = Array.isArray(source) ? source : Array.isArray(source.data) ? source.data : unwrapCollection(payload);

  return {
    rows: rows.map(normalizeSellerProduct),
    meta: payload?.meta || source?.meta || {
      current_page: source?.current_page || 1,
      last_page: source?.last_page || 1,
      per_page: source?.per_page || rows.length,
      total: source?.total || rows.length,
    },
  };
}

function serializeImage(image, index) {
  return {
    url: String(image.url || "").trim(),
    alt_text: String(image.altText || "").trim() || null,
    is_primary: index === 0,
    sort_order: index,
  };
}

function serializeVariant(variant, index) {
  return {
    ...(variant.id ? { id: Number(variant.id) } : {}),
    sku: String(variant.sku || "").trim(),
    name: String(variant.name || "").trim(),
    price: Number(variant.price || 0),
    stock: Number(variant.stock || 0),
    po_stock: Number(variant.poStock || 0),
    max_order_qty: Math.max(1, Number(variant.maxOrderQty || 999999)),
    min_stock: Math.max(0, Number(variant.minStock || 0)),
    is_default: index === 0,
    values: (variant.values || [])
      .filter((value) => Number(value.attributeId) && String(value.value || "").trim())
      .map((value) => ({
        attribute_id: Number(value.attributeId),
        value: String(value.value).trim(),
      })),
  };
}

export function serializeSellerProduct(values = {}, options = {}) {
  const images = (values.images || []).filter((image) => String(image.url || "").trim());
  const categoryId = Number(values.categoryId || 0) || null;
  const includeAdminFields = Boolean(options.includeAdminFields);
  const payload = {
    ...(includeAdminFields && values.storeId ? { store_id: Number(values.storeId) } : {}),
    name: String(values.name || "").trim(),
    description: String(values.description || "").trim() || null,
    brand: String(values.brand || "").trim() || null,
    primary_category_id: categoryId,
    category_ids: categoryId ? [categoryId] : [],
    thumbnail: String(values.thumbnail || images[0]?.url || "").trim() || null,
    ...(includeAdminFields ? { status: values.status || "draft" } : {}),
    is_active: Boolean(values.isActive),
    images: images.map(serializeImage),
  };

  if (values.mode === "variant") {
    payload.variants = (values.variants || []).map(serializeVariant);
  } else {
    payload.sku = String(values.sku || "").trim() || null;
    payload.price = Number(values.price || 0);
    payload.stock = Number(values.stock || 0);
    payload.po_stock = Number(values.poStock || 0);
    payload.max_order_qty = Math.max(1, Number(values.maxOrderQty || 999999));
    payload.min_stock = Math.max(0, Number(values.minStock || 0));
    payload.variants = [
      serializeVariant(
        {
          id: values.variants?.[0]?.id,
          sku: values.sku,
          name: values.name,
          price: values.price,
          stock: values.stock,
          poStock: values.poStock,
          maxOrderQty: values.maxOrderQty,
          minStock: values.minStock,
          isDefault: true,
          values: [],
        },
        0,
      ),
    ];
  }

  return payload;
}

function flattenCategories(rows = [], depth = 0, parentPath = [], result = []) {
  rows.forEach((row) => {
    const rawName = row.name || "Kategori";
    const pathNames = [...parentPath, rawName];
    result.push({
      id: Number(row.id || 0),
      name: rawName,
      rawName,
      depth,
      level: depth + 1,
      parentId: row.parent_id ? Number(row.parent_id) : null,
      parentName: parentPath[parentPath.length - 1] || "",
      pathNames,
      path: pathNames.join(" / "),
    });
    flattenCategories(row.children || [], depth + 1, pathNames, result);
  });
  return result;
}

export async function getSellerProducts(params = {}) {
  const response = await apiClient.get("/api/v1/catalog/seller/products", { params });
  return normalizePagination(response.data);
}

export async function createSellerProduct(values) {
  const response = await apiClient.post("/api/v1/catalog/seller/products", serializeSellerProduct(values));
  return normalizeSellerProduct(unwrapApiData(response.data));
}

export async function updateSellerProduct(id, values) {
  const response = await apiClient.put(`/api/v1/catalog/seller/products/${id}`, serializeSellerProduct(values));
  return normalizeSellerProduct(unwrapApiData(response.data));
}

export async function deleteSellerProduct(id) {
  const response = await apiClient.delete(`/api/v1/catalog/seller/products/${id}`);
  return response.data;
}

export async function getSellerProductCategories() {
  const result = await getCategories();
  return flattenCategories(result.data || []);
}

export async function getSellerProductAttributes() {
  const response = await apiClient.get("/api/v1/catalog/products/attributes");
  return unwrapCollection(response.data).map((attribute) => ({
    id: Number(attribute.id),
    name: attribute.name || "Atribut",
    type: attribute.type || "text",
  }));
}

export function useSellerProducts(params = {}) {
  const { isAuthenticated, activeRole, store } = useAuth();
  const storeId = Number(store?.id || 0);
  const scopedParams = { ...params, ...(storeId ? { store_id: storeId } : {}) };

  return useInfiniteList({
    queryKey: ["seller", "products", "list"],
    queryFn: async (queryParams) => {
      const result = await getSellerProducts(queryParams);
      return {
        ...result,
        rows: storeId ? result.rows.filter((row) => row.storeId === storeId) : [],
      };
    },
    params: scopedParams,
    enabled: Boolean(isAuthenticated && activeRole === "seller" && storeId),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSellerProductCategories(options = {}) {
  return useQuery({ queryKey: sellerProductKeys.categories, queryFn: getSellerProductCategories, staleTime: 30000, ...options });
}

export function useSellerProductAttributes(options = {}) {
  return useQuery({ queryKey: sellerProductKeys.attributes, queryFn: getSellerProductAttributes, staleTime: 30000, ...options });
}

function refreshSellerProductQueries(queryClient) {
  invalidateCatalogQueries("products");
  queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
  queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  queryClient.invalidateQueries({ queryKey: ["catalog", "products"] });
  queryClient.invalidateQueries({ queryKey: ["storefront"] });
  queryClient.invalidateQueries({ queryKey: ["order", "wishlist"] });
}

export function useCreateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSellerProduct,
    onSettled: () => refreshSellerProductQueries(queryClient),
  });
}

export function useUpdateSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateSellerProduct(id, values),
    onMutate: ({ id, values }) => beginOptimisticEntityUpdate(
      queryClient,
      sellerProductKeys.all,
      id,
      (row) => mergeOptimisticValues(row, values),
    ),
    onError: (_error, _variables, context) => rollbackOptimisticEntityUpdate(queryClient, context),
    onSettled: () => refreshSellerProductQueries(queryClient),
  });
}

export function useDeleteSellerProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSellerProduct,
    onSettled: () => refreshSellerProductQueries(queryClient),
  });
}

export function getSellerProductError(error) {
  return getApiMessage(error, "Produk gagal diproses.");
}
