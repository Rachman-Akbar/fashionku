import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toBoolean } from "@/core/utils/boolean";
import { useAuth } from "@/features/auth/context/AuthContext";
import { beginOptimisticEntityUpdate, mergeOptimisticValues, rollbackOptimisticEntityUpdate } from "@/shared/utils/optimisticQueryData";

export const sellerBannerKeys = { all: ["seller", "banners"] };

function normalizeBanner(row = {}) {
  return {
    id: Number(row.id || 0),
    storeId: Number(row.store_id || row.storeId || row.store?.id || 0),
    name: row.name || "",
    imageUrl: resolveMediaUrl(row.image_url || row.imageUrl || ""),
    sortOrder: Number(row.sort_order || 0),
    isActive: toBoolean(row.is_active, true),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    raw: row,
  };
}

function serialize(values) {
  return { name: values.name, image_url: values.imageUrl, sort_order: Number(values.sortOrder || 0), is_active: Boolean(values.isActive) };
}

export async function getSellerBanners() {
  const response = await apiClient.get("/api/v1/catalog/banners/manage");
  return unwrapCollection(response.data).map(normalizeBanner);
}

export async function createSellerBanner(values) {
  const response = await apiClient.post("/api/v1/catalog/banners", serialize(values));
  return normalizeBanner(unwrapApiData(response.data));
}

export async function updateSellerBanner(id, values) {
  const response = await apiClient.put(`/api/v1/catalog/banners/${id}`, serialize(values));
  return normalizeBanner(unwrapApiData(response.data));
}

export async function deleteSellerBanner(id) {
  return apiClient.delete(`/api/v1/catalog/banners/${id}`);
}

function refreshBannerQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: sellerBannerKeys.all });
  queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
  queryClient.invalidateQueries({ queryKey: ["storefront"] });
}

export function useSellerBanners() {
  const { store, activeRole } = useAuth();
  const storeId = Number(store?.id || 0);
  return useQuery({
    queryKey: [...sellerBannerKeys.all, storeId],
    queryFn: async () => {
      const rows = await getSellerBanners();
      return storeId ? rows.filter((row) => row.storeId === storeId) : [];
    },
    enabled: Boolean(activeRole === "seller" && storeId),
    staleTime: 30000,
  });
}

export function useCreateSellerBanner() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createSellerBanner, onSettled: () => refreshBannerQueries(queryClient) });
}

export function useUpdateSellerBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateSellerBanner(id, values),
    onMutate: ({ id, values }) => beginOptimisticEntityUpdate(queryClient, sellerBannerKeys.all, id, (row) => mergeOptimisticValues(row, values)),
    onError: (_error, _variables, context) => rollbackOptimisticEntityUpdate(queryClient, context),
    onSettled: () => refreshBannerQueries(queryClient),
  });
}

export function useDeleteSellerBanner() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteSellerBanner, onSettled: () => refreshBannerQueries(queryClient) });
}

export function getSellerBannerError(error) {
  return getApiMessage(error, "Banner gagal diproses.");
}
