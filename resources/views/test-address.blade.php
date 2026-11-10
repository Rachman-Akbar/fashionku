<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Hierarchical Address Testing</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <style>
        #map { height: 350px; width: 100%; border-radius: 0.5rem; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen py-10 px-4">
    <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">Simulasi Tambah Alamat Berjenjang</h2>
        <p class="text-xs text-gray-500 text-center mb-6">Sinkronisasi OpenStreetMap dan RajaOngkir/Komerce</p>

        <form id="addressForm" class="space-y-4" onsubmit="event.preventDefault(); submitAddress();">
            <div class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <label class="block text-sm font-bold text-amber-800 mb-1">Bearer Token Sanctum</label>
                <div class="flex gap-2">
                    <input type="text" id="auth_token" placeholder="Masukkan token Sanctum" class="mt-1 block w-full p-2 border border-amber-300 rounded-md shadow-sm bg-white text-sm font-mono">
                    <button type="button" id="btn-load-profile" class="mt-1 shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 rounded-md">Muat Profil</button>
                </div>
                <p id="profile-status" class="mt-2 text-xs text-amber-700"></p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Label Alamat</label>
                    <input type="text" id="label" placeholder="Contoh: Rumah Utama" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nama Penerima</label>
                    <input type="text" id="recipient_name" placeholder="Nama penerima" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input type="text" id="phone_number" placeholder="Nomor telepon penerima" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Hierarki Geografis</label>
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Negara</label>
                    <input type="text" id="country" value="Indonesia" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Provinsi</label>
                    <input type="text" id="province" placeholder="Provinsi" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Kota / Kabupaten</label>
                    <input type="text" id="city_or_regency" placeholder="Kota atau kabupaten" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Kecamatan</label>
                    <input type="text" id="district" placeholder="Kecamatan" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Kelurahan / Desa</label>
                    <input type="text" id="subdistrict" placeholder="Kelurahan atau desa" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
                <div>
                    <label class="block text-xs text-gray-600">Kode Pos</label>
                    <input type="text" id="postal_code" placeholder="Kode pos" class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea id="full_address" rows="3" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Nama jalan, blok, nomor rumah, RT/RW"></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Catatan Alamat / Patokan</label>
                <input type="text" id="notes" placeholder="Contoh: Pagar hitam di samping minimarket" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div class="flex items-center justify-between gap-3">
                    <label class="block text-sm font-bold text-blue-800">Komerce Destination ID</label>
                    <button type="button" id="btn-resolve-destination" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-md">Cari Tujuan Logistik</button>
                </div>
                <input type="text" id="komerce_destination_id" readonly placeholder="Terisi otomatis dari RajaOngkir/Komerce" class="mt-2 block w-full p-2 border border-blue-300 bg-white font-mono rounded-md shadow-sm text-sm">
                <p id="destination-status" class="mt-2 text-xs text-blue-700"></p>
            </div>

            <div class="pt-2">
                <div class="flex items-center justify-between gap-3 mb-2">
                    <label class="block text-sm font-medium text-gray-700">Pinpoint Lokasi Tracker</label>
                    <button type="button" id="btn-current-location" class="bg-gray-700 hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-md">Gunakan Lokasi Saya</button>
                </div>
                <div id="map" class="border border-gray-300"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                    <label class="block text-xs font-semibold text-gray-500">Latitude</label>
                    <input type="text" id="latitude" readonly class="mt-1 block w-full bg-gray-200 p-2 text-sm border border-gray-300 rounded-md text-gray-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-500">Longitude</label>
                    <input type="text" id="longitude" readonly class="mt-1 block w-full bg-gray-200 p-2 text-sm border border-gray-300 rounded-md text-gray-600">
                </div>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="is_primary" checked class="h-4 w-4 text-blue-600 border-gray-300 rounded">
                <label for="is_primary" class="ml-2 block text-sm text-gray-900">Jadikan Alamat Utama</label>
            </div>

            <button type="submit" id="btn-submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center space-x-2">
                <svg id="loading-spinner" class="hidden animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span id="btn-text">Simpan Alamat ke Database</span>
            </button>
        </form>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        const API_BASE_URL = "{{ rtrim(config('app.url'), '/') }}";
        const ME_ENDPOINT = "/api/v1/identity/auth/me";
        const RESOLVE_ENDPOINT = "/api/v1/order/addresses/resolve-destination";
        const ADDRESS_ENDPOINT = "/api/v1/order/addresses";
        const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";
        const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";

        const byId = (id) => document.getElementById(id);
        const value = (id) => byId(id).value.trim();
        const setValue = (id, nextValue) => { byId(id).value = nextValue ?? ""; };
        const normalizeToken = (token) => String(token || "").trim().replace(/^Bearer\s+/i, "");
        const getToken = () => normalizeToken(value("auth_token"));
        const apiUrl = (path) => /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path}`;

        const headers = () => {
            const token = getToken();
            return {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };
        };

        const readResponse = async (response) => {
            const type = response.headers.get("content-type") || "";
            if (type.includes("application/json")) return response.json();
            return { message: await response.text() };
        };

        const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload ?? {};

        const setStatus = (id, message, type = "info") => {
            const target = byId(id);
            target.textContent = message || "";
            target.classList.remove("text-blue-700", "text-green-700", "text-red-700", "text-amber-700");
            target.classList.add(type === "success" ? "text-green-700" : type === "error" ? "text-red-700" : type === "warning" ? "text-amber-700" : "text-blue-700");
        };

        const extractDestination = (payload) => {
            const data = unwrap(payload);
            const destination = data?.destination ?? data?.result ?? data;
            const id = data?.komerce_destination_id ?? destination?.komerce_destination_id ?? destination?.destination_id ?? destination?.id ?? destination?.value ?? "";
            return {
                id: String(id || ""),
                label: destination?.label ?? destination?.name ?? destination?.destination_name ?? "",
            };
        };

        const map = L.map("map").setView([-2.548926, 118.014863], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const marker = L.marker([-2.548926, 118.014863], { draggable: true }).addTo(map);
        let fieldTimer = null;
        let destinationTimer = null;
        let destinationController = null;

        const setMapPosition = (latitude, longitude, zoom = 16) => {
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
            marker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], zoom);
            setValue("latitude", latitude.toFixed(8));
            setValue("longitude", longitude.toFixed(8));
        };

        const destinationPayload = () => ({
            country: value("country") || "Indonesia",
            province: value("province"),
            city_or_regency: value("city_or_regency"),
            district: value("district"),
            subdistrict: value("subdistrict"),
            postal_code: value("postal_code"),
            latitude: Number.parseFloat(value("latitude")) || null,
            longitude: Number.parseFloat(value("longitude")) || null,
        });

        const addressPayload = () => ({
            label: value("label"),
            recipient_name: value("recipient_name"),
            phone_number: value("phone_number"),
            country: value("country") || "Indonesia",
            province: value("province"),
            city_or_regency: value("city_or_regency"),
            district: value("district"),
            subdistrict: value("subdistrict"),
            postal_code: value("postal_code"),
            full_address: value("full_address"),
            notes: value("notes") || null,
            latitude: Number.parseFloat(value("latitude")) || null,
            longitude: Number.parseFloat(value("longitude")) || null,
            komerce_destination_id: value("komerce_destination_id") || null,
            is_primary: byId("is_primary").checked ? 1 : 0,
        });

        const validateAddress = (payload) => {
            const labels = {
                label: "Label alamat",
                recipient_name: "Nama penerima",
                phone_number: "Nomor telepon",
                province: "Provinsi",
                city_or_regency: "Kota atau kabupaten",
                district: "Kecamatan",
                subdistrict: "Kelurahan atau desa",
                postal_code: "Kode pos",
                full_address: "Alamat lengkap",
                latitude: "Latitude",
                longitude: "Longitude",
            };
            const missing = Object.entries(labels)
                .filter(([key]) => payload[key] === null || payload[key] === undefined || String(payload[key]).trim() === "")
                .map(([, label]) => label);
            if (missing.length) throw new Error(`Data wajib belum lengkap: ${missing.join(", ")}`);
        };

        const resolveDestination = async ({ silent = false } = {}) => {
            const payload = destinationPayload();
            if (!getToken()) {
                if (!silent) setStatus("destination-status", "Masukkan token Sanctum terlebih dahulu.", "warning");
                return null;
            }
            if (!payload.province || !payload.city_or_regency || (!payload.district && !payload.subdistrict && !payload.postal_code)) {
                setValue("komerce_destination_id", "");
                if (!silent) setStatus("destination-status", "Lengkapi detail wilayah terlebih dahulu.", "warning");
                return null;
            }
            if (destinationController) destinationController.abort();
            destinationController = new AbortController();
            if (!silent) setStatus("destination-status", "Mencari tujuan logistik resmi...", "info");
            try {
                const response = await fetch(apiUrl(RESOLVE_ENDPOINT), {
                    method: "POST",
                    headers: headers(),
                    body: JSON.stringify(payload),
                    signal: destinationController.signal,
                });
                const result = await readResponse(response);
                if (!response.ok) {
                    const validationMessage = Object.values(result?.errors || {}).flat().filter(Boolean).join(", ");
                    throw new Error(validationMessage || result?.message || `Gagal mencari tujuan logistik (${response.status}).`);
                }
                const destination = extractDestination(result);
                if (!destination.id) throw new Error("API tidak mengembalikan Komerce Destination ID.");
                setValue("komerce_destination_id", destination.id);
                setStatus("destination-status", destination.label ? `Tujuan logistik ditemukan: ${destination.label}` : `Tujuan logistik ditemukan dengan ID ${destination.id}.`, "success");
                return destination;
            } catch (error) {
                if (error?.name === "AbortError") return null;
                setValue("komerce_destination_id", "");
                setStatus("destination-status", error.message, "error");
                if (!silent) throw error;
                return null;
            }
        };

        const queueDestination = () => {
            clearTimeout(destinationTimer);
            destinationTimer = setTimeout(() => resolveDestination({ silent: true }), 900);
        };

        const reverseGeocode = async (latitude, longitude) => {
            setMapPosition(latitude, longitude);
            const params = new URLSearchParams({
                format: "jsonv2",
                lat: String(latitude),
                lon: String(longitude),
                addressdetails: "1",
                "accept-language": "id",
            });
            const response = await fetch(`${NOMINATIM_REVERSE}?${params.toString()}`, { headers: { Accept: "application/json" } });
            const data = await readResponse(response);
            if (!response.ok || !data?.address) throw new Error(data?.message || "OpenStreetMap tidak menemukan detail alamat.");
            const address = data.address;
            const city = address.city || address.town || address.municipality || address.county || address.state_district || "";
            const district = address.city_district || address.district || address.suburb || address.town || "";
            const subdistrict = address.village || address.quarter || address.neighbourhood || address.hamlet || "";
            setValue("country", address.country || "Indonesia");
            setValue("province", address.state || address.region || "");
            setValue("city_or_regency", city.replace(/^(Kabupaten|Kab\.|Regency)\s+/i, "").trim());
            setValue("district", district.replace(/^(Kecamatan|District)\s+/i, "").trim());
            setValue("subdistrict", subdistrict.trim());
            setValue("postal_code", address.postcode || "");
            setValue("full_address", data.display_name || "");
            setValue("komerce_destination_id", "");
            queueDestination();
        };

        const forwardGeocode = async () => {
            const payload = destinationPayload();
            const parts = [payload.subdistrict, payload.district, payload.city_or_regency, payload.province, payload.postal_code, payload.country].filter(Boolean);
            if (parts.length < 3) return;
            const params = new URLSearchParams({
                format: "jsonv2",
                q: parts.join(", "),
                limit: "1",
                addressdetails: "1",
                countrycodes: "id",
                "accept-language": "id",
            });
            const response = await fetch(`${NOMINATIM_SEARCH}?${params.toString()}`, { headers: { Accept: "application/json" } });
            const results = await readResponse(response);
            if (!response.ok || !Array.isArray(results) || !results.length) return;
            const latitude = Number.parseFloat(results[0].lat);
            const longitude = Number.parseFloat(results[0].lon);
            setMapPosition(latitude, longitude, 15);
            if (!value("full_address")) setValue("full_address", results[0].display_name || parts.join(", "));
            setValue("komerce_destination_id", "");
            queueDestination();
        };

        const loadProfile = async () => {
            if (!getToken()) {
                setStatus("profile-status", "Masukkan token Sanctum terlebih dahulu.", "warning");
                return;
            }
            setStatus("profile-status", "Memuat profil pengguna...", "info");
            try {
                const response = await fetch(apiUrl(ME_ENDPOINT), { headers: headers() });
                const result = await readResponse(response);
                if (!response.ok) throw new Error(result?.message || `Gagal memuat profil (${response.status}).`);
                const data = unwrap(result);
                const user = data?.user ?? data;
                if (!value("recipient_name")) setValue("recipient_name", user?.name ?? user?.full_name ?? user?.display_name ?? "");
                if (!value("phone_number")) setValue("phone_number", user?.phone_number ?? user?.phone ?? user?.mobile ?? "");
                setStatus("profile-status", user?.email ? `Profil berhasil dimuat: ${user.email}` : "Profil berhasil dimuat.", "success");
            } catch (error) {
                setStatus("profile-status", error.message, "error");
            }
        };

        const useCurrentLocation = () => {
            if (!navigator.geolocation) {
                setStatus("destination-status", "Browser tidak mendukung geolocation.", "error");
                return;
            }
            setStatus("destination-status", "Mengambil lokasi perangkat...", "info");
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await reverseGeocode(position.coords.latitude, position.coords.longitude);
                        setStatus("destination-status", "Lokasi perangkat berhasil ditemukan.", "success");
                    } catch (error) {
                        setStatus("destination-status", error.message, "error");
                    }
                },
                (error) => setStatus("destination-status", error.message || "Izin lokasi ditolak.", "error"),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        };

        const setSubmitting = (state) => {
            byId("btn-submit").disabled = state;
            byId("btn-submit").classList.toggle("opacity-75", state);
            byId("btn-submit").classList.toggle("cursor-not-allowed", state);
            byId("loading-spinner").classList.toggle("hidden", !state);
            byId("btn-text").textContent = state ? "Menyimpan ke Database..." : "Simpan Alamat ke Database";
        };

        const submitAddress = async () => {
            if (!getToken()) {
                alert("Masukkan token Sanctum terlebih dahulu.");
                return;
            }
            setSubmitting(true);
            try {
                let payload = addressPayload();
                validateAddress(payload);
                if (!payload.komerce_destination_id) {
                    const destination = await resolveDestination();
                    if (!destination?.id) throw new Error("Tujuan logistik belum ditemukan. Periksa kembali detail wilayah.");
                    payload = addressPayload();
                }
                const response = await fetch(apiUrl(ADDRESS_ENDPOINT), {
                    method: "POST",
                    headers: headers(),
                    body: JSON.stringify(payload),
                });
                const result = await readResponse(response);
                if (!response.ok) {
                    const validationMessage = Object.values(result?.errors || {}).flat().filter(Boolean).join(", ");
                    throw new Error(validationMessage || result?.message || `Gagal menyimpan alamat (${response.status}).`);
                }
                const saved = unwrap(result);
                const savedId = saved?.komerce_destination_id ?? saved?.destination?.id ?? payload.komerce_destination_id;
                if (savedId) setValue("komerce_destination_id", savedId);
                alert("Alamat berhasil disimpan.");
            } catch (error) {
                alert(error.message || "Terjadi kesalahan saat menyimpan alamat.");
            } finally {
                setSubmitting(false);
            }
        };

        marker.on("dragend", async () => {
            const position = marker.getLatLng();
            try {
                await reverseGeocode(position.lat, position.lng);
            } catch (error) {
                setStatus("destination-status", error.message, "error");
            }
        });

        map.on("click", async (event) => {
            try {
                await reverseGeocode(event.latlng.lat, event.latlng.lng);
            } catch (error) {
                setStatus("destination-status", error.message, "error");
            }
        });

        ["province", "city_or_regency", "district", "subdistrict", "postal_code"].forEach((id) => {
            byId(id).addEventListener("input", () => {
                clearTimeout(fieldTimer);
                setValue("komerce_destination_id", "");
                setStatus("destination-status", "Detail wilayah berubah. Tujuan logistik akan dicari ulang.", "info");
                fieldTimer = setTimeout(forwardGeocode, 1200);
                queueDestination();
            });
            byId(id).addEventListener("blur", () => {
                forwardGeocode();
                queueDestination();
            });
        });

        byId("btn-load-profile").addEventListener("click", loadProfile);
        byId("btn-resolve-destination").addEventListener("click", () => resolveDestination());
        byId("btn-current-location").addEventListener("click", useCurrentLocation);
        byId("auth_token").addEventListener("blur", () => {
            if (getToken()) {
                loadProfile();
                queueDestination();
            }
        });

        window.addEventListener("load", () => setTimeout(() => map.invalidateSize(), 150));
    </script>
</body>
</html>
