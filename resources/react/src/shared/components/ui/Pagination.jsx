import { memo, useCallback, useMemo } from "react";

function createPages(current, total) {
  const safeCurrent = Math.max(1, Number(current) || 1);
  const safeTotal = Math.max(1, Number(total) || 1);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    safeTotal,
    safeCurrent,
    safeCurrent - 1,
    safeCurrent + 1,
  ]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= safeTotal)
    .sort((a, b) => a - b)
    .reduce((result, page, index, array) => {
      if (index > 0 && page - array[index - 1] > 1) result.push("dots-" + page);
      result.push(page);
      return result;
    }, []);
}

const noop = () => {};

export const Pagination = memo(function Pagination({ current = 1, total = 1, onChange = noop }) {
  const safeCurrent = Math.max(1, Number(current) || 1);
  const safeTotal = Math.max(1, Number(total) || 1);
  const pages = useMemo(() => createPages(safeCurrent, safeTotal), [safeCurrent, safeTotal]);

  const moveTo = useCallback(
    (page) => {
      if (page < 1 || page > safeTotal || page === safeCurrent) return;
      onChange(page);
    },
    [safeTotal, safeCurrent, onChange]
  );

  return (
    <div className="flex items-center justify-center gap-[5px] mt-12">
      <button
        type="button"
        disabled={safeCurrent <= 1}
        onClick={() => moveTo(safeCurrent - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#bccbb4] hover:border-[#047857] text-[#3e4a39] transition-all disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      {pages.map((page) =>
        typeof page === "string" ? (
          <span key={page} className="px-1 text-[#3e4a39]">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => moveTo(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
              page === safeCurrent
                ? "bg-[#10B981] text-white font-bold"
                : "border border-[#bccbb4] hover:bg-[#f6f3f2]"
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={safeCurrent >= safeTotal}
        onClick={() => moveTo(safeCurrent + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#bccbb4] hover:border-[#047857] text-[#3e4a39] transition-all disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
});
