import AdminQrisSettingsPage from "@/features/admin/store/components/AdminQrisSettingsPage";
import AdminShippingSettingsPage from "@/features/admin/shipping/pages/AdminShippingSettingsPage";

export default function AdminStoreShippingPaymentPage() {
  return (
    <section className="grid items-start gap-6 md:grid-cols-2">
      <div>
        <div className="mb-3">
          <h2 className="text-base font-extrabold text-slate-900">Pengaturan Pengiriman &amp; Ongkir</h2>
          <p className="mt-1 text-sm text-slate-500">
            Atur tarif dasar, tarif per kilometer, dan radius gratis ongkir.
          </p>
        </div>
        <AdminShippingSettingsPage />
      </div>
      <div>
        <div className="mb-3">
          <h2 className="text-base font-extrabold text-slate-900">Pembayaran QRIS</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tampilkan gambar QRIS pembayaran pada halaman checkout pembeli.
          </p>
        </div>
        <AdminQrisSettingsPage />
      </div>
    </section>
  );
}