import AdminQrisSettingsPage from "@/features/admin/store/components/AdminQrisSettingsPage";
import AdminShippingSettingsPage from "@/features/admin/shipping/pages/AdminShippingSettingsPage";

export default function AdminStoreShippingPaymentPage() {
  return (
    <section className="space-y-4">
      <header>
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">local_shipping</span>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
            Pengiriman & Pembayaran
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Tarif ongkir berbasis jarak, gambar QRIS pembayaran, dan pengaturan lain yang berlaku di
          halaman checkout pembeli.
        </p>
      </header>

      <AdminShippingSettingsPage />
      <AdminQrisSettingsPage />
    </section>
  );
}
