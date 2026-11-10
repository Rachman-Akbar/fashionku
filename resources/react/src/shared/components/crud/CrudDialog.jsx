import { memo, useEffect } from "react";

function DialogHeader({ title, subtitle, onClose, closeLabel = "Tutup" }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
      <div className="min-w-0">
        <h2 className="truncate text-base font-extrabold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {onClose ? (
        <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700" aria-label={closeLabel}>
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      ) : null}
    </div>
  );
}

export const CrudDialog = memo(function CrudDialog({
  open,
  title,
  subtitle,
  children,
  size = "max-w-5xl",
  onClose,
  presentation = "page",
}) {
  const modal = presentation === "modal";

  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    if (modal) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      if (modal) document.body.style.overflow = "";
    };
  }, [modal, onClose, open]);

  if (!open) return null;

  if (!modal) {
    return (
      <section className="w-full min-w-0 animate-ziip-fade-in bg-white" aria-label={title}>
        {title ? <DialogHeader title={title} subtitle={subtitle} onClose={onClose} closeLabel="Tutup halaman data" /> : null}
        {children}
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm">
      <section className={`mx-auto my-6 w-full animate-ziip-fade-in ${size} overflow-hidden rounded-lg bg-slate-100`}>
        <DialogHeader title={title} subtitle={subtitle} onClose={onClose} />
        {children}
      </section>
    </div>
  );
});
