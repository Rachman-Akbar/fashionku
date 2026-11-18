import { cn } from "@/shared/utils/utils";

const OPTIONS = [
  { key: "grid", icon: "grid_view", label: "Tampilan grid" },
  { key: "list", icon: "view_list", label: "Tampilan list" },
];

export function ViewModeToggle({ value = "list", onChange, className }) {
  return (
    <div
      role="tablist"
      aria-label="Mode tampilan data"
      className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-[8px] border border-slate-200 bg-slate-100 p-0.5", className)}
    >
      {OPTIONS.map((option) => {
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
              "flex h-6 w-7 items-center justify-center rounded-[6px] transition-colors",
              active ? "bg-white text-emerald-700 shadow-sm" : "text-slate-400 hover:text-slate-700",
            )}
          >
            <span className="material-symbols-outlined text-[15px] leading-none">{option.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
