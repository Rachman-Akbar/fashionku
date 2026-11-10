import { useQuery } from "@tanstack/react-query";
import { publicQueryOptions, PUBLIC_QUERY_REFRESH_MS } from "@/core/api/publicQueryOptions";
import { apiClient, unwrapCollection } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export const voucherKeys = {
  active: (params = {}) => ["order", "vouchers", "active", params],
  checkout: (storeIds = []) => ["order", "vouchers", "checkout", [...storeIds].map(String).sort()],
  mine: () => ["order", "vouchers", "mine"],
};

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return ["1", "true", "yes", "on", "active"].includes(String(value).trim().toLowerCase());
}

export function normalizeVoucher(voucher = {}) {
  const maxDiscount = voucher.maxDiscount ?? voucher.max_discount;
  const storeId = voucher.storeId ?? voucher.store_id ?? null;

  return {
    id: Number(voucher.id),
    code: voucher.code || "",
    name: voucher.name || "Voucher",
    description: voucher.description || voucher.detail || voucher.subtitle || "",
    terms: voucher.terms || voucher.terms_and_conditions || voucher.termsAndConditions || voucher.conditions || "",
    image: voucher.image || "",
    imageUrl: resolveMediaUrl(voucher.imageUrl || voucher.image_url || voucher.image || ""),
    voucherScope: voucher.voucherScope || voucher.voucher_scope || (storeId ? "store" : "platform"),
    discountTarget: voucher.discountTarget || voucher.discount_target || "product",
    discountType: voucher.discountType || voucher.discount_type || "fixed",
    discountValue: toNumber(voucher.discountValue ?? voucher.discount_value),
    minSpend: toNumber(voucher.minSpend ?? voucher.min_spend),
    maxDiscount: maxDiscount === null || maxDiscount === undefined ? null : toNumber(maxDiscount),
    startsAt: voucher.startsAt || voucher.starts_at || null,
    endsAt: voucher.endsAt || voucher.ends_at || null,
    usageLimit: toNumber(voucher.usageLimit ?? voucher.usage_limit),
    usedCount: toNumber(voucher.usedCount ?? voucher.used_count),
    storeId,
    storeName: voucher.storeName || voucher.store_name || voucher.store?.name || "",
    isActive: toBoolean(voucher.isActive ?? voucher.is_active, true),
    status: voucher.status || "active",
    approvalStatus: voucher.approvalStatus || voucher.approval_status || "approved",
    isMissionReward: toBoolean(voucher.isMissionReward ?? voucher.is_mission_reward, false),
    isOwned: toBoolean(voucher.isOwned ?? voucher.is_owned, true),
    isLocked: toBoolean(voucher.isLocked ?? voucher.is_locked, false),
    createdAt: voucher.createdAt || voucher.created_at || null,
  };
}

export async function getActiveVouchers(params = {}) {
  const response = await apiClient.get("/api/v1/order/vouchers", { params: { is_active: 1, ...params } });
  return unwrapCollection(response.data).map(normalizeVoucher);
}

export function useActiveVouchers(options = {}) {
  return useQuery({
    queryKey: voucherKeys.active(),
    queryFn: () => getActiveVouchers(),
    ...publicQueryOptions,
    refetchInterval: PUBLIC_QUERY_REFRESH_MS,
    ...options,
  });
}

export function useCheckoutVouchers(storeIds = [], options = {}) {
  const normalizedStoreIds = [...new Set(storeIds.map(String).filter(Boolean))];
  const { enabled = true, ...queryOptions } = options;
  const params = normalizedStoreIds.length === 1
    ? { store_id: normalizedStoreIds[0] }
    : normalizedStoreIds.length > 1
      ? { store_ids: normalizedStoreIds.join(",") }
      : {};

  return useQuery({
    queryKey: voucherKeys.checkout(normalizedStoreIds),
    queryFn: () => getActiveVouchers(params),
    enabled: Boolean(enabled && normalizedStoreIds.length > 0),
    ...publicQueryOptions,
    ...queryOptions,
  });
}

export function normalizeMyVoucher(item = {}) {
  const voucher = normalizeVoucher(item.voucher || {});
  return {
    ...voucher,
    id: Number(item.id),
    userVoucherStatus: item.status || "available",
    claimedAt: item.claimedAt || item.claimed_at || null,
    usedAt: item.usedAt || item.used_at || null,
    sourceType: item.sourceType || item.source_type || null,
    sourceId: item.sourceId || item.source_id || null,
  };
}

export async function getMyVouchers() {
  const response = await apiClient.get("/api/v1/order/vouchers/mine");
  return unwrapCollection(response.data).map(normalizeMyVoucher);
}

export function useMyVouchers(options = {}) {
  return useQuery({
    queryKey: voucherKeys.mine(),
    queryFn: () => getMyVouchers(),
    ...options,
  });
}
