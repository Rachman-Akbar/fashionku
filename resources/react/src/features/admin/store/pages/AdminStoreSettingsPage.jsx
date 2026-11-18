import { useState } from "react";
import AdminStoreAddressPage from "@/features/admin/store/pages/AdminStoreAddressPage";
import AdminQrisSettingsPage from "@/features/admin/store/components/AdminQrisSettingsPage";
import AdminShippingSettingsPage from "@/features/admin/shipping/pages/AdminShippingSettingsPage";
import CodePatternSettingsPage from "@/features/advanced/pages/CodePatternSettingsPage";

const TABS = [
  { key: "biodata", label: "Biodata", icon: "badge" },
  { key: "kode", label: "Kode", icon: "tune" },
];

export default function AdminStoreSettingsPage() {
  const [tab, setTab] = useState("biodata");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div
        role="tablist"
        aria-label="Pengaturan toko"
        className="flex w-fit max-w-full items-center gap-0.5 rounded-[10px] border border-slate-200 bg-slate-100 p-0.5"
      >
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
              className={`flex min-w-[112px] items-center justify-center gap-1.5 rounded-[8px] px-4 py-1.5 text-xs font-extrabold transition-colors ${
                active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${active ? "text-emerald-600" : "text-slate-400"}`}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div id={`store-settings-${tab}`} role="tabpanel" className="space-y-6">
      {tab === "biodata" ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Alamat Toko</h2>
              <p className="mt-1 text-sm text-slate-500">Informasi alamat dan koordinat asal toko untuk operasional dan perhitungan ongkir.</p>
            </div>
            <AdminStoreAddressPage />
          </section>
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
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">Kode Custom</h2>
            <p className="mt-1 text-sm text-slate-500">Atur pola kode unik otomatis untuk produk, bahan baku, pesanan, dan stok.</p>
          </div>
          <CodePatternSettingsPage />
        </section>
      )}
      </div>
    </div>
  );
}