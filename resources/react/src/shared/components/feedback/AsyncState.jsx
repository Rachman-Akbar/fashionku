import { memo } from "react";

export const AsyncState = memo(function AsyncState({
  loading,
  error,
  empty,
  emptyText = "Data belum tersedia.",
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-[10px] border border-slate-100 bg-white px-4 py-8" role="status" aria-busy="true">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />
        <span className="text-sm font-semibold text-slate-500">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
        {error}
      </p>
    );
  }

  if (empty) {
    return (
      <div className="rounded-[10px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  return null;
});
