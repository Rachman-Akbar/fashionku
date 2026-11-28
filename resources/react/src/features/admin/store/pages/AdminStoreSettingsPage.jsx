import { NavLink, Outlet } from "react-router-dom";

/**
 * Pengaturan Toko memakai rute bersarang: setiap tab adalah halaman tersendiri
 * (URL berbeda) yang dirender lewat <Outlet />, bukan satu halaman panjang
 * yang di-scroll. Desain strip tab-nya mengikuti tab editor produk
 * (ProductEditorTabs): bar abu-abu dengan tab putih untuk tab aktif.
 */
const SECTIONS = [
  { key: "biodata", label: "Biodata & Alamat", icon: "badge" },
  { key: "pengiriman-pembayaran", label: "Pengiriman & Pembayaran", icon: "local_shipping" },
  { key: "kode", label: "Kode Custom", icon: "tune" },
];

export default function AdminStoreSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="sticky top-0 z-30 overflow-x-auto border-b border-slate-200 bg-slate-100">
        <nav aria-label="Pengaturan toko" className="flex min-w-max items-end gap-0.5 px-4 pt-2">
          {SECTIONS.map((item) => (
            <NavLink
              key={item.key}
              to={`/admin/store/${item.key}`}
              className={({ isActive }) =>
                [
                  "flex h-9 min-w-24 items-center justify-center gap-1.5 px-3 text-[13px] font-bold transition-colors",
                  isActive
                    ? "bg-white text-slate-900"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900",
                ].join(" ")
              }
            >
              <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-5 pb-6 pt-4">
        <Outlet />
      </div>
    </div>
  );
}
