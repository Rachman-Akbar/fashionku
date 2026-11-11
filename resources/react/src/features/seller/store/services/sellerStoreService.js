import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  getApiMessage,
  unwrapApiData,
} from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toBoolean } from "@/core/utils/boolean";
import {
  addressKeys,
  createAddress,
  getAddresses,
  updateAddress,
} from "@/features/profile/address/addressService";

export const sellerStoreKeys = {
  all: ["seller", "stores"],
  detail: () => ["seller", "stores", "detail"],
  address: () => ["order", "addresses", "store"],
};

export function normalizeStore(row = {}) {
  const detail = row.detail || {};

  return {
    id: Number(row.id || 0),
    userId: String(row.user_id || row.userId || ""),
    name: row.name || row.store_name || "",
    slug: row.slug || "",
    description: row.description || "",
    shortDescription: row.short_description || row.shortDescription || "",
    phone: row.phone || "",
    email: row.email || "",
    city: row.city || "",
    province: row.province || "",
    address: row.address || "",
    status: row.status || "pending",
    isActive: toBoolean(row.is_active ?? row.isActive, false),
    logo: resolveMediaUrl(row.logo || ""),
    bannerUrl: resolveMediaUrl(row.banner_url || row.bannerUrl || ""),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
    detail: {
      ownerName: detail.owner_name || detail.ownerName || "",
      ownerPhone: detail.owner_phone || detail.ownerPhone || "",
      description: detail.description || "",
      shippingPolicy: detail.shipping_policy || detail.shippingPolicy || "",
      returnPolicy: detail.return_policy || detail.returnPolicy || "",
      openDays: detail.open_days || detail.openDays || "",
      openTime: detail.open_time || detail.openTime || "",
      closeTime: detail.close_time || detail.closeTime || "",
      whatsappUrl: detail.whatsapp_url || detail.whatsappUrl || "",
      instagramUrl: detail.instagram_url || detail.instagramUrl || "",
      tiktokUrl: detail.tiktok_url || detail.tiktokUrl || "",
      websiteUrl: detail.website_url || detail.websiteUrl || "",
    },
  };
}

export function assetUrl(path) {
  return resolveMediaUrl(path);
}

export async function getSellerStoreData() {
  const response = await apiClient.get(`/api/v1/seller/store/manage`);
  return normalizeStore(unwrapApiData(response.data));
}

export async function updateSellerStore({ formData }) {
  const response = await apiClient.post(`/api/v1/seller/store`, formData);
  return normalizeStore(unwrapApiData(response.data));
}

export async function saveSellerStoreAddress(values) {
  const rows = await getAddresses("store");
  const current = rows[0];

  return current
    ? updateAddress(current.id, values, "store")
    : createAddress(values, "store");
}

export function useSellerStore(options = {}) {
  const { store, isAuthenticated, activeRole } = useAuth();
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: sellerStoreKeys.detail(),
    queryFn: () => getSellerStoreData(),
    enabled: Boolean(enabled && isAuthenticated && activeRole === "seller" && store),
    staleTime: 120000,
    ...queryOptions,
  });
}

export function useSellerStoreAddress(options = {}) {
  const { isAuthenticated, activeRole, store } = useAuth();
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: sellerStoreKeys.address(),
    queryFn: async () => (await getAddresses("store"))[0] || null,
    enabled: Boolean(
      enabled && isAuthenticated && activeRole === "seller" && store,
    ),
    staleTime: 300000,
    ...queryOptions,
  });
}

export function useUpdateSellerStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSellerStore,
    onSuccess: (store) => {
      queryClient.setQueryData(sellerStoreKeys.detail(), store);
      queryClient.invalidateQueries({ queryKey: sellerStoreKeys.all });
    },
  });
}

export function useSaveSellerStoreAddress() {
  const queryClient = useQueryClient();
  const { store } = useAuth();

  return useMutation({
    mutationFn: saveSellerStoreAddress,
    onSuccess: (address) => {
      queryClient.setQueryData(
        sellerStoreKeys.address(),
        address,
      );
      queryClient.setQueryData(addressKeys.store, [address]);
    },
  });
}

export function getSellerStoreError(error) {
  return getApiMessage(error, "Data toko gagal diproses.");
}
