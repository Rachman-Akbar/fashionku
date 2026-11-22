import { useMemo, useState } from "react";
import AdminStoreAddressPage from "@/features/admin/store/pages/AdminStoreAddressPage";
import AdminQrisSettingsPage from "@/features/admin/store/components/AdminQrisSettingsPage";
import AdminShippingSettingsPage from "@/features/admin/shipping/pages/AdminShippingSettingsPage";
import CodePatternSettingsPage from "@/features/advanced/pages/CodePatternSettingsPage";

const TABS = [
  { key: "biodata", label: "Biodata", icon: "badge" },
  { key: "pengiriman-pembayaran", label: "Pengiriman dan Pembayaran", icon: "local_shipping" },
  { key: "kode", label: "Kode", icon: "tune" },
];

export default function AdminStoreSettingsPage() {
  const [tab, setTab] = useState("biodata");

  const content = useMemo(() => {
    if (tab === "kode") {
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">Kode Custom</h2>
            <p className="mt-1 text-sm text-slate-500">Atur pola kode unik otomatis untuk produk, bahan baku, pesanan, dan stok.</p>
          </div>
          <CodePatternSettingsPage />
        </section>
      );
    }
    if (tab === "pengiriman-pembayaran") {
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Pengaturan Pengiriman & Ongkir</h2>
              <p className="mt-1 text-sm text-slate-500">Atur tarif dasar, tarif per kilometer, dan radius gratis ongkir.</p>
            </div>
            <AdminShippingSettingsPage />
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Pembayaran QRIS</h2>
              <p className="mt-1 text-sm text-slate-500">Tampilkan gambar QRIS pembayaran pada halaman checkout pembeli.</p>
            </div>
            <AdminQrisSettingsPage />
          </section>
        </div>
      );
    }
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">Alamat Toko</h2>
          <p className="mt-1 text-sm text-slate-500">Informasi alamat dan koordinat asal toko untuk operasional dan perhitungan ongkir.</p>
        </div>
        <AdminStoreAddressPage />
      </section>
    );
  }, [tab]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-0">
      <div className="sticky top-0 z-30 -mx-6 -mt-px border-b border-slate-200 bg-slate-50 px-6 pt-0.5 pb-0.5">
        <div className="overflow-x-auto">
          <div role="tablist" aria-label="Pengaturan toko" className="flex min-w-max items-end gap-0.5">
            {TABS.map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`store-settings-${item.key}`}
                  onClick={() => setTab(item.key)}
                  className={`flex h-9 min-w-24 items-center justify-center gap-1.5 px-3 text-[13px] font-bold transition-colors ${active ? "bg-white text-slate-900 shadow-sm" : "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={`material-symbols-outlined text-[17px] ${active ? "text-emerald-600" : "text-slate-400"}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div id={`store-settings-${tab}`} role="tabpanel" className="space-y-6 pt-2">
        {content}
      </div>
    </div>
  );
}
