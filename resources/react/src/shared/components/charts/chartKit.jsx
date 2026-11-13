import { useMemo, useState, useRef, useEffect } from "react";
import { Chart as ReactChart } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { ChartFrame } from "./ChartFrame";

ChartJS.register(...registerables);

const AXIS_TICK = { font: { size: 11, weight: 700 }, color: "#64748b" };
const TOOLTIP_STYLE = { borderRadius: 12, borderColor: "#e2e8f0", borderWidth: 1, font: { size: 12, weight: 600 }, titleColor: "#0f172a", bodyColor: "#0f172a" };

export function legendDot(color) {
  return <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />;
}

export function SeriesLegend({ series }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {series.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          {legendDot(item.color)}
          {item.label}
        </span>
      ))}
    </div>
  );
}

function useSeriesFocus() {
  const [hidden, setHidden] = useState(() => new Set());
  const [focus, setFocus] = useState(null);
  const toggle = (key) => setHidden((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  return { hidden, focus, toggle, setFocus };
}

function focusOpacity(focus, key, dim = 0.18) {
  return focus && focus !== key ? dim : 1;
}

export function InteractiveLegend({ series = [], hidden, focus, onToggle, onFocus }) {
  const hiddenSet = hidden instanceof Set ? hidden : new Set(hidden || []);
  return (
    <div className="flex flex-wrap items-center gap-[5px]">
      {series.map((item) => {
        const isHidden = hiddenSet.has(item.key);
        const isDim = !isHidden && focus && focus !== item.key;
        return (
          <button
            key={item.key}
            type="button"
            aria-pressed={!isHidden}
            title={`${item.label} — klik untuk ${isHidden ? "tampilkan" : "sembunyikan"}, arahkan untuk fokus`}
            onClick={() => onToggle?.(item.key)}
            onMouseEnter={() => onFocus?.(item.key)}
            onMouseLeave={() => onFocus?.(null)}
            onFocus={() => onFocus?.(item.key)}
            onBlur={() => onFocus?.(null)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition ${
              isHidden
                ? "border-slate-200 bg-slate-50 text-slate-400 line-through"
                : isDim
                  ? "border-slate-200 bg-white text-slate-400"
                  : "border-teal-200 bg-teal-50 text-slate-700"
            }`}
          >
            {legendDot(item.color)}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function groupTotal(group, series) {
  return series.reduce((sum, item) => sum + Math.max(0, Number(group.values?.[item.key] || 0)), 0);
}

const SERIES_BAR_TYPES = ["horizontal", "column", "stacked", "line", "area"];

export function SeriesBarList({
  groups = [],
  series = [],
  format = (value) => String(value),
  maxBars = 15,
  emptyText = "Belum ada data.",
  types = SERIES_BAR_TYPES,
  defaultType = "horizontal",
}) {
  const [type, setType] = useState(defaultType);
  const [fullscreen, setFullscreen] = useState(false);
  const { hidden, focus, toggle, setFocus } = useSeriesFocus();

  const visible = useMemo(() => {
    if (!series.length) return [];
    return [...groups]
      .map((group) => ({ ...group, _total: groupTotal(group, series) }))
      .sort((a, b) => b._total - a._total)
      .slice(0, maxBars);
  }, [groups, series, maxBars]);

  const data = useMemo(
    () => visible.map((group) => {
      const row = { label: group.label };
      series.forEach((item) => {
        row[item.key] = Math.max(0, Number(group.values?.[item.key] || 0));
      });
      return row;
    }),
    [visible, series],
  );

  const activeSeries = series.filter((item) => !hidden.has(item.key));
  const empty = !visible.length;
  const horizontal = type === "horizontal";

  const datasets = activeSeries.map((item) => ({
    label: item.label,
    data: data.map((row) => row[item.key]),
    backgroundColor: item.color,
    borderColor: item.color,
    borderWidth: 2,
    borderRadius: type === "horizontal" ? { topLeft: 0, topRight: 4, bottomRight: 4, bottomLeft: 0 } : 4,
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  }));

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => format(context.parsed.x ?? context.parsed.y ?? 0),
        },
      },
    },
    scales: horizontal
      ? {
          x: { type: "linear", beginAtZero: true, ticks: AXIS_TICK, grid: { drawBorder: false } },
          y: { type: "category", ticks: AXIS_TICK, grid: { drawBorder: false } },
        }
      : {
          x: { type: "category", ticks: AXIS_TICK, grid: { drawBorder: false } },
          y: { type: "linear", beginAtZero: true, ticks: AXIS_TICK, grid: { drawBorder: false } },
        },
  }), [horizontal, type, series, activeSeries, format]);

  const height = fullscreen
    ? "100%"
    : horizontal
      ? Math.max(180, data.length * 68)
      : 320;

  const legend = series.length ? (
    <InteractiveLegend series={series} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  ) : null;

  return (
    <ReactChartFrame
      types={types}
      type={type}
      onTypeChange={setType}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      empty={empty}
      emptyText={emptyText}
      legend={legend}
    >
      <div style={{ width: "100%", height }}>
        {empty ? null : (
          <ReactChart
            type={type === "area" ? "bar" : type}
            data={{ labels: data.map((row) => row.label), datasets }}
            options={options}
          />
        )}
      </div>
    </ReactChartFrame>
  );
}

const CASHFLOW_SERIES = [
  { key: "income", label: "Pemasukan", color: "#10b981" },
  { key: "expense", label: "Pengeluaran", color: "#fb7185" },
];

export function DailyCashflowBars({
  days = [],
  format = (value) => String(value),
  maxDays = 14,
  types = ["line", "area", "column", "stacked"],
  defaultType = "line",
}) {
  const [type, setType] = useState(defaultType);
  const [fullscreen, setFullscreen] = useState(false);
  const { hidden, focus, toggle, setFocus } = useSeriesFocus();

  const visible = useMemo(() => {
    const parsed = (days || [])
      .map((day) => ({
        ...day,
        income: Number(day.income || 0),
        expense: Number(day.expense || 0),
      }))
      .filter((day) => day.income > 0 || day.expense > 0);
    return parsed.slice(Math.max(0, parsed.length - maxDays));
  }, [days, maxDays]);

  const chartData = useMemo(() => ({
    labels: visible.map((day) => String(day.date || "").slice(5)),
    datasets: CASHFLOW_SERIES.filter((item) => !hidden.has(item.key)).map((item) => ({
      label: item.label,
      data: visible.map((day) => day[item.key]),
      borderColor: item.color,
      backgroundColor: type === "area" ? item.color : undefined,
      borderWidth: 2,
      fill: type === "area" ? true : false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      barThickness: type === "column" || type === "stacked" ? 12 : undefined,
    })),
  }), [visible, type, hidden]);

  const activeSeries = CASHFLOW_SERIES.filter((item) => !hidden.has(item.key));
  const empty = !visible.length;
  const height = fullscreen ? "100%" : 256;

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => format(context.parsed.y ?? 0),
          title: (context) => context[0]?.label ?? "",
        },
      },
    },
    scales: {
      x: { ticks: AXIS_TICK, grid: { drawBorder: false } },
      y: { beginAtZero: true, ticks: AXIS_TICK, grid: { drawBorder: false }, stacked: type === "stacked" },
    },
  }), [visible, type, hidden, format]);

  const legend = activeSeries.length ? (
    <InteractiveLegend series={activeSeries} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  ) : null;

  return (
    <ReactChartFrame
      types={types}
      type={type}
      onTypeChange={setType}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      empty={empty}
      emptyText="Belum ada arus kas harian."
      legend={legend}
    >
      <div style={{ width: "100%", height }}>
        {empty ? null : (
          <ReactChart
            type={type === "area" ? "line" : type === "stacked" ? "bar" : type}
            data={chartData}
            options={options}
          />
        )}
      </div>
    </ReactChartFrame>
  );
}

const TREND_SERIES = [
  { key: "orders", label: "Order", color: "#818CF8" },
  { key: "revenue", label: "Pendapatan", color: "#34D399" },
];

export function OrderRevenueBars({
  points = [],
  format = (value) => String(value),
  maxDays = 45,
  types = ["line", "area", "composed"],
  defaultType = "line",
}) {
  const [type, setType] = useState(defaultType);
  const [fullscreen, setFullscreen] = useState(false);
  const { hidden, focus, toggle, setFocus } = useSeriesFocus();

  const visible = useMemo(() => {
    const parsed = (points || []).map((point) => ({
      ...point,
      orders: Number(point.orders || 0),
      revenue: Number(point.revenue || 0),
    }));
    return parsed.slice(Math.max(0, parsed.length - maxDays));
  }, [points, maxDays]);

  const showOrders = !hidden.has("orders");
  const showRevenue = !hidden.has("revenue");
  const empty = !visible.length;
  const height = fullscreen ? "100%" : 240;

  const datasets = [];
  if (showRevenue) {
    datasets.push({
      label: "Pendapatan",
      data: visible.map((p) => ({ x: p.date, y: p.revenue })),
      borderColor: "#34D399",
      backgroundColor: type === "area" ? "#34D399" : undefined,
      borderWidth: 2,
      fill: type === "area" ? true : false,
      tension: 0.4,
      pointRadius: 0,
      barThickness: type === "composed" ? 14 : undefined,
      barPercentage: 0.8,
    });
  }
  if (showOrders) {
    datasets.push({
      label: "Order",
      data: visible.map((p) => ({ x: p.date, y: p.orders })),
      borderColor: "#818CF8",
      backgroundColor: type === "area" ? "#818CF8" : undefined,
      borderWidth: 2,
      fill: type === "area" ? true : false,
      tension: 0.4,
      pointRadius: 0,
      barThickness: type === "composed" ? 14 : undefined,
      barPercentage: 0.8,
    });
  }

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.y ?? 0;
            return label === "Pendapatan" ? format(value) : String(value);
          },
          title: (context) => context[0]?.label ?? "",
        },
      },
    },
    scales: {
      x: { type: "time", time: { unit: "day", tooltipFormat: "dd MMM" }, ticks: AXIS_TICK, grid: { drawBorder: false } },
      y: { beginAtZero: true, ticks: AXIS_TICK, grid: { drawBorder: false } },
    },
  }), [visible, type, hidden, format]);

  const legend = (showRevenue || showOrders) ? (
    <InteractiveLegend series={TREND_SERIES.filter((s) => (s.key === "orders" ? showOrders : showRevenue))} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  ) : null;

  return (
    <ReactChartFrame
      types={types}
      type={type}
      onTypeChange={setType}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      empty={empty}
      emptyText="Belum ada data tren."
      legend={legend}
    >
      <div style={{ width: "100%", height }}>
        {empty ? null : (
          <ReactChart
            type={type === "composed" ? "bar" : type === "area" ? "line" : type}
            data={{ labels: visible.map((p) => p.date), datasets }}
            options={options}
          />
        )}
      </div>
    </ReactChartFrame>
  );
}

export function StatCard({ label, value, tone = "slate", hint }) {
  const tones = {
    slate: "bg-white ring-slate-200 text-slate-900",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-800",
    rose: "bg-rose-50 ring-rose-200 text-rose-800",
    amber: "bg-amber-50 ring-amber-200 text-amber-800",
    sky: "bg-sky-50 ring-sky-200 text-sky-800",
  };
  return (
    <div className={`rounded-[10px] px-4 py-3 ring-1 ring-inset ${tones[tone] || tones.slate}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 truncate text-lg font-black">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] font-semibold opacity-60">{hint}</p> : null}
    </div>
  );
}

export function DonutChart({
  items = [],
  format = (value) => String(value),
  size = 168,
  thickness = 22,
  centerLabel = "",
  centerValue = "",
  emptyText = "Belum ada data.",
  types = ["donut", "pie", "barList"],
  defaultType = "donut",
}) {
  const [type, setType] = useState(defaultType);
  const [fullscreen, setFullscreen] = useState(false);
  const { hidden, focus, toggle, setFocus } = useSeriesFocus();

  const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.value || 0)), 0);
  const segments = useMemo(() => {
    if (total <= 0) return [];
    return items
      .filter((item) => Number(item.value || 0) > 0)
      .map((item, index) => {
        const value = Math.max(0, Number(item.value || 0));
        return {
          key: `${item.label}-${index}`,
          label: item.label || "Item",
          color: item.color || "#cbd5e1",
          value,
          fraction: value / total,
        };
      });
  }, [items, total]);

  const visibleSegments = segments.filter((segment) => !hidden.has(segment.key));
  const empty = !segments.length;
  const pieSize = fullscreen ? Math.min(360, Math.max(size, Math.round(size * 1.8))) : size;

  const segmentIsDim = (segment) => Boolean(focus && focus !== segment.key);

  const chartData = useMemo(() => ({
    labels: visibleSegments.map((s) => s.label),
    datasets: [{
      data: visibleSegments.map((s) => s.value),
      backgroundColor: visibleSegments.map((s) => s.color),
      borderWidth: 0,
      hoverOffset: 4,
    }],
  }), [visibleSegments]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: type === "donut" ? thickness / size : 0,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const value = context.parsed ?? 0;
            const fraction = total > 0 ? value / total : 0;
            return `${format(value)} (${Math.round(fraction * 100)}%)`;
          },
        },
      },
    },
  }), [visibleSegments, type, thickness, size, total, format]);

  const legend = visibleSegments.length ? (
    <InteractiveLegend series={visibleSegments.map((s, i) => ({ key: s.key, label: s.label, color: s.color }))} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  ) : null;

  if (type === "barList") {
    return (
      <ReactChartFrame
        types={types}
        type={type}
        onTypeChange={setType}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((value) => !value)}
        empty={empty}
        emptyText={emptyText}
      >
        <div className="w-full space-y-2.5">
          {visibleSegments.map((segment) => (
            <div key={segment.key} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-[5px] font-bold text-slate-700">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: segment.color }} />
                  <span className="truncate">{segment.label}</span>
                </span>
                <span className="shrink-0 font-extrabold text-slate-900">
                  {format(segment.value)}
                  <span className="ml-2 font-semibold text-slate-400">{Math.round(segment.fraction * 100)}%</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${Math.max(2, segment.fraction * 100)}%`, backgroundColor: segment.color }} />
              </div>
            </div>
          ))}
        </div>
      </ReactChartFrame>
    );
  }

  return (
    <ReactChartFrame
      types={types}
      type={type}
      onTypeChange={setType}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      empty={empty}
      emptyText={emptyText}
    >
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="relative shrink-0" style={{ width: pieSize, height: pieSize }} role="img" aria-label={centerLabel || "Diagram lingkaran"}>
          {!empty && (
            <ReactChart
              type="doughnut"
              data={chartData}
              options={options}
              plugins={[]}
            />
          )}
          {type === "donut" && (centerLabel || centerValue) && !empty ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              {centerLabel ? <p className="max-w-[104px] truncate text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{centerLabel}</p> : null}
              {centerValue ? <p className="max-w-[104px] truncate text-base font-black text-slate-900">{centerValue}</p> : null}
            </div>
          ) : null}
        </div>
        {visibleSegments.length ? (
          <div className="min-w-44 flex-1 space-y-1">
            {segments.map((segment) => {
              const isHidden = hidden.has(segment.key);
              const isDim = !isHidden && focus && focus !== segment.key;
              return (
                <button
                  key={segment.key}
                  type="button"
                  aria-pressed={!isHidden}
                  title={`${segment.label} — klik untuk ${isHidden ? "tampilkan" : "sembunyikan"}, arahkan untuk fokus`}
                  onClick={() => toggle(segment.key)}
                  onMouseEnter={() => setFocus(segment.key)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(segment.key)}
                  onBlur={() => setFocus(null)}
                  className={`flex w-full items-center gap-[5px] rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    isHidden ? "opacity-40 line-through" : isDim ? "opacity-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: segment.color }} />
                  <span className="min-w-0 flex-1 truncate font-bold text-slate-700">{segment.label}</span>
                  <span className="shrink-0 font-extrabold text-slate-900">{format(segment.value)}</span>
                  <span className="w-10 shrink-0 text-right font-semibold text-slate-400">{Math.round(segment.fraction * 100)}%</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Semua seri disembunyikan.</p>
        )}
      </div>
    </ReactChartFrame>
  );
}
