import { useEffect, useMemo, useState } from "react";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useColumnVisibility } from "@/shared/hooks/useColumnVisibility";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { cn } from "@/shared/utils/utils";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { useToolbarTableColumns } from "./ToolbarTableColumnsContext";

function hasFilterValue(type, value) {
  if (type === "range") return Boolean(value?.min !== "" || value?.max !== "");
  return value !== "" && value !== null && value !== undefined;
}

function valueText(value) {
  const formatted = formatTableValue(value);
  return formatted !== "-" ? String(formatted).toLowerCase() : "";
}

export function DataGrid({ columns, rows, emptyText = "Data belum tersedia.", onRowClick, selectionEnabled = false, selectedIds = new Set(), allSelected = false, onToggleRow, onToggleAll, storageKey, hasNextPage = false, isFetchingNextPage = false, onLoadMore, onFilterStateChange }) {
  const { register, unregister } = useToolbarTableColumns();
  const visibleState = useColumnVisibility(columns, storageKey || `advanced.${columns.map((column) => column.key).join(".")}`);
  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleState.visibleSet.has(column.key)),
    [columns, visibleState.visibleSet],
  );
  const tableKey = useMemo(() => storageKey || `advanced.${columns.map((column) => column.key).join(".")}`, [columns, storageKey]);
  const layoutColumns = useMemo(
    () => visibleColumns.map((column) => ({ ...column, width: column.width || 170, minWidth: column.minWidth || 96, maxWidth: column.maxWidth || 520 })),
    [visibleColumns],
  );
  const filterConfig = useMemo(() => {
    const config = {};
    layoutColumns.forEach((column) => {
      if (column.filterable === false) return;
      config[column.key] = { type: column.filterType || "text", options: column.options || [] };
    });
    return config;
  }, [layoutColumns]);

  const selectOptions = useMemo(() => {
    const options = {};
    layoutColumns.forEach((column) => {
      if ((column.filterType || "text") !== "select" || (column.options && column.options.length)) return;
      const values = new Set();
      rows.forEach((row) => {
        const value = formatTableValue(resolveTableValue(row, column.key));
        if (value !== "-") values.add(value);
      });
      options[column.key] = [...values].sort((left, right) => left.localeCompare(right, "id")).map((value) => ({ value, label: value }));
    });
    return options;
  }, [layoutColumns, rows]);

  const [columnFilters, setColumnFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const layout = useTableColumnLayout({ storageKey: tableKey, columns: layoutColumns });

  const sortedRows = useMemo(() => {
    let next = rows;
    const activeFilters = Object.keys(columnFilters).filter((key) => hasFilterValue(filterConfig[key]?.type, columnFilters[key]));
    if (activeFilters.length) {
      next = next.filter((row) =>
        activeFilters.every((key) => {
          const value = resolveTableValue(row, key);
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
        String(resolveTableValue(left, sortBy) ?? "").localeCompare(String(resolveTableValue(right, sortBy) ?? ""), "id", { numeric: true, sensitivity: "base" }) * direction,
      );
    }
    return next;
  }, [columnFilters, filterConfig, rows, sortBy, sortDirection]);

  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);
  const activeFilterCount = Object.keys(columnFilters).filter((key) => hasFilterValue(filterConfig[key]?.type, columnFilters[key])).length;

  useEffect(() => {
    onFilterStateChange?.({ activeCount: activeFilterCount, filteredCount: sortedRows.length, loadedCount: rows.length });
  }, [activeFilterCount, onFilterStateChange, rows.length, sortedRows.length]);

  useEffect(() => {
    if (!register) return undefined;
    if (columns.length <= 1) {
      unregister();
      return undefined;
    }
    register({
      columns,
      visibleKeys: visibleState.visibleKeys,
      onToggle: visibleState.toggleColumn,
      onShowAll: visibleState.showAll,
      onReset: visibleState.reset,
      onApplyDefault: visibleState.applyAsDefault,
    });
    return () => unregister();
  }, [columns.length, columns, layoutColumns, register, unregister, visibleState.applyAsDefault, visibleState.reset, visibleState.showAll, visibleState.toggleColumn, visibleState.visibleKeys]);

  return (
    <div className="w-full min-w-0 max-w-full">
      {!sortedRows.length ? <div className="border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">{rows.length && !activeFilterCount ? emptyText : activeFilterCount ? "Tidak ada data yang cocok dengan filter aktif." : emptyText}</div> : null}

      {sortedRows.length ? (
        <div className="w-full min-w-0 max-w-full max-h-[calc(100vh-285px)] overflow-auto border border-slate-200 bg-white">
          <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableWidth, 760), minWidth: "100%" }}>
            <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                {selectionEnabled ? (
                  <th className="w-11 border-b border-slate-200 px-3 py-2.5 text-center">
                    <input type="checkbox" checked={allSelected} onChange={onToggleAll} aria-label="Pilih semua data" />
                  </th>
                ) : null}
                {layout.orderedColumns.map((column) => (
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
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row) => {
                const inactive = isInactiveRow(row);
                return (
                  <tr key={row.id} onClick={() => onRowClick?.(row)} className={cn("relative", inactive && "bg-slate-50", onRowClick ? "cursor-pointer hover:bg-emerald-50/40" : "hover:bg-slate-50")}>
                    {selectionEnabled ? (
                      <td className={cn("px-3 py-2.5 text-center", inactive && "opacity-50 saturate-50")} onClick={(event) => event.stopPropagation()}>
                        <input type="checkbox" checked={selectedIds.has(String(row.id)) || selectedIds.has(Number(row.id))} onChange={() => onToggleRow?.(row.id)} aria-label={`Pilih data ${row.id}`} />
                      </td>
                    ) : null}
                    {layout.orderedColumns.map((column) => {
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
      ) : null}
    </div>
  );
}