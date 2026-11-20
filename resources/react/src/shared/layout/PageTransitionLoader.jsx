import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { subscribeNavigationProgress } from "@/shared/layout/navigationProgress";
import { cn } from "@/shared/utils/utils";

const MIN_VISIBLE_MS = 650;

export default function PageTransitionLoader({ variant = "fixed" }) {
  const { pathname, search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setIsLoading(false);
    }, MIN_VISIBLE_MS);
  }, []);

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [pathname, search, start]);

  useEffect(() => subscribeNavigationProgress(start), [start]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "pointer-events-none inset-x-0 h-1 overflow-hidden bg-emerald-100",
        variant === "below-tabs" ? "relative z-40 shrink-0" : "fixed top-0 z-[100]",
      )}
      role="progressbar"
      aria-label="Memuat halaman"
      aria-busy="true"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full w-full animate-pulse bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
    </div>
  );
}
