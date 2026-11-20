import { useMemo } from "react";
import { DonutChart, OrderRevenueBars, SeriesBarList, StatCard } from "@/shared/components/charts/chartKit";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#0ea5e9",
  shipped: "#8b5cf6",
  received: "#06b6d4",
  completed: "#10b981",
  rejected: "#ef4444",
  cancelled: "#f43f5e",
};

const STATUS_ORDER = ["pending", "processing", "shipped", "received", "completed", "rejected", "cancelled"];

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function number(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value || 0));
}

/**
 * Tampilan grafik untuk halaman Pesanan (mode switch "Grafik" pada toolbar).
 * Data diambil dari baris pesanan yang sedang dimuat pada tabel.
 */
export default function OrdersChartPanel({ rows = [] }) {
  const aggregated = useMemo(() => {
    const byStatus = new Map();
    const byDate = new Map();
    let revenue = 0;
    let needsAction = 0;

    rows.forEach((row) => {
      const status = String(row.status || "pending");
      const total = Number(row.total || 0);
      revenue += total;
      if (status === "pending" || status === "processing") needsAction += 1;

      const statusEntry = byStatus.get(status) || { count: 0, revenue: 0 };
      statusEntry.count += 1;
      statusEntry.revenue += total;
      byStatus.set(status, statusEntry);

      if (row.createdAt) {
        const date = String(row.createdAt).slice(0, 10);
        const dateEntry = byDate.get(date) || { date, orders: 0, revenue: 0 };
        dateEntry.orders += 1;
        dateEntry.revenue += total;
        byDate.set(date, dateEntry);
      }
    });

    const statuses = [...byStatus.keys()].sort((left, right) => {
      const leftIndex = STATUS_ORDER.indexOf(left);
      const rightIndex = STATUS_ORDER.indexOf(right);
      return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
    });

    return {
      revenue,
      needsAction,
      statuses,
      donutItems: statuses.map((status) => ({
        label: status,
        value: byStatus.get(status).count,
        color: STATUS_COLORS[status] || "#94a3b8",
      })),
      revenueGroups: statuses.map((status) => ({
        label: status,
        values: { revenue: byStatus.get(status).revenue },
      })),
      points: [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date)),
    };
  }, [rows]);

  const revenueSeries = [{ key: "revenue", label: "Pendapatan", color: "#10b981" }];
  const emptyText = "Belum ada pesanan untuk ditampilkan pada grafik.";

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Pesanan Dimuat" value={number(rows.length)} tone="sky" hint="baris pada tabel saat ini" />
        <StatCard label="Pendapatan" value={money(aggregated.revenue)} tone="emerald" hint="total nilai pesanan termuat" />
        <StatCard label="Perlu Diproses" value={number(aggregated.needsAction)} tone="amber" hint="status pending / processing" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <p className="text-sm font-extrabold text-slate-900">Tren Pesanan &amp; Pendapatan Harian</p>
          <p className="text-xs text-slate-500">Dihitung dari pesanan yang sedang dimuat pada tabel.</p>
        </div>
        <OrderRevenueBars points={aggregated.points} format={money} emptyText={emptyText} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <p className="text-sm font-extrabold text-slate-900">Distribusi Status Pesanan</p>
            <p className="text-xs text-slate-500">Perbandingan jumlah pesanan tiap status.</p>
          </div>
          <DonutChart items={aggregated.donutItems} format={number} centerLabel="Pesanan" centerValue={number(rows.length)} emptyText={emptyText} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <p className="text-sm font-extrabold text-slate-900">Pendapatan per Status</p>
            <p className="text-xs text-slate-500">Total nominal pesanan berdasarkan status.</p>
          </div>
          <SeriesBarList groups={aggregated.revenueGroups} series={revenueSeries} format={money} emptyText={emptyText} maxBars={10} />
        </div>
      </div>
    </div>
  );
}
