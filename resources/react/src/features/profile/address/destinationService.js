import { apiClient } from "@/core/utils/apiClient";

function toPayload(address = {}) {
  return {
    country: String(address.country || "Indonesia").trim(),
    province: String(address.province || "").trim(),
    city_or_regency: String(
      address.cityOrRegency || address.city_or_regency || ""
    ).trim(),
    district: String(address.district || "").trim(),
    subdistrict: String(address.subdistrict || "").trim(),
    postal_code: String(
      address.postalCode || address.postal_code || ""
    ).trim(),
  };
}

function normalizeDestination(payload = {}) {
  const source = payload?.data?.data ?? payload?.data ?? payload ?? {};
  const destination = source.destination ?? source;
  const id =
    source.komerce_destination_id ??
    destination.id ??
    destination.destination_id ??
    "";

  return {
    id: String(id || ""),
    label: String(destination.label || ""),
    province: String(
      destination.province_name || destination.province || ""
    ),
    cityOrRegency: String(
      destination.city_name ||
        destination.city_or_regency ||
        destination.city ||
        ""
    ),
    district: String(
      destination.district_name || destination.district || ""
    ),
    subdistrict: String(
      destination.subdistrict_name || destination.subdistrict || ""
    ),
    postalCode: String(
      destination.zip_code || destination.postal_code || ""
    ),
    raw: destination,
  };
}

export async function resolveKomerceDestination(address = {}) {
  const payload = toPayload(address);

  if (
    !payload.province ||
    !payload.city_or_regency ||
    !payload.district ||
    !payload.subdistrict
  ) {
    throw new Error(
      "Lengkapi provinsi, kota/kabupaten, kecamatan, dan kelurahan terlebih dahulu."
    );
  }

  const response = await apiClient.post(
    "/api/v1/order/addresses/resolve-destination",
    payload
  );

  const destination = normalizeDestination(response);

  if (!destination.id) {
    throw new Error(
      "ID tujuan logistik tidak ditemukan pada respons backend."
    );
  }

  return destination;
}
