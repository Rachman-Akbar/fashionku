import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  getApiMessage,
  unwrapApiData,
  unwrapCollection,
} from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toBoolean } from "@/core/utils/boolean";
import { useAuth } from "@/features/auth/context/AuthContext";

export const sellerOnboardingKeys = {
  store: ["seller", "stores"],
  address: (storeId) => [
    "order",
    "addresses",
    "store",
    String(storeId || ""),
  ],
};

function resolveStoreSource(payload = {}) {
  const source = unwrapApiData(payload) || {};
  return source.store || source.data?.store || source.data || source;
}

function normalizeStore(row = {}) {
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
    status: String(row.status || "pending").toLowerCase(),
    isActive: toBoolean(row.is_active ?? row.isActive, false),
    logo: resolveMediaUrl(row.logo || ""),
    bannerUrl: resolveMediaUrl(row.banner_url || row.bannerUrl || ""),
    detail: {
      ownerName: detail.owner_name || detail.ownerName || "",
      ownerPhone: detail.owner_phone || detail.ownerPhone || "",
      shippingPolicy: detail.shipping_policy || detail.shippingPolicy || "",
      returnPolicy: detail.return_policy || detail.returnPolicy || "",
      openDays: detail.open_days || detail.openDays || "",
      openTime: detail.open_time || detail.openTime || "",
      closeTime: detail.close_time || detail.closeTime || "",
      instagramUrl: detail.instagram_url || detail.instagramUrl || "",
      websiteUrl: detail.website_url || detail.websiteUrl || "",
      whatsappUrl: detail.whatsapp_url || detail.whatsappUrl || "",
      tiktokUrl: detail.tiktok_url || detail.tiktokUrl || "",
    },
  };
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildStoreFormData(values = {}, files = {}) {
  const formData = new FormData();
  const detailKeys = [
    "owner_name",
    "owner_phone",
    "open_days",
    "open_time",
    "close_time",
    "shipping_policy",
    "return_policy",
    "website_url",
    "instagram_url",
  ];

  const storeFields = {
    store_name: values.store_name,
    description: values.description,
    short_description: values.short_description,
    phone: values.phone,
    email: values.email,
    city: values.city_or_regency,
    province: values.province,
    address: values.full_address,
  };

  Object.entries(storeFields).forEach(([key, value]) => {
    formData.append(key, String(value || ""));
  });

  detailKeys.forEach((key) => {
    const value = values[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      formData.append(`detail[${key}]`, String(value));
    }
  });

  if (files.logo) {
    formData.append("logo", files.logo);
  }

  if (files.banner) {
    formData.append("banner", files.banner);
  }

  return formData;
}

function buildStoreAddressPayload(values = {}) {
  return {
    label: "Alamat Toko",
    recipient_name: String(values.owner_name || values.store_name || "").trim(),
    phone_number: String(values.owner_phone || values.phone || "").trim(),
    country: String(values.country || "Indonesia").trim(),
    province: String(values.province || "").trim(),
    city_or_regency: String(values.city_or_regency || "").trim(),
    district: String(values.district || "").trim(),
    subdistrict: String(values.subdistrict || "").trim(),
    postal_code: String(values.postal_code || "").trim(),
    full_address: String(values.full_address || "").trim(),
    notes: String(values.address_notes || "").trim() || null,
    latitude: toNullableNumber(values.latitude),
    longitude: toNullableNumber(values.longitude),
    komerce_destination_id:
      String(values.komerce_destination_id || "").trim() || null,
    is_primary: true,
  };
}

function isEmailVerificationError(error) {
  const status = Number(error?.response?.status || 0);
  const message = String(error?.response?.data?.message || error?.message || "")
    .toLowerCase()
    .trim();

  return status === 403 && message.includes("email verification");
}

function isSessionEmailVerified(session) {
  const user = session?.user || {};
  const explicit =
    user.email_verified ?? user.emailVerified ?? session?.email_verified;

  if (explicit === true || explicit === 1 || explicit === "1") {
    return true;
  }

  return Boolean(
    user.email_verified_at ||
    user.emailVerifiedAt ||
    session?.email_verified_at,
  );
}

function resolveSessionStore(session = {}) {
  return normalizeStore(session?.store || session?.user?.store || {});
}

function isStoreAlreadyExistsError(error) {
  const message = String(
    error?.response?.data?.message || error?.message || "",
  ).toLowerCase();

  return message.includes("sudah memiliki toko");
}

