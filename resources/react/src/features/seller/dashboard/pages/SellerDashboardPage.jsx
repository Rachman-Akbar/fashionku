import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { SellerMetricCard } from "@/features/seller/dashboard/components/SellerMetricCard";
import { SellerOrderTable } from "@/features/seller/dashboard/components/SellerOrderTable";
import { useSellerStore } from "@/features/seller/store/services/sellerStoreService";
import { useSellerProducts } from "@/features/seller/product/services/sellerProductService";
import { useSellerOrders } from "@/features/order/ordering/orderService";
import { useSellerOrderTrend } from "@/features/advanced/services/advancedMarketplaceService";
import { OrderRevenueBars, StatCard } from "@/shared/components/charts/chartKit";
import { formatPrice } from "@/shared/utils/utils";

const statusLabels = {
  pending: "Perlu Dikirim",
  processing: "Siap Pickup",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function SellerDashboardPage() {
  const storeQuery = useSellerStore();
  const productsQuery = useSellerProducts({ per_page: 24 });
  const ordersQuery = useSellerOrders(storeQuery.data?.id, { per_page: 15 });
  const trendQuery = useSellerOrderTrend({ period: "monthly" });

  const products = useMemo(() => productsQuery.data?.rows || [], [productsQuery.data]);
  const orders = useMemo(() => ordersQuery.data?.data || [], [ordersQuery.data]);
  const trend = useMemo(() => trendQuery.data?.points || [], [trendQuery.data]);

  const trendMeta = useMemo(() => {
    const totalsOrders = trend.reduce((total, point) => total + point.orders, 0);
    const totalsRevenue = trend.reduce((total, point) => total + Number(point.revenue || 0), 0);
    const totalsCompleted = trend.reduce((total, point) => total + point.completed, 0);
    return { totalsOrders, totalsRevenue, totalsCompleted };
  }, [trend]);

  const data = useMemo(() => {
    const paidOrders = orders.filter((order) => ["paid", "settlement", "success"].includes(order.paymentStatus));
    const revenue = paidOrders.reduce((total, order) => total + order.totalItemsPrice, 0);
    const completed = orders.filter((order) => order.status === "completed").length;
    const activeProducts = products.filter((product) => product.isActive).length;
    const lowStock = products.filter((product) => product.minStock > 0 && Number(product.stock) <= Number(product.minStock)).length;
    const metrics = [
      { key: "revenue", label: "Omzet dibayar", value: formatPrice(revenue), icon: "payments", change: `${paidOrders.length} pesanan` },
      { key: "orders", label: "Total pesanan", value: orders.length.toLocaleString("id-ID"), icon: "receipt_long", change: `${completed} selesai` },
      { key: "products", label: "Produk aktif", value: activeProducts.toLocaleString("id-ID"), icon: "inventory_2", change: `${lowStock} perlu restock` },
      { key: "store", label: "Status toko", value: storeQuery.data?.isActive ? "Aktif" : "Nonaktif", icon: "storefront", change: storeQuery.data?.city || "Lokasi belum diisi" },
    ];
    const rows = orders.slice(0, 8).map((order) => ({
      id: order.orderNumber,
      buyer: "Pembeli",
      product: order.items.map((item) => item.productName).filter(Boolean).join(", ") || "-",
      qty: order.items.reduce((total, item) => total + item.quantity, 0),
      total: formatPrice(order.totalItemsPrice + order.shippingCost),
      courier: [order.courier, order.service].filter(Boolean).join(" ") || "-",
      status: statusLabels[order.status] || order.status,
    }));
    return { metrics, rows };
  }, [orders, products, storeQuery.data]);

  const funnel = useMemo(() => {
    const total = Math.max(orders.length, 1);
    return [
      { label: "Produk Aktif", value: products.filter((item) => item.isActive).length },
      { label: "Pesanan Masuk", value: orders.length },
      { label: "Diproses", value: orders.filter((item) => item.status === "processing").length },
      { label: "Dikirim", value: orders.filter((item) => item.status === "shipped").length },
      { label: "Selesai", value: orders.filter((item) => item.status === "completed").length },
    ].map((item, index) => ({ ...item, percent: index === 0 ? Math.min(100, item.value * 10) : Math.round((item.value / total) * 100) }));
  }, [orders, products]);

  const lowStockProducts = useMemo(() => products.filter((product) => product.minStock > 0 && Number(product.stock) <= Number(product.minStock)).slice(0, 5), [products]);

  return (
    <SellerPanelShell
      title="Ringkasan"
      subtitle="Pantau penjualan, pesanan, dan produk toko Anda."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((item) => <SellerMetricCard key={item.key} item={item} />)}
      </div>

      {lowStockProducts.length ? (
        <div className="mt-6 rounded-[10px] border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">inventory_2</span>
              <div>
                <h2 className="text-base font-black text-amber-900">Pengingat stok menipis</h2>
                <p className="mt-0.5 text-sm text-amber-700">{lowStockProducts.length} produk berada di bawah atau sama dengan minimal stok. Segera lakukan restock agar tidak kehabisan.</p>
              </div>
            </div>
            <Link to="/seller/stock" className="h-10 rounded-lg bg-amber-600 px-4 text-sm font-extrabold text-white hover:bg-amber-700 inline-flex items-center">Kelola Stok</Link>
          </div>
          <div className="mt-4 grid gap-[5px] sm:grid-cols-2 xl:grid-cols-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-[10px] bg-white px-4 py-3 ring-1 ring-inset ring-amber-100">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.sku || "SKU otomatis"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-extrabold text-amber-700">{product.stock.toLocaleString("id-ID")}</p>
                  <p className="text-[11px] font-semibold text-slate-400">Min {product.minStock.toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <SellerOrderTable rows={data.rows} />
        <div className="space-y-6">
          <div className="rounded-[10px] border border-slate-200 bg-white p-5">
            <h2 className="text-base font-extrabold text-slate-950">Tren order & pendapatan</h2>
            <p className="text-sm text-slate-500">Bulan ini</p>
            {trendQuery.isError ? (
              <p className="mt-3 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                Gagal memuat data tren penjualan.
              </p>
            ) : (
              <>
                {!trendQuery.isLoading && trend.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-[5px]">
                    <StatCard label="Total Order" value={trendMeta.totalsOrders.toLocaleString("id-ID")} tone="sky" />
                    <StatCard label="Pendapatan" value={formatPrice(trendMeta.totalsRevenue)} tone="emerald" />
                    <StatCard label="Selesai" value={trendMeta.totalsCompleted.toLocaleString("id-ID")} tone="slate" />
                  </div>
                )}
                <div className="mt-4">
                  <OrderRevenueBars points={trend} format={formatPrice} maxDays={31} />
                </div>
              </>
            )}
          </div>

          <div className="rounded-[10px] border border-slate-200 bg-white p-5">
            <h2 className="text-base font-extrabold text-slate-950">Aktivitas toko</h2>
            <p className="text-sm text-slate-500">Data produk dan pesanan terkini</p>
            <div className="mt-5 space-y-3">
              {funnel.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-400" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SellerPanelShell>
  );
}
