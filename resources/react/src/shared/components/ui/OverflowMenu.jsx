import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/utils";

export const OverflowMenu = memo(function OverflowMenu({
  items = [],
  renderItem,
  maxVisible = 5,
  buttonLabel = "Lainnya",
  className,
  menuClassName,
  buttonClass,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const visible = items.slice(0, maxVisible);
  const overflow = items.slice(maxVisible);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!items.length) return null;

  return (
    <div ref={rootRef} className={cn("relative flex flex-wrap items-center gap-[5px]", className)}>
      {visible.map((item, i) => renderItem(item, i))}

      {overflow.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={buttonLabel}
            className={cn(
              "flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-[#10B981] hover:text-[#10B981]",
              buttonClass
            )}
          >
            <span className="material-symbols-outlined text-sm">more_horiz</span>
            <span className="hidden sm:inline">{buttonLabel}</span>
          </button>

          {open && (
            <div
              className={cn(
                "absolute right-0 z-50 mt-2 max-h-72 min-w-44 overflow-auto rounded-[10px] border border-gray-100 bg-white py-1 shadow-lg",
                menuClassName
              )}
            >
              {overflow.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {renderItem(item, i + visible.length)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
