import { cn } from "@/shared/utils/utils";

const DEFAULT_OPTIONS = [
  { key: "grid", icon: "grid_view", label: "Tampilan kartu" },
  { key: "list", icon: "view_list", label: "Tampilan list" },
];

export function ViewModeToggle({
  value = "list",
  onChange,
  options = DEFAULT_OPTIONS,
  className,
  label = "Mode tampilan data",
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-[10px] border border-slate-200 bg-slate-100 p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange?.(option.key)}
            className={cn(
              "flex h-full min-h-6 items-center justify-center gap-1 rounded-[8px] px-2 transition-colors",
              active ? "bg-white text-emerald-700 shadow-sm" : "text-slate-400 hover:text-slate-700",
            )}
          >
            <span className="material-symbols-outlined text-[16px] leading-none">{option.icon}</span>
            {option.text ? <span className="text-[10px] font-bold">{option.text}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
