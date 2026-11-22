import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/utils";

const VARIANTS = {
  default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  active: "bg-slate-800 text-white hover:bg-slate-700",
};

const TIP_GAP = 6;
const VIEWPORT_MARGIN = 8;

/**
 * Tooltip dirender lewat portal ke <body> dengan posisi `fixed`.
 *
 * Sebelumnya tooltip memakai `position: absolute` di dalam toolbar, sehingga:
 * - terpotong oleh ancestor yang punya `overflow` (mis. `<main overflow-x:hidden>`
 *   atau container tabel yang bisa di-scroll horizontal), dan
 * - tertutup tombol sebelahnya saat toolbar membungkus ke beberapa baris
 *   (elemen setelahnya dicat di atas tooltip).
 *
 * Dengan portal + posisi terhitung (dan di-clamp ke dalam viewport) tooltip
 * selalu tampil utuh di atas semua elemen.
 */
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
  const buttonRef = useRef(null);
  const tipRef = useRef(null);
  const variantClass = active ? VARIANTS.active : color ? undefined : VARIANTS[variant];
  const style = color ? { backgroundColor: color, color: "#ffffff" } : undefined;
  const tipLabel = title || label;
  const canPromiseTip = tooltip && Boolean(tipLabel);

  const hideTip = useCallback(() => setTip(false), []);

  const showTip = () => {
    if (canPromiseTip) setTip(true);
  };

  // Tooltip ikut hilang saat halaman digulir / ukuran berubah supaya posisinya
  // tidak pernah tertinggal dari tombolnya.
  useEffect(() => {
    if (!tip) return undefined;
    const hide = () => setTip(false);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [tip]);

  useLayoutEffect(() => {
    if (!tip) return;
    const button = buttonRef.current;
    const element = tipRef.current;
    if (!button || !element) return;

    const box = button.getBoundingClientRect();
    const tipBox = element.getBoundingClientRect();
    let top;
    let left;

    if (tooltipPlacement === "left") {
      left = box.left - tipBox.width - TIP_GAP;
      top = box.top + box.height / 2 - tipBox.height / 2;
    } else if (tooltipPlacement === "right") {
      left = box.right + TIP_GAP;
      top = box.top + box.height / 2 - tipBox.height / 2;
    } else {
      left = box.left + box.width / 2 - tipBox.width / 2;
      top = box.bottom + TIP_GAP;
      // Kalau tidak muat di bawah, tampilkan di atas tombol.
      if (top + tipBox.height > window.innerHeight - VIEWPORT_MARGIN) top = box.top - tipBox.height - TIP_GAP;
    }

    left = Math.min(Math.max(VIEWPORT_MARGIN, left), window.innerWidth - tipBox.width - VIEWPORT_MARGIN);
    top = Math.min(Math.max(VIEWPORT_MARGIN, top), window.innerHeight - tipBox.height - VIEWPORT_MARGIN);

    element.style.left = `${Math.round(left)}px`;
    element.style.top = `${Math.round(top)}px`;
  }, [tip, tooltipPlacement]);

  return (
    <>
      <span className="relative inline-flex shrink-0">
        <button
          ref={buttonRef}
          type="button"
          aria-label={tipLabel}
          title={tipLabel}
          onMouseDown={onMouseDown}
          onClick={(event) => {
            hideTip();
            onClick?.(event);
          }}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-45",
            round ? "rounded-full shadow-md" : "rounded-[10px]",
            variantClass,
            className,
          )}
          style={style}
          onMouseEnter={canPromiseTip ? showTip : undefined}
          onMouseLeave={canPromiseTip ? hideTip : undefined}
          onFocus={canPromiseTip ? showTip : undefined}
          onBlur={canPromiseTip ? hideTip : undefined}
        >
          <span className={cn("material-symbols-outlined text-[19px]", iconClassName)}>{icon}</span>
          {badge ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
              {Math.min(99, badge)}
            </span>
          ) : null}
        </button>
      </span>
      {tip && canPromiseTip && typeof document !== "undefined"
        ? createPortal(
            <span
              ref={tipRef}
              role="tooltip"
              className="pointer-events-none fixed z-[400] max-w-[240px] whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white shadow-lg ring-1 ring-white/10"
              style={{ left: -9999, top: 0 }}
            >
              {tipLabel}
            </span>,
            document.body,
          )
        : null}
    </>
  );
});
