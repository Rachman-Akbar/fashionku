import { cn } from "@/shared/utils/utils";

/**
 * Kerangka kartu panel dashboard: judul + ikon + aksi opsional.
 * Semua panel dashboard memakai komponen ini agar jarak, radius, dan
 * hierarki teks konsisten.
 */
export function SectionCard({ title, subtitle, icon, iconClassName, action, className, children }) {
  return (
    <section className={cn("rounded-[12px] border border-slate-200 bg-white p-4 sm:p-5", className)}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]", iconClassName || "bg-emerald-50 text-emerald-700")}>
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-base font-extrabold leading-tight text-slate-950">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

/** Tampilan kosong ringan untuk panel yang belum punya data. */
export function PanelEmpty({ icon = "inbox", text, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
      <span className="material-symbols-outlined text-[28px] text-slate-400">{icon}</span>
      <p className="mt-2 text-sm font-bold text-slate-600">{text}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

/** Status chip seragam (pesanan, kasbon, pembayaran). */
export function Badge({ children, className }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset", className)}>
      {children}
    </span>
  );
}
