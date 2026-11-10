import { useEffect, useRef } from "react";

export function InfiniteScrollSentinel({
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  loadingLabel = "Memuat data lainnya...",
  idleLabel = "Gulir ke bawah untuk memuat lebih banyak",
  endLabel = "Semua data sudah dimuat",
  className = "",
}) {
  const nodeRef = useRef(null);
  const loadMoreRef = useRef(onLoadMore);
  const fetchingRef = useRef(isFetchingNextPage);
  loadMoreRef.current = onLoadMore;
  fetchingRef.current = isFetchingNextPage;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !hasNextPage || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !fetchingRef.current) loadMoreRef.current?.();
      },
      { rootMargin: "280px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage]);

  return (
    <div ref={nodeRef} className={`flex items-center justify-center gap-[5px] py-4 text-xs font-bold text-slate-500 ${className}`} aria-live="polite">
      {isFetchingNextPage ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          {loadingLabel}
        </>
      ) : hasNextPage ? (
        idleLabel
      ) : (
        endLabel
      )}
    </div>
  );
}
