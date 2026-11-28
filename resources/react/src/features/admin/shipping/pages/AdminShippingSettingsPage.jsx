import { useEffect, useMemo, useState } from "react";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

const defaults = {
  store_latitude: "",
  store_longitude: "",
  free_shipping_max_distance: 0,
  default_flat_rate: 0,
  rate_per_km: 0,
};

export default function AdminShippingSettingsPage() {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiClient.get("/api/v1/order/orderings/shipping-settings");
        const data = unwrapApiData(res.data) || {};
        if (!active) return;
        setForm({
          store_latitude: data.store_latitude ?? "",
          store_longitude: data.store_longitude ?? "",
          free_shipping_max_distance: data.free_shipping_max_distance ?? 0,
          default_flat_rate: data.default_flat_rate ?? 0,
          rate_per_km: data.rate_per_km ?? 0,
        });
      } catch (e) {
        if (active) toastError("Pengaturan Ongkir", getApiMessage(e, "Gagal memuat pengaturan ongkir."));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const set = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));
  const setNum = (key) => (value) => setForm((c) => ({ ...c, [key]: value }));
  const canSave = useMemo(() => form.store_latitude !== "" && form.store_longitude !== "", [form]);

  async function onSave(e) {
    e.preventDefault();
    if (!canSave) return toastError("Pengaturan Ongkir", "Koordinat toko wajib diisi.");
    setSaving(true);
    try {
      await apiClient.put("/api/v1/order/orderings/shipping-settings", {
        store_latitude: Number(form.store_latitude),
        store_longitude: Number(form.store_longitude),
        free_shipping_max_distance: Number(form.free_shipping_max_distance || 0),
        default_flat_rate: Number(form.default_flat_rate || 0),
        rate_per_km: Number(form.rate_per_km || 0),
      });
      toastSuccess("Pengaturan Ongkir", "Pengaturan ongkir Haversine berhasil disimpan.");
    } catch (e) {
      toastError("Pengaturan Ongkir", getApiMessage(e, "Gagal menyimpan pengaturan ongkir."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[10px] bg-white p-5 text-sm text-slate-500 ring-1 ring-slate-200">
        Memuat pengaturan ongkir...
      </div>
    );
  }

  return (
    <form onSubmit={onSave}>
      <FormEditorLayout
        className="px-0 py-0"
        actions={(
          <FormActionDock
            tone="emerald"
            save={{ icon: "save", label: "Simpan" }}
            disabled={saving || !canSave}
          />
        )}
      >
        <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
          <div className="flex items-center gap-[5px]">
            <span className="material-symbols-outlined text-slate-400">local_shipping</span>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
              Pengaturan Pengiriman & Ongkir
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Atur titik asal toko, tarif dasar, tarif per kilometer, dan radius gratis ongkir.
          </p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Latitude Toko" hint="Titik asal jarak Haversine." required>
              <input
                type="number"
                step="any"
                required
                value={form.store_latitude}
                onChange={set("store_latitude")}
                disabled={saving}
                className={inputClassName}
                placeholder="-6.200000"
              />
            </FormField>
            <FormField label="Longitude Toko" hint="Titik asal jarak Haversine." required>
              <input
                type="number"
                step="any"
                required
                value={form.store_longitude}
                onChange={set("store_longitude")}
                disabled={saving}
                className={inputClassName}
                placeholder="106.816666"
              />
            </FormField>
            <FormField label="Tarif Dasar / Flat (Rp)">
              <FormattedNumberInput
                decimal
                min="0"
                step="any"
                value={form.default_flat_rate}
                onChange={setNum("default_flat_rate")}
                disabled={saving}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Tarif per KM (Rp)" hint="Biaya per kilometer jarak (Haversine).">
              <FormattedNumberInput
                decimal
                min="0"
                step="any"
                value={form.rate_per_km}
                onChange={setNum("rate_per_km")}
                disabled={saving}
                className={inputClassName}
              />
            </FormField>
            <FormField label="Gratis Ongkir s/d (KM)" hint="Jarak maksimal yang dibebaskan dari ongkir.">
              <FormattedNumberInput
                decimal
                min="0"
                step="any"
                value={form.free_shipping_max_distance}
                onChange={setNum("free_shipping_max_distance")}
                disabled={saving}
                className={inputClassName}
              />
            </FormField>
          </div>

          <p className="mt-3 rounded-[10px] bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Rumus: ongkir = tarif dasar + max(0, jarak - gratis s/d) × tarif per KM. Pastikan alamat
            penerima memiliki koordinat.
          </p>
        </section>
      </FormEditorLayout>

      <FormEditorFooter
        submitLabel="Simpan Pengaturan"
        submitIcon="save"
        disabled={saving || !canSave}
        tone="emerald"
      />
    </form>
  );
}
