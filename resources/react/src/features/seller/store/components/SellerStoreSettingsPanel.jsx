import { useEffect, useMemo, useState } from "react";
import {
  getSellerStoreError,
  useSaveSellerStoreAddress,
  useSellerStoreAddress,
  useUpdateSellerStore,
} from "@/features/seller/store/services/sellerStoreService";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { useObjectUrl } from "@/shared/hooks/useObjectUrl";
import { DayPicker, TimePicker } from "@/shared/components/form";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { useTabDirtyGuard } from "@/shared/hooks/useTabDirtyGuard";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const emptyForm = {
  store_name: "",
  description: "",
  short_description: "",
  phone: "",
  email: "",
  city: "",
  province: "",
  address: "",
  country: "Indonesia",
  district: "",
  subdistrict: "",
  postal_code: "",
  komerce_destination_id: "",
  latitude: "",
  longitude: "",
  address_notes: "",
  owner_name: "",
  owner_phone: "",
  open_days: "",
  open_time: "",
  close_time: "",
  shipping_policy: "",
  return_policy: "",
  website_url: "",
  instagram_url: "",
};

function fromStore(store, storeAddress) {
  if (!store) return { ...emptyForm };

  return {
    store_name: toTitleCase(store.name),
    description: store.description,
    short_description: store.shortDescription,
    phone: store.phone,
    email: store.email,
    city: storeAddress?.cityOrRegency || store.city,
    province: storeAddress?.province || store.province,
    address: storeAddress?.fullAddress || store.address,
    country: storeAddress?.country || "Indonesia",
    district: storeAddress?.district || "",
    subdistrict: storeAddress?.subdistrict || "",
    postal_code: storeAddress?.postalCode || "",
    komerce_destination_id: storeAddress?.komerceDestinationId || "",
    latitude: storeAddress?.latitude ?? "",
    longitude: storeAddress?.longitude ?? "",
    address_notes: storeAddress?.notes || "",
    owner_name: store.detail.ownerName,
    owner_phone: store.detail.ownerPhone,
    open_days: store.detail.openDays,
    open_time: store.detail.openTime,
    close_time: store.detail.closeTime,
    shipping_policy: store.detail.shippingPolicy,
    return_policy: store.detail.returnPolicy,
    website_url: store.detail.websiteUrl,
    instagram_url: store.detail.instagramUrl,
  };
}

