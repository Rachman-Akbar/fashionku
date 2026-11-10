import { assetUrl } from "@/features/seller/store/services/sellerStoreService";

export function SellerStoreProfileCard({ store }) {
  if (!store) return null;
  const initial = (store.name || "T").trim().slice(0, 1).toUpperCase();

  return (
    <div className="border-b border-slate-100 pb-8">
      {store.bannerUrl ? (
        <img src={assetUrl(store.bannerUrl)} alt={store.name} className="mb-6 h-36 w-full rounded-2xl object-cover" />
      ) : null}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-xl font-semibold text-white">
          {store.logo ? <img src={assetUrl(store.logo)} alt={store.name} className="h-full w-full object-cover" /> : initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{store.name}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${store.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {store.isActive ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          {store.slug ? <p className="mt-0.5 text-xs text-slate-400">/{store.slug}</p> : null}
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {store.description || store.shortDescription || "Belum ada deskripsi toko."}
          </p>
          <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Telepon", store.phone],
              ["Email", store.email],
              ["Kota", store.city],
              ["Provinsi", store.province],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd className="mt-0.5 truncate font-medium text-slate-800">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
