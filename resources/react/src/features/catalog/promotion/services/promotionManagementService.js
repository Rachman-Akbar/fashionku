import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";
import { assetUrl } from "@/features/seller/store/services/sellerStoreService";
import { toAppPath } from "@/core/utils/url";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { useAuth } from "@/features/auth/context/AuthContext";
import { beginOptimisticEntityUpdate, mergeOptimisticValues, rollbackOptimisticEntityUpdate } from "@/shared/utils/optimisticQueryData";
import { publicQueryOptions } from "@/core/api/publicQueryOptions";


function booleanValue(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "yes", "on", "active", "approved"].includes(String(value).trim().toLowerCase());
}
export const promotionManagementKeys = {
  public: ["catalog", "promotions", "public"],
  admin: ["admin", "promotions"],
  seller: ["seller", "promotions"],
};

export function normalizePromotion(row = {}) {
  const action = row.click_action || "none";
  const targetId = row.target_id ? Number(row.target_id) : null;
  const rawHref = row.resolved_url || (action === "url" ? row.target_url : "/promotions") || "/promotions";
  const href = toAppPath(rawHref, "/promotions");

  return {
    id: Number(row.id || 0),
    storeId: row.store_id || row.storeId || row.store?.id ? Number(row.store_id || row.storeId || row.store?.id) : null,
    storeName: toTitleCase(row.store_name || ""),
    promotionPaymentId: row.promotion_payment_id ? Number(row.promotion_payment_id) : null,
    name: row.name || "",
    title: toTitleCase(row.name || "Promosi"),
    subtitle: row.store_name ? `Campaign dari ${toTitleCase(row.store_name)}` : "Campaign pilihan untuk buyer Ziip",
    badge: row.store_name ? "Promo Seller" : "Promo Pilihan",
    cta: "Lihat Promo",
    imageUrl: assetUrl(row.image_url || ""),
    mobileImageUrl: assetUrl(row.mobile_image_url || row.image_url || ""),
    clickAction: action,
    targetId,
    targetUrl: row.target_url || "",
    sortOrder: Number(row.sort_order || 0),
    isActive: booleanValue(row.is_active ?? row.isActive, true),
    approvalStatus: String(row.approval_status || row.approvalStatus || "approved").trim().toLowerCase(),
    rejectionReason: row.rejection_reason || "",
    submittedAt: row.submitted_at || null,
    approvedAt: row.approved_at || null,
    approvedBy: row.approved_by || null,
    href,
    raw: row,
  };
}

function serialize(values) {
  return {
    ...(values.storeId ? { store_id: Number(values.storeId) } : {}),
    ...(values.promotionPaymentId ? { promotion_payment_id: Number(values.promotionPaymentId) } : {}),
    name: values.name,
    image_url: values.imageUrl,
    mobile_image_url: values.mobileImageUrl || null,
    click_action: values.clickAction || "none",
    target_id: ["product", "category"].includes(values.clickAction) ? Number(values.targetId) || null : null,
    target_url: values.clickAction === "url" ? toAppPath(values.targetUrl || "", "") || null : null,
    sort_order: Number(values.sortOrder || 0),
    is_active: Boolean(values.isActive),
  };
}

async function list(url, params = {}) {
  const response = await apiClient.get(url, { params });
  return unwrapCollection(response.data).map(normalizePromotion);
}

async function create(url, values) {
  const response = await apiClient.post(url, serialize(values));
  return normalizePromotion(unwrapApiData(response.data));
}

async function update(url, id, values) {
  const response = await apiClient.put(`${url}/${id}`, serialize(values));
  return normalizePromotion(unwrapApiData(response.data));
}

async function remove(url, id) {
  return apiClient.delete(`${url}/${id}`);
}

