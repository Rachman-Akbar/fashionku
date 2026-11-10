import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle, MapPin, X } from "lucide-react";
import {
  getAddressError,
  useCreateAddress,
} from "@/features/profile/address/addressService";
import AddressMapTracker from "@/features/profile/address/components/AddressMapTracker";
import { resolveKomerceDestination } from "@/features/profile/address/destinationService";

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
  komerceDestinationId: "",
  isPrimary: false,
};

function Field({ label, required, children }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
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
  const [message, setMessage] = useState("");
  const [destinationState, setDestinationState] = useState({
    loading: false,
    message: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      ...EMPTY_ADDRESS,
      isPrimary: defaultPrimary,
    });
    setMessage("");
    setDestinationState({ loading: false, message: "" });
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
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "province" ||
      key === "cityOrRegency" ||
      key === "district" ||
      key === "subdistrict" ||
      key === "postalCode"
        ? { komerceDestinationId: "" }
        : {}),
    }));
  };

  const resolveDestination = async (values) => {
    setDestinationState({
      loading: true,
      message: "Mencocokkan tujuan logistik...",
    });

    try {
      const destination = await resolveKomerceDestination(values);
      setForm((current) => ({
        ...current,
        komerceDestinationId: destination.id,
      }));
      setDestinationState({
        loading: false,
        message: `Tujuan logistik ditemukan: ${destination.label || destination.subdistrict || destination.id}`,
      });
      return destination.id;
    } catch (error) {
      setDestinationState({
        loading: false,
        message: error.message,
      });
      return "";
    }
  };

  useEffect(() => {
    if (
      !open ||
      !form.subdistrict ||
      !form.district ||
      !form.cityOrRegency ||
      !form.province
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      resolveDestination(addressValues);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    addressValues,
    form.cityOrRegency,
    form.district,
    form.postalCode,
    form.province,
    form.subdistrict,
    open,
  ]);

  const resolveAddress = (address) => {
    const nextValues = {
      ...addressValues,
      country: address.country || form.country,
      province: address.province || form.province,
      cityOrRegency: address.cityOrRegency || form.cityOrRegency,
      district: address.district || form.district,
      subdistrict: address.subdistrict || form.subdistrict,
      postalCode: address.postalCode || form.postalCode,
      fullAddress: address.fullAddress || form.fullAddress,
    };

    setForm((current) => ({
      ...current,
      country: nextValues.country,
      province: nextValues.province,
      cityOrRegency: nextValues.cityOrRegency,
      district: nextValues.district,
      subdistrict: nextValues.subdistrict,
      postalCode: nextValues.postalCode,
      fullAddress: nextValues.fullAddress,
      komerceDestinationId: "",
    }));
  };

  const setCoordinate = ({ latitude, longitude }) => {
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
    }));
  };

  const submit = async () => {
    const required = [
      form.label,
      form.recipientName,
      form.phoneNumber,
      form.province,
      form.cityOrRegency,
      form.district,
      form.subdistrict,
      form.postalCode,
      form.fullAddress,
      form.latitude,
      form.longitude,
    ];

    if (required.some((value) => !String(value || "").trim())) {
      setMessage(
        "Lengkapi identitas penerima, wilayah, alamat, dan pinpoint lokasi.",
      );
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
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#10B981]">
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
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
              <Field key={key} label={label} required={required}>
                <input
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/10"
                />
              </Field>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Alamat lengkap" required>
              <textarea
                value={form.fullAddress}
                onChange={(event) => update("fullAddress", event.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/10"
              />
            </Field>
            <Field label="Catatan atau patokan">
              <input
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/10"
                placeholder="Contoh: Pagar hitam dekat minimarket"
              />
            </Field>
          </div>

          <div className="mt-5">
            <AddressMapTracker
              compact
              latitude={form.latitude}
              longitude={form.longitude}
              addressValues={addressValues}
              onCoordinateChange={setCoordinate}
              onAddressResolved={resolveAddress}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-[#10B981]/20 bg-[#ECFDF5] px-4 py-3">
            <div className="flex items-start gap-3">
              {destinationState.loading ? (
                <LoaderCircle
                  className="mt-0.5 text-[#10B981]"
                  size={18}
                />
              ) : form.komerceDestinationId ? (
                <CheckCircle2 className="mt-0.5 text-[#10B981]" size={18} />
              ) : (
                <MapPin className="mt-0.5 text-slate-400" size={18} />
              )}
              <div>
                <p className="text-sm font-black text-slate-800">
                  Tujuan logistik terisi otomatis
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {destinationState.message ||
                    "OpenStreetMap mengisi wilayah. ID tujuan kurir akan diisi jika pencocokan backend menemukan data yang valid."}
                </p>
              </div>
            </div>
          </div>

          <Field label="Komerce Destination ID (opsional)">
            <input
              readOnly
              value={form.komerceDestinationId}
              placeholder="Terisi otomatis dari backend"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
            />
          </Field>

          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(event) => update("isPrimary", event.target.checked)}
              className="accent-[#10B981]"
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
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:border-[#10B981] hover:text-[#10B981]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={createMutation.isPending || destinationState.loading}
            className="h-11 rounded-xl bg-[#10B981] px-5 text-sm font-black text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
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
