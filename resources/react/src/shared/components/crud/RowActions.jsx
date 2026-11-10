import { memo } from "react";

export const RowActions = memo(function RowActions({
  onEdit,
  onDelete,
  extra,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {extra}
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
        aria-label="Edit"
      >
        <span className="material-symbols-outlined text-[17px]">edit</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
        aria-label="Hapus"
      >
        <span className="material-symbols-outlined text-[17px]">delete</span>
      </button>
    </div>
  );
});
