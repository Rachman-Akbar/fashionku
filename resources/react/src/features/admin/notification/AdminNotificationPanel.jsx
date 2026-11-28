import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/shared/utils/utils";
import { toastSuccess, toastError } from "@/shared/utils/userFeedback";

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
};

const ANTREAN_MODULES = ["users", "promotions", "categories", "products", "stock", "vouchers", "payments", "shipments", "support", "chat"];
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

  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function getNotificationStatus(item) {
  return item.status || (item.read_at ? "read" : "unread");
}

function isSuccessNotification(item) {
  const status = getNotificationStatus(item);
  return status === "success" || status === "done" || status === "completed";
}

function isFailedNotification(item) {
  const status = getNotificationStatus(item);
  return status === "failed" || status === "error" || status === "rejected";
}

function getTabForModule(module) {
  if (MARKETPLACE_MODULES.includes(module)) return "marketplace";
  return "antrean";
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
  onDelete,
  widthClassName,
  contentClassName,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("antrean");

  const filteredItems = useMemo(() => {
    return items.filter((item) => getTabForModule(item.module) === activeTab);
  }, [items, activeTab]);

  const unreadCount = useMemo(() => {
    return filteredItems.filter((item) => !item.read_at).length;
  }, [filteredItems]);

  const handleOpen = useCallback((item) => {
    const tab = getTabForModule(item.module);
    const success = isSuccessNotification(item);
    const failed = isFailedNotification(item);

    if (!item.read_at) {
      onMarkRead?.(item.id);
    }

    if (tab === "antrean") {
      if (success) {
        toastSuccess("Sukses", item.title);
        if (item.url) {
          navigate(item.url);
        }
        onClose?.();
      } else if (failed) {
        if (item.url) {
          navigate(item.url);
          onClose?.();
        }
      } else if (item.url) {
        navigate(item.url);
        onClose?.();
      }
    } else if (tab === "marketplace") {
      if (success) {
        toastSuccess("Marketplace", item.title);
        if (item.url) {
          navigate(item.url);
        }
        onClose?.();
      } else if (failed) {
        if (item.url) {
          navigate(item.url);
          onClose?.();
        }
      } else if (item.url) {
        navigate(item.url);
        onClose?.();
      }
    }
  }, [navigate, onMarkRead, onClose]);

  const handleDelete = useCallback((id, event) => {
    event.stopPropagation();
    onDelete?.(id);
  }, [onDelete]);

  const handleMarkAllRead = useCallback(() => {
    const module = activeTab === "marketplace" ? "orders" : null;
    onMarkAllRead?.(module);
  }, [activeTab, onMarkAllRead]);

  const getClearableCount = useCallback(() => {
    return filteredItems.filter((item) => {
      if (activeTab === "antrean") {
        return isSuccessNotification(item) && item.read_at;
      }
      return isSuccessNotification(item);
    }).length;
  }, [filteredItems, activeTab]);

  const handleClear = useCallback(async () => {
    const module = activeTab === "marketplace" ? "orders" : null;
    try {
      await onMarkAllRead?.(module);
    } catch (err) {
      // noop
    }
  }, [activeTab, onMarkAllRead]);

  const tabConfigs = [
    { key: "antrean", label: `Antrean (${items.filter(i => getTabForModule(i.module) === "antrean").length})`, icon: "pending_actions" },
    { key: "marketplace", label: `Marketplace (${items.filter(i => getTabForModule(i.module) === "marketplace").length})`, icon: "storefront" },
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Notifikasi Admin
          </p>
          <h2 className="mt-0.5 flex items-center gap-2 truncate text-sm font-black text-slate-950">
            {activeTab === "antrean" ? "Aktivitas Admin" : "Aktivitas Marketplace"}
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
        {tabConfigs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 h-8 rounded-md px-2 text-[11px] font-extrabold transition-colors ${
              activeTab === tab.key
                ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="ml-auto flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className={cn("material-symbols-outlined text-[15px]", refreshing && "animate-spin")}>refresh</span>
          Muat ulang
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-2 py-1.5">
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-700 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[15px]">done_all</span>
          Tandai dibaca{unreadCount ? ` (${unreadCount})` : ""}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={getClearableCount() === 0}
          title={activeTab === "antrean" ? "Kosongkan antrean yang sudah selesai" : "Kosongkan notifikasi marketplace yang sudah selesai"}
          className="ml-auto flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
          Kosongkan{getClearableCount() ? ` (${getClearableCount()})` : ""}
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

        {!loading && !filteredItems.length && !error ? (
          <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              {activeTab === "antrean" ? "pending_actions" : "storefront"}
            </span>
            <p className="mt-2 text-sm font-bold text-slate-600">
              Belum ada {activeTab === "antrean" ? "aktivitas antrean" : "aktivitas marketplace"}.
            </p>
          </div>
        ) : null}

        {filteredItems.map((item) => {
          const unread = !item.read_at;
          const success = isSuccessNotification(item);
          const failed = isFailedNotification(item);
          const tab = getTabForModule(item.module);

          let itemClassName = cn(
            "flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-white",
            unread ? "bg-emerald-50/60" : "bg-transparent",
          );

          if (success && item.read_at) {
            itemClassName = cn(itemClassName, "opacity-60 bg-slate-50/50");
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpen(item)}
              className={itemClassName}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  unread ? "bg-emerald-500" : success ? "bg-emerald-400" : failed ? "bg-rose-400" : "bg-transparent",
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
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-500">
                    {moduleLabel(item.module)}
                  </span>
                  {success && (
                    <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">check_circle</span>
                      Selesai
                    </span>
                  )}
                  {failed && (
                    <span className="inline-flex items-center rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">error</span>
                      Gagal
                    </span>
                  )}
                  {unread && !success && !failed && (
                    <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      <span className="material-symbols-outlined text-[10px] mr-0.5">pending</span>
                      Baru
                    </span>
                  )}
                </div>
              </span>
              {(success && item.read_at) || failed ? (
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Hapus notifikasi"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}