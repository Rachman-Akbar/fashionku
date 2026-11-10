import { useEffect } from "react";
import { createPortal } from "react-dom";

export const CHART_TYPE_META = {
  horizontal: { label: "Batang horizontal", icon: "align_horizontal_left" },
  column: { label: "Batang vertikal", icon: "bar_chart" },
  stacked: { label: "Batang bertumpuk", icon: "stacked_bar_chart" },
  line: { label: "Garis", icon: "show_chart" },
  area: { label: "Area", icon: "area_chart" },
  composed: { label: "Kombinasi batang & garis", icon: "waterfall_chart" },
  donut: { label: "Donat", icon: "donut_large" },
  pie: { label: "Lingkaran", icon: "pie_chart" },
  barList: { label: "Daftar batang", icon: "bar_chart_4_bars" },
};

export function ChartTypeSwitcher({ value, types = [], onChange }) {
  if (types.length < 2) return null;
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5" role="group" aria-label="Ubah tipe grafik">
      {types.map((item) => {
        const meta = CHART_TYPE_META[item] || { label: item, icon: "bar_chart" };
        const active = item === value;
        return (
          <button
            key={item}
            type="button"
            title={meta.label}
            aria-label={meta.label}
            aria-pressed={active}
            onClick={() => onChange?.(item)}
            className={`grid h-7 w-7 place-items-center rounded-md transition ${active ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ChartFrame({
  types = [],
  type,
  onTypeChange,
  fullscreen = false,
  onToggleFullscreen,
  empty = false,
  emptyText = "Belum ada data.",
  legend = null,
  className = "",
  children,
}) {
  const hasToolbar = Boolean(onToggleFullscreen || types.length > 1);
  const controls = hasToolbar ? (
    <div className="flex items-center gap-1.5">
      <ChartTypeSwitcher value={type} types={types} onChange={onTypeChange} />
      {onToggleFullscreen ? (
        <button
          type="button"
          title={fullscreen ? "Tutup mode fokus (fullscreen)" : "Mode fokus (fullscreen)"}
          aria-label={fullscreen ? "Tutup mode fokus" : "Mode fokus (fullscreen)"}
          onClick={onToggleFullscreen}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-teal-300 hover:text-teal-700"
        >
          <span className="material-symbols-outlined text-[18px]">{fullscreen ? "close" : "fullscreen"}</span>
        </button>
      ) : null}
    </div>
  ) : null;

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onToggleFullscreen?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, onToggleFullscreen]);

  if (fullscreen) {
    return createPortal(
      <div className="fixed inset-0 z-[200] flex flex-col bg-white" role="dialog" aria-label="Mode fokus grafik">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex min-w-0 items-center gap-[5px]">
              <span className="material-symbols-outlined text-slate-400">monitoring</span>
              <p className="truncate text-sm font-extrabold text-slate-900">Mode Fokus Grafik</p>
              <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500 md:inline-block">Tekan ESC untuk keluar</span>
            </div>
            {legend ? <div className="min-w-0">{legend}</div> : null}
          </div>
          <div className="flex min-w-0 items-center gap-1.5">{controls}</div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-5">
          {empty ? (
            <p className="grid h-full min-h-64 place-items-center text-center text-sm text-slate-500">{emptyText}</p>
          ) : (
            children
          )}
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {(controls || legend) ? (
        <div className="flex flex-wrap items-center justify-between gap-[5px]">
          <div className="min-w-0">{legend}</div>
          {controls}
        </div>
      ) : null}
      {empty ? (
        <p className="rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  );
}
