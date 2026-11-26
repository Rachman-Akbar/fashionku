import AdminStoreAddressPage from "@/features/admin/store/pages/AdminStoreAddressPage";

export default function AdminStoreBiodataPage() {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-extrabold text-slate-900">Alamat Toko</h2>
        <p className="mt-1 text-sm text-slate-500">
          Informasi alamat dan koordinat asal toko untuk operasional dan perhitungan ongkir.
        </p>
      </div>
      <AdminStoreAddressPage />
    </section>
  );
}