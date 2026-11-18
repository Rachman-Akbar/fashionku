import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useSellerStore } from "@/features/seller/store/services/sellerStoreService";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";
import { cn } from "@/shared/utils/utils";

export const SELLER_NAV_ITEMS = [
  { href: "/seller", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },
  { href: "/seller/products", label: "Produk", icon: "inventory_2", group: "Katalog", iconColor: "#60a5fa" },
  { href: "/seller/stock", label: "Stok", icon: "warehouse", group: "Katalog", iconColor: "#22d3ee" },
  { href: "/seller/orders", label: "Pesanan", icon: "receipt_long", group: "Penjualan", iconColor: "#fb923c" },
  { href: "/seller/customers", label: "Pelanggan", icon: "group", group: "Penjualan", iconColor: "#fbbf24" },
  { href: "/seller/vouchers", label: "Voucher", icon: "confirmation_number", group: "Promo", iconColor: "#f59e0b" },
  { href: "/seller/promotions", label: "Promosi", icon: "campaign", group: "Promo", iconColor: "#f43f5e" },
  { href: "/seller/reviews", label: "Ulasan", icon: "reviews", group: "Penjualan", iconColor: "#a78bfa" },
  { href: "/seller/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Keuangan", iconColor: "#a3e635" },
  { href: "/seller/receivables-payables", label: "Hutang/Piutang", icon: "payments", group: "Keuangan", iconColor: "#34d399" },
  { href: "/seller/code-settings", label: "Kode", icon: "tune", group: "Lainnya", noChildTabs: true, hiddenInSidebar: true, pinTop: true, iconColor: "#6366f1" },
  { href: "/seller/chat", label: "Chat", icon: "forum", bottom: true, noChildTabs: true, iconColor: "#22c55e" },
];

export default function SellerLayout() {
  const { user } = useAuth();
  const { data: store } = useSellerStore();
  const { pathname } = useLocation();
  const isChatRoute = pathname === "/seller/chat";

  return (
    <PanelTabsProvider items={SELLER_NAV_ITEMS}>
      <NotificationFeedbackBridge />
      <div className="h-dvh bg-white text-slate-900">
        <PageTransitionLoader />
        <div className="grid h-full grid-cols-1 lg:grid-cols-[76px_minmax(0,1fr)]">
          <PanelSidebar
            items={SELLER_NAV_ITEMS}
            homeHref="/seller"
            title="Penjual"
            sidebarClassName="border-r border-slate-100 bg-white"
            activeClassName="bg-emerald-50 text-emerald-700"
            showHomeLink={false}
            showMarketplaceLink={false}
          />
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden lg:pl-[1px]">
            <PanelHeader
              eyebrow="Panel Penjual"
              title={store?.name || "Toko"}
              storeName={store?.name || "Toko"}
              userName={user?.name || "Penjual"}
              roleLabel="Penjual"
              accentTextClassName="text-emerald-700"
              avatarClassName="bg-emerald-600"
              notificationClassName="hover:bg-slate-50"
              notificationPanel={({ close }) => <NotificationCenterPanel onClose={close} />}
              mobileNavigation={<PanelMobileNavigation items={SELLER_NAV_ITEMS} activeClassName="bg-emerald-50 text-emerald-700" />}
            />
            <PanelTabBar />
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white pb-20 lg:pb-6">
              <div id="panel-editor-root" className={cn("relative w-full px-4 py-6 sm:px-6 lg:px-8", isChatRoute ? "flex h-full min-h-0 flex-col" : "mx-auto max-w-6xl")}>
                <RouteOutletBoundary className={cn("h-full w-full min-w-0 max-w-full", isChatRoute && "min-h-0 flex-1")} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </PanelTabsProvider>
  );
}
