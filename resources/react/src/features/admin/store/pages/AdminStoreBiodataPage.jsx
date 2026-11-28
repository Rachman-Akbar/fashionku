import AdminStoreAddressPage from "@/features/admin/store/pages/AdminStoreAddressPage";

export default function AdminStoreBiodataPage() {
  return (
    <section className="space-y-4">
      <header>
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">badge</span>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
            Biodata & Alamat Toko
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Identitas toko, alamat lengkap, dan koordinat asal pengiriman untuk operasional serta
          perhitungan ongkir.
        </p>
      </header>

      <AdminStoreAddressPage />
    </section>
  );
}
