import { useQuery } from "@tanstack/react-query";
import { publicQueryOptions, PUBLIC_QUERY_REFRESH_MS } from "@/core/api/publicQueryOptions";
import { apiClient, unwrapApiData, unwrapCollection } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export const voucherKeys = {
  active: (params = {}) => ["order", "vouchers", "active", params],
  checkout: () => ["order", "vouchers", "checkout"],
  mine: () => ["order", "vouchers", "mine"],
  preview: (params = {}) => ["order", "vouchers", "preview", params],
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

  return {
    id: Number(voucher.id),
    code: voucher.code || "",
    name: voucher.name || "Voucher",
    description: voucher.description || voucher.detail || voucher.subtitle || "",
    terms: voucher.terms || voucher.terms_and_conditions || voucher.termsAndConditions || voucher.conditions || "",
    image: voucher.image || "",
    imageUrl: resolveMediaUrl(voucher.imageUrl || voucher.image_url || voucher.image || ""),
    discountTarget: voucher.discountTarget || voucher.discount_target || "product",
    discountType: voucher.discountType || voucher.discount_type || "fixed",
    discountValue: toNumber(voucher.discountValue ?? voucher.discount_value),
    minSpend: toNumber(voucher.minSpend ?? voucher.min_spend),
    maxDiscount: maxDiscount === null || maxDiscount === undefined ? null : toNumber(maxDiscount),
    startsAt: voucher.startsAt || voucher.starts_at || null,
    endsAt: voucher.endsAt || voucher.ends_at || null,
    usageLimit: toNumber(voucher.usageLimit ?? voucher.usage_limit),
    usageLimitPerUser: toNumber(
      voucher.usageLimitPerUser ?? voucher.usage_limit_per_user,
    ),
    usedByUser: toNumber(voucher.usedByUser ?? voucher.used_by_user),
    usedCount: toNumber(voucher.usedCount ?? voucher.used_count),
    // Scope produk: kosong = voucher berlaku untuk semua produk.
    productIds: (Array.isArray(voucher.productIds)
      ? voucher.productIds
      : Array.isArray(voucher.product_ids)
        ? voucher.product_ids
        : []
    )
      .map((id) => toNumber(id))
      .filter((id) => id > 0),
    minItems: toNumber(voucher.minItems ?? voucher.min_items),
    minDistinctProducts: toNumber(
      voucher.minDistinctProducts ?? voucher.min_distinct_products,
    ),
    minSameProductQty: toNumber(
      voucher.minSameProductQty ?? voucher.min_same_product_qty,
    ),
    isActive: toBoolean(voucher.isActive ?? voucher.is_active, true),
    status: voucher.status || "active",
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
    refetchInterval: false,
    ...options,
  });
}

export function useCheckoutVouchers(options = {}) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: voucherKeys.checkout(),
    queryFn: () => getActiveVouchers(),
    enabled: Boolean(enabled),
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

/**
 * Preview kelayakan voucher yang DIHITUNG OLEH BACKEND (tanggal berlaku,
 * kuota global, kuota per user, scope produk, minimal belanja/item).
 * Frontend hanya menampilkan hasilnya — aturan tidak pernah ditentukan di sini.
 */
export async function previewCheckoutVoucher({
  voucherCode,
  items = [],
  shippingCost = 0,
}) {
  const response = await apiClient.post("/api/v1/order/vouchers/preview", {
    voucher_code: String(voucherCode || "").trim(),
    shipping_cost: Number(shippingCost || 0),
    items: items.map((item) => ({
      product_id: Number(item.productId ?? item.product_id ?? 0) || null,
      price: Number(item.price || 0),
      quantity: Math.max(1, Number(item.quantity || 1)),
    })),
  });
  const source = unwrapApiData(response.data) || {};

  return {
    valid: Boolean(source.valid),
    reason: String(source.reason || ""),
    productDiscount: Number(source.product_discount || 0),
    shippingDiscount: Number(source.shipping_discount || 0),
    eligibleSubtotal: Number(source.eligible_subtotal || 0),
    voucher: source.voucher || null,
  };
}

export function useVoucherPreview({
  enabled = false,
  voucherCode = "",
  items = [],
  shippingCost = 0,
}) {
  const code = String(voucherCode || "").trim().toUpperCase();
  const signature = items
    .map(
      (item) =>
        `${item.productId ?? item.product_id ?? 0}:${item.price}:${item.quantity}`,
    )
    .join("|");

  return useQuery({
    queryKey: voucherKeys.preview({
      code,
      signature,
      shippingCost: Number(shippingCost || 0),
    }),
    queryFn: () =>
      previewCheckoutVoucher({
        voucherCode: code,
        items,
        shippingCost,
      }),
    enabled: Boolean(enabled && code && items.length),
    staleTime: 15000,
    retry: false,
  });
}
