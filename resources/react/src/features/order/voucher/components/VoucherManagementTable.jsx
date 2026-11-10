import { memo, useCallback, useMemo } from "react";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { TableSelectionCell, TableSelectionHeader } from "@/shared/components/crud/TableSelectionCell";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useColumnFilterState } from "@/shared/hooks";
import { formatDateTime } from "@/core/utils/dateTime";
import { formatPrice } from "@/shared/utils/utils";
import { formatTableValue } from "@/shared/utils/tableData";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const VOUCHER_TABLE_COLUMNS = [
  { key: "voucher", label: "Voucher" },
  { key: "scope", label: "Cakupan" },
  { key: "image", label: "Gambar" },
  { key: "discount", label: "Diskon" },
  { key: "minSpend", label: "Min. Belanja", defaultVisible: false },
  { key: "minItems", label: "Min. Item", defaultVisible: false },
  { key: "terms", label: "Syarat & Ketentuan", defaultVisible: false },
  { key: "maxDiscount", label: "Maks. Diskon", defaultVisible: false },
  { key: "period", label: "Periode" },
  { key: "usage", label: "Penggunaan" },
  { key: "active", label: "Status" },
];

const widths = { voucher: 250, scope: 200, image: 110, discount: 180, minSpend: 150, minItems: 130, terms: 260, maxDiscount: 170, period: 190, usage: 150, active: 130 };

function discountLabel(row) {
  const value = row.discountType === "percentage" ? `${row.discountValue}%` : formatPrice(row.discountValue);
  return `${row.discountTarget === "shipping" ? "Ongkir" : "Produk"} · ${value}`;
}

