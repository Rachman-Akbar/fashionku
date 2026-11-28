import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/utils/utils";
import { showSuccess } from "@/shared/utils/sweetAlert";
import { markHppSeen } from "@/shared/utils/hppSeen";

const MODULE_LABELS = {
  orders: "Pesanan",
  chat: "Chat",
  support: "Bantuan",
  promotions: "Promosi",
  users: "Pengguna",
  categories: "Kategori",
  products: "Produk",
  stock: "Stok",
  vouchers: "Voucher",
  payments: "Pembayaran",
  shipments: "Pengiriman",
  hpp: "HPP",
};

const MARKETPLACE_MODULES = ["orders"];

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

  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getNotificationStatus(item) {
  return item.status || (item.read_at ? "read" : "unread");
}

function isProcessingNotification(item) {
  const status = getNotificationStatus(item);
  return status === "processing" || status === "waiting";
}

function isSuccessNotification(item) {
  const status = getNotificationStatus(item);
  return status === "done" || status === "success" || item.type === "success";
}

function isFailedNotification(item) {
  const status = getNotificationStatus(item);
  return status === "failed" || status === "error" || item.type === "error";
}

function getTabForModule(module) {
  return MARKETPLACE_MODULES.includes(module) ? "marketplace" : "antrean";
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
  onDelete,
  widthClassName,
  contentClassName,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");
  const seenProcessingRef = useRef(new Set());

  // Saat proses baru (mis. aksi CRUD) masuk, pindah ke tab yang menampilkannya
  // agar antrean yang sedang berjalan langsung terlihat tanpa klik manual.
  useEffect(() => {
    const processingIds = new Set(
      items.filter((item) => isProcessingNotification(item)).map((item) => String(item.id)),
    );
    const hasNew = [...processingIds].some((id) => !seenProcessingRef.current.has(id));
    seenProcessingRef.current = processingIds;
    if (!hasNew) return;
    const first = items.find((item) => processingIds.has(String(item.id)));
    if (!first) return;
    const tab = getTabForModule(first.module);
    setActiveTab((current) => (current === tab ? current : tab));
  }, [items]);

  const filteredItems = useMemo(
    () => items.filter((item) => getTabForModule(item.module) === activeTab),
    [items, activeTab],
  );

  const clearableItems = useMemo(
    () => filteredItems.filter((item) => isSuccessNotification(item) || item.alert),
    [filteredItems],
  );

  const hasProcessing = useMemo(
    () => filteredItems.some((item) => isProcessingNotification(item)),
    [filteredItems],
  );

  const tabCounts = useMemo(() => ({
    antrean: items.filter((item) => getTabForModule(item.module) === "antrean").length,
    marketplace: items.filter((item) => getTabForModule(item.module) === "marketplace").length,
  }), [items]);

  const handleOpen = useCallback((item) => {
    if (isProcessingNotification(item)) return;
    if (!item.read_at) onMarkRead?.(item.id);

    if (isSuccessNotification(item)) showSuccess("Sukses", item.title);
    if (item.url) {
      navigate(item.url);
      onClose?.();
    }
  }, [navigate, onMarkRead, onClose]);

  const handleDelete = useCallback((id, event) => {
    event?.stopPropagation?.();
    onDelete?.(id);
  }, [onDelete]);

const handleClear = useCallback(() => {
    if (!clearableItems.length) return;
    clearableItems.forEach((item) => onDelete?.(item.id));
    markHppSeen();
  }, [clearableItems, onDelete]);

  const renderActions = (item) => {
    if (isProcessingNotification(item)) return null;

    if (isFailedNotification(item)) {
      return (
        <span className="flex shrink-0 items-center gap-1.5">
          {item.onAction ? (
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); item.onAction?.(); }}
              className="h-7 rounded-md bg-emerald-600 px-3 text-xs font-extrabold text-white transition-colors hover:bg-emerald-700"
            >
              {item.actionLabel || "Coba Lagi"}
            </button>
          ) : null}
          {item.onSecondaryAction ? (
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); item.onSecondaryAction?.(); }}
              className="h-7 rounded-md border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {item.secondaryActionLabel || "Lihat Detail"}
            </button>
          ) : null}
        </span>
      );
    }

    if (isSuccessNotification(item) && item.read_at) {
      return (
        <button
          type="button"
          onClick={(event) => handleDelete(item.id, event)}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Hapus notifikasi"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      );
    }

    return null;
  };

  const tabs = [
    { key: "antrean", label: "Antrean", icon: "pending_actions" },
    { key: "marketplace", label: "Marketplace", icon: "storefront" },
  ];

  return (
    <section
      className={cn(
        "flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden bg-slate-50 shadow-2xl ring-1 ring-slate-200",
        widthClassName,
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Notifikasi Admin</p>
          <h2 className="mt-0.5 flex items-center gap-2 truncate text-sm font-black text-slate-950">
            Pusat Aktivitas
            <span
              className={cn("inline-block h-2 w-2 rounded-full", connected ? "bg-emerald-500" : "bg-amber-500")}
              title={connected ? "Realtime tersambung" : "Realtime terputus"}
            />
            {hasProcessing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                Memproses
              </span>
            ) : null}
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Muat ulang"
          title="Muat ulang notifikasi"
        >
          <span className={cn("material-symbols-outlined text-[18px]", refreshing && "animate-spin")}>refresh</span>
        </button>
      </header>

      <div className="grid grid-cols-2 gap-1 border-b border-slate-200 bg-white p-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg text-[11px] font-extrabold transition-colors",
                active ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              {tab.label}
              <span className={cn("rounded-full px-1.5 text-[10px] font-black", active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600")}>{tabCounts[tab.key]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end border-b border-slate-200 bg-white px-2 py-1.5">
        <button
          type="button"
          onClick={handleClear}
          disabled={clearableItems.length === 0}
          title={activeTab === "antrean" ? "Kosongkan antrean yang sudah selesai" : "Kosongkan notifikasi marketplace yang sudah selesai"}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
          Kosongkan{clearableItems.length ? ` (${clearableItems.length})` : ""}
        </button>
      </div>

      <div className={cn("max-h-[min(60vh,26rem)] flex-1 overflow-y-auto", contentClassName)}>
        {error ? <p className="px-4 py-3 text-xs font-semibold text-rose-600">{error}</p> : null}

        {loading && !items.length ? (
          <div className="flex min-h-40 items-center justify-center px-6 py-10 text-sm font-bold text-slate-500">Memuat notifikasi...</div>
        ) : null}

        {!loading && !filteredItems.length && !error ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">{activeTab === "antrean" ? "pending_actions" : "storefront"}</span>
            <p className="mt-2 text-sm font-bold text-slate-600">Belum ada {activeTab === "antrean" ? "aktivitas antrean" : "aktivitas marketplace"}.</p>
          </div>
        ) : null}

        {filteredItems.map((item) => {
          const unread = !item.read_at;
          const success = isSuccessNotification(item);
          const failed = isFailedNotification(item);
          const processing = isProcessingNotification(item);

          let itemClassName = cn(
            "flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-white",
            unread ? "bg-emerald-50/60" : "bg-transparent",
            processing && "bg-amber-50/30 animate-pulse",
          );
          if (success && item.read_at) itemClassName = cn(itemClassName, "opacity-60 bg-slate-50/50");

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpen(item)}
              className={itemClassName}
              disabled={processing}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  unread ? "bg-emerald-500" : success ? "bg-emerald-400" : failed ? "bg-rose-400" : processing ? "bg-amber-400 animate-pulse" : "bg-transparent",
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-extrabold text-slate-900">{item.title}</span>
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400">{item.progress !== undefined && item.progress !== null ? `${Math.round(item.progress)}%` : relativeTime(item.created_at)}</span>
                </span>
                {item.message ? <span className="mt-0.5 line-clamp-2 block text-xs font-medium text-slate-500">{item.message}</span> : null}
                {processing && item.progress !== undefined && item.progress !== null ? (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.max(3, Math.min(100, item.progress))}%` }} />
                  </div>
                ) : null}
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-500">{moduleLabel(item.module)}</span>
                  {success ? (
                    <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">check_circle</span>Selesai
                    </span>
                  ) : null}
                  {failed ? (
                    <span className="inline-flex items-center rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">error</span>Gagal
                    </span>
                  ) : null}
                  {processing ? (
                    <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5 animate-spin">sync</span>Memproses
                    </span>
                  ) : null}
                  {unread && !success && !failed && !processing ? (
                    <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">pending</span>Baru
                    </span>
                  ) : null}
                </div>
              </span>
              {renderActions(item)}
            </button>
          );
        })}
      </div>
    </section>
  );
}