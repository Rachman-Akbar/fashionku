import { memo } from "react";

export const ActiveToggle = memo(function ActiveToggle({
  checked,
  onChange,
  label = "Status aktif",
  description = "Data aktif dapat digunakan dan ditampilkan sesuai hak akses.",
  disabled = false,
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-3">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-4 w-4 accent-emerald-600"
      />
      <span>
        <span className="block text-sm font-extrabold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
});
