import { memo } from "react";
import { cn } from "@/shared/utils/utils";

/**
 * Scrollbar horizontal tipis di atas tabel. Hanya tampil jika tabel memang
 * lebih lebar dari kontainernya, dan tersinkron dengan kontainer scroll tabel.
 *
 * Dipakai bersama `useHorizontalScroll()`:
 *   const hScroll = useHorizontalScroll();
 *   <TopScrollbar {...hScroll} />
 *   <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll}>…</div>
 */
export const TopScrollbar = memo(function TopScrollbar({
  topScrollRef,
  handleTopScroll,
  width = 0,
  visible = true,
  className,
}) {
  if (!visible) return null;
  return (
    <div
      ref={topScrollRef}
      onScroll={handleTopScroll}
      aria-hidden="true"
      className={cn(
        "mb-1 h-3 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin]",
        className,
      )}
    >
      <div style={{ width, height: 1 }} />
    </div>
  );
});