async function registerSellerStore(values, files) {
  const formData = buildStoreFormData(values, files);
  const response = await apiClient.post(
    "/api/v1/identity/auth/register-seller",
    formData,
    {
      headers: {
        "X-Device-Name": "marketplace-web-seller-onboarding",
      },
    },
  );
  const store = normalizeStore(resolveStoreSource(response.data));

  if (!store.id) {
    throw new Error(
      "Backend tidak mengembalikan data toko setelah pendaftaran.",
    );
  }

  return store;
}

async function updateRegisteredStore(id, values, files) {
  const response = await apiClient.post(
    `/api/v1/seller/stores/${id}`,
    buildStoreFormData(values, files),
  );
  const store = normalizeStore(resolveStoreSource(response.data));

  if (!store.id) {
    throw new Error("Data toko belum berhasil diperbarui.");
  }

  return store;
}

async function getRegisteredStore(id) {
  const response = await apiClient.get(`/api/v1/seller/stores/${id}/manage`);
  return normalizeStore(resolveStoreSource(response.data));
}

async function upsertStoreAddress(values) {
  const config = {
    params: {
      scope: "store",
    },
  };
  const listResponse = await apiClient.get(
    "/api/v1/order/addresses",
    config,
  );
  const currentAddress = unwrapCollection(listResponse.data)[0] || null;
  const payload = buildStoreAddressPayload(values);
  const response = currentAddress?.id
    ? await apiClient.put(
        `/api/v1/order/addresses/${currentAddress.id}`,
        payload,
        config,
      )
    : await apiClient.post(
        "/api/v1/order/addresses",
        payload,
        config,
      );

  return unwrapApiData(response.data);
}

export function useSellerOnboarding() {
  const queryClient = useQueryClient();
  const { switchRole, refreshMe } = useAuth();

  return useMutation({
    mutationFn: async ({ values, files }) => {
      let currentSession = await refreshMe();
      let store = resolveSessionStore(currentSession);
      let shouldUpdateExistingStore = Boolean(store.id);

      if (!store.id) {
        try {
          store = await registerSellerStore(values, files);
        } catch (error) {
          if (isEmailVerificationError(error)) {
            currentSession = await refreshMe();

            if (!isSessionEmailVerified(currentSession)) {
              throw new Error(
                "Email akun belum terverifikasi di backend. Verifikasi email terlebih dahulu, lalu buka kembali pendaftaran seller.",
              );
            }

            store = await registerSellerStore(values, files);
          } else if (isStoreAlreadyExistsError(error)) {
            currentSession = await refreshMe();
            store = resolveSessionStore(currentSession);

            if (!store.id) {
              throw error;
            }

            shouldUpdateExistingStore = true;
          } else {
            throw error;
          }
        }
      }

      await refreshMe();
      await switchRole("seller", {
        deviceName: "marketplace-web-seller",
        storageScope: "window",
      });

      if (shouldUpdateExistingStore) {
        store = await updateRegisteredStore(store.id, values, files);
      }

      let address;

      try {
        address = await upsertStoreAddress(values);
      } catch (error) {
        throw new Error(
          getApiMessage(
            error,
            "Toko sudah tercatat, tetapi alamat onboarding belum berhasil disimpan. Data belum dianggap selesai dan Anda belum dialihkan ke Seller Panel.",
          ),
        );
      }

      const finalStore = await getRegisteredStore(store.id);
      await refreshMe();

      if (!finalStore.id || !address?.id) {
        throw new Error(
          "Onboarding seller belum lengkap. Data toko dan alamat wajib tersedia sebelum masuk ke Seller Panel.",
        );
      }

      return {
        store: finalStore,
        address,
      };
    },
    onSuccess: ({ store, address }) => {
      queryClient.setQueryData(
        ["seller", "stores", "detail", String(store.id)],
        store,
      );
      queryClient.setQueryData(
        sellerOnboardingKeys.address(store.id),
        address,
      );
      queryClient.invalidateQueries({ queryKey: sellerOnboardingKeys.store });
      queryClient.invalidateQueries({
        queryKey: sellerOnboardingKeys.address(store.id),
      });
    },
  });
}

export function getSellerOnboardingError(error) {
  return getApiMessage(
    error,
    "Pendaftaran toko gagal diproses. Periksa kembali data yang diisi.",
  );
}
