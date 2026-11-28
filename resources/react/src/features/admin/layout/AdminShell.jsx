import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { usePanelBadges } from "@/shared/hooks/usePanelBadges";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import { ImportProgressHost } from "@/shared/excel/ImportProgressHost";
import { FocusModeContext, useFocusModeValue } from "@/shared/layout/FocusModeContext";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";
import { AdminThemeControl } from "@/features/admin/layout/AdminThemeControl";
import { useAdminNotifications } from "@/features/admin/notification/useAdminNotifications";
import { AdminActionTrackerProvider, useAdminActionTrackerContext } from "@/features/admin/notification/AdminActionTrackerContext";
import { AdminNotificationPanel } from "@/features/admin/notification/AdminNotificationPanel";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { cn } from "@/shared/utils/utils";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },

  { href: "/admin/store", label: "Pengaturan Toko", icon: "storefront", group: "Pengaturan Toko", pinTop: true, noChildTabs: true },

  { href: "/admin/products", label: "Product", icon: "inventory_2", group: "Master Data" },
  { href: "/admin/categories", label: "Category", icon: "category", group: "Master Data" },
  { href: "/admin/bahan-baku", label: "Bahan Baku", icon: "science", group: "Master Data" },
  { href: "/admin/customers", label: "Pelanggan", icon: "groups", group: "Master Data" },

  { href: "/admin/orders", label: "Pesanan dan Penjualan", icon: "receipt_long", group: "Operasional" },
  { href: "/admin/stock", label: "Stock", icon: "warehouse", group: "Operasional" },
  { href: "/admin/hpp-report", label: "Laporan HPP", icon: "trending_up", group: "Operasional" },
  { href: "/admin/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Operasional" },

  { href: "/admin/vouchers", label: "Voucher", icon: "confirmation_number", group: "Operasional" },
  { href: "/admin/promotions", label: "Promosi", icon: "campaign", group: "Operasional" },

  { href: "/admin/users", label: "Manajemen User", icon: "manage_accounts", group: "Manajemen User" },

  // Halaman bantuan dibuka lewat tombol "?" pada PanelTabBar. Tanpa entri ini
  // URL /admin/help tidak cocok dengan menu mana pun, sehingga tab induk tidak
  // pernah terbuat dan halaman bantuan tampil kosong/gagal berpindah.
  { href: "/admin/help", label: "Bantuan", icon: "help", group: "Bantuan", hiddenInSidebar: true },

  { href: "/admin/chat", label: "Chat", icon: "chat", group: "Chat", noChildTabs: true, bottom: true },
  { href: "/admin/planner", label: "Jadwal", icon: "event_note", group: "Jadwal", bottom: true },
];

