import { useAuth } from "@/features/auth/context/AuthContext";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";

export const SELLER_NAV_ITEMS = [
  { href: "/seller", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },
  { href: "/seller/products", label: "Produk", icon: "inventory_2", group: "Katalog" },
  { href: "/seller/stock", label: "Stok", icon: "warehouse", group: "Katalog" },
  { href: "/seller/orders", label: "Pesanan", icon: "receipt_long", group: "Penjualan" },
  { href: "/seller/customers", label: "Pelanggan", icon: "group", group: "Penjualan" },
  { href: "/seller/vouchers", label: "Voucher", icon: "confirmation_number", group: "Promo" },
  { href: "/seller/promotions", label: "Promosi", icon: "campaign", group: "Promo" },
  { href: "/seller/reviews", label: "Ulasan", icon: "reviews", group: "Penjualan" },
  { href: "/seller/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Keuangan" },
  { href: "/seller/receivables-payables", label: "Hutang/Piutang", icon: "payments", group: "Keuangan" },
  { href: "/seller/code-settings", label: "Kode", icon: "tune", group: "Lainnya", noChildTabs: true, hiddenInSidebar: true, pinTop: true },
  { href: "/seller/chat", label: "Chat", icon: "forum", bottom: true, noChildTabs: true },
  { href: "/seller/help", label: "Bantuan", icon: "help_outline", bottom: true, dividerBefore: true },
];

export default function SellerLayout() {
  const { user, store } = useAuth();

  return (
    <PanelTabsProvider items={SELLER_NAV_ITEMS}>
      <NotificationFeedbackBridge />
      <div className="h-dvh bg-white text-slate-900">
        <PageTransitionLoader />
        <div className="grid h-full grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)]">
          <PanelSidebar
            items={SELLER_NAV_ITEMS}
            homeHref="/seller"
            title="Penjual"
            sidebarClassName="border-r border-slate-100 bg-white"
            activeClassName="bg-emerald-50 text-emerald-700"
            showHomeLink={false}
            showMarketplaceLink={false}
          />
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
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
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-6">
              <div className="mx-auto w-full max-w-6xl py-6">
                <RouteOutletBoundary className="h-full w-full min-w-0 max-w-full" />
              </div>
            </main>
          </div>
        </div>
      </div>
    </PanelTabsProvider>
  );
}
