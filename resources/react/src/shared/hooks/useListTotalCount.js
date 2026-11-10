import { useCallback, useMemo, useState } from "react";

const EMPTY = { activeCount: 0, filteredCount: 0, loadedCount: 0 };

export function useListTotalCount(meta, options = {}) {
  const { label = "Data", fallbackTotal } = options;
  const [filterState, setFilterState] = useState(EMPTY);

  const onFilterStateChange = useCallback((next) => {
    setFilterState(next || EMPTY);
  }, []);

  return useMemo(() => {
    const hasMeta = meta?.total !== undefined && meta?.total !== null;
    const rawTotal = hasMeta ? meta.total : fallbackTotal;
    const total = Number(rawTotal);
    const hasTotal = Number.isFinite(total) && total >= 0;
    const filtered = filterState.activeCount > 0;
    const count = filtered ? filterState.filteredCount : (hasTotal ? total : undefined);
    const totalText = hasTotal ? total.toLocaleString("id-ID") : "";
    const filteredText = filterState.filteredCount.toLocaleString("id-ID");
    const loadedText = hasTotal ? totalText : filterState.loadedCount.toLocaleString("id-ID");
    return {
      totalCount: count,
      totalLabel: count === undefined ? "" : label,
      totalTitle: !hasTotal
        ? (filtered ? `${filteredText} data pada halaman ini` : "")
        : (hasMeta
          ? (filtered ? `${filteredText} dari ${totalText} data sesuai filter` : `${totalText} data`)
          : (filtered ? `${filteredText} dari ${loadedText} data pada halaman ini` : `${loadedText} data pada halaman ini`)),
      onFilterStateChange,
    };
  }, [filterState, fallbackTotal, label, meta?.total, onFilterStateChange]);
}
