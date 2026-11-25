import { memo, useCallback, useEffect, useMemo } from "react";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { TableSelectionCell, TableSelectionHeader } from "@/shared/components/crud/TableSelectionCell";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InteractiveColGroup } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { useColumnFilterState } from "@/shared/hooks";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { buildColumnFilterConfig } from "@/shared/utils/columnFilters";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const PROMOTION_TABLE_COLUMNS = [
  { key: "promotion", label: "Promosi" },
  { key: "store", label: "Toko" },
  { key: "target", label: "Target" },
  { key: "image", label: "Gambar", defaultVisible: false },
  { key: "mobileImage", label: "Gambar Mobile", defaultVisible: false },
  { key: "sortOrder", label: "Urutan", defaultVisible: false, align: "right" },
  { key: "active", label: "Active" },
];

const widths = { promotion: 240, store: 220, target: 220, image: 120, mobileImage: 110, sortOrder: 100, active: 130 };

export const PromotionManagementTable = memo(function PromotionManagementTable({
  rows,
  portal,
  onEdit,
  onToggleActive,
  isActiveOf,
  pendingId,
  columns = PROMOTION_TABLE_COLUMNS,
  visibleSet,
  selectionEnabled = false,
  selectedIds = new Set(),
  allSelected = false,
  onToggleRow,
  onToggleAll,
  columnOrder,
  onOrderChange,
  onFilterStateChange,
  headerOnly = false,
}) {
  const isAdmin = portal === "admin";
  const activeColumns = useMemo(() => columns.filter((column) => column.key !== "store" || isAdmin).filter((column) => !visibleSet || visibleSet.has(column.key)).map((column) => ({ ...column, width: widths[column.key] || 180 })), [columns, isAdmin, visibleSet]);
  const layout = useTableColumnLayout({ storageKey: "catalog.promotions", columns: activeColumns, preferredOrder: columnOrder, onOrderChange });
  const hScroll = useHorizontalScroll();
  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);

  const getValue = useCallback((row, key) => {
    if (String(key).startsWith("raw:")) return row?.raw?.[String(key).slice(4)];
    if (key === "promotion") return row.name || "";
    if (key === "store") return row.storeName || "Platform";
    if (key === "target") return `${row.clickAction || ""} ${row.targetId ?? ""} ${row.targetUrl ?? ""}`;
    if (key === "sortOrder") return row.sortOrder;
    if (key === "active") return row.isActive ? "active" : "inactive";
    return row[key] ?? row.raw?.[key];
  }, []);

  const filterConfig = useMemo(() => buildColumnFilterConfig(columns, rows, getValue), [columns, getValue, rows]);
  const filterTypes = useMemo(() => ({
    ...filterConfig.types,
    promotion: "text",
    store: "text",
    target: "text",
    image: "text",
    mobileImage: "text",
    sortOrder: "range",
    active: "select",
  }), [filterConfig.types]);
  const { rows: tableRows, columnFilters, changeFilter, sortBy, sortDirection, setSort, resetFilters, resetSort } = useColumnFilterState({ rows, getValue, filterTypes });

  // Mode kartu/grafik memakai header ini sebagai filter, jadi hasil saringan
  // diteruskan ke pemanggil agar kartu menampilkan baris yang sama.
  useEffect(() => {
    onFilterStateChange?.({ filteredRows: tableRows });
  }, [onFilterStateChange, tableRows]);

  const interactiveProps = (column) => ({
    headerProps: layout.getHeaderProps(column.key),
    columnKey: column.key,
    columnStyle: layout.getColumnStyle(column.key),
    onResizeStart: layout.startResize,
    onResetWidth: layout.resetWidth,
    dragging: layout.dragKey === column.key,
    dropTarget: layout.dropKey === column.key,
    onClearAllFilters: resetFilters,
    onResetSort: resetSort,
  });

  const renderHeader = (column) => {
    if (column.key.startsWith("raw:")) return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label={column.label} filterType="text" filterValue={columnFilters[column.key] || ""} onFilterChange={(value) => changeFilter(column.key, value)} placeholder={`Cari ${String(column.label || "").toLowerCase()}`} />;
    if (column.key === "promotion") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Promosi" sortKey="promotion" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.promotion || ""} onFilterChange={(value) => changeFilter("promotion", value)} placeholder="Cari nama promosi" />;
    if (column.key === "store") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Toko" sortKey="store" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.store || ""} onFilterChange={(value) => changeFilter("store", value)} placeholder="Cari toko" />;
    if (column.key === "target") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Target" filterType="text" filterValue={columnFilters.target || ""} onFilterChange={(value) => changeFilter("target", value)} placeholder="Cari target" />;
    if (column.key === "image") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Gambar" filterType="text" filterValue={columnFilters.image || ""} onFilterChange={(value) => changeFilter("image", value)} placeholder="Cari gambar" />;
    if (column.key === "mobileImage") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Gambar Mobile" filterType="text" filterValue={columnFilters.mobileImage || ""} onFilterChange={(value) => changeFilter("mobileImage", value)} placeholder="Cari gambar mobile" />;
    if (column.key === "sortOrder") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Urutan" align="right" filterType="range" filterValue={columnFilters.sortOrder || { min: "", max: "" }} onFilterChange={(value) => changeFilter("sortOrder", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    if (column.key === "active") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Active" sortKey="active" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.active || ""} onFilterChange={(value) => changeFilter("active", value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Non-Active" }]} />;
    // Kolom database lain: filter mengikuti tipe otomatis (teks/pilihan/rentang).
    return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label={column.label} filterType={filterTypes[column.key] || "text"} filterValue={columnFilters[column.key]} onFilterChange={(value) => changeFilter(column.key, value)} options={filterConfig.options[column.key] || []} placeholder={`Cari ${String(column.label || "").toLowerCase()}`} />;
  };

  const renderCell = (column, row) => {
    if (column.key.startsWith("raw:")) return <td key={column.key} className="max-w-72 truncate px-4 py-3 text-slate-600">{formatTableValue(resolveTableValue({ raw: row.raw }, column.rawKey))}</td>;
    if (column.key === "promotion") return <td key={column.key} className="px-4 py-3"><p className="font-extrabold text-slate-900">{toTitleCase(row.name)}</p><p className="mt-1 text-xs text-slate-500">{row.badge}</p></td>;
    if (column.key === "store") return <td key={column.key} className="px-4 py-3 font-bold text-slate-700">{toTitleCase(row.storeName) || "Platform"}</td>;
    if (column.key === "target") return <td key={column.key} className="px-4 py-3 text-slate-600"><span className="capitalize">{row.clickAction}</span>{row.targetId ? ` #${row.targetId}` : row.targetUrl ? <p className="max-w-[220px] truncate text-xs text-slate-400">{row.targetUrl}</p> : null}</td>;
    if (column.key === "image") return <td key={column.key} className="px-4 py-3"><img src={row.imageUrl} alt={row.name} className="h-12 w-24 bg-slate-100 object-cover" loading="lazy" /></td>;
    if (column.key === "mobileImage") return <td key={column.key} className="px-4 py-3"><img src={row.mobileImageUrl} alt="" className="h-12 w-20 bg-slate-100 object-cover" loading="lazy" /></td>;
    if (column.key === "sortOrder") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{row.sortOrder}</td>;
    if (column.key === "active") return <td key={column.key} className="px-4 py-3" onClick={(event) => event.stopPropagation()}><InlineActiveSwitch checked={isActiveOf ? isActiveOf(row) : row.isActive} pending={pendingId === row.id} onChange={(checked) => onToggleActive?.(row, checked)} compact /></td>;
    // Kolom database lain dirender apa adanya (objek relasi tampil sebagai nama).
    return <td key={column.key} className="max-w-72 truncate px-4 py-3 text-slate-500">{formatTableValue(resolveTableValue(row, column.key))}</td>;
  };

  return (
    <div className={headerOnly ? "sticky top-[var(--list-toolbar-h,0px)] z-30 mb-3 bg-white" : undefined}>
      <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
      <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] bg-white ring-1 ring-slate-200">
      <table className="table-fixed text-left text-sm" style={{ width: Math.max(tableWidth, 900), minWidth: "100%" }}>
          <InteractiveColGroup columns={layout.orderedColumns} getColumnStyle={layout.getColumnStyle} leadingWidth={selectionEnabled ? 44 : 0} />
          <thead className={headerOnly ? "bg-slate-100 text-xs font-extrabold text-slate-600" : "sticky top-[var(--list-toolbar-h,0px)] z-20 bg-slate-100 text-xs font-extrabold text-slate-600"}>
            <tr>
              <TableSelectionHeader enabled={selectionEnabled} checked={allSelected} onToggle={onToggleAll} />
              {layout.orderedColumns.map(renderHeader)}
            </tr>
          </thead>
          {headerOnly ? null : (
          <tbody className="divide-y divide-slate-100">
            {tableRows.map((row) => {
              const inactive = isInactiveRow(row);
              return (
                <tr key={row.id} onClick={() => onEdit(row)} className={`relative ${inactive ? "bg-slate-50 opacity-60 saturate-50" : ""} cursor-pointer hover:bg-slate-50`} title="Klik untuk edit">
                  <TableSelectionCell enabled={selectionEnabled} checked={selectedIds.has(String(row.id))} onToggle={() => onToggleRow?.(row.id)} />
                  {layout.orderedColumns.map((column) => renderCell(column, row))}
                </tr>
              );
            })}
          </tbody>
          )}
        </table>
      </div>
    </div>
  );
});