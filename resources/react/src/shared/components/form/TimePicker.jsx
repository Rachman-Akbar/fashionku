function normalizeTime(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{1,2})/);

  if (!match) {
    return "";
  }

  const hour = Math.min(23, Math.max(0, Number(match[1])));
  const minute = Math.min(59, Math.max(0, Number(match[2])));

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function TimePicker({ value, onChange, disabled, label }) {
  return (
    <input
      type="time"
      value={normalizeTime(value)}
      onChange={(event) => onChange(normalizeTime(event.target.value))}
      disabled={disabled}
      aria-label={label}
      className="h-11 w-full rounded-[10px] border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}