export async function getPublicPromotions() {
  const rows = await list("/api/v1/catalog/promotions");
  return rows.filter((row) => row.isActive && row.approvalStatus === "approved");
}
export async function getAdminPromotions(params = {}) { return list("/api/v1/catalog/promotions/manage", params); }
export async function getSellerPromotions(params = {}) { return list("/api/v1/seller/promotions/manage", params); }
export async function createAdminPromotion(values) { return create("/api/v1/catalog/promotions", values); }
export async function updateAdminPromotion(id, values) { return update("/api/v1/catalog/promotions", id, values); }
export async function deleteAdminPromotion(id) { return remove("/api/v1/catalog/promotions", id); }
export async function createSellerPromotion(values) { return create("/api/v1/seller/promotions", values); }
export async function updateSellerPromotion(id, values) { return update("/api/v1/seller/promotions", id, values); }
export async function deleteSellerPromotion(id) { return remove("/api/v1/seller/promotions", id); }

export async function approvePromotion(id) {
  const response = await apiClient.patch(`/api/v1/catalog/promotions/${id}/approve`);
  return normalizePromotion(unwrapApiData(response.data));
}

export async function rejectPromotion({ id, reason }) {
  const response = await apiClient.patch(`/api/v1/catalog/promotions/${id}/reject`, { reason });
  return normalizePromotion(unwrapApiData(response.data));
}

export function usePublicPromotions() {
  return useQuery({
    queryKey: promotionManagementKeys.public,
    queryFn: getPublicPromotions,
    ...publicQueryOptions,
    retry: 1,
  });
}

export function useAdminPromotions(params = {}) {
  return useQuery({ queryKey: [...promotionManagementKeys.admin, params], queryFn: () => getAdminPromotions(params), staleTime: 30000, refetchOnMount: "always", });
}

export function useSellerPromotions(params = {}) {
  const { store, activeRole } = useAuth();
  const storeId = Number(store?.id || 0);
  const scopedParams = { ...params, ...(storeId ? { store_id: storeId } : {}) };

  return useQuery({
    queryKey: [...promotionManagementKeys.seller, scopedParams],
    queryFn: async () => {
      const rows = await getSellerPromotions(scopedParams);
      return storeId ? rows.filter((row) => row.storeId === storeId) : [];
    },
    enabled: Boolean(activeRole === "seller" && storeId),
    staleTime: 30000,
  });
}

function refreshPromotionQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: promotionManagementKeys.public });
  queryClient.invalidateQueries({ queryKey: promotionManagementKeys.admin });
  queryClient.invalidateQueries({ queryKey: promotionManagementKeys.seller });
  queryClient.invalidateQueries({ queryKey: ["storefront"] });
}

function usePromotionMutation(mutationFn, queryKey, optimistic = false) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onMutate: optimistic ? ({ id, values }) => beginOptimisticEntityUpdate(queryClient, queryKey, id, (row) => mergeOptimisticValues(row, values)) : undefined,
    onError: optimistic ? (_error, _variables, context) => rollbackOptimisticEntityUpdate(queryClient, context) : undefined,
    onSettled: () => refreshPromotionQueries(queryClient),
  });
}

export function useCreateAdminPromotion() { return usePromotionMutation(createAdminPromotion, promotionManagementKeys.admin); }
export function useUpdateAdminPromotion() { return usePromotionMutation(({ id, values }) => updateAdminPromotion(id, values), promotionManagementKeys.admin, true); }
export function useDeleteAdminPromotion() { return usePromotionMutation(deleteAdminPromotion, promotionManagementKeys.admin); }
export function useCreateSellerPromotion() { return usePromotionMutation(createSellerPromotion, promotionManagementKeys.seller); }
export function useUpdateSellerPromotion() { return usePromotionMutation(({ id, values }) => updateSellerPromotion(id, values), promotionManagementKeys.seller, true); }
export function useDeleteSellerPromotion() { return usePromotionMutation(deleteSellerPromotion, promotionManagementKeys.seller); }
export function useApprovePromotion() { return usePromotionMutation(approvePromotion, promotionManagementKeys.admin); }
export function useRejectPromotion() { return usePromotionMutation(rejectPromotion, promotionManagementKeys.admin); }
export function getPromotionError(error) { return getApiMessage(error, "Promosi gagal diproses."); }
