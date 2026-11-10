import { memo, useCallback, useMemo } from "react";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { TableSelectionCell, TableSelectionHeader } from "@/shared/components/crud/TableSelectionCell";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useColumnFilterState } from "@/shared/hooks";
import { formatTableValue } from "@/shared/utils/tableData";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const BANNER_TABLE_COLUMNS = [
  { key: "banner", label: "Banner" },
  { key: "store", label: "Toko" },
  { key: "image", label: "Gambar" },
  { key: "sortOrder", label: "Urutan" },
  { key: "active", label: "Status" },
];

const widths = { banner: 220, store: 220, image: 220, sortOrder: 120, active: 140 };

const alsoSelectable = (rows, key) => {
  const seen = new Set();
  return rows.flatMap((row) => {
    if (key !== "store") return [];
    const label = toTitleCase(row.storeName) || `Store #${row.storeId}`;
    if (!label || seen.has(label)) return [];
    seen.add(label);
    return [{ value: label, label }];
  });
};

export const BannerManagementTable = memo(function BannerManagementTable({ rows, portal = "seller", onEdit, onToggleActive, pendingId, columns = BANNER_TABLE_COLUMNS, visibleSet, selectionEnabled = false, selectedIds = new Set(), allSelected = false, onToggleRow, onToggleAll }) {
  const admin = portal === "admin";
  const activeColumns = useMemo(() => columns.filter((column) => (!visibleSet || visibleSet.has(column.key)) && (column.key !== "store" || admin)).map((column) => ({ ...column, width: widths[column.key] || 180, align: column.key === "sortOrder" ? "right" : "left" })), [admin, columns, visibleSet]);
  const layout = useTableColumnLayout({ storageKey: `${portal}.banners`, columns: activeColumns });
  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);

  const getValue = useCallback((row, key) => {
    switch (key) {
      case "banner":
        return row.name;
      case "store":
        return toTitleCase(row.storeName) || `Store #${row.storeId}`;
      case "sortOrder":
        return Number(row.sortOrder);
      case "active":
        return row.isActive ? "active" : "inactive";
      default:
        return row[key] ?? row.raw?.[key];
    }
  }, []);

  const storeOptions = useMemo(() => alsoSelectable(rows, "store"), [rows]);
  const filterTypes = useMemo(() => ({ banner: "text", store: "select", sortOrder: "range", active: "select" }), []);
  const { rows: tableRows, columnFilters, changeFilter, sortBy, sortDirection, setSort, resetFilters, resetSort } = useColumnFilterState({ rows, getValue, filterTypes });

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
    if (column.key.startsWith("raw:")) return <InteractiveTableHeader key={column.key} {...interactiveProps(column)}>{column.label}</InteractiveTableHeader>;
    if (column.key === "banner") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label={admin ? "Nama Banner" : "Banner"} sortKey="banner" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.banner || ""} onFilterChange={(value) => changeFilter("banner", value)} placeholder="Cari nama banner" />;
    if (column.key === "store") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Toko" sortKey="store" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.store || ""} onFilterChange={(value) => changeFilter("store", value)} options={storeOptions} />;
    if (column.key === "image") return <InteractiveTableHeader key={column.key} {...interactiveProps(column)}>Gambar</InteractiveTableHeader>;
    if (column.key === "sortOrder") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Urutan" sortKey="sortOrder" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="range" filterValue={columnFilters.sortOrder || { min: "", max: "" }} onFilterChange={(value) => changeFilter("sortOrder", value)} minPlaceholder="Urutan min" maxPlaceholder="Urutan max" align="right" />;
    return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Status" sortKey="active" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.active || ""} onFilterChange={(value) => changeFilter("active", value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Non-Active" }]} />;
  };

  const renderCell = (column, banner) => {
    if (column.key.startsWith("raw:")) return <td key={column.key} className="truncate px-4 py-3 text-slate-600">{formatTableValue(banner.raw?.[column.rawKey])}</td>;
    if (column.key === "banner") return <td key={column.key} className="truncate px-4 py-3 font-extrabold text-slate-900">{toTitleCase(banner.name)}</td>;
    if (column.key === "store") return <td key={column.key} className="truncate px-4 py-3 font-bold text-slate-700">{toTitleCase(banner.storeName) || `Store #${banner.storeId}`}</td>;
    if (column.key === "image") return <td key={column.key} className="px-4 py-3"><img src={banner.imageUrl} alt={banner.name} className="h-16 w-full max-w-44 bg-slate-100 object-cover" loading="lazy" /></td>;
    if (column.key === "sortOrder") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{banner.sortOrder}</td>;
    return <td key={column.key} className="px-4 py-3" onClick={(event) => event.stopPropagation()}><InlineActiveSwitch checked={banner.isActive} pending={pendingId === banner.id} onChange={(checked) => onToggleActive?.(banner, checked)} compact /></td>;
  };

  return <div className="bg-white ring-1 ring-slate-200"><table className="table-fixed text-left text-sm" style={{ width: Math.max(tableWidth, 720), minWidth: "100%" }}><InteractiveColGroup columns={layout.orderedColumns} getColumnStyle={layout.getColumnStyle} leadingWidth={selectionEnabled ? 44 : 0} /><thead className="sticky top-0 z-10 bg-slate-100 text-xs font-extrabold text-slate-600"><tr><TableSelectionHeader enabled={selectionEnabled} checked={allSelected} onToggle={onToggleAll} />{layout.orderedColumns.map(renderHeader)}</tr></thead><tbody className="divide-y divide-slate-100">{tableRows.map((banner) => { const inactive = isInactiveRow(banner); return <tr key={banner.id} onClick={() => onEdit(banner)} className={`relative ${inactive ? "bg-slate-50 opacity-60 saturate-50" : ""} cursor-pointer hover:bg-slate-50`}><TableSelectionCell enabled={selectionEnabled} checked={selectedIds.has(String(banner.id))} onToggle={() => onToggleRow?.(banner.id)} />{layout.orderedColumns.map((column) => renderCell(column, banner))}</tr>; })}</tbody></table></div>;
});
