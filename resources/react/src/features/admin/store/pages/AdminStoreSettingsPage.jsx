import { useCallback, useState } from "react";
import AdminStoreAddressPage from "@/features/admin/store/pages/AdminStoreAddressPage";
import AdminQrisSettingsPage from "@/features/admin/store/components/AdminQrisSettingsPage";
import AdminShippingSettingsPage from "@/features/admin/shipping/pages/AdminShippingSettingsPage";
import CodePatternSettingsPage from "@/features/advanced/pages/CodePatternSettingsPage";

/**
 * Pengaturan Toko disatukan dalam SATU halaman: biodata/alamat, pengiriman &
 * pembayaran, serta kode custom tampil berurutan (bukan halaman terpisah).
 * Navigasi cepat di atas hanya menggulir ke bagian yang dituju.
 */
const SECTIONS = [
  { key: "biodata", label: "Biodata & Alamat", icon: "badge" },
  { key: "pengiriman-pembayaran", label: "Pengiriman & Pembayaran", icon: "local_shipping" },
  { key: "kode", label: "Kode Custom", icon: "tune" },
];

export default function AdminStoreSettingsPage() {
  const [active, setActive] = useState(SECTIONS[0].key);

  const jumpTo = useCallback((key) => {
    setActive(key);
    const target = document.getElementById(`store-settings-${key}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <div className="sticky top-0 z-30 -mx-6 -mt-px border-b border-slate-200 bg-slate-50 px-6 pt-0.5 pb-0.5">
        <div className="overflow-x-auto">
          <div role="tablist" aria-label="Pengaturan toko" className="flex min-w-max items-end gap-0.5">
            {SECTIONS.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`store-settings-${item.key}`}
                  onClick={() => jumpTo(item.key)}
                  className={`flex h-9 min-w-24 items-center justify-center gap-1.5 px-3 text-[13px] font-bold transition-colors ${isActive ? "bg-white text-slate-900 shadow-sm" : "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900"}`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${isActive ? "text-emerald-600" : "text-slate-400"}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section id="store-settings-biodata" role="tabpanel" className="scroll-mt-14 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
        <div className="mb-3">
          <h2 className="text-base font-extrabold text-slate-900">Alamat Toko</h2>
          <p className="mt-1 text-sm text-slate-500">Informasi alamat dan koordinat asal toko untuk operasional dan perhitungan ongkir.</p>
        </div>
        <AdminStoreAddressPage />
      </section>

      <section id="store-settings-pengiriman-pembayaran" role="tabpanel" className="scroll-mt-14 border-t border-slate-200 pt-4">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3">
              <h2 className="text-base font-extrabold text-slate-900">Pengaturan Pengiriman & Ongkir</h2>
              <p className="mt-1 text-sm text-slate-500">Atur tarif dasar, tarif per kilometer, dan radius gratis ongkir.</p>
            </div>
            <AdminShippingSettingsPage />
          </div>
          <div>
            <div className="mb-3">
              <h2 className="text-base font-extrabold text-slate-900">Pembayaran QRIS</h2>
              <p className="mt-1 text-sm text-slate-500">Tampilkan gambar QRIS pembayaran pada halaman checkout pembeli.</p>
            </div>
            <AdminQrisSettingsPage />
          </div>
        </div>
      </section>

      <section id="store-settings-kode" role="tabpanel" className="scroll-mt-14 border-t border-slate-200 pt-4">
        <div className="mb-3">
          <h2 className="text-base font-extrabold text-slate-900">Kode Custom</h2>
          <p className="mt-1 text-sm text-slate-500">Atur pola kode unik otomatis untuk produk, bahan baku, pesanan, dan stok.</p>
        </div>
        <CodePatternSettingsPage />
      </section>
    </div>
  );
}
