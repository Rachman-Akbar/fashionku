import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/features/admin/layout/AdminShell";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { Button } from "@/shared/components/ui/Button";
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

  return (
    <AdminShell>
      <div className="max-w-2xl">
        <h1 className="text-xl font-black text-slate-900">Pengaturan Ongkir (Haversine)</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ongkir dihitung dari jarak koordinat toko ke alamat penerima. Atur koordinat toko dan tarif di sini.
        </p>
        {loading ? (
          <div className="mt-6 text-sm text-slate-500">Memuat...</div>
        ) : (
          <form onSubmit={onSave} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-700">Latitude Toko</span>
                <input type="number" step="any" required value={form.store_latitude} onChange={set("store_latitude")} className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3" placeholder="-6.200000" />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-700">Longitude Toko</span>
                <input type="number" step="any" required value={form.store_longitude} onChange={set("store_longitude")} className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3" placeholder="106.816666" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-semibold text-slate-700">Tarif per KM (Rp)</span>
              <input type="number" min="0" step="any" value={form.rate_per_km} onChange={set("rate_per_km")} className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3" />
              <span className="mt-1 block text-xs text-slate-500">Biaya per kilometer jarak (Haversine).</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-700">Tarif Dasar / Flat (Rp)</span>
                <input type="number" min="0" step="any" value={form.default_flat_rate} onChange={set("default_flat_rate")} className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3" />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-700">Gratis Ongkir s/d (KM)</span>
                <input type="number" min="0" step="any" value={form.free_shipping_max_distance} onChange={set("free_shipping_max_distance")} className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3" />
              </label>
            </div>
            <p className="text-xs text-slate-500">Rumus: ongkir = tarif dasar + max(0, jarak - gratis s/d) × tarif per KM. Pastikan alamat penerima memiliki koordinat.</p>
            <div className="pt-2">
              <Button type="submit" disabled={saving || !canSave}>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</Button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
