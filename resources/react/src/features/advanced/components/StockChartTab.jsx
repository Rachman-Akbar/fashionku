import { useMemo } from "react";
import { SeriesBarList, StatCard } from "@/shared/components/charts/chartKit";

function number(value) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(value || 0));
}

const SERIES = [
  { key: "stock", label: "Stok Asli (Gudang)", color: "#059669" },
  { key: "available", label: "Tersedia Jual", color: "#0ea5e9" },
  { key: "preorder", label: "Preorder", color: "#f59e0b" },
  { key: "booking", label: "Booking", color: "#8b5cf6" },
];

export default function StockChartTab({ variants = [] }) {
  const groups = useMemo(() => {
    const byProduct = new Map();
    (variants || []).forEach((variant) => {
      const productId = Number(variant.product_id || variant.productId || 0);
      const key = `${productId}-${variant.product_name || "Produk"}`;
      const current = byProduct.get(key) || {
        label: variant.product_name || `Produk (${productId})`,
        values: { stock: 0, available: 0, preorder: 0, booking: 0 },
      };
      current.values.stock += Math.max(0, Number(variant.stock ?? variant.total_stock ?? 0));
      current.values.available += Math.max(0, Number(variant.available_stock ?? variant.availableStock ?? variant.stock ?? 0));
      current.values.preorder += Math.max(0, Number(variant.stock_preorder ?? variant.stockPreorder ?? 0));
      current.values.booking += Math.max(0, Number(variant.stock_booked ?? variant.stockBooked ?? 0));
      byProduct.set(key, current);
    });
    return [...byProduct.values()];
  }, [variants]);

  const totals = useMemo(() => {
    const result = { stock: 0, available: 0, preorder: 0, booking: 0 };
    groups.forEach((group) => {
      result.stock += group.values.stock;
      result.available += group.values.available;
      result.preorder += group.values.preorder;
      result.booking += group.values.booking;
    });
    return result;
  }, [groups]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Stok Asli (Gudang)" value={number(totals.stock)} tone="emerald" hint="fisik / stok riil" />
        <StatCard label="Tersedia Jual" value={number(totals.available)} tone="sky" hint="asli - reserved - booking" />
        <StatCard label="Stok Preorder" value={number(totals.preorder)} tone="amber" hint="menunggu dipenuhi" />
        <StatCard label="Stok Booking" value={number(totals.booking)} tone="rose" hint="jadwal kirim / pickup" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-slate-900">Bagan Perbandingan Stok per Produk</p>
            <p className="text-xs text-slate-500">Empat komponen stok dibandingkan tiap produk (jumlah dari seluruh varian).</p>
          </div>
        </div>
        <SeriesBarList groups={groups} series={SERIES} format={number} maxBars={15} emptyText="Belum ada data stok produk." />
      </div>
    </div>
  );
}