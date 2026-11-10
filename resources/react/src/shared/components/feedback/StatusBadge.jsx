import { memo } from "react";

const STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  processing: "bg-sky-50 text-sky-700 ring-sky-200",
  shipped: "bg-violet-50 text-violet-700 ring-violet-200",
  received: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partially_paid: "bg-amber-50 text-amber-700 ring-amber-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
  refunded: "bg-slate-100 text-slate-600 ring-slate-200",
  open: "bg-amber-50 text-amber-700 ring-amber-200",
  review: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  archived: "bg-slate-100 text-slate-600 ring-slate-200",
  draft: "bg-sky-50 text-sky-700 ring-sky-200",
  banned: "bg-red-50 text-red-700 ring-red-200",
};

export const StatusBadge = memo(function StatusBadge({ status, label }) {
  const normalized = String(status || "inactive").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold capitalize ring-1 ring-inset ${STYLES[normalized] || STYLES.inactive}`}
    >
      {label || normalized.replaceAll("_", " ")}
    </span>
  );
});
