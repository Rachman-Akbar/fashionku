import { Link } from "react-router-dom";

export default function ModulePlaceholderPage({
  title,
  group,
  description = "Tampilan frontend modul sudah disiapkan. Integrasi API dapat dilanjutkan ketika backend tersedia.",
  icon = "construction",
  actionHref = "",
  actionLabel = "",
}) {
  return (
    <section className="min-w-0 bg-white p-6 ring-1 ring-slate-200 sm:p-8">
      <div className="flex max-w-3xl items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-700">
          <span className="material-symbols-outlined text-[26px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{group}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Status</p><p className="mt-1 font-extrabold text-slate-900">Frontend Ready</p></div>
            <div className="rounded-[10px] bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Data</p><p className="mt-1 font-extrabold text-slate-900">Menunggu API</p></div>
            <div className="rounded-[10px] bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Akses</p><p className="mt-1 font-extrabold text-slate-900">Sesuai Role</p></div>
          </div>
          {actionHref ? <Link to={actionHref} className="mt-6 inline-flex h-10 items-center gap-[5px] rounded-lg bg-emerald-600 px-4 text-sm font-extrabold text-white hover:bg-emerald-700"><span className="material-symbols-outlined text-[18px]">open_in_new</span>{actionLabel || "Buka"}</Link> : null}
        </div>
      </div>
    </section>
  );
}
