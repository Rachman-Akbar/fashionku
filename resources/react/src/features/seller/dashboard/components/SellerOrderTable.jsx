import { useMemo } from "react";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";

const statusClass = {
  "Perlu Dikirim": "bg-amber-50 text-amber-700",
  "Siap Pickup": "bg-blue-50 text-blue-700",
  Dikirim: "bg-sky-50 text-sky-700",
  Selesai: "bg-emerald-50 text-emerald-700",
};

export function SellerOrderTable({ rows = [] }) {
  const columns = useMemo(() => [
    { key: "order", label: "Order", width: 150 },
    { key: "buyer", label: "Pembeli", width: 180 },
    { key: "product", label: "Produk", width: 240 },
    { key: "qty", label: "Qty", width: 100, align: "center" },
    { key: "total", label: "Total", width: 160, align: "right" },
    { key: "courier", label: "Kurir", width: 150 },
    { key: "status", label: "Status", width: 160 },
  ], []);
  const layout = useTableColumnLayout({ storageKey: "seller.dashboard.orders", columns });
  const orderedColumns = layout.orderedColumns;

  const renderCell = (column, row) => {
    if (column.key === "order") return <td key={column.key} className="px-5 py-4 font-extrabold text-slate-900">{row.id}</td>;
    if (column.key === "buyer") return <td key={column.key} className="px-5 py-4 text-slate-600">{row.buyer}</td>;
    if (column.key === "product") return <td key={column.key} className="px-5 py-4 text-slate-600"><div className="truncate">{row.product}</div></td>;
    if (column.key === "qty") return <td key={column.key} className="px-5 py-4 text-center font-bold text-slate-700">{row.qty}</td>;
    if (column.key === "total") return <td key={column.key} className="px-5 py-4 text-right font-bold text-slate-900">{row.total}</td>;
    if (column.key === "courier") return <td key={column.key} className="px-5 py-4 text-slate-500">{row.courier}</td>;
    return <td key={column.key} className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[row.status] || "bg-slate-100 text-slate-600"}`}>{row.status}</span></td>;
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-extrabold text-slate-950">Pesanan perlu perhatian</h2>
        <p className="text-sm text-slate-500">Antrian order terbaru dari pembeli.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table-fixed text-left text-sm" style={{ width: Math.max(layout.totalWidth, 900), minWidth: "100%" }}>
          <InteractiveColGroup columns={orderedColumns} getColumnStyle={layout.getColumnStyle} />
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{orderedColumns.map((column) => <InteractiveTableHeader key={column.key} columnKey={column.key} headerProps={layout.getHeaderProps(column.key)} style={layout.getColumnStyle(column.key)} onResizeStart={layout.startResize} onResetWidth={layout.resetWidth} dragging={layout.dragKey === column.key} dropTarget={layout.dropKey === column.key} align={column.align}>{column.label}</InteractiveTableHeader>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id} className="transition hover:bg-slate-50/80">{orderedColumns.map((column) => renderCell(column, row))}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
