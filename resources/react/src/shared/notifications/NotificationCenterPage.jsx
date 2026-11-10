import { useEffect, useState } from "react";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { confirmClearNotifications } from "@/shared/utils/userFeedback";
import { cn } from "@/shared/utils/utils";

function BriefCountdown({ item }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, (item.expiresAt || 0) - Date.now()));

  useEffect(() => {
    if (!item.expiresAt) return undefined;
    const timer = window.setInterval(() => setRemaining(Math.max(0, item.expiresAt - Date.now())), 100);
    return () => window.clearInterval(timer);
  }, [item.expiresAt]);

  const total = Math.max(1, item.briefTotal || 1);
  const ratio = Math.max(0, Math.min(1, remaining / total));

  return (
    <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-300" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}

export function NotificationItem({ item, onRemove }) {
  const icon = item.status === "processing" ? "sync" : item.status === "waiting" ? "pending_actions" : item.type === "error" ? "error" : item.type === "success" ? "check_circle" : "info";
  const iconClass = item.status === "processing" ? "animate-spin text-amber-600" : item.status === "waiting" ? "text-amber-600" : item.type === "error" ? "text-red-600" : item.type === "success" ? "text-emerald-600" : "text-sky-600";

  return (
    <article className="border-b border-slate-100 bg-white px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-2.5">
        <span className={`material-symbols-outlined mt-0.5 shrink-0 text-[19px] ${iconClass}`}>{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-[5px]">
            <h3 className="flex min-w-0 items-center gap-1.5 text-sm font-extrabold text-slate-900">
              <span className="truncate">{item.title}</span>
              {item.count > 1 ? <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600">{item.count}x</span> : null}
            </h3>
            <button type="button" onClick={() => onRemove(item.id)} className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Hapus notifikasi">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p className="mt-0.5 text-sm leading-5 text-slate-600">{item.message}</p>
          {item.status === "processing" ? (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full bg-emerald-500 transition-all ${item.progress === null ? "w-1/3 animate-pulse" : ""}`} style={item.progress === null ? undefined : { width: `${Math.max(3, Math.min(100, item.progress))}%` }} />
            </div>
          ) : null}
          {item.brief ? <BriefCountdown item={item} /> : null}
          {item.status === "waiting" && (item.actionLabel || item.secondaryActionLabel) ? (
            <div className="mt-3 flex flex-wrap gap-[5px]">
              {item.secondaryActionLabel ? <button type="button" onClick={() => item.onSecondaryAction?.()} className="h-8 border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50">{item.secondaryActionLabel}</button> : null}
              {item.actionLabel ? <button type="button" onClick={() => item.onAction?.()} className="h-8 bg-emerald-600 px-3 text-xs font-extrabold text-white hover:bg-emerald-700">{item.actionLabel}</button> : null}
            </div>
          ) : null}
          <p className="mt-1.5 text-[11px] font-semibold text-slate-400">{new Date(item.createdAt).toLocaleString("id-ID")}</p>
        </div>
      </div>
    </article>
  );
}

export function NotificationCenterPanel({
  onClose,
  widthClassName,
  contentClassName,
  closeButton = false,
}) {
  const center = useNotificationCenter();
  const [busy, setBusy] = useState(false);
  const rows = center.activeTab === "queue" ? center.queueItems : center.infoItems;
  const isQueue = center.activeTab === "queue";
  const clearableCount = center.clearableCount;

  const handleClear = async () => {
    if (busy || clearableCount === 0) return;
    const label = isQueue ? "notifikasi antrean" : "notifikasi info";
    if (!(await confirmClearNotifications(label))) return;

    setBusy(true);
    try {
      center.clear(center.activeTab);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={cn("flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-slate-50 shadow-2xl ring-1 ring-slate-200", widthClassName)}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Pusat Notifikasi</p>
          <h2 className="mt-0.5 truncate text-sm font-black text-slate-950">Proses dan informasi terbaru</h2>
        </div>
        {closeButton ? (
          <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Tutup">
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : null}
      </header>
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-2">
        {[{ key: "queue", label: `Antrean (${center.queueItems.length})` }, { key: "info", label: `Info (${center.infoItems.length})` }].map((tab) => (
          <button key={tab.key} type="button" onClick={() => center.setActiveTab(tab.key)} className={`border-b-2 px-3 py-2.5 text-xs font-extrabold ${center.activeTab === tab.key ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          disabled={busy || clearableCount === 0}
          title={isQueue ? "Kosongkan notifikasi antrean yang sudah selesai" : "Kosongkan semua notifikasi info"}
          className="ml-auto flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
          Kosongkan{clearableCount ? ` (${clearableCount})` : ""}
        </button>
      </div>
      <div className={cn("max-h-[min(60vh,26rem)] flex-1 overflow-y-auto", contentClassName)}>
        {rows.length ? rows.map((item) => <NotificationItem key={item.id} item={item} onRemove={center.remove} />) : (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">notifications_off</span>
            <p className="mt-2 text-sm font-bold text-slate-600">Belum ada {isQueue ? "proses dalam antrean" : "informasi"}.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function NotificationCenterPage() {
  const center = useNotificationCenter();
  return (
    <div className="fixed inset-0 z-[180] bg-slate-950/35 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Pusat notifikasi">
      <div className="ml-auto flex h-full w-full max-w-xl flex-col">
        <NotificationCenterPanel
          widthClassName="h-full w-full max-w-xl"
          contentClassName="max-h-none"
          closeButton
          onClose={() => center.setOpen(false)}
        />
      </div>
    </div>
  );
}