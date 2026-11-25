import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionCard, PanelEmpty } from "@/features/admin/dashboard/components/SectionCard";
import { formatPrice } from "@/shared/utils/utils";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

/**
 * Daftar barang yang stoknya sudah di bawah batas minimum, plus tombol cepat
 * menuju halaman stok untuk mencatat belanja/restock.
 */
export function LowStockList({ products = [] }) {
  if (!products.length) {
    return <PanelEmpty icon="check_circle" text="Tidak ada stok menipis" hint="Semua barang masih di atas batas minimum." />;
  }

  return (
    <ul className="space-y-2">
      {products.map((product) => {
        const isOut = Number(product.stock) === 0;
        return (
          <li key={product.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-950">{product.name || "Produk"}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                {product.sku || "SKU otomatis"} · min {Number(product.minStock || 0).toLocaleString("id-ID")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <p className={`text-lg font-black ${isOut ? "text-red-600" : "text-amber-700"}`}>
                {Number(product.stock || 0).toLocaleString("id-ID")}
              </p>
              <Link
                to={`/admin/stock?q=${encodeURIComponent(product.name || "")}`}
                title={`Catat belanja untuk ${product.name || "produk ini"}`}
                aria-label={`Catat belanja untuk ${product.name || "produk ini"}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-amber-600 text-white transition hover:bg-amber-700"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const SORTS = [
  { key: "qty", label: "Pcs terjual" },
  { key: "revenue", label: "Omzet" },
];

const RANK_STYLES = [
  "bg-amber-100 text-amber-700",
  "bg-slate-200 text-slate-600",
  "bg-orange-100 text-orange-700",
];

/**
 * 5 barang terlaris 7 hari terakhir. Bisa diurutkan berdasarkan jumlah pcs
 * atau omzet; bar kontribusi memudahkan melihat selisih antar produk.
 */
export function TopProductsPanel({ products = [] }) {
  const [sortBy, setSortBy] = useState("qty");

  const rows = useMemo(() => {
    const sorted = [...products].sort((left, right) => {
      if (sortBy === "revenue") return right.revenue - left.revenue;
      return right.qty - left.qty || right.revenue - left.revenue;
    });
    const max = Math.max(...sorted.map((product) => Number(product[sortBy] || 0)), 1);
    return sorted.map((product) => ({
      ...product,
      percent: Math.round((Number(product[sortBy] || 0) / max) * 100),
    }));
  }, [products, sortBy]);

  return (
    <SectionCard
      title="Barang Terlaris"
      subtitle="7 hari terakhir · pesanan batal tidak dihitung"
      icon="trophy"
      iconClassName="bg-emerald-50 text-emerald-700"
      action={
        <div className="flex items-center rounded-[10px] bg-slate-100 p-1">
          {SORTS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortBy(option.key)}
              aria-pressed={sortBy === option.key}
              className={`h-7 rounded-[7px] px-2.5 text-[11px] font-extrabold transition ${
                sortBy === option.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      {!products.length ? (
        <PanelEmpty icon="inventory_2" text="Belum ada penjualan minggu ini" hint="Barang terlaris akan tampil di sini." />
      ) : (
        <ol className="space-y-2">
          {rows.map((product, index) => (
            <li key={`${product.productId || product.name}-${index}`} className="flex items-center gap-3 rounded-[10px] border border-slate-200 bg-slate-50 p-2.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  RANK_STYLES[index] || "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}
              </span>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white ring-1 ring-inset ring-slate-200">
                {product.thumbnail ? (
                  <img
                    src={resolveMediaUrl(product.thumbnail)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-slate-400">inventory_2</span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-extrabold text-slate-950">{product.name}</p>
                  <p className="shrink-0 text-xs font-bold text-slate-500">
                    {sortBy === "revenue"
                      ? formatPrice(product.revenue)
                      : `${Number(product.qty || 0).toLocaleString("id-ID")} pcs`}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${product.percent}%` }} />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  {sortBy === "revenue"
                    ? `${Number(product.qty || 0).toLocaleString("id-ID")} pcs terjual`
                    : `${formatPrice(product.revenue)} omzet`}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
