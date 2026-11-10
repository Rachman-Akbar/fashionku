export const FILLED_TONES = {
  emerald: "border-emerald-700 bg-emerald-600 text-white hover:bg-emerald-700",
  teal: "border-teal-700 bg-teal-600 text-white hover:bg-teal-700",
  slate: "border-slate-500 bg-slate-500 text-white hover:bg-slate-700",
  rose: "border-rose-700 bg-rose-600 text-white hover:bg-rose-700",
  indigo: "border-indigo-700 bg-indigo-600 text-white hover:bg-indigo-700",
};

export const SOFT_TONES = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  teal: "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100",
  slate: "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
  rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
};

export const FILLED_ICON_TONES = {
  emerald: "bg-white/20 text-white",
  teal: "bg-white/20 text-white",
  slate: "bg-white/20 text-white",
  rose: "bg-white/20 text-white",
  indigo: "bg-white/20 text-white",
};

export const SOFT_ICON_TONES = {
  emerald: "bg-emerald-100 text-emerald-700",
  teal: "bg-teal-100 text-teal-700",
  slate: "bg-white text-slate-600 ring-1 ring-slate-200",
  rose: "bg-rose-100 text-rose-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

export const DOCK_BUTTON_BASE = "flex w-full flex-col items-center justify-center gap-1.5 rounded-[10px] border px-1.5 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0";

export const DOCK_BUTTON_BASE_FILLED = `${DOCK_BUTTON_BASE} text-white`;

export const DOCK_ICON_BASE = "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]";

export const DOCK_ICON_SIZE = "text-[18px]";

export const DOCK_LABEL_CLASS = "w-full min-w-0 truncate text-[11px] font-bold leading-tight";

export const FOOTER_BUTTON_BASE = "flex h-10 items-center justify-center gap-1.5 rounded-[10px] border px-4 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export const FOOTER_DISABLED_SUBMIT = "border-slate-200 bg-slate-100 text-slate-400";

export function resolveFilledTone(tone) {
  return FILLED_TONES[tone] || FILLED_TONES.teal;
}

export function resolveSoftTone(tone) {
  return SOFT_TONES[tone] || SOFT_TONES.slate;
}
