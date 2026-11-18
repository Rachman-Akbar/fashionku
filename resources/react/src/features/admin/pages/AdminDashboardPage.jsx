import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";
import "chartjs-adapter-date-fns";
import { useAdminDashboard } from "@/features/admin/services/adminDashboardService";
import { getApiMessage } from "@/core/utils/apiClient";
import { useTheme } from "@/shared/theme/ThemeProvider";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

function StatCard({ item }) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{item.label}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-950">{item.value}</h3>
          <p className="mt-1 text-xs text-slate-400">{item.change}</p>
        </div>
        <div className={`rounded-[10px] p-3 ring-1 bg-${item.tone}-50 text-${item.tone}-700 ring-${item.tone}-100`}>
          <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const dashboardQuery = useAdminDashboard();
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";
  const axisTickColor = isDark ? "#a8b7cd" : "#64748b";
  const axisGridColor = isDark ? "#24334d" : "#f1f5f9";
  const { isLoading, error, data } = dashboardQuery;
  const dataSafe = data || { stats: [], revenue: [], recentOrders: [] };

  const chartData = useMemo(() => {
    const labels = dataSafe.revenue.map((row) => row.month || "-");
    const values = dataSafe.revenue.map((row) => Number(row.revenue || 0));
    return { labels, values };
  }, [dataSafe.revenue]);

  return (
    <>
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400">progress_activity</span>
        </div>
      ) : error ? (
        <div className="rounded-[10px] border border-red-100 bg-red-50 p-6">
          <p className="text-sm text-red-700">{getApiMessage(error, "Gagal memuat data dashboard.")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dataSafe.stats.map((item) => (
              <StatCard key={item.key} item={item} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Tren Pendapatan</h2>
                  <p className="text-sm text-slate-500">12 bulan terakhir</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Data API</span>
              </div>
              <div className="h-96 w-full">
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Pendapatan",
                        data: chartData.values,
                        backgroundColor: "#10B981",
                        borderColor: "#059669",
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 24,
                        maxBarThickness: 32,
                      },
                    ],
                  }}
                  options={
                    {
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: {
                          mode: "index",
                          intersect: false,
                          callbacks: {
                            label: (context) => `Rp ${context.parsed.y.toLocaleString("id-ID")}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { font: { size: 11, weight: 700 }, color: axisTickColor },
                        },
                        y: {
                          beginAtZero: true,
                          grid: { color: axisGridColor },
                          ticks: {
                            font: { size: 10, weight: 700 },
                            color: axisTickColor,
                            callback: (value) => `Rp ${value.toLocaleString("id-ID")}`,
                          },
                        },
                      },
                    }
                  }
                />
              </div>
            </div>

            <div className="rounded-[10px] border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Pesanan Terbaru</h2>
                  <p className="text-sm text-slate-500">Aktivitas transaksi terakhir</p>
                </div>
                <Link to="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline">Lihat semua</Link>
              </div>
              <div className="space-y-3">
                {dataSafe.recentOrders.length ? (
                  dataSafe.recentOrders.map((order) => (
                    <div key={order.id} className="rounded-[10px] border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">#{order.id}</p>
                          <p className="mt-0.5 text-sm font-extrabold text-slate-900">{order.buyer}</p>
                          <p className="mt-1 text-xs text-slate-500">{order.total}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${
                          order.status === "completed" || order.status === "success"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : order.status === "cancelled" || order.status === "failed"
                              ? "bg-red-50 text-red-700 ring-red-100"
                              : "bg-slate-50 text-slate-600 ring-slate-200"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">Belum ada pesanan terbaru.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
