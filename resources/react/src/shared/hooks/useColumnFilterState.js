import { useCallback, useMemo, useState } from "react";
import { isColumnFilterEmpty, matchesColumnFilter, sortRowsBy } from "@/shared/utils/tableData";

export function useColumnFilterState({ rows = [], getValue, filterTypes = {}, excludeKeys = [], initialSortBy = null, initialSortDirection = "asc" } = {}) {
  const [columnFilters, setColumnFilters] = useState({});
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const changeFilter = useCallback((key, value) => {
    const filterType = filterTypes[key] || "text";
    setColumnFilters((current) => {
      const next = { ...current };
      if (isColumnFilterEmpty(value, filterType)) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  }, [filterTypes]);

  const resetFilters = useCallback(() => setColumnFilters({}), []);

  const resetSort = useCallback(() => {
    setSortBy(initialSortBy);
    setSortDirection(initialSortDirection || "asc");
  }, [initialSortBy, initialSortDirection]);

  const setSort = useCallback((key, direction) => {
    setSortBy(key);
    setSortDirection(direction || "asc");
  }, []);

  const processedRows = useMemo(() => {
    let output = rows;
    Object.entries(columnFilters).forEach(([key, value]) => {
      // `excludeKeys` dipakai kolom yang filternya sudah ditangani server.
      if (excludeKeys.includes(key)) return;
      const filterType = filterTypes[key] || "text";
      output = output.filter((row) => matchesColumnFilter(getValue(row, key), value, filterType));
    });
    return sortRowsBy(output, sortBy, sortDirection, getValue);
  }, [columnFilters, excludeKeys, filterTypes, getValue, rows, sortBy, sortDirection]);

  return {
    rows: processedRows,
    columnFilters,
    changeFilter,
    resetFilters,
    resetSort,
    sortBy,
    sortDirection,
    setSort,
  };
}