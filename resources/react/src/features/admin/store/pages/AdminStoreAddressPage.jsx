import { useEffect, useRef, useState } from "react";
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
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { FormField, inputClassName, textAreaClassName } from "@/shared/components/form/FormField";
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
  notes: "Catatan Alamat",
  latitude: "Latitude",
  longitude: "Longitude",
};

const REQUIRED_FIELDS = Object.keys(FIELD_LABELS);

function SectionCard({ icon, title, description, children }) {
  return (
    <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
      <div className="flex items-center gap-[5px]">
        <span className="material-symbols-outlined text-slate-400">{icon}</span>
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">{title}</h3>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

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

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-5 text-sm text-slate-500 ring-1 ring-slate-200">
        Memuat data alamat toko...
      </div>
    );
  }

  const field = (key, type) => ({
    ref: registerField(key),
    type: type || "text",
    step: type === "number" ? "any" : undefined,
    value: form[key],
    onChange: change(key),
    className: inputClassName,
    disabled: saving,
    "aria-invalid": Boolean(fieldErrors[key]),
  });

  return (
    <form onSubmit={submit}>
      <FormEditorLayout
        className="px-0 py-0"
        actions={(
          <FormActionDock
            tone="emerald"
            save={{ icon: "save", label: "Simpan" }}
            disabled={saving}
          />
        )}
      >
        <div className="space-y-4">
          {message ? (
            <p className="rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              {message}
            </p>
          ) : null}

          <SectionCard
            icon="badge"
            title="Identitas Toko"
            description="Nama toko, penanggung jawab, dan nomor telepon yang tampil pada katalog dan invoice."
          >
            <FormField label="Nama Toko" error={fieldErrors.store_name} required>
              <input {...field("store_name")} />
            </FormField>
            <FormField label="Nama Penanggung Jawab" error={fieldErrors.recipient_name} required>
              <input {...field("recipient_name")} />
            </FormField>
            <FormField label="Telepon Toko" error={fieldErrors.phone_number} required>
              <input {...field("phone_number")} />
            </FormField>
          </SectionCard>

          <SectionCard
            icon="location_on"
            title="Alamat Toko"
            description="Alamat lengkap yang dipakai untuk data toko, faktur, dan pencarian produk berdasarkan lokasi."
          >
            <FormField label="Negara" error={fieldErrors.country} required>
              <input {...field("country")} />
            </FormField>
            <FormField label="Provinsi" error={fieldErrors.province} required>
              <input {...field("province")} />
            </FormField>
            <FormField label="Kota / Kabupaten" error={fieldErrors.city_or_regency} required>
              <input {...field("city_or_regency")} />
            </FormField>
            <FormField label="Kecamatan" error={fieldErrors.district} required>
              <input {...field("district")} />
            </FormField>
            <FormField label="Kelurahan / Desa" error={fieldErrors.subdistrict} required>
              <input {...field("subdistrict")} />
            </FormField>
            <FormField label="Kode Pos" error={fieldErrors.postal_code} required>
              <input {...field("postal_code")} />
            </FormField>
            <FormField label="Alamat Lengkap" error={fieldErrors.full_address} className="md:col-span-2" required>
              <textarea
                ref={registerField("full_address")}
                value={form.full_address}
                onChange={change("full_address")}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.full_address)}
                className={textAreaClassName}
              />
            </FormField>
            <FormField label="Catatan Alamat" error={fieldErrors.notes} className="md:col-span-2" required>
              <textarea
                ref={registerField("notes")}
                value={form.notes}
                onChange={change("notes")}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.notes)}
                className={textAreaClassName}
              />
            </FormField>
          </SectionCard>

          <SectionCard
            icon="my_location"
            title="Koordinat Asal Pengiriman"
            description="Titik asal jarak Haversine untuk tarif ongkir berbasis jarak."
          >
            <FormField label="Latitude" error={fieldErrors.latitude} required>
              <input {...field("latitude", "number")} placeholder="-6.200000" />
            </FormField>
            <FormField label="Longitude" error={fieldErrors.longitude} required>
              <input {...field("longitude", "number")} placeholder="106.816666" />
            </FormField>
            <p className="text-xs text-slate-500 md:col-span-2">
              Koordinat otomatis dipakai sebagai titik asal pengiriman. Rumus ongkir: tarif dasar +
              max(0, jarak - gratis s/d) × tarif per KM. Pastikan alamat penerima memiliki koordinat.
            </p>
          </SectionCard>
        </div>
      </FormEditorLayout>

      <FormEditorFooter
        submitLabel="Simpan Alamat Toko"
        submitIcon="save"
        disabled={saving}
        tone="emerald"
      />
    </form>
  );
}
