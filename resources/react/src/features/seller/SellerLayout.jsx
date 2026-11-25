import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useSellerStore } from "@/features/seller/store/services/sellerStoreService";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { usePanelBadges } from "@/shared/hooks/usePanelBadges";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import { FocusModeContext, useFocusModeValue } from "@/shared/layout/FocusModeContext";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";
import { cn } from "@/shared/utils/utils";

export const SELLER_NAV_ITEMS = [
  { href: "/seller", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },
  { href: "/seller/products", label: "Produk", icon: "inventory_2", group: "Katalog" },
  { href: "/seller/stock", label: "Stok", icon: "warehouse", group: "Katalog" },
  { href: "/seller/hpp-report", label: "Laporan HPP", icon: "trending_up", group: "Katalog" },
  { href: "/seller/orders", label: "Pesanan", icon: "receipt_long", group: "Penjualan" },
  { href: "/seller/customers", label: "Pelanggan", icon: "group", group: "Penjualan" },
  { href: "/seller/vouchers", label: "Voucher", icon: "confirmation_number", group: "Operasional" },
  { href: "/seller/promotions", label: "Promosi", icon: "campaign", group: "Operasional" },
  { href: "/seller/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Keuangan" },
  { href: "/seller/receivables-payables", label: "Hutang/Piutang", icon: "payments", group: "Keuangan" },
  { href: "/seller/code-settings", label: "Kode", icon: "tune", group: "Lainnya", noChildTabs: true, hiddenInSidebar: true, pinTop: true },
  { href: "/seller/chat", label: "Chat", icon: "forum", bottom: true, noChildTabs: true },
];

export default function SellerLayout() {
  const { user } = useAuth();
  const { data: store } = useSellerStore();
  const { pathname } = useLocation();
  const isChatRoute = pathname === "/seller/chat";
  const { badges } = usePanelBadges("/seller/chat");
  const focusable = pathname.startsWith("/seller/chat");
  const [isFocus, setIsFocus] = useState(false);
  const focusValue = useFocusModeValue(isFocus, setIsFocus);

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
    <PanelTabsProvider items={SELLER_NAV_ITEMS}>
      <FocusModeContext.Provider value={focusValue}>
      <NotificationFeedbackBridge />
      <div className="h-dvh bg-white text-slate-900">
        <div className={cn("grid h-full grid-cols-1", isFocus ? "" : "lg:grid-cols-[76px_minmax(0,1fr)]")}>
          {isFocus ? null : <PanelSidebar
            items={SELLER_NAV_ITEMS}
            badges={badges}
            homeHref="/seller"
            title="Penjual"
            showHomeLink={false}
            showMarketplaceLink={false}
          />}
          <div className={cn("flex min-h-0 min-w-0 flex-col overflow-hidden", isFocus ? "" : "lg:pl-[1px]")}>
            {isFocus ? null : <PanelHeader
              eyebrow="Panel Penjual"
              title={store?.name || "Toko"}
              storeName={store?.name || "Toko"}
              userName={user?.name || "Penjual"}
              roleLabel="Penjual"
              accentTextClassName="text-[var(--color-primary-strong)]"
              avatarClassName="bg-[var(--color-primary)]"
              notificationClassName="hover:bg-slate-50"
              notificationPanel={({ close }) => <NotificationCenterPanel onClose={close} />}
              mobileNavigation={<PanelMobileNavigation items={SELLER_NAV_ITEMS} badges={badges} activeClassName="bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]" />}
            />}
            {isFocus ? null : <PageTransitionLoader variant="below-header" />}
            {isFocus ? null : <PanelTabBar />}
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white pb-20 lg:pb-6">
              <div id="panel-editor-root" className={cn("relative min-h-full w-full px-4 py-6 sm:px-6 lg:px-8", isChatRoute ? "flex h-full min-h-0 flex-col" : "mx-auto max-w-6xl")}>
                <RouteOutletBoundary className={cn("h-full w-full min-w-0 max-w-full", isChatRoute && "min-h-0 flex-1")} />
              </div>
            </main>
          </div>
        </div>
        {isFocus ? (
          <button type="button" onClick={() => setIsFocus(false)} className="fixed right-3 top-3 z-[70] inline-flex h-9 items-center gap-1 rounded-[10px] bg-slate-900/90 px-3 text-xs font-bold text-white shadow-lg hover:bg-slate-900">
            <span className="material-symbols-outlined text-[18px]">close_fullscreen</span>
            Keluar fokus
          </button>
        ) : null}
      </div>
      </FocusModeContext.Provider>
    </PanelTabsProvider>
  );
}


