import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils/utils";

const MODULE_LABELS = {
  orders: "Pesanan",
  chat: "Chat",
  support: "Bantuan",
  promotions: "Promosi",
  users: "Pengguna",
};

function moduleLabel(module) {
  return MODULE_LABELS[module] || module || "Umum";
}

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "baru saja";
  if (diff < hour) return `${Math.floor(diff / minute)} menit lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} hari lalu`;

  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function AdminNotificationPanel({
  items = [],
  loading = false,
  refreshing = false,
  connected = false,
  error = "",
  onClose,
  onRefresh,
  onMarkRead,
  onMarkAllRead,
  widthClassName,
  contentClassName,
}) {
  const navigate = useNavigate();

  const handleOpen = (item) => {
    if (!item.read_at) onMarkRead?.(item.id);
    if (item.url) {
      navigate(item.url);
      onClose?.();
    }
  };

  return (
    <section
      className={cn(
        "flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-slate-50 shadow-2xl ring-1 ring-slate-200",
        widthClassName,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Notifikasi Admin
          </p>
          <h2 className="mt-0.5 flex items-center gap-2 truncate text-sm font-black text-slate-950">
            Aktivitas marketplace
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                connected ? "bg-emerald-500" : "bg-amber-500",
              )}
              title={connected ? "Realtime tersambung" : "Realtime terputus"}
            />
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </header>

      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className={cn("material-symbols-outlined text-[15px]", refreshing && "animate-spin")}>refresh</span>
          Muat ulang
        </button>
        <button
          type="button"
          onClick={() => onMarkAllRead?.()}
          className="ml-auto flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-700"
        >
          <span className="material-symbols-outlined text-[15px]">done_all</span>
          Tandai dibaca
        </button>
      </div>

      <div className={cn("max-h-[min(60vh,26rem)] flex-1 overflow-y-auto", contentClassName)}>
        {error ? (
          <p className="px-4 py-3 text-xs font-semibold text-rose-600">{error}</p>
        ) : null}

        {loading && !items.length ? (
          <div className="flex min-h-40 items-center justify-center px-6 py-10 text-sm font-bold text-slate-500">
            Memuat notifikasi...
          </div>
        ) : null}

        {!loading && !items.length && !error ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">notifications_off</span>
            <p className="mt-2 text-sm font-bold text-slate-600">Belum ada notifikasi.</p>
          </div>
        ) : null}

        {items.map((item) => {
          const unread = !item.read_at;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpen(item)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-white",
                unread ? "bg-emerald-50/60" : "bg-transparent",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  unread ? "bg-emerald-500" : "bg-transparent",
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-extrabold text-slate-900">{item.title}</span>
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400">{relativeTime(item.created_at)}</span>
                </span>
                {item.message ? (
                  <span className="mt-0.5 line-clamp-2 block text-xs font-medium text-slate-500">{item.message}</span>
                ) : null}
                <span className="mt-1 inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-500">
                  {moduleLabel(item.module)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}