import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  getApiMessage,
  unwrapCollection,
  unwrapApiData,
} from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";

export const addressKeys = {
  all: ["order", "addresses", "user"],
  store: ["order", "addresses", "store"],
  list: (scope = "user") =>
    scope === "store"
      ? ["order", "addresses", "store"]
      : ["order", "addresses", "user"],
};

export function normalizeAddress(row = {}) {
  return {
    id: Number(row.id),
    userId: row.user_id ? String(row.user_id) : null,
    storeId: row.store_id ? String(row.store_id) : null,
    label: row.label || "Alamat",
    recipientName: row.recipient_name || "",
    phoneNumber: row.phone_number || "",
    country: row.country || "Indonesia",
    province: row.province || "",
    cityOrRegency: row.city_or_regency || "",
    district: row.district || "",
    subdistrict: row.subdistrict || "",
    postalCode: row.postal_code || "",
    fullAddress: row.full_address || "",
    notes: row.notes || "",
    latitude:
      row.latitude === null || row.latitude === undefined
        ? null
        : Number(row.latitude),
    longitude:
      row.longitude === null || row.longitude === undefined
        ? null
        : Number(row.longitude),
    komerceDestinationId: row.komerce_destination_id || "",
    isPrimary: Boolean(row.is_primary),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function toAddressPayload(values = {}) {
  return {
    label: String(values.label || "").trim(),
    recipient_name: String(
      values.recipientName || values.recipient_name || "",
    ).trim(),
    phone_number: String(
      values.phoneNumber || values.phone_number || "",
    ).trim(),
    country: String(values.country || "Indonesia").trim(),
    province: String(values.province || "").trim(),
    city_or_regency: String(
      values.cityOrRegency || values.city_or_regency || "",
    ).trim(),
    district: String(values.district || "").trim(),
    subdistrict: String(values.subdistrict || "").trim(),
    postal_code: String(values.postalCode || values.postal_code || "").trim(),
    full_address: String(
      values.fullAddress || values.full_address || "",
    ).trim(),
    notes: String(values.notes || "").trim() || null,
    latitude: toNullableNumber(values.latitude),
    longitude: toNullableNumber(values.longitude),
    komerce_destination_id:
      String(
        values.komerceDestinationId || values.komerce_destination_id || "",
      ).trim() || null,
    is_primary: Boolean(values.isPrimary ?? values.is_primary),
  };
}

function scopeConfig(scope) {
  return scope === "store" ? { params: { scope: "store" } } : undefined;
}

export async function getAddresses(scope = "user") {
  const response = await apiClient.get(
    "/api/v1/order/addresses",
    scopeConfig(scope),
  );
  return unwrapCollection(response.data).map(normalizeAddress);
}

export async function createAddress(values, scope = "user") {
  const response = await apiClient.post(
    "/api/v1/order/addresses",
    toAddressPayload(values),
    scopeConfig(scope),
  );
  return normalizeAddress(unwrapApiData(response.data));
}

export async function updateAddress(id, values, scope = "user") {
  const response = await apiClient.put(
    `/api/v1/order/addresses/${id}`,
    toAddressPayload(values),
    scopeConfig(scope),
  );
  return normalizeAddress(unwrapApiData(response.data));
}

export async function deleteAddress(id, scope = "user") {
  const response = await apiClient.delete(
    `/api/v1/order/addresses/${id}`,
    scopeConfig(scope),
  );
  return response.data;
}

export function useAddresses(scope = "user", options = {}) {
  const { isAuthenticated, activeRole } = useAuth();
  const enabledByRole = scope !== "store" || activeRole === "seller";

  return useQuery({
    queryKey: addressKeys.list(scope),
    queryFn: () => getAddresses(scope),
    enabled: Boolean(isAuthenticated && enabledByRole),
    staleTime: 300000,
    ...options,
  });
}

export function useCreateAddress(scope = "user") {
  const queryClient = useQueryClient();
  const key = addressKeys.list(scope);

  return useMutation({
    mutationFn: (values) => createAddress(values, scope),
    onSuccess: (created) => {
      queryClient.setQueryData(key, (current = []) => {
        const rows = created.isPrimary
          ? current.map((row) => ({ ...row, isPrimary: false }))
          : current;
        return scope === "store" ? [created] : [created, ...rows];
      });
    },
  });
}

export function useUpdateAddress(scope = "user") {
  const queryClient = useQueryClient();
  const key = addressKeys.list(scope);

  return useMutation({
    mutationFn: ({ id, values }) => updateAddress(id, values, scope),
    onSuccess: (updated) => {
      queryClient.setQueryData(key, (current = []) =>
        current.map((row) => {
          if (row.id === updated.id) return updated;
          return updated.isPrimary ? { ...row, isPrimary: false } : row;
        }),
      );
    },
  });
}

export function useDeleteAddress(scope = "user") {
  const queryClient = useQueryClient();
  const key = addressKeys.list(scope);

  return useMutation({
    mutationFn: (id) => deleteAddress(id, scope),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key) || [];
      queryClient.setQueryData(
        key,
        previous.filter((row) => row.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(key, context?.previous || []);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function getAddressError(error) {
  return getApiMessage(error, "Alamat gagal diproses.");
}