export const VoucherManagementTable = memo(function VoucherManagementTable({
  rows,
  onEdit,
  onToggleActive,
  pendingId,
  columns = VOUCHER_TABLE_COLUMNS,
  visibleSet,
  selectionEnabled = false,
  selectedIds = new Set(),
  allSelected = false,
  onToggleRow,
  onToggleAll,
}) {
  const activeColumns = useMemo(() => columns.filter((column) => !visibleSet || visibleSet.has(column.key)).map((column) => ({ ...column, width: widths[column.key] || 180 })), [columns, visibleSet]);
  const layout = useTableColumnLayout({ storageKey: "order.vouchers", columns: activeColumns });
  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);

  const getValue = useCallback((row, key) => {
    if (key === "voucher") return row.name || "";
    if (key === "scope") return row.voucherScope || "";
    if (key === "image") return row.imageUrl || row.image || "";
    if (key === "discount") return `${row.discountTarget || ""} ${row.discountType || ""} ${row.discountValue ?? ""}`;
    if (key === "minSpend") return row.minSpend;
    if (key === "minItems") return row.minItems;
    if (key === "terms") return row.terms || "";
    if (key === "maxDiscount") return row.maxDiscount === "" || row.maxDiscount === null ? null : Number(row.maxDiscount);
    if (key === "period") return `${row.startsAt || ""} ${row.endsAt || ""}`;
    if (key === "usage") return Number(row.usedCount) || 0;
    if (key === "active") return row.isActive ? "active" : "inactive";
    return row[key] ?? row.raw?.[key];
  }, []);

  const filterTypes = useMemo(() => ({ voucher: "text", scope: "select", discount: "text", minSpend: "range", minItems: "range", terms: "text", maxDiscount: "range", period: "text", usage: "range", active: "select" }), []);
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
    if (column.key === "voucher") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Voucher" sortKey="voucher" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.voucher || ""} onFilterChange={(value) => changeFilter("voucher", value)} placeholder="Cari voucher" />;
    if (column.key === "scope") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Cakupan" sortKey="scope" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.scope || ""} onFilterChange={(value) => changeFilter("scope", value)} options={[{ value: "store", label: "Store" }, { value: "platform", label: "Platform" }]} />;
    if (column.key === "image") return <InteractiveTableHeader key={column.key} {...interactiveProps(column)}>Gambar</InteractiveTableHeader>;
    if (column.key === "discount") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Diskon" sortKey="discount" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="text" filterValue={columnFilters.discount || ""} onFilterChange={(value) => changeFilter("discount", value)} placeholder="Cari diskon" />;
    if (column.key === "minSpend") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Min. Belanja" align="right" filterType="range" filterValue={columnFilters.minSpend || { min: "", max: "" }} onFilterChange={(value) => changeFilter("minSpend", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    if (column.key === "minItems") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Min. Item" align="right" filterType="range" filterValue={columnFilters.minItems || { min: "", max: "" }} onFilterChange={(value) => changeFilter("minItems", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    if (column.key === "terms") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Syarat & Ketentuan" filterType="text" filterValue={columnFilters.terms || ""} onFilterChange={(value) => changeFilter("terms", value)} placeholder="Cari syarat" />;
    if (column.key === "maxDiscount") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Maks. Diskon" align="right" filterType="range" filterValue={columnFilters.maxDiscount || { min: "", max: "" }} onFilterChange={(value) => changeFilter("maxDiscount", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    if (column.key === "period") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Periode" filterType="text" filterValue={columnFilters.period || ""} onFilterChange={(value) => changeFilter("period", value)} placeholder="Cari tanggal" />;
    if (column.key === "usage") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Penggunaan" align="right" sortKey="usage" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="range" filterValue={columnFilters.usage || { min: "", max: "" }} onFilterChange={(value) => changeFilter("usage", value)} minPlaceholder="Min" maxPlaceholder="Max" />;
    return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Status" sortKey="active" sortBy={sortBy} sortDirection={sortDirection} onSortChange={setSort} filterType="select" filterValue={columnFilters.active || ""} onFilterChange={(value) => changeFilter("active", value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Non-Active" }]} />;
  };

  const renderCell = (column, row) => {
    if (column.key.startsWith("raw:")) return <td key={column.key} className="max-w-72 truncate px-4 py-3 text-slate-600">{formatTableValue(row.raw?.[column.rawKey])}</td>;
    if (column.key === "voucher") return <td key={column.key} className="px-4 py-3"><p className="font-extrabold text-slate-900">{toTitleCase(row.name)}</p><p className="mt-1 text-xs font-bold uppercase text-emerald-700">{row.code}</p></td>;
    if (column.key === "scope") return <td key={column.key} className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-extrabold ${row.voucherScope === "store" ? "bg-emerald-50 text-emerald-700" : "bg-teal-50 text-teal-700"}`}>{row.voucherScope === "store" ? toTitleCase(row.storeName || `Toko ${row.storeId}`) : "Platform"}</span></td>;
    if (column.key === "image") return <td key={column.key} className="px-4 py-3">{row.imageUrl || row.image ? <img src={row.imageUrl || row.image} alt={row.name} className="h-12 w-20 object-cover" loading="lazy" /> : "-"}</td>;
    if (column.key === "discount") return <td key={column.key} className="px-4 py-3 font-bold text-slate-700">{discountLabel(row)}</td>;
    if (column.key === "minSpend") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{formatPrice(row.minSpend)}</td>;
    if (column.key === "minItems") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{row.minItems ? `${Number(row.minItems).toLocaleString("id-ID")} item` : "-"}</td>;
    if (column.key === "terms") return <td key={column.key} className="max-w-64 truncate px-4 py-3 text-slate-600" title={row.terms || ""}>{row.terms || "-"}</td>;
    if (column.key === "maxDiscount") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{row.maxDiscount === "" || row.maxDiscount === null ? "-" : formatPrice(Number(row.maxDiscount))}</td>;
    if (column.key === "period") return <td key={column.key} className="px-4 py-3 text-xs text-slate-500"><p>{formatDateTime(row.startsAt)}</p><p>{formatDateTime(row.endsAt)}</p></td>;
    if (column.key === "usage") return <td key={column.key} className="px-4 py-3 text-right text-slate-600">{row.usedCount.toLocaleString("id-ID")} / {row.usageLimit ? row.usageLimit.toLocaleString("id-ID") : "∞"}</td>;
    return <td key={column.key} className="px-4 py-3" onClick={(event) => event.stopPropagation()}><InlineActiveSwitch checked={row.isActive} pending={pendingId === row.id} onChange={(checked) => onToggleActive?.(row, checked)} compact /></td>;
  };

  return (
    <div className="overflow-hidden bg-white ring-1 ring-slate-200">
      <table className="table-fixed text-left text-sm" style={{ width: Math.max(tableWidth, 1000), minWidth: "100%" }}>
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