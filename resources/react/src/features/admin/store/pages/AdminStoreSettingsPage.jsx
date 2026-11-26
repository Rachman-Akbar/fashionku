import { NavLink, Outlet } from "react-router-dom";

/**
 * Pengaturan Toko kini memakai rute bersarang: setiap tab adalah halaman
 * tersendiri (URL berbeda) yang dirender lewat <Outlet />, bukan lagi satu
 * halaman panjang yang di-scroll. Warna mengikuti palet & mode tema aktif
 * melalui token --color-primary* dan override .profile-theme.
 */
const SECTIONS = [
  { key: "biodata", label: "Biodata & Alamat", icon: "badge" },
  { key: "pengiriman-pembayaran", label: "Pengiriman & Pembayaran", icon: "local_shipping" },
  { key: "kode", label: "Kode Custom", icon: "tune" },
];

export default function AdminStoreSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="sticky top-0 z-30 -mx-6 -mt-px border-b border-slate-200 bg-white px-6 pt-0.5 pb-0.5">
        <div className="overflow-x-auto">
          <nav aria-label="Pengaturan toko" className="flex min-w-max items-center gap-1 py-1">
            {SECTIONS.map((item) => (
              <NavLink
                key={item.key}
                to={`/admin/store/${item.key}`}
                className={({ isActive }) =>
                  [
                    "flex h-9 min-w-24 items-center justify-center gap-1.5 rounded-[10px] px-3 text-[13px] font-bold transition-colors",
                    isActive
                      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined text-[17px] ${
                        isActive ? "text-[var(--color-primary)]" : "text-slate-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}