import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { cn } from "@/shared/utils/utils";

/**
 * Header kolom + baris filter, SEKALI render untuk semua mode tampilan.
 *
 * Komponen ini sengaja tidak tahu apa pun tentang body (tabel/kartu/grafik).
 * Ia hanya menerima state filter & urutan, sehingga bisa dipasang sekali di
 * atas area konten dan tidak ikut ter-unmount saat mode tampilan diganti.
 */
export function DataViewHeader({
  columns = [],
  tableWidth,
  minWidth = 760,
  getColumnStyle,
  getHeaderProps,
  sort = {},
  filter = {},
  resize = {},
  selection = null,
  actionsKey,
  actionsLabel = "Aksi Khusus",
  actionsContent = null,
  sticky = true,
  stickyTop = "var(--list-toolbar-h,0px)",
  viewportRef,
  onViewportScroll,
  className,
  theadClassName = "bg-slate-100 text-xs uppercase tracking-wide text-slate-600",
}) {
  const cellWidth = (column) => {
    if (getColumnStyle) return getColumnStyle(column.key);
    return {
      width: column.width || 170,
      minWidth: column.minWidth || 96,
      maxWidth: column.maxWidth || 520,
    };
  };

  return (
    <div className={cn(sticky && "sticky z-30 bg-slate-100", className)} style={sticky ? { top: stickyTop } : undefined}>
      <div
        ref={viewportRef}
        onScroll={onViewportScroll}
        className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] bg-slate-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableWidth || minWidth, minWidth), minWidth: "100%" }}>
          <thead className={theadClassName}>
            <tr>
              {selection?.enabled ? (
                <th className="w-11 border-b border-slate-200 px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(selection.allSelected)}
                    onChange={selection.onToggleAll}
                    aria-label="Pilih semua data"
                  />
                </th>
              ) : null}

              {columns.map((column) => {
                if (actionsKey && column.key === actionsKey) {
                  return (
                    <th key={column.key} className="border-b border-slate-200 px-3 py-2.5 text-right align-middle" style={cellWidth(column)}>
                      {actionsContent || actionsLabel}
                    </th>
                  );
                }

                return (
                  <TableHeaderFilter
                    key={column.key}
                    label={column.label}
                    sortKey={column.key}
                    sortBy={sort.by}
                    sortDirection={sort.direction}
                    onSortChange={sort.set}
                    filterable={column.filterable !== false}
                    filterType={column.filterable === false ? undefined : filter.config?.[column.key]?.type}
                    filterValue={filter.values?.[column.key]}
                    onFilterChange={(value) => filter.setValue?.(column.key, value)}
                    onClearAllFilters={filter.resetAll}
                    onResetSort={sort.reset}
                    options={filter.config?.[column.key]?.options || []}
                    headerProps={getHeaderProps?.(column.key)}
                    columnKey={column.key}
                    columnStyle={cellWidth(column)}
                    onResizeStart={resize.onStart}
                    onResetWidth={resize.onReset}
                    dragging={resize.dragKey === column.key}
                    dropTarget={resize.dropKey === column.key}
                    className="border-b border-slate-200 py-2.5"
                  />
                );
              })}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
