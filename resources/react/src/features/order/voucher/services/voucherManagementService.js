import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";
import { toSqlDateTime } from "@/core/utils/dateTime";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toBoolean } from "@/core/utils/boolean";
import { beginOptimisticEntityUpdate, mergeOptimisticValues, rollbackOptimisticEntityUpdate } from "@/shared/utils/optimisticQueryData";

export const voucherManagementKeys = {
  admin: ["admin", "vouchers"],
  seller: ["seller", "vouchers"],
};

export function normalizeVoucher(row = {}) {
  return {
    id: Number(row.id || 0),
    code: row.code || "",
    name: row.name || "",
    image: row.image || "",
    imageUrl: resolveMediaUrl(row.imageUrl || row.image_url || row.image || ""),
    voucherScope: row.voucherScope || row.voucher_scope || (row.storeId || row.store_id ? "store" : "platform"),
    discountTarget: row.discountTarget || row.discount_target || "product",
    discountType: row.discountType || row.discount_type || "fixed",
    discountValue: Number(row.discountValue ?? row.discount_value ?? 0),
    minSpend: Number(row.minSpend ?? row.min_spend ?? 0),
    minItems: row.minItems ?? row.min_items ?? "",
    minDistinctProducts: row.minDistinctProducts ?? row.min_distinct_products ?? "",
    terms: row.terms ?? "",
    maxDiscount: row.maxDiscount ?? row.max_discount ?? "",
    startsAt: row.startsAt || row.starts_at || "",
    endsAt: row.endsAt || row.ends_at || "",
    usageLimit: Number(row.usageLimit ?? row.usage_limit ?? 0),
    usedCount: Number(row.usedCount ?? row.used_count ?? 0),
    storeId: row.storeId ?? row.store_id ?? row.store?.id ?? null,
    storeName: row.storeName || row.store_name || row.store?.name || "",
    isActive: toBoolean(row.isActive ?? row.is_active, true),
    createdAt: row.createdAt || row.created_at || null,
    raw: row,
  };
}

function serialize(values) {
  const formData = new FormData();
  const entries = {
    code: String(values.code || "").trim(),
    name: String(values.name || "").trim(),
    discount_target: values.discountTarget || "product",
    discount_type: values.discountType || "fixed",
    discount_value: Number(values.discountValue || 0),
    min_spend: Number(values.minSpend || 0),
    min_items: values.minItems === "" ? "" : Number(values.minItems || 0),
    min_distinct_products: values.minDistinctProducts === "" ? "" : Number(values.minDistinctProducts || 0),
    terms: String(values.terms || "").trim(),
    max_discount: values.maxDiscount === "" ? "" : Number(values.maxDiscount || 0),
    starts_at: toSqlDateTime(values.startsAt),
    ends_at: toSqlDateTime(values.endsAt),
    usage_limit: Number(values.usageLimit || 0),
    is_active: values.isActive ? 1 : 0,
  };

  Object.entries(entries).forEach(([key, value]) => formData.append(key, String(value)));
  if (values.imageFile) formData.append("image", values.imageFile);
  return formData;
}

function endpoints(portal) {
  if (portal === "seller") {
    return {
      list: "/api/v1/order/vouchers/seller/manage/list",
      create: "/api/v1/order/vouchers/seller",
      item: (id) => `/api/v1/order/vouchers/seller/${id}`,
    };
  }

  return {
    list: "/api/v1/order/vouchers/admin/manage/list",
    create: "/api/v1/order/vouchers/admin",
    item: (id) => `/api/v1/order/vouchers/admin/${id}`,
  };
}

export async function getManagedVouchers(portal, params = {}) {
  const response = await apiClient.get(endpoints(portal).list, { params });
  return unwrapCollection(response.data).map(normalizeVoucher);
}

export async function createVoucher(portal, values) {
  const response = await apiClient.post(endpoints(portal).create, serialize(values));
  return normalizeVoucher(unwrapApiData(response.data));
}

export async function updateVoucher(portal, id, values) {
  const formData = serialize(values);
  formData.append("_method", "PUT");
  const response = await apiClient.post(endpoints(portal).item(id), formData);
  return normalizeVoucher(unwrapApiData(response.data));
}

export async function deleteVoucher(portal, id) {
  return apiClient.delete(endpoints(portal).item(id));
}

function refreshVoucherQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: voucherManagementKeys.admin });
  queryClient.invalidateQueries({ queryKey: voucherManagementKeys.seller });
  queryClient.invalidateQueries({ queryKey: ["order", "vouchers"] });
}

export function useManagedVouchers(portal, params = {}) {
  return useQuery({
    queryKey: [...voucherManagementKeys[portal], params],
    queryFn: () => getManagedVouchers(portal, params),
    staleTime: 30000,
  });
}

export function useCreateVoucher(portal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => createVoucher(portal, values),
    onSettled: () => refreshVoucherQueries(queryClient),
  });
}

export function useUpdateVoucher(portal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => updateVoucher(portal, id, values),
    onMutate: ({ id, values }) => beginOptimisticEntityUpdate(
      queryClient,
      voucherManagementKeys[portal],
      id,
      (row) => mergeOptimisticValues(row, values),
    ),
    onError: (_error, _variables, context) => rollbackOptimisticEntityUpdate(queryClient, context),
    onSettled: () => refreshVoucherQueries(queryClient),
  });
}

export function useDeleteVoucher(portal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVoucher(portal, id),
    onSettled: () => refreshVoucherQueries(queryClient),
  });
}

export function getVoucherManagementError(error) {
  return getApiMessage(error, "Voucher gagal diproses.");
}
