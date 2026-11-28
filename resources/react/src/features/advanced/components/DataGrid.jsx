import { useEffect, useMemo, useRef, useCallback } from "react";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { InteractiveColGroup } from "@/shared/components/table/InteractiveTableHeader";
import { useColumnVisibility } from "@/shared/hooks/useColumnVisibility";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { DataViewHeader } from "@/shared/components/data-view/DataViewHeader";
import { useDataView } from "@/shared/components/data-view/useDataView";
import { cn } from "@/shared/utils/utils";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { useToolbarTableColumns } from "./ToolbarTableColumnsContext";

export const HEADER_ACTIONS_KEY = "special_actions";

export function DataGrid({ columns, rows, emptyText = "Data belum tersedia.", onRowClick, selectionEnabled = false, selectedIds = new Set(), allSelected = false, onToggleRow, onToggleAll, isRowSelectable, storageKey, hasNextPage = false, isFetchingNextPage = false, onLoadMore, onFilterStateChange, viewMode = "list", card, chart = null, headerActions, renderSpecialActions, headerActionsLabel = "Aksi Khusus" }) {
  const { register, unregister } = useToolbarTableColumns();
  const tableColumns = useMemo(() => {
    if ((!headerActions && !renderSpecialActions) || columns.some((column) => column.key === HEADER_ACTIONS_KEY)) return columns;
    return [...columns, { key: HEADER_ACTIONS_KEY, label: headerActionsLabel, width: 240, minWidth: 220, maxWidth: 340, filterable: false, align: "right" }];
  }, [columns, headerActions, renderSpecialActions, headerActionsLabel]);
  const visibleState = useColumnVisibility(tableColumns, storageKey || `advanced.${tableColumns.map((column) => column.key).join(".")}`);
  const visibleColumns = useMemo(
    () => tableColumns.filter((column) => visibleState.visibleSet.has(column.key)),
    [tableColumns, visibleState.visibleSet],
  );
  const specialVisible = visibleState.visibleSet.has(HEADER_ACTIONS_KEY);
  const tableKey = useMemo(() => storageKey || `advanced.${tableColumns.map((column) => column.key).join(".")}`, [tableColumns, storageKey]);
  const layoutColumns = useMemo(
    () => visibleColumns.map((column) => ({ ...column, width: column.width || 170, minWidth: column.minWidth || 96, maxWidth: column.maxWidth || 520 })),
    [visibleColumns],
  );
  const view = useDataView({ columns: layoutColumns, rows });
  const {
    filterConfig,
    columnFilters,
    setColumnFilter,
    activeFilterCount,
    sortedRows,
    sortBy,
    sortDirection,
    setSort,
    resetSort,
    resetAll,
  } = view;

  const layout = useTableColumnLayout({ storageKey: tableKey, columns: layoutColumns, preferredOrder: visibleState.visibleKeys, onOrderChange: visibleState.syncVisibleOrder });
  const hScroll = useHorizontalScroll();
  const headerViewportRef = useRef(null);

  // Header tabel berada di kontainer scroll horizontal tersendiri agar bisa
  // sticky terhadap halaman (bukan terhadap scrollport tabel). Posisi
  // horizontalnya disinkronkan dua arah dengan body tabel.
  const handleBodyScroll = useCallback((event) => {
    hScroll.handleTableScroll(event);
    const header = headerViewportRef.current;
    if (header && Math.abs(header.scrollLeft - event.currentTarget.scrollLeft) > 1) {
      header.scrollLeft = event.currentTarget.scrollLeft;
    }
  }, [hScroll]);

  const handleHeaderScroll = useCallback((event) => {
    const body = hScroll.scrollRef.current;
    if (body && Math.abs(body.scrollLeft - event.currentTarget.scrollLeft) > 1) {
      body.scrollLeft = event.currentTarget.scrollLeft;
    }
  }, [hScroll]);

  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);

  useEffect(() => {
    onFilterStateChange?.({ activeCount: activeFilterCount, filteredCount: sortedRows.length, loadedCount: rows.length });
  }, [activeFilterCount, onFilterStateChange, rows.length, sortedRows.length]);

  useEffect(() => {
    if (!register) return undefined;
    if (tableColumns.length <= 1) {
      unregister();
      return undefined;
    }
    register({
      columns: visibleState.allColumns?.length ? visibleState.allColumns : tableColumns,
      visibleKeys: visibleState.visibleKeys,
      onMoveColumn: visibleState.moveColumn,
      onToggle: visibleState.toggleColumn,
      onShowAll: visibleState.showAll,
      onReset: visibleState.reset,
      onApplyDefault: visibleState.applyAsDefault,
    });
    return () => unregister();
  }, [tableColumns, layoutColumns, register, unregister, visibleState.allColumns, visibleState.applyAsDefault, visibleState.moveColumn, visibleState.reset, visibleState.showAll, visibleState.toggleColumn, visibleState.visibleKeys]);

  const emptyMessage = rows.length && !activeFilterCount ? emptyText : activeFilterCount ? "Tidak ada data yang cocok dengan filter aktif." : emptyText;

  // ── HEADER PERSISTEN ────────────────────────────────────────────────
  // Dirender SEKALI, di luar percabangan mode tampilan. Struktur return di
  // bawah selalu: header -> body. React karena itu tidak pernah melepas
  // header saat viewMode berubah, sehingga popover filter tetap terbuka,
  // state filter tetap hidup, dan posisi scroll horizontal tidak reset.
  const persistentHeader = (
    <DataViewHeader
      columns={layout.orderedColumns}
      tableWidth={tableWidth}
      getColumnStyle={layout.getColumnStyle}
      getHeaderProps={layout.getHeaderProps}
      sort={{ by: sortBy, direction: sortDirection, set: setSort, reset: resetSort }}
      filter={{ config: filterConfig, values: columnFilters, setValue: setColumnFilter, resetAll }}
      resize={{ onStart: layout.startResize, onReset: layout.resetWidth, dragKey: layout.dragKey, dropKey: layout.dropKey }}
      selection={selectionEnabled ? { enabled: true, allSelected, onToggleAll } : null}
      actionsKey={HEADER_ACTIONS_KEY}
      actionsLabel={headerActionsLabel}
      actionsContent={renderSpecialActions ? headerActionsLabel : headerActions}
      viewportRef={headerViewportRef}
      onViewportScroll={handleHeaderScroll}
    />
  );

  const headerActionsBar = headerActions && !renderSpecialActions && specialVisible ? (
    <div className="mb-1 flex items-center justify-end bg-white px-1 py-1">{headerActions}</div>
  ) : null;

  // Grafik, kartu, dan tabel SEMUA membaca `sortedRows` yang sama.
  // `chart` boleh berupa node atau fungsi (rows, meta) => node agar grafik
  // ikut menyaring saat filter header berubah.
  const chartContent = typeof chart === "function"
    ? chart(sortedRows, { columnFilters, activeFilterCount, loadedCount: rows.length })
    : chart;

  const sentinel = hasNextPage || isFetchingNextPage ? (
    <InfiniteScrollSentinel hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={onLoadMore} />
  ) : null;

  let body;
  if (viewMode === "chart" && chart) {
    body = <div className="border-x border-b border-slate-200 bg-white">{chartContent}</div>;
  } else if (viewMode === "grid") {
    body = (
      <>
        <div className="border-x border-b border-slate-200 bg-white p-2">
          {sortedRows.length ? (
            <RecordCardGrid
              rows={sortedRows}
              columns={layout.orderedColumns.filter((column) => column.key !== HEADER_ACTIONS_KEY)}
              card={card}
              onRowClick={onRowClick}
              selectionEnabled={selectionEnabled}
              selectedIds={selectedIds}
              isRowSelectable={isRowSelectable}
              onToggleRow={onToggleRow}
              rowKey={(row) => row.id ?? row.orderId ?? row.order_id}
            />
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">{emptyMessage}</div>
          )}
        </div>
        {sentinel}
      </>
    );
  } else if (!sortedRows.length) {
    body = (
      <div ref={hScroll.scrollRef} className="w-full min-w-0 max-w-full border-x border-b border-slate-200 bg-white">
        <div className="p-8 text-center text-sm text-slate-500">{emptyMessage}</div>
      </div>
    );
  } else {
    body = (
      <div ref={hScroll.scrollRef} onScroll={handleBodyScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] border-x border-b border-slate-200 bg-white">
        <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableWidth, 760), minWidth: "100%" }}>
          {/* table-fixed membagi kolom rata bila body tidak punya lebar kolom,
              sehingga daftar akan bergeser dari header. ColGroup ini memakai
              lebar yang sama persis dengan header (termasuk kolom seleksi). */}
          <InteractiveColGroup
            columns={layout.orderedColumns}
            getColumnStyle={layout.getColumnStyle}
            leadingWidth={selectionEnabled ? 44 : 0}
          />
          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row) => {
              const inactive = isInactiveRow(row);
              return (
                <tr key={row.id} onClick={() => onRowClick?.(row)} className={cn("relative", inactive && "bg-slate-50", onRowClick ? "cursor-pointer hover:bg-emerald-50/40" : "hover:bg-slate-50")}>
                  {selectionEnabled ? (
                    <td className={cn("px-4 py-2.5 text-center align-middle", inactive && "opacity-50 saturate-50")} onClick={(event) => event.stopPropagation()}>
                      {!isRowSelectable || isRowSelectable(row) ? (
                        <input type="checkbox" checked={selectedIds.has(String(row.id)) || selectedIds.has(Number(row.id))} onChange={() => onToggleRow?.(row.id)} aria-label={`Pilih data ${row.id}`} />
                      ) : null}
                    </td>
                  ) : null}
                  {layout.orderedColumns.map((column) => {
                    if (column.key === HEADER_ACTIONS_KEY) {
                      return (
                        <td key={column.key} className="px-4 py-2.5 text-right align-middle" onClick={(event) => event.stopPropagation()}>
                          {renderSpecialActions ? renderSpecialActions(row) : null}
                        </td>
                      );
                    }
                    const content = column.render ? column.render(row) : formatTableValue(resolveTableValue(row, column.key));
                    return (
                      <td key={column.key} className={cn("overflow-hidden px-4 py-2.5 align-middle text-slate-700", column.align === "right" && "text-right", column.align === "center" && "text-center")}>
                        <div className={cn("truncate", inactive && "opacity-50 saturate-50")}>{content}</div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {sentinel}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      {viewMode === "list" && sortedRows.length ? null : headerActionsBar}
      {viewMode === "list" && sortedRows.length ? (
        <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
      ) : null}
      {persistentHeader}
      {body}
    </div>
  );
}