export function SellerStoreSettingsPanel({ store }) {
  const storeAddressQuery = useSellerStoreAddress();
  const storeAddress = storeAddressQuery.data || null;
  const [form, setForm] = useState(() => fromStore(store, storeAddress));
  const [pristine, setPristine] = useState(() => fromStore(store, storeAddress));
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const dirty = useFormDirty(pristine, form) || Boolean(logo) || Boolean(banner);
  useTabDirtyGuard(dirty);
  const logoObjectUrl = useObjectUrl(logo);
  const bannerObjectUrl = useObjectUrl(banner);
  const logoPreviewUrl = logoObjectUrl || resolveMediaUrl(store?.logo || "");
  const bannerPreviewUrl = bannerObjectUrl || resolveMediaUrl(store?.bannerUrl || "");
  const updateMutation = useUpdateSellerStore();
  const saveAddressMutation = useSaveSellerStoreAddress();
  const pending = updateMutation.isPending || saveAddressMutation.isPending;

  useEffect(
    () => {
      const fresh = fromStore(store, storeAddress);
      setPristine(fresh);
      setForm(fresh);
    },
    [store, storeAddress],
  );

  const detailKeys = useMemo(
    () => [
      "owner_name",
      "owner_phone",
      "open_days",
      "open_time",
      "close_time",
      "shipping_policy",
      "return_policy",
      "website_url",
      "instagram_url",
    ],
    [],
  );
  const addressOnlyKeys = useMemo(
    () => [
      "country",
      "district",
      "subdistrict",
      "postal_code",
      "komerce_destination_id",
      "latitude",
      "longitude",
      "address_notes",
    ],
    [],
  );

  const change = (key) => (valueOrEvent) => {
    const nextValue =
      valueOrEvent && typeof valueOrEvent === "object" && valueOrEvent.target
        ? valueOrEvent.target.value
        : valueOrEvent;
    setForm((current) => ({ ...current, [key]: nextValue }));
  };

  const buildAddress = () => ({
    label: "Alamat Toko",
    recipientName: form.owner_name || form.store_name,
    phoneNumber: form.owner_phone || form.phone,
    country: form.country || "Indonesia",
    province: form.province,
    cityOrRegency: form.city,
    district: form.district,
    subdistrict: form.subdistrict,
    postalCode: form.postal_code,
    fullAddress: form.address,
    notes: form.address_notes,
    latitude: form.latitude,
    longitude: form.longitude,
    komerceDestinationId: form.komerce_destination_id,
    isPrimary: true,
  });

  const submit = async (event) => {
    event.preventDefault();

    const address = buildAddress();
    const requiredAddress = [
      address.recipientName,
      address.phoneNumber,
      address.province,
      address.cityOrRegency,
      address.district,
      address.subdistrict,
      address.postalCode,
      address.fullAddress,
      address.latitude,
      address.longitude,
    ];

    if (requiredAddress.some((value) => String(value ?? "").trim() === "")) {
      toastError("Simpan Pengaturan Toko", "Lengkapi seluruh data alamat toko dan koordinat.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (addressOnlyKeys.includes(key)) return;
      data.append(
        detailKeys.includes(key) ? `detail[${key}]` : key,
        value || "",
      );
    });
    if (logo) data.append("logo", logo);
    if (banner) data.append("banner", banner);

    if (!store?.id) {
      toastError("Simpan Pengaturan Toko", "Data toko tidak ditemukan. Selesaikan onboarding seller terlebih dahulu.");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: store.id, formData: data });
      await saveAddressMutation.mutateAsync(address);

      toastSuccess("Simpan Pengaturan Toko", "Perubahan toko dan alamat berhasil disimpan.");
      setLogo(null);
      setBanner(null);
    } catch (error) {
      toastError("Simpan Pengaturan Toko", getSellerStoreError(error));
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[10px] border border-slate-200 bg-white p-5">
        <h2 className="text-base font-extrabold text-slate-950">
          Informasi operasional
        </h2>
        <div className="mt-4 grid gap-3">
          {[
            ["owner_name", "Nama pemilik"],
            ["owner_phone", "Telepon pemilik"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{label}</span>
              <input
                type="text"
                value={form[key]}
                onChange={change(key)}
                className="h-11 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>
          ))}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">
              Hari operasional
            </span>
            <DayPicker value={form.open_days} onChange={change("open_days")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">
                Jam buka
              </span>
              <TimePicker value={form.open_time} onChange={change("open_time")} />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">
                Jam tutup
              </span>
              <TimePicker value={form.close_time} onChange={change("close_time")} />
            </div>
          </div>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">
              Kebijakan pengiriman
            </span>
            <textarea
              value={form.shipping_policy}
              onChange={change("shipping_policy")}
              className="min-h-24 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">
              Kebijakan retur
            </span>
            <textarea
              value={form.return_policy}
              onChange={change("return_policy")}
              className="min-h-24 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
        </div>
      </div>

      <div className="rounded-[10px] border border-slate-200 bg-white p-5">
        <h2 className="text-base font-extrabold text-slate-950">
          Pengaturan toko
        </h2>
        <div className="mt-4 grid gap-3">
          {[
            ["store_name", "Nama toko", true],
            ["short_description", "Deskripsi singkat"],
            ["phone", "Telepon", true],
            ["email", "Email", false, "email"],
            ["country", "Negara", true],
            ["province", "Provinsi", true],
            ["city", "Kota / Kabupaten", true],
            ["district", "Kecamatan", true],
            ["subdistrict", "Kelurahan / Desa", true],
            ["postal_code", "Kode Pos", true],
            ["komerce_destination_id", "Komerce Destination ID (opsional)"],
            ["latitude", "Latitude", true, "number"],
            ["longitude", "Longitude", true, "number"],
            ["address", "Alamat Lengkap", true],
            ["address_notes", "Catatan Alamat"],
          ].map(([key, label, required, type]) => (
            <label key={key} className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">{label}</span>
              <input
                type={type || "text"}
                step={type === "number" ? "any" : undefined}
                required={Boolean(required)}
                value={form[key]}
                onChange={change(key)}
                className="h-11 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </label>
          ))}
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">Deskripsi</span>
            <textarea
              value={form.description}
              onChange={change("description")}
              className="min-h-28 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">Logo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setLogo(event.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500"
              />
              <div className="aspect-square w-full max-w-40 overflow-hidden rounded-[10px] bg-slate-100">
                {logoPreviewUrl ? <img src={logoPreviewUrl} alt="Preview logo toko" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><span className="material-symbols-outlined text-4xl">image</span></div>}
              </div>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-slate-500">Banner</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => setBanner(event.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500"
              />
              <div className="aspect-[3/1] w-full overflow-hidden rounded-[10px] bg-slate-100">
                {bannerPreviewUrl ? <img src={bannerPreviewUrl} alt="Preview banner toko" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400"><span className="material-symbols-outlined text-4xl">image</span></div>}
              </div>
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            disabled={pending || !dirty}
            className={`rounded-[10px] px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${dirty ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-100 text-slate-400"}`}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </form>
  );
}
