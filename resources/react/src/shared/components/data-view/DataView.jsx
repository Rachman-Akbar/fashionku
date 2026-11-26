import { useDataView } from "./useDataView";
import { DataViewHeader } from "./DataViewHeader";

/**
 * Kerangka generik "header persisten + body yang bisa berganti mode".
 *
 * Susunannya SELALU sama:
 *   <DataViewHeader />        <- dirender sekali, di luar percabangan mode
 *   {mode === "list"  && renderTable(ctx)}
 *   {mode === "grid"  && renderGrid(ctx)}
 *   {mode === "chart" && renderChart(ctx)}
 *
 * Karena header tidak berada di dalam cabang kondisi, React tidak pernah
 * melepasnya saat mode berubah: popover filter yang terbuka, posisi scroll
 * horizontal, dan fokus input tetap hidup. Semua body menerima `ctx.rows`
 * (data yang sudah difilter + diurutkan) dari satu hook `useDataView`.
 */
export function DataView({
  columns = [],
  rows = [],
  viewMode = "list",
  getValue,
  initialFilters,
  initialSort,
  renderTable,
  renderGrid,
  renderChart,
  emptyText = "Data belum tersedia.",
  headerProps = {},
  selection = null,
  className,
}) {
  const view = useDataView({ columns, rows, getValue, initialFilters, initialSort });

  const ctx = {
    rows: view.sortedRows,
    filteredRows: view.filteredRows,
    allRows: rows,
    columns,
    emptyText,
    isFiltering: view.isFiltering,
    activeFilterCount: view.activeFilterCount,
    activeFilterKeys: view.activeFilterKeys,
    columnFilters: view.columnFilters,
    filterConfig: view.filterConfig,
    sortBy: view.sortBy,
    sortDirection: view.sortDirection,
  };

  const body = viewMode === "chart" && renderChart
    ? renderChart(ctx)
    : viewMode === "grid" && renderGrid
      ? renderGrid(ctx)
      : renderTable
        ? renderTable(ctx)
        : null;

  return (
    <div className={className || "w-full min-w-0 max-w-full"}>
      <DataViewHeader
        {...headerProps}
        columns={columns}
        sort={{ by: view.sortBy, direction: view.sortDirection, set: view.setSort, reset: view.resetSort }}
        filter={{
          config: view.filterConfig,
          values: view.columnFilters,
          setValue: view.setColumnFilter,
          resetAll: view.resetAll,
          ...headerProps.filter,
        }}
        selection={selection}
      />
      {body}
    </div>
  );
}
