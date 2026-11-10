export function SellerPanelShell({ children, actions, title, subtitle }) {
  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col">
      {(title || subtitle || actions) ? (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title ? <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
