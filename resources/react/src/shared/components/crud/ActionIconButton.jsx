import { memo, useState } from "react";
import { cn } from "@/shared/utils/utils";

const VARIANTS = {
  default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  active: "bg-slate-800 text-white hover:bg-slate-700",
};

const TOOLTIP_PLACEMENTS = {
  below: {
    className: "left-1/2 top-full mt-1.5 -translate-x-1/2",
    arrowClassName: "bottom-full left-1/2 -translate-x-1/2 rotate-45",
  },
  left: {
    className: "right-full top-1/2 mr-2 -translate-y-1/2",
    arrowClassName: "-right-1 top-1/2 -translate-y-1/2 rotate-45",
  },
  right: {
    className: "left-full top-1/2 ml-2 -translate-y-1/2",
    arrowClassName: "-left-1 top-1/2 -translate-y-1/2 rotate-45",
  },
};

export const ActionIconButton = memo(function ActionIconButton({
  icon,
  label,
  title,
  onClick,
  onMouseDown,
  disabled = false,
  variant = "default",
  active = false,
  round = false,
  color,
  badge,
  iconClassName,
  tooltip = true,
  tooltipPlacement = "below",
  className,
}) {
  const [tip, setTip] = useState(false);
  const variantClass = active ? VARIANTS.active : color ? undefined : VARIANTS[variant];
  const style = color ? { backgroundColor: color, color: "#ffffff" } : undefined;
  const placement = TOOLTIP_PLACEMENTS[tooltipPlacement] || TOOLTIP_PLACEMENTS.below;
  const tipLabel = title || label;

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={tipLabel}
        title={tipLabel}
        onMouseDown={onMouseDown}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-45",
          round ? "rounded-full shadow-md" : "rounded-[10px]",
          variantClass,
          className,
        )}
        style={style}
        onMouseEnter={tooltip ? () => setTip(true) : undefined}
        onMouseLeave={tooltip ? () => setTip(false) : undefined}
      >
        <span className={cn("material-symbols-outlined text-[19px]", iconClassName)}>{icon}</span>
        {badge ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
            {Math.min(99, badge)}
          </span>
        ) : null}
      </button>
      {tip ? (
        <span className={cn("pointer-events-none absolute z-[130] whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white shadow-lg ring-1 ring-white/10", placement.className)}>
          {tipLabel}
          <span className={cn("absolute h-2 w-2 bg-slate-900", placement.arrowClassName)} />
        </span>
      ) : null}
    </span>
  );
});