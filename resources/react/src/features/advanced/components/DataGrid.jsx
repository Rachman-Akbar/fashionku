import { useEffect, useMemo, useState, useCallback } from "react";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { useColumnVisibility } from "@/shared/hooks/useColumnVisibility";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { cn } from "@/shared/utils/utils";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { useToolbarTableColumns } from "./ToolbarTableColumnsContext";

function hasFilterValue(type, value) {
  if (type === "range") return Boolean(value?.min !== "" || value?.max !== "");
  return value !== "" && value !== null && value !== undefined;
}

function valueText(value) {
  const formatted = formatTableValue(value);
  return formatted !== "-" ? String(formatted).toLowerCase() : "";
}

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
  const filterConfig = useMemo(() => {
    const config = {};
    layoutColumns.forEach((column) => {
      if (column.filterable === false || column.key === HEADER_ACTIONS_KEY) return;
      config[column.key] = { type: column.filterType || "text", options: column.options || [] };
    });
    return config;
  }, [layoutColumns]);

  // Nilai sel untuk filter/sort/opsi. Kolom boleh mendefinisikan `valueOf`
  // untuk nilai turunan (mis. persentase kenaikan HPP) yang tidak ada di data.
  const columnsByKey = useMemo(() => new Map(layoutColumns.map((column) => [column.key, column])), [layoutColumns]);
  const cellValue = useCallback((row, key) => {
    const column = columnsByKey.get(key);
    if (typeof column?.valueOf === "function") return column.valueOf(row);
    return resolveTableValue(row, key);
  }, [columnsByKey]);

  const selectOptions = useMemo(() => {
    const options = {};
    layoutColumns.forEach((column) => {
      if (column.key === HEADER_ACTIONS_KEY || (column.filterType || "text") !== "select" || (column.options && column.options.length)) return;
      const values = new Set();
      rows.forEach((row) => {
        const value = formatTableValue(cellValue(row, column.key));
        if (value !== "-") values.add(value);
      });
      options[column.key] = [...values].sort((left, right) => left.localeCompare(right, "id")).map((value) => ({ value, label: value }));
    });
    return options;
  }, [cellValue, layoutColumns, rows]);

  const [columnFilters, setColumnFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const layout = useTableColumnLayout({ storageKey: tableKey, columns: layoutColumns, preferredOrder: visibleState.visibleKeys, onOrderChange: visibleState.syncVisibleOrder });
  const hScroll = useHorizontalScroll();

  const sortedRows = useMemo(() => {
    let next = rows;
    const activeFilters = Object.keys(columnFilters).filter((key) => hasFilterValue(filterConfig[key]?.type, columnFilters[key]));
    if (activeFilters.length) {
      next = next.filter((row) =>
        activeFilters.every((key) => {
          const value = cellValue(row, key);
          const type = filterConfig[key].type;
          const filterValue = columnFilters[key];
          if (type === "range") {
            const num = Number(value);
            return !(filterValue.min !== "" && !(num >= Number(filterValue.min))) && !(filterValue.max !== "" && !(num <= Number(filterValue.max)));
          }
          if (type === "select") {
            return String(value ?? "") === String(filterValue ?? "") || String(formatTableValue(value ?? "")) === String(filterValue ?? "");
          }
          return valueText(value).includes(String(filterValue ?? "").toLowerCase());
        }),
      );
    }
    if (sortBy) {
      const direction = sortDirection === "desc" ? -1 : 1;
      next = [...next].sort((left, right) =>
        String(cellValue(left, sortBy) ?? "").localeCompare(String(cellValue(right, sortBy) ?? ""), "id", { numeric: true, sensitivity: "base" }) * direction,
      );
    }
    return next;
  }, [cellValue, columnFilters, filterConfig, rows, sortBy, sortDirection]);

  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);
  const activeFilterCount = Object.keys(columnFilters).filter((key) => hasFilterValue(filterConfig[key]?.type, columnFilters[key])).length;

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

  // Header tabel (sekaligus baris filter) dibangun sekali lalu dipakai di
  // semua mode tampilan: list, kartu, dan grafik. Jadi filter selalu
  // tersedia walau mode tampilan data diganti.
  const headerCells = (
    <tr>
      {selectionEnabled ? (
        <th className="w-11 border-b border-slate-200 px-3 py-2.5 text-center">
          <input type="checkbox" checked={allSelected} onChange={onToggleAll} aria-label="Pilih semua data" />
        </th>
      ) : null}
      {layout.orderedColumns.map((column) => column.key === HEADER_ACTIONS_KEY ? (
        <th key={column.key} className="border-b border-slate-200 px-3 py-2.5 text-right align-middle" style={layout.getColumnStyle(column.key)}>
          {renderSpecialActions ? headerActionsLabel : headerActions}
        </th>
      ) : (
        <TableHeaderFilter
          key={column.key}
          label={column.label}
          sortKey={column.key}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(key, direction) => {
            setSortBy(key);
            setSortDirection(direction);
          }}
          filterable={column.filterable !== false}
          filterType={column.filterable === false ? undefined : filterConfig[column.key]?.type}
          filterValue={columnFilters[column.key]}
          onFilterChange={(value) =>
            setColumnFilters((current) => {
              const next = { ...current };
              if (hasFilterValue(filterConfig[column.key]?.type, value)) next[column.key] = value;
              else delete next[column.key];
              return next;
            })
          }
          onClearAllFilters={() => { setColumnFilters({}); setSortBy(""); setSortDirection("asc"); }}
          onResetSort={() => { setSortBy(""); setSortDirection("asc"); }}
          options={selectOptions[column.key] || filterConfig[column.key]?.options || []}
          headerProps={layout.getHeaderProps(column.key)}
          columnKey={column.key}
          columnStyle={layout.getColumnStyle(column.key)}
          onResizeStart={layout.startResize}
          onResetWidth={layout.resetWidth}
          dragging={layout.dragKey === column.key}
          dropTarget={layout.dropKey === column.key}
          className="border-b border-slate-200 py-2.5"
        />
      ))}
    </tr>
  );

  // Sticky di bawah toolbar daftar (`--list-toolbar-h` diisi ListPageFrame)
  // dan di atas tabel kartu/grafik. Satu-satunya area scroll adalah <main>.
  // Baris header saja: dipakai di dalam satu kontainer scroll bersama tabel
  // body (mode list) agar header dan isi bergeser bersamaan saat di-scroll
  // ke samping. `sticky` tetap bekerja karena kontainer memakai
  // `overflow-y: clip` (bukan scroll container vertikal).
  const headerRow = (
    <div className="sticky top-[var(--list-toolbar-h,0px)] z-30 bg-slate-100">
      <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableWidth, 760), minWidth: "100%" }}>
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">{headerCells}</thead>
      </table>
    </div>
  );

  // Header dipakai juga sebagai baris filter, jadi harus tetap menempel di
  // atas saat halaman digulir pada SEMUA mode tampilan (list, kartu, grafik).
  // `[overflow-y:clip]` penting: kontainer hanya menjadi scrollport horizontal,
  // sehingga `sticky` tetap mengacu ke area gulir halaman.
  const headerTable = (
    <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] bg-slate-100">{headerRow}</div>
  );

  const headerActionsBar = headerActions && !renderSpecialActions && specialVisible ? (
    <div className="mb-1 flex items-center justify-end bg-white px-1 py-1">{headerActions}</div>
  ) : null;

  if (viewMode === "chart" && chart) {
    return (
      <div className="w-full min-w-0 max-w-full">
        {headerActionsBar}
        {headerTable}
        <div className="border-x border-b border-slate-200 bg-white">{chart}</div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="w-full min-w-0 max-w-full">
        {headerActionsBar}
        {headerTable}
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
        {hasNextPage || isFetchingNextPage ? (
          <InfiniteScrollSentinel hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={onLoadMore} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      {!sortedRows.length ? headerActionsBar : null}
      {!sortedRows.length ? (
        <>
          <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
          <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] border-x border-b border-slate-200 bg-white">
            {headerRow}
            <div className="p-8 text-center text-sm text-slate-500">{emptyMessage}</div>
          </div>
        </>
      ) : null}

      {sortedRows.length ? (
        <>
          {/* Satu kontainer scroll horizontal untuk header + body: sebelumnya
              dua kontainer terpisah sehingga geseran ke samping tidak sinkron
              (header diam, isi bergeser) dan terasa "tidak bisa digeser". */}
          {/* Scrollbar horizontal di atas header supaya tetap terjangkau walau
              daftar sudah panjang (infinite scroll). */}
          <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
          <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] border-x border-b border-slate-200 bg-white">
            {headerRow}
            <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableWidth, 760), minWidth: "100%" }}>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row) => {
                const inactive = isInactiveRow(row);
                return (
                  <tr key={row.id} onClick={() => onRowClick?.(row)} className={cn("relative", inactive && "bg-slate-50", onRowClick ? "cursor-pointer hover:bg-emerald-50/40" : "hover:bg-slate-50")}>
                    {selectionEnabled ? (
                      <td className={cn("px-3 py-2.5 text-center", inactive && "opacity-50 saturate-50")} onClick={(event) => event.stopPropagation()}>
                        {!isRowSelectable || isRowSelectable(row) ? (
                          <input type="checkbox" checked={selectedIds.has(String(row.id)) || selectedIds.has(Number(row.id))} onChange={() => onToggleRow?.(row.id)} aria-label={`Pilih data ${row.id}`} />
                        ) : null}
                      </td>
                    ) : null}
                    {layout.orderedColumns.map((column) => {
                      if (column.key === HEADER_ACTIONS_KEY) {
                        return (
                          <td key={column.key} className="px-3 py-2.5 text-right" onClick={(event) => event.stopPropagation()}>
                            {renderSpecialActions ? renderSpecialActions(row) : null}
                          </td>
                        );
                      }
                      const content = column.render ? column.render(row) : formatTableValue(resolveTableValue(row, column.key));
                      return (
                        <td key={column.key} className={cn("overflow-hidden px-3 py-2.5 align-top text-slate-700", column.align === "right" && "text-right", column.align === "center" && "text-center")}>
                          <div className={cn("truncate", inactive && "opacity-50 saturate-50")}>{content}</div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {hasNextPage || isFetchingNextPage ? (
            <InfiniteScrollSentinel hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} onLoadMore={onLoadMore} />
          ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}