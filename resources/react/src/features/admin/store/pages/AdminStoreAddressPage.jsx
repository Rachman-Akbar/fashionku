import { useEffect, useRef, useState } from "react";
import AdminShell from "@/features/admin/layout/AdminShell";
import {
  apiClient,
  getApiMessage,
  unwrapApiData,
} from "@/core/utils/apiClient";
import {
  createAddress,
  getAddresses,
  updateAddress,
} from "@/features/profile/address/addressService";
import { Button } from "@/shared/components/ui/Button";
import { toastError, toastInfo, toastSuccess } from "@/shared/utils/userFeedback";

const STORE_ADDRESS_LABEL = "Alamat Toko";

const emptyForm = {
  store_name: "",
  recipient_name: "",
  phone_number: "",
  country: "Indonesia",
  province: "",
  city_or_regency: "",
  district: "",
  subdistrict: "",
  postal_code: "",
  full_address: "",
  notes: "",
  latitude: "",
  longitude: "",
};

const FIELD_LABELS = {
  store_name: "Nama Toko",
  recipient_name: "Nama Penanggung Jawab",
  phone_number: "Telepon Toko",
  country: "Negara",
  province: "Provinsi",
  city_or_regency: "Kota / Kabupaten",
  district: "Kecamatan",
  subdistrict: "Kelurahan / Desa",
  postal_code: "Kode Pos",
  full_address: "Alamat Lengkap",
  latitude: "Latitude",
  longitude: "Longitude",
};

const REQUIRED_FIELDS = Object.keys(FIELD_LABELS);

const INPUT_FIELDS = [
  ["store_name", "Nama Toko"],
  ["recipient_name", "Nama Penanggung Jawab"],
  ["phone_number", "Telepon Toko"],
  ["country", "Negara"],
  ["province", "Provinsi"],
  ["city_or_regency", "Kota / Kabupaten"],
  ["district", "Kecamatan"],
  ["subdistrict", "Kelurahan / Desa"],
  ["postal_code", "Kode Pos"],
  ["full_address", "Alamat Lengkap"],
  ["latitude", "Latitude", "number"],
  ["longitude", "Longitude", "number"],
  ["notes", "Catatan Alamat"],
];

function isInRange(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max;
}

