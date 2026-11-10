import { memo } from "react";
import { cn } from "@/shared/utils/utils";

export const InlineActiveSwitch = memo(function InlineActiveSwitch({
  checked,
  onChange,
  disabled = false,
  pending = false,
  activeLabel = "Active",
  inactiveLabel = "Non-Active",
  compact = false,
  showLabel = true,
}) {
  const label = checked ? activeLabel : inactiveLabel;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={Boolean(checked)}
      aria-busy={pending}
      aria-label={`Ubah status menjadi ${checked ? inactiveLabel : activeLabel}`}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onChange?.(!checked);
      }}
      className={cn(
        "inline-flex items-center gap-[5px] text-left transition-opacity disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 rounded-full transition-colors",
          compact ? "h-5 w-9" : "h-6 w-11",
          checked ? "bg-emerald-600" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 rounded-full bg-white transition-transform",
            compact ? "h-4 w-4" : "h-5 w-5",
            checked
              ? compact ? "translate-x-[18px]" : "translate-x-5"
              : "translate-x-0.5",
          )}
        />
      </span>
      {showLabel ? (
        <span className={cn("inline-flex items-center gap-1 font-bold", checked ? "text-emerald-700" : "text-slate-500")}>
          {label}
        </span>
      ) : null}
    </button>
  );
});
