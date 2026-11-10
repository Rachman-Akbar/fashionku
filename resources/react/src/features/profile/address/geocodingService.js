function cleanRegency(value = "") {
  return String(value).replace(/\b(Kabupaten|Regency)\b/gi, "").trim();
}

function normalizeAddress(data = {}) {
  const address = data.address || {};
  const rawCity = address.city || address.town || address.municipality || "";
  const rawDistrict = address.district || address.suburb || address.city_district || "";
  const rawCounty = address.county || "";
  const cityOrRegency = rawCity && !rawDistrict && rawCounty
    ? cleanRegency(rawCounty)
    : cleanRegency(rawCity || rawCounty);
  const district = rawCity && !rawDistrict && rawCounty
    ? rawCity
    : rawDistrict || rawCity;

  return {
    country: address.country || "Indonesia",
    province: address.state || address.region || "",
    cityOrRegency,
    district,
    subdistrict:
      address.village ||
      address.neighbourhood ||
      address.hamlet ||
      address.suburb ||
      "",
    postalCode: address.postcode || "",
    fullAddress: data.display_name || "",
  };
}

async function requestNominatim(path, params) {
  const query = new URLSearchParams(params);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/${path}?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "id",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Data lokasi OpenStreetMap tidak dapat diambil.");
  }

  return response.json();
}

export async function reverseGeocode(latitude, longitude) {
  const data = await requestNominatim("reverse", {
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    "accept-language": "id",
  });

  return normalizeAddress(data);
}

export async function forwardGeocode(values = {}) {
  const parts = [
    values.fullAddress,
    values.subdistrict,
    values.district,
    values.cityOrRegency,
    values.province,
    values.postalCode,
    values.country || "Indonesia",
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  if (parts.length < 3) {
    throw new Error("Lengkapi wilayah sebelum mencari lokasi pada peta.");
  }

  const rows = await requestNominatim("search", {
    format: "jsonv2",
    q: parts.join(", "),
    limit: "1",
    addressdetails: "1",
    countrycodes: "id",
    "accept-language": "id",
  });

  const selected = Array.isArray(rows) ? rows[0] : null;

  if (!selected) {
    throw new Error("Lokasi tidak ditemukan pada OpenStreetMap.");
  }

  return {
    latitude: Number(selected.lat),
    longitude: Number(selected.lon),
    address: normalizeAddress(selected),
  };
}
