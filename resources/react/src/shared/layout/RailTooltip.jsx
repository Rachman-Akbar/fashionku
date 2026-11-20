import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DEFAULT_TOOLTIP_COLOR = "var(--color-primary)";

/**
 * Tooltip label untuk rail navigasi (admin, penjual, dan profil).
 * Posisinya dihitung dari elemen pemicu lalu dirender lewat portal agar tidak
 * terpotong oleh overflow sidebar.
 */
export function useRailTooltip() {
  const [tooltip, setTooltip] = useState(null);
  const anchorRef = useRef(null);

  const positionFrom = useCallback((anchor, label, color) => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setTooltip({
      label,
      color: color || DEFAULT_TOOLTIP_COLOR,
      left: rect.right + 10,
      top: Math.max(16, Math.min(window.innerHeight - 24, rect.top + rect.height / 2)),
    });
  }, []);

  const showTip = useCallback(
    (event, label, color) => {
      anchorRef.current = event.currentTarget;
      positionFrom(event.currentTarget, label, color);
    },
    [positionFrom],
  );

  const clearTip = useCallback(() => {
    anchorRef.current = null;
    setTooltip(null);
  }, []);

  useEffect(() => {
    if (!tooltip) return undefined;
    const reposition = () => {
      const anchor = anchorRef.current;
      if (anchor) positionFrom(anchor, tooltip.label, tooltip.color);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [tooltip, positionFrom]);

  return { tooltip, showTip, clearTip };
}

export function RailTooltip({ tooltip }) {
  if (!tooltip) return null;

  return createPortal(
    <span
      role="tooltip"
      style={{
        left: tooltip.left,
        top: tooltip.top,
        backgroundColor: tooltip.color || DEFAULT_TOOLTIP_COLOR,
      }}
      className="pointer-events-none fixed z-[80] -translate-y-1/2 rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-lg ring-1 ring-white/10"
    >
      <span
        className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45"
        style={{ backgroundColor: tooltip.color || DEFAULT_TOOLTIP_COLOR }}
      />
      {tooltip.label}
    </span>,
    document.body,
  );
}
