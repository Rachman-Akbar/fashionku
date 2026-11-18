import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";
import { AdminThemeControl } from "@/features/admin/layout/AdminThemeControl";
import { cn } from "@/shared/utils/utils";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },

  { href: "/admin/store", label: "Pengaturan Toko", icon: "storefront", group: "Pengaturan Toko", iconColor: "#6366f1", pinTop: true },

  { href: "/admin/products", label: "Product", icon: "inventory_2", group: "Master Data", iconColor: "#60a5fa" },
  { href: "/admin/categories", label: "Category", icon: "category", group: "Master Data", iconColor: "#34d399" },
  { href: "/admin/bahan-baku", label: "Bahan Baku", icon: "science", group: "Master Data", iconColor: "#f472b6" },
  { href: "/admin/customers", label: "Pelanggan", icon: "groups", group: "Master Data", iconColor: "#fbbf24" },

  { href: "/admin/orders", label: "Pesanan dan Penjualan", icon: "receipt_long", group: "Operasional", iconColor: "#fb923c" },
  { href: "/admin/stock", label: "Stock", icon: "warehouse", group: "Operasional", iconColor: "#22d3ee" },
  { href: "/admin/cashflow", label: "Keuangan", icon: "account_balance_wallet", group: "Operasional", iconColor: "#a3e635" },

  { href: "/admin/vouchers", label: "Voucher", icon: "confirmation_number", group: "Marketing", iconColor: "#f59e0b" },
  { href: "/admin/promotions", label: "Promosi", icon: "campaign", group: "Marketing", iconColor: "#f43f5e" },
  { href: "/admin/reviews", label: "Ulasan", icon: "rate_review", group: "Marketing", iconColor: "#a78bfa" },

  { href: "/admin/users", label: "Manajemen User", icon: "manage_accounts", group: "Manajemen User", iconColor: "#8b5cf6" },

  { href: "/admin/chat", label: "Chat", icon: "chat", group: "Chat", noChildTabs: true, iconColor: "#22c55e", bottom: true },
  { href: "/admin/planner", label: "Jadwal", icon: "event_note", group: "Jadwal", iconColor: "#14b8a6", bottom: true },
  { href: "/admin/help", label: "Bantuan", icon: "help", group: "Bantuan", iconColor: "#ec4899" },
];

export default function AdminShell({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { resolvedMode, palette } = useTheme();
  const isChatRoute = pathname === "/admin/chat";

  return (
    <PanelTabsProvider items={ADMIN_NAV_ITEMS}>
      <NotificationFeedbackBridge />
      <div className="profile-theme h-dvh bg-white text-slate-900" data-mode={resolvedMode} data-palette={palette}>
        <PageTransitionLoader />
        <div className="grid h-full grid-cols-1 lg:grid-cols-[76px_minmax(0,1fr)]">
          <PanelSidebar
            items={ADMIN_NAV_ITEMS}
            homeHref="/admin"
            title="Admin"
            sidebarClassName="border-r border-white/10 bg-[#0b1f3b]"
            activeClassName="bg-white/15 text-white"
            showHomeLink={false}
            showMarketplaceLink={false}
          />
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden lg:pl-[1px]">
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
              modeHeader={<AdminThemeControl />}
            />
            <PanelTabBar />
            <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white pt-0 pb-0">
              <div className={cn("w-full min-w-0 pb-8 pt-0", isChatRoute ? "flex h-full min-h-0 flex-col" : "")}>
                {children || <RouteOutletBoundary className={cn("h-full w-full min-w-0 max-w-full", isChatRoute && "min-h-0 flex-1")} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PanelTabsProvider>
  );
}
