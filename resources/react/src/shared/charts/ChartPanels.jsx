import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import { format } from "date-fns";
import { id } from "date-fns/locale";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const COLORS = {
  primary: "#059669",
  secondary: "#2563eb",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0891b2",
  success: "#16a34a",
  muted: "#94a3b8",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.success,
  "#9333ea",
  "#e11d48",
  "#0d9488",
  "#ea580c",
];

export function FinanceChartPanel({ data, isLoading }) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">Grafik Keuangan</h2>
          <p className="mt-1 text-sm text-slate-500">Tren pemasukan, pengeluaran, piutang, dan hutang per bulan</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-500 animate-pulse">Memuat data grafik...</div>
        </div>
      </section>
    );
  }
  const chartData = useMemo(() => {
    const income = data?.income || [];
    const expense = data?.expense || [];
    const receivable = data?.receivable || [];
    const payable = data?.payable || [];

    const labels = [...new Set([
      ...income.map((d) => format(new Date(d.occurred_at), "MMM yyyy", { locale: id })),
      ...expense.map((d) => format(new Date(d.occurred_at), "MMM yyyy", { locale: id })),
      ...receivable.map((d) => format(new Date(d.occurred_at), "MMM yyyy", { locale: id })),
      ...payable.map((d) => format(new Date(d.occurred_at), "MMM yyyy", { locale: id })),
    ])].sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`));

    const sumByMonth = (arr, label) => labels.map((l) => 
      arr.filter((d) => format(new Date(d.occurred_at), "MMM yyyy", { locale: id }) === l)
        .reduce((sum, d) => sum + Number(d.amount || 0), 0)
    );

    return {
      labels,
      datasets: [
        { label: "Pemasukan", data: sumByMonth(income), backgroundColor: COLORS.success, borderColor: COLORS.success, fill: false, tension: 0.3 },
        { label: "Pengeluaran", data: sumByMonth(expense), backgroundColor: COLORS.danger, borderColor: COLORS.danger, fill: false, tension: 0.3 },
        { label: "Piutang", data: sumByMonth(receivable), backgroundColor: COLORS.info, borderColor: COLORS.info, fill: false, tension: 0.3, borderDash: [5, 5] },
        { label: "Hutang", data: sumByMonth(payable), backgroundColor: COLORS.warning, borderColor: COLORS.warning, fill: false, tension: 0.3, borderDash: [5, 5] },
      ],
    };
  }, [data]);

  const summaryData = useMemo(() => {
    const incomeTotal = data?.income?.reduce((sum, d) => sum + Number(d.amount || 0), 0) || 0;
    const expenseTotal = data?.expense?.reduce((sum, d) => sum + Number(d.amount || 0), 0) || 0;
    const receivableTotal = data?.receivable?.reduce((sum, d) => sum + Number(d.outstanding_amount || 0), 0) || 0;
    const payableTotal = data?.payable?.reduce((sum, d) => sum + Number(d.outstanding_amount || 0), 0) || 0;
    return { incomeTotal, expenseTotal, receivableTotal, payableTotal, netCashflow: incomeTotal - expenseTotal };
  }, [data]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-900">Grafik Keuangan</h2>
        <p className="mt-1 text-sm text-slate-500">Tren pemasukan, pengeluaran, piutang, dan hutang per bulan</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Total Pemasukan</p>
          <p className="mt-1 text-lg font-extrabold text-emerald-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summaryData.incomeTotal)}</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Total Pengeluaran</p>
          <p className="mt-1 text-lg font-extrabold text-rose-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summaryData.expenseTotal)}</p>
        </div>
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Piutang Terbuka</p>
          <p className="mt-1 text-lg font-extrabold text-sky-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summaryData.receivableTotal)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Hutang Terbuka</p>
          <p className="mt-1 text-lg font-extrabold text-amber-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summaryData.payableTotal)}</p>
        </div>
      </div>

      <div className="h-80">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11 } } },
              y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 }, callback: (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value) } },
            },
            interaction: { mode: "nearest", axis: "x", intersect: false },
          }}
        />
      </div>
    </section>
  );
}

export function OrdersChartPanel({ data, isLoading }) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">Grafik Pesanan</h2>
          <p className="mt-1 text-sm text-slate-500">Distribusi status pesanan dan tren per bulan</p>
        </div>
        <div className="h-72 flex items-center justify-center">
          <div className="text-slate-500 animate-pulse">Memuat data grafik...</div>
        </div>
      </section>
    );
  }
  const chartData = useMemo(() => {
    const orders = data?.orders || [];
    const labels = [...new Set(orders.map((d) => format(new Date(d.created_at), "MMM yyyy", { locale: id })))].sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`));
    
    const statuses = ["pending", "processing", "shipped", "received", "completed", "cancelled"];
    const datasets = statuses.map((status, i) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      data: labels.map((l) => orders.filter((d) => format(new Date(d.created_at), "MMM yyyy", { locale: id }) === l && d.status === status).length),
      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
      borderColor: CHART_COLORS[i % CHART_COLORS.length],
    }));

    return { labels, datasets };
  }, [data]);

  const summaryData = useMemo(() => {
    const orders = data?.orders || [];
    const total = orders.length;
    const byStatus = {};
    ["pending", "processing", "shipped", "received", "completed", "cancelled"].forEach((s) => {
      byStatus[s] = orders.filter((d) => d.status === s).length;
    });
    const totalRevenue = orders.filter((d) => d.status === "completed").reduce((sum, d) => sum + Number(d.grand_total || 0), 0);
    return { total, byStatus, totalRevenue };
  }, [data]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-900">Grafik Pesanan</h2>
        <p className="mt-1 text-sm text-slate-500">Distribusi status pesanan dan tren per bulan</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-black uppercase tracking-wide text-slate-600">Total Pesanan</p>
          <p className="mt-1 text-lg font-extrabold text-slate-900">{summaryData.total}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Selesai</p>
          <p className="mt-1 text-lg font-extrabold text-emerald-900">{summaryData.byStatus.completed || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">Diproses</p>
          <p className="mt-1 text-lg font-extrabold text-blue-900">{summaryData.byStatus.processing || 0}</p>
        </div>
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Total Pendapatan</p>
          <p className="mt-1 text-lg font-extrabold text-sky-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summaryData.totalRevenue)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
                y: { stacked: true, beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 }, stepSize: 1 } },
              },
            }}
          />
        </div>
        
        <div className="h-72">
          <Doughnut
            data={{
              labels: Object.keys(summaryData.byStatus).map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
              datasets: [{
                data: Object.values(summaryData.byStatus),
                backgroundColor: CHART_COLORS,
                borderWidth: 2,
                borderColor: "#fff",
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw} (${((ctx.raw / summaryData.total) * 100).toFixed(1)}%)` } },
              },
              cutout: "60%",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export function StockChartPanel({ data, isLoading }) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900">Grafik Stok</h2>
          <p className="mt-1 text-sm text-slate-500">Stok teratas, stok rendah, dan stok habis</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-500 animate-pulse">Memuat data grafik...</div>
        </div>
      </section>
    );
  }
  const chartData = useMemo(() => {
    const products = data?.products || [];
    const materials = data?.materials || [];
    
    const lowStockProducts = products.filter((p) => Number(p.stock || 0) <= Number(p.minimum_stock || 0)).length;
    const outOfStockProducts = products.filter((p) => Number(p.stock || 0) <= 0).length;
    const lowStockMaterials = materials.filter((m) => Number(m.stock || 0) <= Number(m.minimum_stock || 0)).length;
    const outOfStockMaterials = materials.filter((m) => Number(m.stock || 0) <= 0).length;
    
    const topProducts = [...products].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0)).slice(0, 10);
    const topMaterials = [...materials].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0)).slice(0, 10);

    return {
      summary: { lowStockProducts, outOfStockProducts, lowStockMaterials, outOfStockMaterials },
      topProducts: { labels: topProducts.map((p) => p.name || p.sku || "Produk"), data: topProducts.map((p) => Number(p.stock || 0)) },
      topMaterials: { labels: topMaterials.map((m) => m.name || m.code || "Bahan"), data: topMaterials.map((m) => Number(m.stock || 0)) },
    };
  }, [data]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-extrabold text-slate-900">Grafik Stok</h2>
        <p className="mt-1 text-sm text-slate-500">Stok teratas, stok rendah, dan stok habis</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Produk Stok Rendah</p>
          <p className="mt-1 text-lg font-extrabold text-amber-900">{chartData.summary.lowStockProducts}</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Produk Stok Habis</p>
          <p className="mt-1 text-lg font-extrabold text-rose-900">{chartData.summary.outOfStockProducts}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Bahan Stok Rendah</p>
          <p className="mt-1 text-lg font-extrabold text-amber-900">{chartData.summary.lowStockMaterials}</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Bahan Stok Habis</p>
          <p className="mt-1 text-lg font-extrabold text-rose-900">{chartData.summary.outOfStockMaterials}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80">
          <Bar
            data={{
              labels: chartData.topProducts.labels,
              datasets: [{ label: "Stok Produk", data: chartData.topProducts.data, backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderRadius: 6 }],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw} pcs` } } },
              scales: { x: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } },
            }}
          />
        </div>
        
        <div className="h-80">
          <Bar
            data={{
              labels: chartData.topMaterials.labels,
              datasets: [{ label: "Stok Bahan Baku", data: chartData.topMaterials.data, backgroundColor: COLORS.warning, borderColor: COLORS.warning, borderRadius: 6 }],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw} pcs` } } },
              scales: { x: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } },
            }}
          />
        </div>
      </div>
    </section>
  );
}