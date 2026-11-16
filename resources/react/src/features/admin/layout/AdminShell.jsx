import { useAuth } from "@/features/auth/context/AuthContext";
import { NotificationCenterPanel } from "@/shared/notifications/NotificationCenterPage";
import { NotificationFeedbackBridge } from "@/shared/notifications/NotificationFeedbackBridge";
import { PanelHeader } from "@/shared/layout/PanelHeader";
import { PanelMobileNavigation } from "@/shared/layout/PanelMobileNavigation";
import { PanelSidebar } from "@/shared/layout/PanelSidebar";
import { PanelTabBar, PanelTabsProvider } from "@/shared/layout/tabs";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard", exact: true, hiddenInSidebar: true },
  { href: "/admin/orders", label: "Pesanan", icon: "receipt_long", group: "Operasional" },
  { href: "/admin/shipping", label: "Ongkir", icon: "local_shipping", group: "Pengaturan" },
  { href: "/admin/store", label: "Alamat Toko", icon: "storefront", group: "Pengaturan" },
];

export default function AdminShell({ children }) {
  const { user } = useAuth();

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
              notificationPanel={({ close }) => <NotificationCenterPanel onClose={close} />}
              mobileNavigation={<PanelMobileNavigation items={ADMIN_NAV_ITEMS} activeClassName="bg-emerald-50 text-emerald-700" />}
            />
            <PanelTabBar />
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-6">
              <div className="mx-auto w-full max-w-6xl py-6">
                {children || <RouteOutletBoundary className="h-full w-full min-w-0 max-w-full" />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </PanelTabsProvider>
  );
}
