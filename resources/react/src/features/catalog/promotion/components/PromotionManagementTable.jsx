import { memo, useCallback, useMemo } from "react";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { TableSelectionCell, TableSelectionHeader } from "@/shared/components/crud/TableSelectionCell";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useColumnFilterState } from "@/shared/hooks";
import { formatDateTime } from "@/core/utils/dateTime";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const PROMOTION_TABLE_COLUMNS = [
  { key: "promotion", label: "Promosi" },
  { key: "store", label: "Toko" },
  { key: "target", label: "Target" },
  { key: "image", label: "Gambar", defaultVisible: false },
  { key: "mobileImage", label: "Gambar Mobile", defaultVisible: false },
  { key: "sortOrder", label: "Urutan", defaultVisible: false, align: "right" },
  { key: "approval", label: "Approval" },
  { key: "active", label: "Active" },
  { key: "submittedAt", label: "Diajukan" },
  { key: "approvedAt", label: "Disetujui", defaultVisible: false },
];

const widths = { promotion: 240, store: 220, target: 220, image: 120, mobileImage: 110, sortOrder: 100, approval: 180, active: 130, submittedAt: 170, approvedAt: 170 };

export const PromotionManagementTable = memo(function PromotionManagementTable({
  rows,
  portal,
  onEdit,
  onToggleActive,
  onApprove,
  onReject,
  pendingId,
  columns = PROMOTION_TABLE_COLUMNS,
  visibleSet,
  selectionEnabled = false,
  selectedIds = new Set(),
  allSelected = false,
  onToggleRow,
  onToggleAll,
}) {
  const isAdmin = portal === "admin";
  const activeColumns = useMemo(() => columns.filter((column) => column.key !== "store" || isAdmin).filter((column) => !visibleSet || visibleSet.has(column.key)).map((column) => ({ ...column, width: widths[column.key] || 180 })), [columns, isAdmin, visibleSet]);
  const layout = useTableColumnLayout({ storageKey: "catalog.promotions", columns: activeColumns });
  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);

  const getValue = useCallback((row, key) => {
    if (key === "promotion") return row.name || "";
    if (key === "store") return row.storeName || "Platform";
    if (key === "target") return `${row.clickAction || ""} ${row.targetId ?? ""} ${row.targetUrl ?? ""}`;
    if (key === "sortOrder") return row.sortOrder;
    if (key === "approval") return row.approvalStatus || "";
    if (key === "active") return row.isActive ? "active" : "inactive";
    return row[key] ?? row.raw?.[key];
  }, []);

  const filterTypes = useMemo(() => ({ promotion: "text", store: "text", target: "text", sortOrder: "range", approval: "select", active: "select", submittedAt: "text", approvedAt: "text" }), []);
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
    if (column.key === "promotion") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Promosi" sortKey="promotion" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.promotion || ""} onFilterChange={(value) => changeFilter("promotion", value)} placeholder="Cari nama promosi" />;
    if (column.key === "store") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Toko" sortKey="store" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.store || ""} onFilterChange={(value) => changeFilter("store", value)} placeholder="Cari toko" />;
    if (column.key === "target") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Target" filterType="text" filterValue={columnFilters.target || ""} onFilterChange={(value) => changeFilter("target", value)} placeholder="Cari target" />;
    if (column.key === "image") return <InteractiveTableHeader key={column.key} {...interactiveProps(column)}>Gambar</InteractiveTableHeader>;
    if (column.key === "mobileImage") return <InteractiveTableHeader key={column.key} {...interactiveProps(column)}>Gambar Mobile</InteractiveTableHeader>;
    if (column.key === "sortOrder") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Urutan" align="right" filterType="range" filterValue={columnFilters.sortOrder || { min: "", max: "" }} onFilterChange={(value) => changeFilter("sortOrder", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    if (column.key === "approval") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Approval" sortKey="approval" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.approval || ""} onFilterChange={(value) => changeFilter("approval", value)} options={[{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" }]} />;
    if (column.key === "active") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Active" sortKey="active" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.active || ""} onFilterChange={(value) => changeFilter("active", value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Non-Active" }]} />;
    if (column.key === "submittedAt") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Diajukan" filterType="text" filterValue={columnFilters.submittedAt || ""} onFilterChange={(value) => changeFilter("submittedAt", value)} placeholder="Cari tanggal" />;
    return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Disetujui" filterType="text" filterValue={columnFilters.approvedAt || ""} onFilterChange={(value) => changeFilter("approvedAt", value)} placeholder="Cari tanggal" />;
  };

  const renderCell = (column, row) => {
    if (column.key.startsWith("raw:")) return <td key={column.key} className="max-w-72 truncate px-4 py-3 text-slate-600">{formatTableValue(resolveTableValue({ raw: row.raw }, column.rawKey))}</td>;
    if (column.key === "promotion") return <td key={column.key} className="px-4 py-3"><p className="font-extrabold text-slate-900">{toTitleCase(row.name)}</p><p className="mt-1 text-xs text-slate-500">{row.badge}</p></td>;
    if (column.key === "store") return <td key={column.key} className="px-4 py-3 font-bold text-slate-700">{toTitleCase(row.storeName) || "Platform"}</td>;
    if (column.key === "target") return <td key={column.key} className="px-4 py-3 text-slate-600"><span className="capitalize">{row.clickAction}</span>{row.targetId ? ` #${row.targetId}` : row.targetUrl ? <p className="max-w-[220px] truncate text-xs text-slate-400">{row.targetUrl}</p> : null}</td>;
    if (column.key === "image") return <td key={column.key} className="px-4 py-3"><img src={row.imageUrl} alt={row.name} className="h-12 w-24 bg-slate-100 object-cover" loading="lazy" /></td>;
    if (column.key === "mobileImage") return <td key={column.key} className="px-4 py-3"><img src={row.mobileImageUrl} alt="" className="h-12 w-20 bg-slate-100 object-cover" loading="lazy" /></td>;
    if (column.key === "sortOrder") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{row.sortOrder}</td>;
    if (column.key === "approval") return <td key={column.key} className="px-4 py-3"><div className="flex flex-col items-start gap-1.5"><StatusBadge status={row.approvalStatus} />{row.rejectionReason ? <p className="max-w-[240px] text-xs text-red-600">{row.rejectionReason}</p> : null}{isAdmin && row.approvalStatus === "pending" ? <div className="flex gap-1" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => onApprove(row)} className="h-8 bg-emerald-50 px-2.5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100">Approve</button><button type="button" onClick={() => onReject(row)} className="h-8 bg-amber-50 px-2.5 text-xs font-extrabold text-amber-700 hover:bg-amber-100">Reject</button></div> : null}</div></td>;
    if (column.key === "active") return <td key={column.key} className="px-4 py-3" onClick={(event) => event.stopPropagation()}><InlineActiveSwitch checked={row.isActive} pending={pendingId === row.id} onChange={(checked) => onToggleActive?.(row, checked)} compact /></td>;
    if (column.key === "submittedAt") return <td key={column.key} className="px-4 py-3 text-slate-500">{formatDateTime(row.submittedAt)}</td>;
    return <td key={column.key} className="px-4 py-3 text-slate-500">{formatDateTime(row.approvedAt)}</td>;
  };

  return (
    <div className="overflow-hidden bg-white ring-1 ring-slate-200">
      <table className="table-fixed text-left text-sm" style={{ width: Math.max(tableWidth, 900), minWidth: "100%" }}>
          <InteractiveColGroup columns={layout.orderedColumns} getColumnStyle={layout.getColumnStyle} leadingWidth={selectionEnabled ? 44 : 0} />
          <thead className="sticky top-0 z-10 bg-slate-100 text-xs font-extrabold text-slate-600">
            <tr>
              <TableSelectionHeader enabled={selectionEnabled} checked={allSelected} onToggle={onToggleAll} />
              {layout.orderedColumns.map(renderHeader)}
            </tr>
          </thead>
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
        </table>
    </div>
  );
});