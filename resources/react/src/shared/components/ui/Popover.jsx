import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/utils";

export const Popover = memo(function Popover({
  trigger,
  children,
  className,
  onOpenChange,
  open: openProp,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const rootRef = useRef(null);
  const lastEmittedRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : internalOpen;
  const openRef = useRef(open);
  const controlledRef = useRef(isControlled);

  openRef.current = open;
  controlledRef.current = isControlled;

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    lastEmittedRef.current = open;
  }, [open]);

  const emit = (next) => {
    if (lastEmittedRef.current !== next) {
      lastEmittedRef.current = next;
      onOpenChangeRef.current?.(next);
    }
  };

  const close = useCallback(() => {
    if (!controlledRef.current) setInternalOpen(false);
    emit(false);
  }, []);

  const toggle = useCallback(() => {
    const next = !openRef.current;
    if (!controlledRef.current) setInternalOpen(next);
    emit(next);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      close();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const state = { open, close, toggle };

  return (
    <div ref={rootRef} className="relative">
      {typeof trigger === "function" ? trigger(state) : trigger}
      <div
        className={cn(
          "absolute right-0 top-full z-[150] mt-2 origin-top-right transition-all duration-150",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          className,
        )}
        aria-hidden={!open}
      >
        {typeof children === "function" ? children(state) : children}
      </div>
    </div>
  );
});