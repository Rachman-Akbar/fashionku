import { useState } from "react";
import { DailyCashflowBars, SeriesBarList, StatCard } from "@/shared/components/charts/chartKit";
import { inputClassName } from "@/shared/components/form/FormField";
import { cn } from "@/shared/utils/utils";
import { useFinanceDashboard } from "@/features/advanced/services/advancedMarketplaceService";

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

const PERIOD_OPTIONS = [
  { value: "daily", label: "Harian" },
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
];

export default function FinanceChartPanel({ mode = "cashflow" }) {
  const [period, setPeriod] = useState("monthly");
  const dashboardQuery = useFinanceDashboard({ period });
  const summary = dashboardQuery.data?.summary || {};
  const daily = dashboardQuery.data?.daily_cashflow || [];

  const payableSeries = [
    { key: "paid", label: "Sudah Dibayar", color: "#059669" },
    { key: "remaining", label: "Sisa", color: "#f43f5e" },
  ];
  const debtGroups = [
    { label: "Hutang (Utang)", values: { paid: summary.payable_paid || 0, remaining: summary.payable_remaining || 0 } },
    { label: "Piutang", values: { paid: summary.receivable_paid || 0, remaining: summary.receivable_remaining || 0 } },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-900">Grafik Keuangan</p>
          <p className="text-xs text-slate-500">Rentang periode: {PERIOD_OPTIONS.find((item) => item.value === period)?.label.toLowerCase()}. Periode saat ini dimulai {dashboardQuery.data?.start_date ? new Date(dashboardQuery.data.start_date).toLocaleDateString("id-ID") : "-"}.</p>
        </div>
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className={cn(inputClassName, "font-bold")}>
          {PERIOD_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>

      {mode === "cashflow" ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Pemasukan" value={money(summary.income)} tone="emerald" />
            <StatCard label="Pengeluaran" value={money(summary.expense)} tone="rose" />
            <StatCard label="Laba (Kas)" value={money(summary.profit)} tone={Number(summary.profit || 0) >= 0 ? "sky" : "amber"} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Arus Kas Harian</p>
                <p className="text-xs text-slate-500">Perbandingan pemasukan vs pengeluaran setiap hari.</p>
              </div>
            </div>
            <DailyCashflowBars days={daily} format={money} />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Hutang" value={money(summary.payable_total)} tone="rose" hint={`Sudah dibayar ${money(summary.payable_paid)}`} />
            <StatCard label="Sisa Hutang" value={money(summary.payable_remaining)} tone="amber" hint="dapat dicicil" />
            <StatCard label="Total Piutang" value={money(summary.receivable_total)} tone="sky" hint={`Sudah dibayar ${money(summary.receivable_paid)}`} />
            <StatCard label="Sisa Piutang" value={money(summary.receivable_remaining)} tone="emerald" hint="dapat dicicil" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Bagan Perbandingan Hutang & Piutang</p>
                <p className="text-xs text-slate-500">Total nominal dibandingkan dengan berapa yang sudah dibayar (cicilan) dan sisa tagihan.</p>
              </div>
            </div>
            <SeriesBarList groups={debtGroups} series={payableSeries} format={money} />
          </div>
        </>
      )}
    </div>
  );
}