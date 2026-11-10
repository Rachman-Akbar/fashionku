function cleanText(value = "") {
  return String(value || "").trim();
}

function cleanRegency(value = "") {
  return cleanText(value).replace(/\b(Kabupaten|Regency)\b/gi, "").trim();
}

function parseAddress(data = {}) {
  const address = data.address || {};
  const rawCity = address.city || address.town || address.municipality || "";
  const rawDistrict = address.district || address.suburb || address.city_district || "";
  const rawCounty = address.county || "";

  const cityOrRegency = rawCity && !rawDistrict && rawCounty
    ? cleanRegency(rawCounty)
    : cleanRegency(rawCity || rawCounty);

  const district = rawCity && !rawDistrict && rawCounty
    ? cleanText(rawCity)
    : cleanText(rawDistrict || rawCity);

  return {
    country: cleanText(address.country) || "Indonesia",
    province: cleanText(address.state || address.region),
    cityOrRegency,
    district,
    subdistrict: cleanText(
      address.village ||
      address.neighbourhood ||
      address.hamlet ||
      address.suburb
    ),
    postalCode: cleanText(address.postcode),
    fullAddress: cleanText(data.display_name),
  };
}

async function readJson(response, fallbackMessage) {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json();
}

export async function reverseOpenStreetMap(latitude, longitude) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    zoom: "18",
    "accept-language": "id",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "id",
      },
    }
  );

  const data = await readJson(
    response,
    "Lokasi dari OpenStreetMap tidak dapat dibaca."
  );

  return parseAddress(data);
}

export async function searchOpenStreetMap(values = {}) {
  const parts = [
    values.fullAddress,
    values.subdistrict,
    values.district,
    values.cityOrRegency,
    values.province,
    values.country || "Indonesia",
  ]
    .map(cleanText)
    .filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Lengkapi minimal kota atau provinsi sebelum mencari lokasi.");
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    q: parts.join(", "),
    limit: "1",
    addressdetails: "1",
    countrycodes: "id",
    "accept-language": "id",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Language": "id",
      },
    }
  );

  const rows = await readJson(
    response,
    "Pencarian lokasi OpenStreetMap gagal."
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Lokasi tidak ditemukan di OpenStreetMap.");
  }

  const selected = rows[0];
  const latitude = Number(selected.lat);
  const longitude = Number(selected.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Koordinat lokasi tidak valid.");
  }

  return {
    latitude,
    longitude,
    address: parseAddress(selected),
  };
}