export default function AdminStoreAddressPage() {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [addressId, setAddressId] = useState(null);
  const [addressIsPrimary, setAddressIsPrimary] = useState(false);
  const [hasOtherAddresses, setHasOtherAddresses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fieldRefs = useRef({});

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [profileRes, addressRows, shippingRes] = await Promise.all([
          apiClient
            .get("/api/v1/seller/settings/store")
            .catch(() => null),
          getAddresses("store").catch(() => []),
          apiClient
            .get("/api/v1/order/orderings/shipping-settings")
            .catch(() => null),
        ]);

        if (!active) return;

        const profile = profileRes ? unwrapApiData(profileRes.data) || {} : {};
        const rows = Array.isArray(addressRows) ? addressRows : [];
        const storeAddress =
          rows.find((row) => row.label === STORE_ADDRESS_LABEL) || rows[0] || null;
        const shipping = shippingRes
          ? unwrapApiData(shippingRes.data) || {}
          : {};

        setAddressId(storeAddress?.id ?? null);
        setAddressIsPrimary(Boolean(storeAddress?.isPrimary));
        setHasOtherAddresses(rows.length > 0);
        setForm({
          store_name: profile.name || "",
          recipient_name:
            storeAddress?.recipientName || profile.detail?.owner_name || "",
          phone_number: storeAddress?.phoneNumber || profile.phone || "",
          country: storeAddress?.country || "Indonesia",
          province: storeAddress?.province || profile.province || "",
          city_or_regency: storeAddress?.cityOrRegency || profile.city || "",
          district: storeAddress?.district || "",
          subdistrict: storeAddress?.subdistrict || "",
          postal_code: storeAddress?.postalCode || "",
          full_address: storeAddress?.fullAddress || profile.address || "",
          notes: storeAddress?.notes || "",
          latitude: storeAddress?.latitude ?? shipping.store_latitude ?? "",
          longitude: storeAddress?.longitude ?? shipping.store_longitude ?? "",
        });
      } catch (error) {
        if (active) {
          setMessage(getApiMessage(error, "Gagal memuat alamat toko."));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const change = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const registerField = (key) => (node) => {
    if (node) {
      fieldRefs.current[key] = node;
    } else {
      delete fieldRefs.current[key];
    }
  };

  const focusFirstInvalidField = (keys) => {
    const targetKey = keys[0];
    if (!targetKey) return;

    window.requestAnimationFrame(() => {
      const node = fieldRefs.current[targetKey];
      if (node && typeof node.scrollIntoView === "function") {
        node.scrollIntoView({ block: "center", behavior: "smooth" });
      }

      const focusable =
        node && typeof node.focus === "function"
          ? node
          : node?.querySelector?.("input, textarea, select, button");

      if (focusable && typeof focusable.focus === "function") {
        window.setTimeout(() => focusable.focus({ preventScroll: true }), 260);
      }
    });
  };

  const validate = () => {
    const errors = {};

    for (const key of REQUIRED_FIELDS) {
      if (String(form[key] ?? "").trim() === "") {
        errors[key] = `${FIELD_LABELS[key]} wajib diisi.`;
      }
    }

    if (!errors.latitude && !isInRange(form.latitude, -90, 90)) {
      errors.latitude = "Latitude harus antara -90 sampai 90.";
    }

    if (!errors.longitude && !isInRange(form.longitude, -180, 180)) {
      errors.longitude = "Longitude harus antara -180 sampai 180.";
    }

    setFieldErrors(errors);

    return REQUIRED_FIELDS.filter((key) => errors[key]);
  };

  const submit = async (event) => {
    event.preventDefault();

    const invalidKeys = validate();

    if (invalidKeys.length) {
      const firstLabel = FIELD_LABELS[invalidKeys[0]] ?? "beberapa field wajib";
      setMessage(
        `Lengkapi field yang ditandai merah, mulai dari ${firstLabel}.`,
      );
      focusFirstInvalidField(invalidKeys);
      return;
    }

    setMessage("");
    setSaving(true);

    try {
      // 1. Profil toko: alamat ringkas untuk tampilan & filter lokasi produk.
      await apiClient.put("/api/v1/seller/settings/store", {
        store_name: form.store_name.trim(),
        address: form.full_address.trim(),
        city: form.city_or_regency.trim(),
        province: form.province.trim(),
      });

      // 2. Alamat toko terstruktur (dipakai panel toko & data pengiriman).
      const payload = {
        label: STORE_ADDRESS_LABEL,
        recipient_name: form.recipient_name.trim(),
        phone_number: form.phone_number.trim(),
        country: form.country.trim(),
        province: form.province.trim(),
        city_or_regency: form.city_or_regency.trim(),
        district: form.district.trim(),
        subdistrict: form.subdistrict.trim(),
        postal_code: form.postal_code.trim(),
        full_address: form.full_address.trim(),
        notes: form.notes.trim() || null,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        // Jangan merebut status primary dari alamat lain yang sudah ada.
        is_primary: addressId ? addressIsPrimary : !hasOtherAddresses,
      };

      if (addressId) {
        await updateAddress(addressId, payload, "store");
      } else {
        const created = await createAddress(payload, "store");
        setAddressId(created.id);
        setAddressIsPrimary(Boolean(created.isPrimary));
        setHasOtherAddresses(true);
      }

      // 3. Sinkronkan koordinat sebagai asal pengiriman (ongkir Haversine).
      let coordSynced = true;
      try {
        await apiClient.put("/api/v1/order/orderings/shipping-settings", {
          store_latitude: Number(form.latitude),
          store_longitude: Number(form.longitude),
        });
      } catch {
        coordSynced = false;
      }

      if (coordSynced) {
        toastSuccess(
          "Alamat Toko",
          "Alamat toko berhasil disimpan dan koordinat asal pengiriman disinkronkan.",
        );
      } else {
        toastInfo(
          "Alamat Toko",
          "Alamat toko tersimpan, tetapi koordinat asal pengiriman gagal disinkronkan. Perbarui di menu Ongkir.",
        );
      }
    } catch (error) {
      toastError(
        "Alamat Toko",
        getApiMessage(error, "Gagal menyimpan alamat toko."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <h1 className="text-xl font-black text-slate-900">Alamat Toko</h1>
        <p className="mt-1 text-sm text-slate-600">
          Satu pengaturan untuk seluruh toko. Alamat ini dipakai pada profil
          toko, panel penjual, dan sebagai asal pengiriman (ongkir Haversine).
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-slate-500">Memuat...</div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {INPUT_FIELDS.map(([key, label, type]) => (
                <label key={key} className="block text-sm">
                  <span className="font-semibold text-slate-700">
                    {label}
                    {REQUIRED_FIELDS.includes(key) ? (
                      <span className="ml-1 text-red-500">*</span>
                    ) : null}
                  </span>
                  <input
                    ref={registerField(key)}
                    type={type || "text"}
                    step={type === "number" ? "any" : undefined}
                    value={form[key]}
                    onChange={change(key)}
                    aria-invalid={Boolean(fieldErrors[key])}
                    className={`mt-1 h-11 w-full rounded-xl border px-3 outline-none transition ${
                      fieldErrors[key]
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-emerald-500"
                    }`}
                  />
                  {fieldErrors[key] ? (
                    <span className="mt-1 block text-xs font-medium text-red-500">
                      {fieldErrors[key]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            {message ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                {message}
              </p>
            ) : null}

            <p className="text-xs text-slate-500">
              Koordinat otomatis dipakai sebagai titik asal pengiriman. Rumus
              ongkir: tarif dasar + max(0, jarak - gratis s/d) × tarif per KM.
            </p>

            <div className="pt-1">
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Alamat Toko"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