function AdminShellInner({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { resolvedMode, palette } = useTheme();
  const isChatRoute = pathname === "/admin/chat";
  const { badges, lowStock, financeDue, scheduleDue, hppNew } = usePanelBadges("/admin/chat");
  const notifications = useAdminNotifications();
  const actionTracker = useAdminActionTrackerContext();
  const center = useNotificationCenter();
  const focusable = pathname.startsWith("/admin/planner") || pathname.startsWith("/admin/chat");
  const [isFocus, setIsFocus] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(() => new Set());
  const focusValue = useFocusModeValue(isFocus, setIsFocus);

  // Peringatan (badge) yang juga ditampilkan sebagai item notifikasi. Item ini
  // diturunkan dari data badge sehingga muncul lagi setiap kali notifikasi di-
  // refresh, tetapi bisa dikosongkan lewat "Kosongkan" tanpa mengganggu badge
  // (alert) di sidebar.
  const alertItems = useMemo(() => {
    const now = new Date().toISOString();
    const items = [];
    if (lowStock > 0) items.push({ id: "alert:stock", alert: true, module: "stock", type: "warning", title: "Stok menipis", message: `${lowStock} produk perlu restock.`, url: "/admin/stock", read_at: null, created_at: now });
    if (financeDue > 0) items.push({ id: "alert:finance", alert: true, module: "payments", type: "warning", title: "Jatuh tempo terdekat", message: `${financeDue} tagihan jatuh tempo dalam 3 hari.`, url: "/admin/cashflow", read_at: null, created_at: now });
    if (scheduleDue > 0) items.push({ id: "alert:schedule", alert: true, module: "general", type: "warning", title: "Jadwal mendekati", message: `${scheduleDue} jadwal belum selesai dalam 3 hari.`, url: "/admin/planner", read_at: null, created_at: now });
    if (hppNew > 0) items.push({ id: "alert:hpp", alert: true, module: "hpp", type: "warning", title: "Data HPP baru", message: `${hppNew} perubahan HPP baru.`, url: "/admin/hpp-report", read_at: null, created_at: now });
    return items;
  }, [lowStock, financeDue, scheduleDue, hppNew]);

  const visibleAlertItems = useMemo(
    () => alertItems.filter((item) => !dismissedAlerts.has(item.id)),
    [alertItems, dismissedAlerts],
  );

  // Gabungkan antrean aksi live (dari useAdminActionTracker via NotificationCenter)
  // dengan notifikasi server (Reverb). Item live dipetakan ke bentuk yang dipakai
  // AdminNotificationPanel agar proses CRUD yang sedang berjalan langsung tampil
  // di dropdown, lalu otomatis hilang saat sukses atau menetap saat gagal.
  const liveItems = center.items.map((item) => ({
    id: item.id,
    module: item.module || "general",
    type: item.type,
    title: item.title,
    message: item.message,
    status: item.status,
    progress: item.progress ?? undefined,
    read_at: item.read_at || (item.status === "processing" ? null : new Date().toISOString()),
    url: item.url || null,
    created_at: item.createdAt,
    onAction: item.onAction || null,
    onSecondaryAction: item.onSecondaryAction || null,
    live: true,
  }));
  const liveIds = new Set(liveItems.map((item) => String(item.id)));
  const alertIds = new Set(alertItems.map((item) => item.id));
  const mergedItems = [
    ...visibleAlertItems,
    ...liveItems,
    ...notifications.items.filter((item) => !liveIds.has(String(item.id))),
  ];

  const handleDeleteNotification = (id) => {
    if (alertIds.has(id)) {
      setDismissedAlerts((current) => new Set(current).add(id));
      return;
    }
    if (liveIds.has(String(id))) {
      actionTracker.dismiss(id);
      return;
    }
    notifications.deleteNotification(id);
  };

  const handleMarkRead = (id) => {
    if (alertIds.has(id) || liveIds.has(String(id))) return;
    notifications.markRead(id);
  };

  const handleRefresh = () => {
    setDismissedAlerts(new Set());
    notifications.refresh();
  };

  useEffect(() => {
    if (!focusable) setIsFocus(false);
  }, [focusable]);

  useEffect(() => {
    if (!isFocus) return undefined;
    const handler = (event) => { if (event.key === "Escape") setIsFocus(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFocus]);

  return (
    <PanelTabsProvider items={ADMIN_NAV_ITEMS}>
      <FocusModeContext.Provider value={focusValue}>
      <NotificationFeedbackBridge />
      <div className="profile-theme h-dvh bg-white text-slate-900" data-mode={resolvedMode} data-palette={palette}>
        <div className={cn("grid h-full grid-cols-1", isFocus ? "" : "lg:grid-cols-[76px_minmax(0,1fr)]")}>
          {isFocus ? null : <PanelSidebar
            items={ADMIN_NAV_ITEMS}
            badges={badges}
            homeHref="/admin"
            title="Admin"
            showHomeLink={false}
            showMarketplaceLink={false}
          />}
          <div className={cn("flex min-h-0 min-w-0 flex-col overflow-hidden", isFocus ? "" : "lg:pl-[1px]")}>
            {isFocus ? null : <PanelHeader
              eyebrow="Panel Admin"
              title="Administrasi"
              storeName="Administrasi"
              userName={user?.name || "Admin"}
              roleLabel="Admin"
              accentTextClassName="text-[var(--color-primary-strong)]"
              avatarClassName="bg-[var(--color-primary)]"
              notificationClassName="hover:bg-slate-50"
              notificationCount={notifications.unreadCount}
              notificationConnected={notifications.connected}
              notificationPanel={({ close }) => (
                <AdminNotificationPanel
                  items={mergedItems}
                  loading={notifications.loading}
                  refreshing={notifications.refreshing}
                  connected={notifications.connected}
                  error={notifications.error}
                  onClose={close}
                  onRefresh={handleRefresh}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDeleteNotification}
                />
              )}
              onNotificationOpen={(open) => { if (open) handleRefresh(); }}
              mobileNavigation={<PanelMobileNavigation items={ADMIN_NAV_ITEMS} badges={badges} activeClassName="bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]" />}
              modeHeader={<AdminThemeControl />}
            />}
            {isFocus ? null : <PageTransitionLoader variant="below-header" />}
            {isFocus ? null : <PanelTabBar />}
            <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white pt-0 pb-0">
              {/* `min-h-full` penting: halaman detail (CrudDialog
                  presentation="page") diposisikan `absolute inset-0` di dalam
                  container ini. Tanpa tinggi minimum, container ikut menciut
                  setinggi konten yang tersisa sehingga detail hanya tampil
                  sebagai strip tipis di bawah tab dan sisanya putih kosong. */}
              <div id="panel-editor-root" className={cn("relative min-h-full w-full min-w-0 pb-8 pt-0", isChatRoute ? "flex h-full min-h-0 flex-col" : "")}>
                {children || <RouteOutletBoundary className={cn("h-full w-full min-w-0 max-w-full", isChatRoute && "min-h-0 flex-1")} />}
                <ImportProgressHost />
              </div>
            </main>
          </div>
        </div>
      </div>
      </FocusModeContext.Provider>
    </PanelTabsProvider>
  );
}

export default function AdminShell({ children }) {
  return (
    <AdminActionTrackerProvider>
      <AdminShellInner children={children} />
    </AdminActionTrackerProvider>
  );
}


