export function FormPageLayout({ title, subtitle, lead, header, className = "", contentClassName = "", children }) {
  const defaultHeader = title ? (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-extrabold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {lead}
    </header>
  ) : null;

  const headerEl = header !== undefined ? header : defaultHeader;

  return (
    <section className={`w-full min-w-0 rounded-[10px] border border-slate-200 bg-white ${className}`}>
      {headerEl}
      <div className={`space-y-4 px-5 py-4 ${contentClassName}`}>{children}</div>
    </section>
  );
}
