import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  getAddressError,
  useCreateAddress,
} from "@/features/profile/address/addressService";
import AddressMapTracker from "@/features/profile/address/components/AddressMapTracker";

const EMPTY_ADDRESS = {
  label: "Rumah",
  recipientName: "",
  phoneNumber: "",
  country: "Indonesia",
  province: "",
  cityOrRegency: "",
  district: "",
  subdistrict: "",
  postalCode: "",
  fullAddress: "",
  notes: "",
  latitude: "",
  longitude: "",
  isPrimary: false,
};

// Urutan field wajib sesuai tampilan di modal. Dipakai untuk menemukan
// field wajib pertama yang masih kosong agar bisa digulir + di-focus.
const REQUIRED_FIELDS = [
  "label",
  "recipientName",
  "phoneNumber",
  "country",
  "province",
  "cityOrRegency",
  "district",
  "subdistrict",
  "postalCode",
  "fullAddress",
  "latitude",
];

const FIELD_LABELS = {
  label: "Label alamat",
  recipientName: "Nama penerima",
  phoneNumber: "Nomor telepon",
  country: "Negara",
  province: "Provinsi",
  cityOrRegency: "Kota / Kabupaten",
  district: "Kecamatan",
  subdistrict: "Kelurahan / Desa",
  postalCode: "Kode pos",
  fullAddress: "Alamat lengkap",
  latitude: "Pinpoint lokasi",
  longitude: "Pinpoint lokasi",
};

const inputClass = (hasError) =>
  `h-11 w-full rounded-xl border bg-slate-50 px-3 text-sm outline-none transition focus:bg-white ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
      : "border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
  }`;

function Field({ label, required, error, children }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block text-xs font-semibold text-red-500">{error}</span>
      ) : null}
    </label>
  );
}

