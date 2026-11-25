import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SectionCard, PanelEmpty } from "@/features/admin/dashboard/components/SectionCard";
import { formatPrice } from "@/shared/utils/utils";
import { useTheme } from "@/shared/theme/ThemeProvider";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

function compactRupiah(value) {
  const amount = Number(value || 0);
  const abs = Math.abs(amount);
  if (abs >= 1e9) return `Rp ${(amount / 1e9).toFixed(1).replace(".", ",")} M`;
  if (abs >= 1e6) return `Rp ${(amount / 1e6).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1e3) return `Rp ${Math.round(amount / 1e3)} rb`;
  return `Rp ${Math.round(amount)}`;
}

function buildWhatsAppUrl(entry) {
  const due = entry.dueDate ? ` yang jatuh tempo pada ${formatDate(entry.dueDate)}` : "";
  const overdue = entry.overdueDays > 0 ? ` (sudah lewat ${entry.overdueDays} hari)` : "";
  const message = `Halo ${entry.name}, kami ingin mengingatkan kasbon Anda sebesar ${formatPrice(entry.remaining)}${due}${overdue}. Mohon dibayar apabila sudah bisa. Terima kasih.`;
  return entry.phone
    ? `https://wa.me/${entry.phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Daftar kasbon terlama/terbesar + tombol kirim pengingat WhatsApp.
 */
export function KasbonList({ entries = [] }) {
  if (!entries.length) {
    return <PanelEmpty icon="savings" text="Tidak ada kasbon berjalan" hint="Semua hutang pelanggan sudah lunas." />;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const isOverdue = entry.overdueDays > 0;
        return (
          <li key={entry.id} className="rounded-[10px] border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-950">{entry.name}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                  Jatuh tempo {formatDate(entry.dueDate)} · {formatPrice(entry.remaining)}
                </p>
              </div>
              <a
                href={buildWhatsAppUrl(entry)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Kirim pengingat WhatsApp ke ${entry.name}`}
                aria-label={`Kirim pengingat WhatsApp ke ${entry.name}`}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-600 text-white transition hover:bg-emerald-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ring-1 ring-inset ${
                isOverdue ? "bg-red-50 text-red-700 ring-red-200" : "bg-blue-50 text-blue-700 ring-blue-200"
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {isOverdue ? "event_busy" : "event_upcoming"}
              </span>
              {isOverdue ? `Terlambat ${entry.overdueDays} hari` : "Belum jatuh tempo"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const METRICS = [
  { key: "both", label: "Keduanya" },
  { key: "income", label: "Masuk" },
  { key: "expense", label: "Keluar" },
];

const DATASETS = {
  income: { label: "Pemasukan", color: "#10b981" },
  expense: { label: "Pengeluaran", color: "#f43f5e" },
};

/**
 * Grafik batang pemasukan vs pengeluaran 7 hari terakhir dengan penyaring
 * metrik, plus total periode agar kondisi kas langsung terbaca.
 */
export function CashflowChartPanel({ days = [] }) {
  const { resolvedMode } = useTheme();
  const [metric, setMetric] = useState("both");
  const isDark = resolvedMode === "dark";
  const axisTickColor = isDark ? "#a8b7cd" : "#64748b";
  const axisGridColor = isDark ? "#24334d" : "#f1f5f9";

  const totals = useMemo(
    () =>
      days.reduce(
        (result, day) => ({
          income: result.income + Number(day.income || 0),
          expense: result.expense + Number(day.expense || 0),
        }),
        { income: 0, expense: 0 },
      ),
    [days],
  );

  const hasData = totals.income > 0 || totals.expense > 0;

  const chartData = useMemo(() => {
    const keys = metric === "both" ? ["income", "expense"] : [metric];
    return {
      labels: days.map((day) => format(new Date(`${day.date}T00:00:00`), "EEE d", { locale: id })),
      datasets: keys.map((key) => ({
        label: DATASETS[key].label,
        data: days.map((day) => Number(day[key] || 0)),
        backgroundColor: DATASETS[key].color,
        borderRadius: 6,
        barPercentage: 0.75,
        categoryPercentage: 0.7,
      })),
    };
  }, [days, metric]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatPrice(context.parsed.y)}`,
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
        ticks: { font: { size: 10, weight: 700 }, color: axisTickColor, callback: (value) => compactRupiah(value) },
      },
    },
  }), [axisGridColor, axisTickColor]);

  const net = totals.income - totals.expense;

  return (
    <SectionCard
      title="Arus Kas 7 Hari"
      subtitle="Pemasukan, pengeluaran, dan selisih periode"
      icon="bar_chart"
      iconClassName="bg-emerald-50 text-emerald-700"
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-[10px] bg-slate-100 p-1">
            {METRICS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMetric(option.key)}
                aria-pressed={metric === option.key}
                className={`h-7 rounded-[7px] px-2.5 text-[11px] font-extrabold transition ${
                  metric === option.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link
            to="/admin/cashflow"
            className="inline-flex h-9 items-center gap-1 rounded-[10px] px-2 text-xs font-extrabold text-emerald-600 transition hover:bg-emerald-50"
          >
            Buka
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      }
    >
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { label: "Masuk", value: totals.income, className: "text-emerald-600" },
          { label: "Keluar", value: totals.expense, className: "text-rose-600" },
          { label: "Selisih", value: net, className: net >= 0 ? "text-emerald-600" : "text-rose-600" },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] bg-slate-50 px-2.5 py-2 ring-1 ring-inset ring-slate-200">
            <p className="text-[11px] font-bold text-slate-500">{item.label}</p>
            <p className={`mt-0.5 truncate text-sm font-black ${item.className}`}>{formatPrice(item.value)}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <PanelEmpty icon="bar_chart" text="Belum ada arus kas 7 hari ini" hint="Catat pemasukan atau pengeluaran agar grafik tampil." />
      ) : (
        <div className="h-56 w-full sm:h-64">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </SectionCard>
  );
}
