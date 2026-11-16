import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getAdminMode, setAdminMode } from "@/features/admin/adminMode";
import { confirmPanelModeSwitch } from "@/shared/utils/userFeedback";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";
import { cn } from "@/shared/utils/utils";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },
  { href: "/admin/products", label: "Produk", icon: "inventory_2", group: "Katalog" },
  { href: "/admin/stock", label: "Stok", icon: "warehouse", group: "Katalog" },
  { href: "/admin/bahan-baku", label: "Bahan Baku", icon: "science", group: "Operasional" },
  { href: "/admin/orders", label: "Pesanan", icon: "receipt_long", group: "Transaksi" },
  { href: "/admin/vouchers", label: "Voucher", icon: "confirmation_number", group: "Promo" },
  { href: "/admin/promotions", label: "Promosi", icon: "campaign", group: "Promo" },
  { href: "/admin/reviews", label: "Ulasan", icon: "reviews", group: "Transaksi" },
  { href: "/admin/customers", label: "Pelanggan", icon: "group", group: "Transaksi" },
  { href: "/admin/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Keuangan" },
  { href: "/admin/categories", label: "Kategori", icon: "account_tree", group: "Master Data" },
  { href: "/admin/users", label: "Pengguna", icon: "group", group: "Manajemen" },
  { href: "/admin/planner", label: "Jadwal / Pengingat", icon: "calendar_month", group: "Operasional", iconColor: "#06b6d4" },
  { href: "/admin/chat", label: "Chat Pembeli", icon: "chat", group: "Bantuan", noChildTabs: true, iconColor: "#3b82f6" },
  { href: "/admin/help", label: "Bantuan", icon: "help_outline", group: "Bantuan", iconColor: "#ec4899" },
  { href: "/admin/store", label: "Alamat Toko", icon: "storefront", group: "Pengaturan" },
  { href: "/admin/shipping", label: "Ongkir", icon: "local_shipping", group: "Pengaturan" },
  { href: "/admin/code-settings", label: "Kode", icon: "tune", group: "Lainnya", noChildTabs: true, hiddenInSidebar: true, pinTop: true },
];

function AdminModeSwitchButton() {
  const mode = getAdminMode();
  const isSeller = mode === "seller";
  const target = isSeller ? "monitor" : "seller";

  const handleSwitch = async () => {
    const targetLabel = isSeller ? "Monitoring Operasional" : "Panel Penjual";
    const description = isSeller
      ? "Anda akan melihat perspektif monitoring operasional toko."
      : "Anda akan mengelola toko sebagai penjual.";
    if (!(await confirmPanelModeSwitch(targetLabel, description))) return;
    setAdminMode(target);
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      title={isSeller ? "Beralih ke Monitoring Operasional" : "Beralih ke Panel Penjual"}
      className="relative flex h-10 items-center gap-1.5 rounded-lg bg-white px-2.5 text-slate-600 hover:bg-slate-50"
      aria-label={isSeller ? "Beralih ke Monitoring Operasional" : "Beralih ke Panel Penjual"}
    >
      <span className="material-symbols-outlined text-[20px]">{isSeller ? "monitor_heart" : "storefront"}</span>
      <span className="hidden text-xs font-extrabold md:inline">{isSeller ? "Monitoring" : "Penjual"}</span>
      <span className="material-symbols-outlined text-[15px] text-slate-400">swap_horiz</span>
    </button>
  );
}

export default function AdminShell({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isChatRoute = pathname === "/admin/chat";

  return (
    <PanelTabsProvider items={ADMIN_NAV_ITEMS}>
      <NotificationFeedbackBridge />
      <div className="h-dvh bg-white text-slate-900">
        <PageTransitionLoader />
        <div className="grid h-full grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)]">
          <PanelSidebar
            items={ADMIN_NAV_ITEMS}
            homeHref="/admin"
            title="Admin"
            sidebarClassName="border-r border-slate-100 bg-white"
            activeClassName="bg-emerald-50 text-emerald-700"
            showHomeLink={false}
            showMarketplaceLink={false}
          />
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <PanelHeader
              eyebrow="Panel Admin"
              title="Administrasi"
              storeName="Administrasi"
              userName={user?.name || "Admin"}
              roleLabel="Admin"
              accentTextClassName="text-emerald-700"
              avatarClassName="bg-slate-900"
              notificationClassName="hover:bg-slate-50"
              mobileNavigation={<PanelMobileNavigation items={ADMIN_NAV_ITEMS} activeClassName="bg-emerald-50 text-emerald-700" />}
              modeHeader={<AdminModeSwitchButton />}
            />
            <PanelTabBar />
            <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white px-0 pt-0 pb-0 sm:px-0 lg:px-0">
              <div className={cn("w-full pt-0 pb-8 min-w-0", isChatRoute ? "flex h-full min-h-0 flex-col" : "")}>
                {children || <RouteOutletBoundary className={cn("h-full w-full min-w-0 max-w-full", isChatRoute && "min-h-0 flex-1")} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PanelTabsProvider>
  );
}