export default function InstantAddressModal({
  open,
  onClose,
  onCreated,
  defaultPrimary = false,
}) {
  const createMutation = useCreateAddress();
  const [form, setForm] = useState({
    ...EMPTY_ADDRESS,
    isPrimary: defaultPrimary,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const fieldRefs = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      ...EMPTY_ADDRESS,
      isPrimary: defaultPrimary,
    });
    setFieldErrors({});
    setMessage("");
    fieldRefs.current = {};
  }, [defaultPrimary, open]);

  const addressValues = useMemo(
    () => ({
      country: form.country,
      province: form.province,
      cityOrRegency: form.cityOrRegency,
      district: form.district,
      subdistrict: form.subdistrict,
      postalCode: form.postalCode,
      fullAddress: form.fullAddress,
    }),
    [
      form.cityOrRegency,
      form.country,
      form.district,
      form.fullAddress,
      form.postalCode,
      form.province,
      form.subdistrict,
    ],
  );

  const update = (key, value) => {
    setMessage("");
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];

      return next;
    });
    setForm((current) => ({ ...current, [key]: value }));
  };

  const registerField = (key) => (node) => {
    if (node) {
      fieldRefs.current[key] = node;
    } else {
      delete fieldRefs.current[key];
    }
  };

  // Gulir container modal ke field pertama yang masih kosong lalu focus.
  const focusFirstInvalidField = (keys) => {
    const targetKey = keys[0];
    if (!targetKey) {
      return;
    }

    window.requestAnimationFrame(() => {
      const node = fieldRefs.current[targetKey];

      if (node && typeof node.scrollIntoView === "function") {
        node.scrollIntoView({ block: "center", behavior: "smooth" });
      }

      const focusable =
        node && typeof node.focus === "function"
          ? node
          : node?.querySelector?.(
              "input, textarea, select, button, [tabindex]",
            );

      if (focusable && typeof focusable.focus === "function") {
        window.setTimeout(() => focusable.focus({ preventScroll: true }), 260);
      }
    });
  };

  const resolveAddress = (address) => {
    setForm((current) => ({
      ...current,
      country: address.country || current.country,
      province: address.province || current.province,
      cityOrRegency: address.cityOrRegency || current.cityOrRegency,
      district: address.district || current.district,
      subdistrict: address.subdistrict || current.subdistrict,
      postalCode: address.postalCode || current.postalCode,
      fullAddress: address.fullAddress || current.fullAddress,
    }));
  };

  const setCoordinate = ({ latitude, longitude }) => {
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
    }));
    setFieldErrors((current) => {
      if (!current.latitude && !current.longitude) {
        return current;
      }

      const next = { ...current };
      delete next.latitude;
      delete next.longitude;

      return next;
    });
  };

  const validate = () => {
    const errors = {};
    const invalidKeys = [];

    for (const key of REQUIRED_FIELDS) {
      if (!String(form[key] ?? "").trim()) {
        errors[key] = `${FIELD_LABELS[key] ?? "Field ini"} wajib diisi.`;
        invalidKeys.push(key);
      }
    }

    if (
      errors.latitude &&
      String(form.longitude ?? "").trim() &&
      !errors.longitude
    ) {
      delete errors.latitude;
      invalidKeys.splice(invalidKeys.indexOf("latitude"), 1);
    }

    if (
      errors.longitude &&
      String(form.latitude ?? "").trim() &&
      !errors.latitude
    ) {
      delete errors.longitude;
      invalidKeys.splice(invalidKeys.indexOf("longitude"), 1);
    }

    setFieldErrors(errors);

    return invalidKeys;
  };

  const submit = async () => {
    const invalidKeys = validate();

    if (invalidKeys.length) {
      const firstLabel =
        FIELD_LABELS[invalidKeys[0]] ?? "beberapa field wajib";

      setMessage(
        `Lengkapi field yang ditandai merah, mulai dari ${firstLabel}.`,
      );
      focusFirstInvalidField(invalidKeys);
      return;
    }

    try {
      setMessage("");
      const created = await createMutation.mutateAsync(form);
      onCreated?.(created);
      onClose?.();
    } catch (error) {
      setMessage(getAddressError(error));
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Alamat instan
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Tambah alamat pengiriman
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["label", "Label alamat", true],
              ["recipientName", "Nama penerima", true],
              ["phoneNumber", "Nomor telepon", true],
              ["country", "Negara", true],
              ["province", "Provinsi", true],
              ["cityOrRegency", "Kota / Kabupaten", true],
              ["district", "Kecamatan", true],
              ["subdistrict", "Kelurahan / Desa", true],
              ["postalCode", "Kode pos", true],
            ].map(([key, label, required]) => (
              <Field
                key={key}
                label={label}
                required={required}
                error={fieldErrors[key]}
              >
                <input
                  ref={registerField(key)}
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  aria-invalid={Boolean(fieldErrors[key])}
                  className={inputClass(Boolean(fieldErrors[key]))}
                />
              </Field>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <Field
              label="Alamat lengkap"
              required
              error={fieldErrors.fullAddress}
            >
              <textarea
                ref={registerField("fullAddress")}
                value={form.fullAddress}
                onChange={(event) => update("fullAddress", event.target.value)}
                rows={3}
                aria-invalid={Boolean(fieldErrors.fullAddress)}
                className={`w-full resize-none rounded-xl border bg-slate-50 px-3 py-3 text-sm outline-none transition focus:bg-white ${
                  fieldErrors.fullAddress
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                }`}
              />
            </Field>
            <Field label="Catatan atau patokan">
              <input
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/10"
                placeholder="Contoh: Pagar hitam dekat minimarket"
              />
            </Field>
          </div>

          <div
            ref={registerField("latitude")}
            className={`mt-5 rounded-2xl border p-1 ${
              fieldErrors.latitude || fieldErrors.longitude
                ? "border-red-400"
                : "border-transparent"
            }`}
          >
            <AddressMapTracker
              compact
              latitude={form.latitude}
              longitude={form.longitude}
              addressValues={addressValues}
              onCoordinateChange={setCoordinate}
              onAddressResolved={resolveAddress}
            />
            {fieldErrors.latitude || fieldErrors.longitude ? (
              <p className="mt-1 px-2 pb-1 text-xs font-semibold text-red-500">
                {fieldErrors.latitude || fieldErrors.longitude}
              </p>
            ) : null}
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(event) => update("isPrimary", event.target.checked)}
              className="accent-[var(--color-primary)]"
            />
            Jadikan alamat utama
          </label>

          {message ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={createMutation.isPending}
            className="h-11 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-black text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending
              ? "Simpan"
              : "Simpan dan Pilih Alamat"}
          </button>
        </div>
      </div>
    </div>
  );
}
