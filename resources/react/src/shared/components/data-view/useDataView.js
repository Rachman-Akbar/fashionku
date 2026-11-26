import { useCallback, useMemo, useState } from "react";
import { buildColumnFilterConfig } from "@/shared/utils/columnFilters";
import { isColumnFilterEmpty, matchesColumnFilter, resolveTableValue, sortRowsBy } from "@/shared/utils/tableData";

/**
 * Nilai sel untuk filter/sort. Kolom boleh mendefinisikan `valueOf` untuk
 * nilai turunan (mis. persentase kenaikan HPP) yang tidak ada di data mentah.
 */
export function createCellValueGetter(columns = []) {
  const byKey = new Map(columns.map((column) => [String(column?.key ?? ""), column]));
  return (row, key) => {
    const column = byKey.get(String(key));
    // `valueOf` hanya dipakai bila kolom benar-benar mendefinisikannya sendiri;
    // semua object mewarisi Object.prototype.valueOf.
    if (column && Object.hasOwn(column, "valueOf") && typeof column.valueOf === "function") return column.valueOf(row);
    return resolveTableValue(row, key);
  };
}

/**
 * Satu sumber kebenaran untuk filter kolom, urutan, dan data hasil saring.
 *
 * Semua mode tampilan (tabel, kartu, grafik) membaca `filteredRows` /
 * `sortedRows` dari hook ini, sehingga filter yang dipilih di header langsung
 * memengaruhi ketiganya tanpa logika duplikat di masing-masing view.
 */
export function useDataView({
  columns = [],
  rows = [],
  getValue,
  initialFilters = {},
  initialSort = null,
  coerceNumericStrings = false,
}) {
  const cellValue = useMemo(() => {
    if (typeof getValue === "function") return getValue;
    return createCellValueGetter(columns);
  }, [columns, getValue]);

  // Deteksi tipe filter otomatis: `select` untuk opsi/boolean, `range` untuk
  // angka, `text` untuk sisanya. `column.filterType` / `filterable: false`
  // selalu menang atas hasil deteksi.
  const filterConfig = useMemo(() => {
    const filterable = columns.filter((column) => column?.key && column.filterable !== false);
    const detected = buildColumnFilterConfig(filterable, rows, cellValue, { coerceNumericStrings });
    const config = {};
    filterable.forEach((column) => {
      const key = String(column.key);
      const type = column.filterType || detected.types[key] || "text";
      const options = Array.isArray(column.options) && column.options.length ? column.options : detected.options[key] || [];
      config[key] = { type, options };
    });
    return config;
  }, [cellValue, coerceNumericStrings, columns, rows]);

  const [columnFilters, setColumnFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState(initialSort?.key || "");
  const [sortDirection, setSortDirection] = useState(initialSort?.direction || "asc");

  const activeFilterKeys = useMemo(
    () => Object.keys(columnFilters).filter((key) => !isColumnFilterEmpty(columnFilters[key], filterConfig[key]?.type || "text")),
    [columnFilters, filterConfig],
  );

  const filteredRows = useMemo(() => {
    if (!activeFilterKeys.length) return rows;
    return rows.filter((row) => activeFilterKeys.every(
      (key) => matchesColumnFilter(cellValue(row, key), columnFilters[key], filterConfig[key]?.type || "text"),
    ));
  }, [activeFilterKeys, cellValue, columnFilters, filterConfig, rows]);

  const sortedRows = useMemo(
    () => sortRowsBy(filteredRows, sortBy, sortDirection, cellValue),
    [cellValue, filteredRows, sortBy, sortDirection],
  );

  const setColumnFilter = useCallback((key, value) => {
    setColumnFilters((current) => {
      const next = { ...current };
      if (!isColumnFilterEmpty(value, filterConfig[key]?.type || "text")) next[key] = value;
      else delete next[key];
      return next;
    });
  }, [filterConfig]);

  const clearFilters = useCallback(() => setColumnFilters({}), []);

  const setSort = useCallback((key, direction = "asc") => {
    setSortBy(key);
    setSortDirection(direction);
  }, []);

  const resetSort = useCallback(() => {
    setSortBy("");
    setSortDirection("asc");
  }, []);

  const resetAll = useCallback(() => {
    setColumnFilters({});
    resetSort();
  }, [resetSort]);

  return {
    cellValue,
    filterConfig,
    columnFilters,
    setColumnFilters,
    setColumnFilter,
    clearFilters,
    activeFilterKeys,
    activeFilterCount: activeFilterKeys.length,
    isFiltering: activeFilterKeys.length > 0,
    filteredRows,
    sortedRows,
    sortBy,
    sortDirection,
    setSort,
    resetSort,
    resetAll,
  };
}
