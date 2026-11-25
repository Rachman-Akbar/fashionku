import { memo } from "react";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";

/**
 * Header kolom dengan filter untuk SEMUA kolom tabel (termasuk kolom database
 * yang muncul otomatis). Tipe filter ditentukan pemanggil lewat
 * `buildColumnFilterConfig`, jadi satu komponen ini cukup untuk kolom teks,
 * pilihan, maupun rentang angka.
 */
export const ColumnFilterHeader = memo(function ColumnFilterHeader({
  column,
  filterType = "text",
  filterValue,
  onFilterChange,
  options = [],
  sortKey,
  sortBy,
  sortDirection,
  onSortChange,
  headerProps,
  columnStyle,
  onResizeStart,
  onResetWidth,
  dragging = false,
  dropTarget = false,
  onClearAllFilters,
  onResetSort,
  align = "left",
  className,
}) {
  if (!column) return null;
  return (
    <TableHeaderFilter
      label={column.label}
      sortKey={sortKey}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      filterType={filterType}
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      options={options}
      placeholder={`Cari ${String(column.label || "").toLowerCase()}`}
      align={align}
      className={className}
      headerProps={headerProps}
      columnKey={column.key}
      columnStyle={columnStyle}
      onResizeStart={onResizeStart}
      onResetWidth={onResetWidth}
      dragging={dragging}
      dropTarget={dropTarget}
      onClearAllFilters={onClearAllFilters}
      onResetSort={onResetSort}
    />
  );
});
