import { useMemo } from "react";
import { useAdminDashboard } from "@/features/admin/services/adminDashboardService";
import { getApiMessage } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import DashboardHeader from "@/features/admin/dashboard/components/DashboardHeader";
import KpiGrid from "@/features/admin/dashboard/components/KpiGrid";
import OrderQueuePanel from "@/features/admin/dashboard/components/OrderQueuePanel";
import { TopProductsPanel } from "@/features/admin/dashboard/components/StockPanels";
import { CashflowChartPanel } from "@/features/admin/dashboard/components/FinancePanels";
import AttentionPanel from "@/features/admin/dashboard/components/AttentionPanel";

const EMPTY_DASHBOARD = {
  kpi: {},
  cashflow: [],
  queue: [],
  lowStock: [],
  topProducts: [],
  kasbon: [],
  failed: [],
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-32 animate-pulse rounded-[12px] bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[12px] bg-slate-100" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-[12px] bg-slate-100" />
        <div className="h-80 animate-pulse rounded-[12px] bg-slate-100" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="h-72 animate-pulse rounded-[12px] bg-slate-100" />
        <div className="h-72 animate-pulse rounded-[12px] bg-slate-100" />
      </div>
    </div>
  );
}

/**
 * Dashboard Admin — pusat kendali warung kelontong.
 *
 * Alur: sapaan & aksi cepat → 4 kartu ringkasan (bisa diklik) → arus kas dan
 * barang terlaris → antrean pesanan dan hal yang perlu ditindaklanjuti.
 * Semua panel penting tampil tanpa perlu menggulir jauh.
 */
export default function AdminDashboardPage() {
  const dashboardQuery = useAdminDashboard();
  const { user } = useAuth();
  const { isLoading, error, data, refetch, isFetching } = dashboardQuery;
  const dashboard = data || EMPTY_DASHBOARD;

  const attention = useMemo(() => {
    const items = [];
    const overdueKasbon = dashboard.kasbon.filter((entry) => entry.overdueDays > 0).length;

    if (dashboard.kpi.newOrders > 0) {
      items.push({ icon: "shopping_bag", label: `${dashboard.kpi.newOrders} pesanan online baru`, href: "/admin/orders" });
    }
    if (dashboard.lowStock.length > 0) {
      items.push({ icon: "warning", label: `${dashboard.lowStock.length} stok menipis`, href: "/admin/stock" });
    }
    if (overdueKasbon > 0) {
      items.push({ icon: "contact_mail", label: `${overdueKasbon} kasbon jatuh tempo`, href: "/admin/receivables-payables" });
    }
    return items;
  }, [dashboard]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-[12px] border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-extrabold text-red-700">Dashboard gagal dimuat</p>
        <p className="mt-1 text-sm text-red-600">{getApiMessage(error, "Gagal memuat data dashboard. Coba muat ulang halaman.")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader
        userName={user?.name}
        attention={attention}
        refreshing={isFetching}
        onRefresh={() => refetch()}
      />

      {dashboard.failed.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="material-symbols-outlined text-[18px] text-amber-700">cloud_off</span>
          <p className="text-sm font-bold text-amber-800">
            Sebagian data belum bisa dimuat ({dashboard.failed.join(", ")}). Angka yang tampil bisa belum lengkap.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-amber-600 px-3.5 text-xs font-extrabold text-white transition hover:bg-amber-700"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Coba lagi
          </button>
        </div>
      ) : null}

      <KpiGrid kpi={dashboard.kpi} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <CashflowChartPanel days={dashboard.cashflow} />
        <TopProductsPanel products={dashboard.topProducts} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <OrderQueuePanel orders={dashboard.queue} total={dashboard.kpi.newOrders} />
        <AttentionPanel lowStock={dashboard.lowStock} kasbon={dashboard.kasbon} />
      </div>
    </div>
  );
}
