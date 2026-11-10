import { memo } from "react";

export const FormField = memo(function FormField({
  label,
  error,
  hint,
  required: isRequired,
  children,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-extrabold text-slate-700">
        {label}
        {isRequired ? <span className="text-red-500"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span> : null}
      {!error && hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
});

export const inputClassName =
  "h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";

export const textAreaClassName =
  "min-h-28 w-full resize-y rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";
