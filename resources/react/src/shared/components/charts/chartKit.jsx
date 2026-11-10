import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "./ChartFrame";

const AXIS_TICK = { fontSize: 11, fill: "#64748b", fontWeight: 700 };
const TOOLTIP_STYLE = { borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 600, color: "#0f172a" };
const TOOLTIP_CURSOR = { fill: "rgba(148,163,184,0.14)" };

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
  const height = fullscreen
    ? "100%"
    : horizontal
      ? Math.max(180, data.length * 68)
      : 320;

  const tooltip = <Tooltip cursor={TOOLTIP_CURSOR} contentStyle={TOOLTIP_STYLE} formatter={(value) => format(value)} />;
  const categoryAxis = (
    <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={56} />
  );
  const valueAxis = <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={64} />;
  const legend = series.length ? (
    <InteractiveLegend series={series} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  ) : null;

  let chart = null;
  if (!empty) {
    if (horizontal) {
      chart = (
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }} barCategoryGap={12}>
          <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} width={150} />
          {tooltip}
          {activeSeries.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color}
              fillOpacity={focusOpacity(focus, item.key)}
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            />
          ))}
        </BarChart>
      );
    } else if (type === "line") {
      chart = (
        <LineChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {categoryAxis}
          {valueAxis}
          {tooltip}
          {activeSeries.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={2}
              strokeOpacity={focusOpacity(focus, item.key)}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      );
    } else if (type === "area") {
      chart = (
        <AreaChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {categoryAxis}
          {valueAxis}
          {tooltip}
          {activeSeries.map((item) => {
            const dim = focus && focus !== item.key;
            return (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color}
                strokeWidth={2}
                strokeOpacity={dim ? 0.2 : 1}
                fill={item.color}
                fillOpacity={dim ? 0.04 : 0.16}
              />
            );
          })}
        </AreaChart>
      );
    } else {
      const stacked = type === "stacked";
      chart = (
        <BarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 4 }} barGap={2} barCategoryGap={16}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {categoryAxis}
          {valueAxis}
          {tooltip}
          {activeSeries.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color}
              fillOpacity={focusOpacity(focus, item.key)}
              stackId={stacked ? "stack" : undefined}
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              maxBarSize={28}
            />
          ))}
        </BarChart>
      );
    }
  }

  return (
    <ChartFrame
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
        <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
      </div>
    </ChartFrame>
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

  const data = useMemo(
    () => visible.map((day) => ({
      date: String(day.date || "").slice(5),
      fullDate: day.date,
      income: day.income,
      expense: day.expense,
    })),
    [visible],
  );

  const activeSeries = CASHFLOW_SERIES.filter((item) => !hidden.has(item.key));
  const empty = !visible.length;
  const height = fullscreen ? "100%" : 256;

  const tooltip = (
    <Tooltip
      cursor={TOOLTIP_CURSOR}
      contentStyle={TOOLTIP_STYLE}
      formatter={(value) => format(value)}
      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
    />
  );
  const xAxis = <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={16} />;
  const hiddenValueAxis = <YAxis tick={false} axisLine={false} tickLine={false} width={8} />;
  const legend = (
    <InteractiveLegend series={CASHFLOW_SERIES} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  );

  let chart = null;
  if (!empty) {
    if (type === "line") {
      chart = (
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {hiddenValueAxis}
          {tooltip}
          {activeSeries.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={item.color}
              strokeWidth={2}
              strokeOpacity={focusOpacity(focus, item.key)}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      );
    } else if (type === "area") {
      chart = (
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {hiddenValueAxis}
          {tooltip}
          {activeSeries.map((item) => {
            const dim = focus && focus !== item.key;
            return (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color}
                strokeWidth={2}
                strokeOpacity={dim ? 0.2 : 1}
                fill={item.color}
                fillOpacity={dim ? 0.04 : 0.16}
              />
            );
          })}
        </AreaChart>
      );
    } else {
      const stacked = type === "stacked";
      chart = (
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {hiddenValueAxis}
          {tooltip}
          {activeSeries.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              fill={item.color}
              fillOpacity={focusOpacity(focus, item.key)}
              stackId={stacked ? "stack" : undefined}
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              maxBarSize={22}
            />
          ))}
        </BarChart>
      );
    }
  }

  return (
    <ChartFrame
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
        <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
      </div>
    </ChartFrame>
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

  const tooltip = (
    <Tooltip
      cursor={TOOLTIP_CURSOR}
      contentStyle={TOOLTIP_STYLE}
      formatter={(value, name) => (name === "Pendapatan" ? format(value) : value)}
    />
  );
  const xAxis = <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={24} />;
  const revenueAxis = <YAxis yAxisId="revenue" tick={false} axisLine={false} tickLine={false} width={8} />;
  const ordersAxis = <YAxis yAxisId="orders" orientation="right" tick={false} axisLine={false} tickLine={false} width={8} />;
  const legend = (
    <InteractiveLegend series={TREND_SERIES} hidden={hidden} focus={focus} onToggle={toggle} onFocus={setFocus} />
  );

  let chart = null;
  if (!empty) {
    if (type === "line") {
      chart = (
        <LineChart data={visible} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {revenueAxis}
          {ordersAxis}
          {tooltip}
          {showRevenue ? (
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Pendapatan"
              stroke="#34D399"
              strokeWidth={2}
              strokeOpacity={focusOpacity(focus, "revenue")}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ) : null}
          {showOrders ? (
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Order"
              stroke="#818CF8"
              strokeWidth={2}
              strokeOpacity={focusOpacity(focus, "orders")}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ) : null}
        </LineChart>
      );
    } else if (type === "area") {
      chart = (
        <AreaChart data={visible} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {revenueAxis}
          {ordersAxis}
          {tooltip}
          {showRevenue ? (
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Pendapatan"
              stroke="#34D399"
              strokeWidth={2}
              strokeOpacity={focus && focus !== "revenue" ? 0.2 : 1}
              fill="#34D399"
              fillOpacity={focus && focus !== "revenue" ? 0.04 : 0.16}
            />
          ) : null}
          {showOrders ? (
            <Area
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Order"
              stroke="#818CF8"
              strokeWidth={2}
              strokeOpacity={focus && focus !== "orders" ? 0.2 : 1}
              fill="#818CF8"
              fillOpacity={focus && focus !== "orders" ? 0.04 : 0.12}
            />
          ) : null}
        </AreaChart>
      );
    } else {
      chart = (
        <ComposedChart data={visible} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          {xAxis}
          {revenueAxis}
          {ordersAxis}
          {tooltip}
          {showRevenue ? (
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="Pendapatan"
              fill="#34D399"
              fillOpacity={focusOpacity(focus, "revenue")}
              radius={[3, 3, 0, 0]}
              maxBarSize={14}
            />
          ) : null}
          {showOrders ? (
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Order"
              stroke="#818CF8"
              strokeWidth={2}
              strokeOpacity={focusOpacity(focus, "orders")}
              dot={false}
            />
          ) : null}
        </ComposedChart>
      );
    }
  }

  return (
    <ChartFrame
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
        <ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer>
      </div>
    </ChartFrame>
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

  const segments = useMemo(() => {
    const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.value || 0)), 0);
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
  }, [items]);

  const visibleSegments = segments.filter((segment) => !hidden.has(segment.key));
  const empty = !segments.length;
  const pieSize = fullscreen ? Math.min(360, Math.max(size, Math.round(size * 1.8))) : size;
  const actualThickness = type === "pie" ? 0 : thickness;
  const innerRadius = Math.max(1, pieSize / 2 - actualThickness);
  const outerRadius = pieSize / 2;

  const segmentIsDim = (segment) => Boolean(focus && focus !== segment.key);

  const pie = (
    <div className="relative shrink-0" style={{ width: pieSize, height: pieSize }} role="img" aria-label={centerLabel || "Diagram lingkaran"}>
      <PieChart width={pieSize} height={pieSize}>
        <Pie
          data={visibleSegments}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={visibleSegments.length > 1 ? 2 : 0}
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          {visibleSegments.map((segment) => (
            <Cell key={segment.key} fill={segment.color} fillOpacity={segmentIsDim(segment) ? 0.2 : 1} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => format(value)} />
      </PieChart>
      {type === "donut" && (centerLabel || centerValue) ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel ? <p className="max-w-[104px] truncate text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{centerLabel}</p> : null}
          {centerValue ? <p className="max-w-[104px] truncate text-base font-black text-slate-900">{centerValue}</p> : null}
        </div>
      ) : null}
    </div>
  );

  const segmentList = (
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
  );

  const barList = (
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
  );

  return (
    <ChartFrame
      types={types}
      type={type}
      onTypeChange={setType}
      fullscreen={fullscreen}
      onToggleFullscreen={() => setFullscreen((value) => !value)}
      empty={empty}
      emptyText={emptyText}
    >
      {type === "barList" ? (
        visibleSegments.length ? barList : <p className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Semua seri disembunyikan.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6">
          {pie}
          {segmentList}
        </div>
      )}
    </ChartFrame>
  );
}
