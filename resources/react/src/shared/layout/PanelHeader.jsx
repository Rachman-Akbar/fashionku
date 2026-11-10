import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { Popover } from "@/shared/components/ui/Popover";
import { useSaveShortcut } from "@/shared/layout/useSaveShortcut";
import { confirmLogout } from "@/shared/utils/userFeedback";
import { cn } from "@/shared/utils/utils";

function PanelHeaderComponent({
  eyebrow,
  title,
  storeName,
  userName,
  roleLabel,
  searchPlaceholder,
  actionHref,
  actionLabel,
  accentTextClassName,
  avatarClassName,
  focusClassName,
  actionClassName,
  notificationClassName,
  mobileNavigation,
  notificationCount,
  notificationConnected,
  notificationPanel,
  onNotificationOpen,
  modeHeader,
  backToMarketplace,
}) {
  const initial = userName?.slice(0, 1)?.toUpperCase() || "U";
  const center = useNotificationCenter();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutPending, setLogoutPending] = useState(false);
  const localUnreadCount = center.queueItems.length + center.infoItems.length;
  const unreadCount = notificationCount ?? localUnreadCount;
  const hasRealtimeNotification = notificationCount !== undefined;

  useSaveShortcut();

  const handleLogout = async () => {
    if (logoutPending) return;
    if (!(await confirmLogout())) return;
    setLogoutPending(true);
    try {
      await logout();
      navigate(roleLabel?.toLowerCase().includes("admin") ? "/admin/login" : "/auth/login", { replace: true });
    } finally {
      setLogoutPending(false);
    }
  };

  const handleNotificationOpenChange = (next) => {
    if (next) {
      center.openPanel(center.activeTab);
      return;
    }
    center.closePanel();
  };

  const notificationButton = (state) => (
    <button
      type="button"
      onClick={state?.toggle}
      aria-expanded={notificationPanel ? state?.open : undefined}
      className={cn("relative flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 transition", notificationClassName)}
      aria-label="Notifikasi"
    >
      <span className={`material-symbols-outlined text-[20px] ${unreadCount ? "animate-pulse text-amber-600" : ""}`}>{unreadCount ? "notifications_active" : "notifications"}</span>
      {unreadCount ? <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{Math.min(99, unreadCount)}</span> : null}
      {hasRealtimeNotification ? <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${notificationConnected ? "bg-emerald-500" : "bg-amber-500"}`} /> : null}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className={cn("text-xs font-bold uppercase tracking-[0.22em]", accentTextClassName)}>{eyebrow}</p>
            <h1 className="truncate text-base font-extrabold text-slate-950">{title}</h1>
          </div>

          {searchPlaceholder ? (
            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <div className={cn("flex w-full max-w-xl items-center rounded-lg bg-slate-50 px-3 py-2 focus-within:bg-white", focusClassName)}>
                <span className="material-symbols-outlined mr-2 text-[20px] text-slate-400">search</span>
                <input className="w-full bg-transparent text-sm outline-none" placeholder={searchPlaceholder} />
              </div>
            </div>
          ) : <div className="min-w-0 flex-1" />}

          <div className="flex items-center gap-[5px]">
            {actionHref ? (
              <Link to={actionHref} className={cn("hidden rounded-lg bg-white px-3 py-2 text-xs font-extrabold text-slate-700 transition sm:inline-flex", actionClassName)}>{actionLabel}</Link>
            ) : null}
            {modeHeader ? <>{modeHeader}</> : null}
            {notificationPanel ? (
              <Popover
                trigger={(state) => notificationButton(state)}
                onOpenChange={(next) => {
                  onNotificationOpen?.(next);
                  handleNotificationOpenChange(next);
                }}
                open={center.open && center.openMode === "panel"}
              >
                {notificationPanel}
              </Popover>
            ) : notificationButton()}
            {backToMarketplace ? (
              <Popover
                trigger={({ toggle, open }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={open}
                    className="flex items-center gap-[5px] rounded-lg bg-white px-2.5 py-1.5 text-left hover:bg-slate-50"
                    aria-label="Buka menu kembali ke marketplace"
                  >
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-white", avatarClassName)}>
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                    </div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="max-w-[150px] truncate text-xs font-extrabold text-slate-900">{storeName || title || userName}</p>
                      <p className="text-[10px] font-semibold text-slate-400">{userName}</p>
                    </div>
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="w-64 overflow-hidden rounded-[10px] border border-slate-200 bg-white p-1.5 shadow-2xl">
                    <Link
                      to="/"
                      onClick={close}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-extrabold text-slate-800 transition hover:bg-slate-50"
                    >
                      <span className="material-symbols-outlined text-[19px] text-emerald-600">storefront</span>
                      <span className="min-w-0 flex-1 truncate">Kembali ke Marketplace</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => { close(); handleLogout(); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-extrabold text-red-600 transition hover:bg-red-50"
                    >
                      <span className="material-symbols-outlined text-[19px]">logout</span>
                      <span className="min-w-0 flex-1 truncate">Logout</span>
                    </button>
                  </div>
                )}
              </Popover>
            ) : (
              <button type="button" onClick={handleLogout} disabled={logoutPending} className="flex items-center gap-[5px] rounded-lg bg-white px-2.5 py-1.5 text-left hover:bg-slate-50 disabled:opacity-60" aria-label="Buka logout">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white", avatarClassName)}>{initial}</div>
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-[120px] truncate text-xs font-extrabold text-slate-900">{userName}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{roleLabel}</p>
                </div>
                <span className="material-symbols-outlined hidden text-[17px] text-slate-400 sm:block">expand_more</span>
              </button>
            )}
          </div>
        </div>
      </header>
      {mobileNavigation}
    </>
  );
}

export const PanelHeader = memo(PanelHeaderComponent);