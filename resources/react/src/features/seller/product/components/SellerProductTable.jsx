import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/shared/utils/utils";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { isInactiveRow } from "@/shared/components/feedback/inactiveRow";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { TableSelectionCell, TableSelectionHeader } from "@/shared/components/crud/TableSelectionCell";
import { TableHeaderFilter } from "@/shared/components/crud/TableHeaderFilter";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { toTitleCase } from "@/shared/utils/textFormatter";

export const PRODUCT_TABLE_COLUMNS = [
  { key: "expand", label: "Open", width: 60, minWidth: 56 },
  { key: "product", label: "Produk" },
  { key: "store", label: "Toko", defaultVisible: false },
  { key: "mode", label: "Mode" },
  { key: "price", label: "Harga" },
  { key: "stock", label: "Stok" },
  { key: "status", label: "Status Admin" },
  { key: "active", label: "Status Seller" },
];

const widths = { expand: 60, product: 330, store: 220, mode: 160, price: 170, stock: 150, status: 180, active: 180 };

export const SellerProductTable = memo(function SellerProductTable({
  rows,
  onEdit,
  onToggleActive,
  onStatusChange,
  pendingId,
  portal = "seller",
  columns = PRODUCT_TABLE_COLUMNS,
  visibleSet,
  selectionEnabled = false,
  selectedIds = new Set(),
  allSelected = false,
  onToggleRow,
  onToggleAll,
  sortBy = "created_at",
  sortDirection = "desc",
  onSortChange,
  columnFilters = {},
  onColumnFilterChange,
  onClearAllFilters,
  onResetSort,
  storeOptions = [],
  columnOrder = [],
  isLoading = false,
}) {
  const admin = portal === "admin";
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const activeColumns = useMemo(() => columns.filter((column) => (!visibleSet || visibleSet.has(column.key)) && (column.key !== "store" || admin) && (column.key !== "status" || admin)).map((column) => ({ ...column, width: widths[column.key] || 190 })), [admin, columns, visibleSet]);
  const layout = useTableColumnLayout({ storageKey: `${portal}.products`, columns: activeColumns, preferredOrder: columnOrder });
  const applyOrder = layout.applyOrder;
  const tableWidth = layout.totalWidth + (selectionEnabled ? 44 : 0);
  const changeFilter = (key) => (value) => onColumnFilterChange?.(key, value);

  const hasVariants = (product) => product.mode === "variant" && (product.variants || []).length > 0;
  const isExpanded = (product) => hasVariants(product) && expandedIds.has(product.id);
  const variantProducts = useMemo(() => rows.filter((product) => hasVariants(product)), [rows]);
  const allExpanded = variantProducts.length > 0 && variantProducts.every((product) => expandedIds.has(product.id));

  useEffect(() => {
    if (columnOrder.length) applyOrder(columnOrder);
  }, [applyOrder, columnOrder]);

  const toggleVariants = (product) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  };

  const toggleAllVariants = () => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (allExpanded) variantProducts.forEach((product) => next.delete(product.id));
      else variantProducts.forEach((product) => next.add(product.id));
      return next;
    });
  };

  const interactiveProps = (column) => ({
    headerProps: layout.getHeaderProps(column.key),
    columnKey: column.key,
    columnStyle: layout.getColumnStyle(column.key),
    onResizeStart: layout.startResize,
    onResetWidth: layout.resetWidth,
    dragging: layout.dragKey === column.key,
    dropTarget: layout.dropKey === column.key,
    onClearAllFilters,
    onResetSort,
  });

  const renderHeader = (column) => {
    if (column.key === "expand") {
      const canToggleAll = variantProducts.length > 0;
      return (
        <InteractiveTableHeader
          key={column.key}
          {...interactiveProps(column)}
          style={layout.getColumnStyle(column.key)}
          align="center"
          className="px-1 py-2"
          onClick={canToggleAll ? toggleAllVariants : undefined}
          onKeyDown={canToggleAll ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleAllVariants(); } } : undefined}
          tabIndex={canToggleAll ? 0 : undefined}
          title={canToggleAll ? (allExpanded ? "Klik untuk menutup semua variant" : "Klik untuk membuka semua variant") : "Tarik header untuk mengubah urutan kolom. Tarik garis kanan untuk mengubah lebar."}
        >
          <span className="inline-flex items-center justify-center gap-0.5">
            {column.label}
            {allExpanded ? <span className="material-symbols-outlined text-[16px] leading-none text-slate-600">arrow_drop_down</span> : null}
          </span>
        </InteractiveTableHeader>
      );
    }
    if (column.key.startsWith("raw:")) return <InteractiveTableHeader key={column.key} columnKey={column.key} headerProps={layout.getHeaderProps(column.key)} style={layout.getColumnStyle(column.key)} onResizeStart={layout.startResize} onResetWidth={layout.resetWidth} dragging={layout.dragKey === column.key} dropTarget={layout.dropKey === column.key}>{column.label}</InteractiveTableHeader>;
    if (column.key === "product") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Produk" sortKey="name" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="text" filterValue={columnFilters.product || ""} onFilterChange={changeFilter("product")} placeholder="Cari nama produk" />;
    if (column.key === "store") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Toko" sortKey="store_name" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="select" filterValue={columnFilters.store || ""} onFilterChange={changeFilter("store")} options={storeOptions} />;
    if (column.key === "mode") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Mode" sortKey="mode" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="select" filterValue={columnFilters.mode || ""} onFilterChange={changeFilter("mode")} options={[{ value: "simple", label: "Tanpa Variant" }, { value: "variant", label: "Dengan Variant" }]} />;
    if (column.key === "price") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Harga" sortKey="price" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="range" filterValue={columnFilters.price || { min: "", max: "" }} onFilterChange={changeFilter("price")} minPlaceholder="Harga min" maxPlaceholder="Harga max" />;
    if (column.key === "stock") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Stok" sortKey="stock" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="range" filterValue={columnFilters.stock || { min: "", max: "", status: "" }} onFilterChange={changeFilter("stock")} minPlaceholder="Stok min" maxPlaceholder="Stok max" extraRangeFilter={{ label: "Status stok", options: [{ value: "low", label: "Stok rendah" }, { value: "safe", label: "Stok aman" }] }} />;
    if (column.key === "status") return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Status Admin" sortKey="status" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="select" filterValue={columnFilters.status || ""} onFilterChange={changeFilter("status")} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]} />;
    return <TableHeaderFilter key={column.key} {...interactiveProps(column)} label="Status Seller" sortKey="is_active" sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} filterType="select" filterValue={columnFilters.active || ""} onFilterChange={changeFilter("active")} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Non-Active" }]} />;
  };

  const renderCell = (column, product) => {
    if (column.key.startsWith("raw:")) return <td key={column.key} className="truncate px-4 py-3 text-slate-600">{formatTableValue(resolveTableValue({ raw: product.raw }, column.rawKey))}</td>;
    if (column.key === "expand") {
      const expandable = hasVariants(product);
      const expanded = isExpanded(product);
      return (
        <td key={column.key} className="px-2 py-3 text-center" onClick={(event) => event.stopPropagation()}>
          {expandable ? (
            <button
              type="button"
              onClick={(event) => { event.stopPropagation(); toggleVariants(product); }}
              aria-expanded={expanded}
              title={expanded ? "Tutup daftar variant" : "Buka daftar variant"}
              className="mx-auto flex h-7 w-7 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <span className={`material-symbols-outlined text-[20px] leading-none transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>expand_more</span>
            </button>
          ) : null}
        </td>
      );
    }
    if (column.key === "product") {
      return (
        <td key={column.key} className="px-4 py-3">
          <div className="flex items-center gap-[5px]">
            <div className="h-11 w-11 shrink-0 overflow-hidden bg-slate-100">{product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" loading="lazy" /> : null}</div>
            <div className="min-w-0">
              <p className="truncate font-extrabold text-slate-900">{toTitleCase(product.name)}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{product.sku || "SKU otomatis"}</p>
            </div>
          </div>
        </td>
      );
    }
    if (column.key === "store") return <td key={column.key} className="truncate px-4 py-3 font-bold text-slate-700">{toTitleCase(product.storeName) || "-"}</td>;
    if (column.key === "mode") return <td key={column.key} className="truncate px-4 py-3 text-slate-600">{product.mode === "variant" ? `${product.variants.length} variant` : "Tanpa variant"}</td>;
    if (column.key === "price") return <td key={column.key} className="px-4 py-3 font-bold text-slate-800">{formatPrice(product.price)}</td>;
    if (column.key === "stock") return <td key={column.key} className="px-4 py-3"><div className="flex items-center gap-[5px]"><p className="text-sm font-extrabold text-slate-800">{product.stock.toLocaleString("id-ID")}</p>{product.minStock > 0 && Number(product.stock) <= Number(product.minStock) ? <span title={`Di bawah minimal stok ${product.minStock.toLocaleString("id-ID")}`} className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700"><span className="material-symbols-outlined text-[12px]">priority_high</span>Restock</span> : null}</div>{product.poStock > 0 ? <p className="text-[11px] font-bold text-amber-600">PO {product.poStock.toLocaleString("id-ID")}</p> : null}<p className="text-[11px] text-slate-400">Total {product.totalStock.toLocaleString("id-ID")}{product.minStock > 0 ? ` · Min ${product.minStock.toLocaleString("id-ID")}` : ""}</p></td>;
    if (column.key === "status") return <td key={column.key} className="px-4 py-3"><div onClick={(event) => event.stopPropagation()} className="w-full"><SearchableSelect value={product.status} disabled={pendingId === product.id} onChange={(nextValue) => onStatusChange?.(product, nextValue)} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]} clearable={false} buttonClassName="h-8 px-2 text-xs" /></div></td>;
    return <td key={column.key} className="px-4 py-3" onClick={(event) => event.stopPropagation()}><InlineActiveSwitch checked={product.isActive} onChange={(checked) => onToggleActive?.(product, checked)} compact />{!admin ? <div className="mt-1"><StatusBadge status={product.status} /></div> : null}</td>;
  };

  const renderVariantCell = (column, variant) => {
    if (column.key === "expand") return <td key={column.key} className="border-r border-slate-200 px-2 py-2" />;
    if (column.key === "product") {
      const variantValues = (variant.values || []).map((item) => item.value).filter(Boolean).join(" · ");
      return (
        <td key={column.key} className="py-2 pr-4 pl-4">
          <div className="flex items-center gap-[5px] pl-8">
            <span className="material-symbols-outlined shrink-0 text-[16px] leading-none text-slate-400">subdirectory_arrow_right</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-700">{toTitleCase(variant.name) || variant.sku || "Variant"}</p>
              <p className="truncate text-[11px] text-slate-500">{variantValues || variant.sku || "-"}</p>
            </div>
            {variant.isDefault ? <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-200">Default</span> : null}
          </div>
        </td>
      );
    }
    if (column.key === "price") return <td key={column.key} className="px-4 py-2 text-sm font-bold text-slate-700">{formatPrice(variant.price)}</td>;
    if (column.key === "stock") {
      return (
        <td key={column.key} className="px-4 py-2">
          <div className="flex items-center gap-[5px]"><p className="text-sm font-extrabold text-slate-800">{variant.stock.toLocaleString("id-ID")}</p>{variant.minStock > 0 && variant.stock <= variant.minStock ? <span title={`Di bawah minimal stok ${variant.minStock.toLocaleString("id-ID")}`} className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700"><span className="material-symbols-outlined text-[12px]">priority_high</span>Restock</span> : null}</div>
          {variant.poStock > 0 ? <p className="text-[11px] font-bold text-amber-600">PO {variant.poStock.toLocaleString("id-ID")}</p> : null}
        </td>
      );
    }
    return <td key={column.key} className="px-4 py-2" />;
  };

  return (
    <div className="relative bg-white ring-1 ring-slate-200">
      <table className="table-fixed text-left text-sm" style={{ width: Math.max(tableWidth, 840), minWidth: "100%" }}>
        <InteractiveColGroup columns={layout.orderedColumns} getColumnStyle={layout.getColumnStyle} leadingWidth={selectionEnabled ? 44 : 0} />
        <thead className="sticky top-0 z-30 bg-slate-100 text-xs font-extrabold text-slate-600"><tr><TableSelectionHeader enabled={selectionEnabled} checked={allSelected} onToggle={onToggleAll} />{layout.orderedColumns.map(renderHeader)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((product) => {
            const inactive = isInactiveRow(product);
            const expanded = isExpanded(product);
            return (
              <Fragment key={product.id}>
                <tr onClick={() => onEdit(product)} className={`relative ${inactive ? "bg-slate-50 opacity-60 saturate-50" : ""} cursor-pointer hover:bg-slate-50`} title="Klik untuk edit">
                  <TableSelectionCell enabled={selectionEnabled} checked={selectedIds.has(String(product.id))} onToggle={() => onToggleRow?.(product.id)} />
                  {layout.orderedColumns.map((column) => renderCell(column, product))}
                </tr>
                {expanded ? product.variants.map((variant) => (
                  <tr key={`${product.id}-variant-${variant.id || variant.sku}`} className={`${inactive ? "bg-slate-50 opacity-60 saturate-50" : "bg-slate-50/50"}`}>
                    {selectionEnabled ? <td className="w-11 px-3 py-2" /> : null}
                    {layout.orderedColumns.map((column) => renderVariantCell(column, variant))}
                  </tr>
                )) : null}
              </Fragment>
            );
          })}</tbody>
      </table>
      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px]">
          <span className="material-symbols-outlined animate-spin text-[28px] leading-none text-slate-500">progress_activity</span>
        </div>
      ) : null}
    </div>
  );
});
