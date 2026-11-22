import { useQuery } from "@tanstack/react-query";
import { apiClient, unwrapCollection, unwrapApiData, getApiMessage } from "@/core/utils/apiClient";
import { formatPrice } from "@/shared/utils/utils";

const keys = {
  dashboard: ["admin", "dashboard"],
};

function normalizeStat(row) {
  return {
    key: row.key || row.label || "stat",
    label: row.label || row.name || "Statistik",
    value: row.value ?? row.total ?? row.count ?? "-",
    change: row.change ?? "",
    tone: row.tone || "emerald",
    icon: row.icon || "monitoring",
  };
}

async function fetchDashboardStats() {
  const [ordersRes, usersRes, productsRes, storeRes, financeRes] = await Promise.allSettled([
    apiClient.get("/api/v1/order/orderings", { params: { per_page: 1 } }),
    apiClient.get("/api/v1/identity/users", { params: { per_page: 1 } }),
    apiClient.get("/api/v1/catalog/products", { params: { per_page: 1 } }),
    // Single-store: profil toko diambil dari endpoint pengaturan toko.
    // (`/seller/stores/manage` tidak ada di backend sehingga selalu 404.)
    apiClient.get("/api/v1/seller/settings/store"),
    apiClient.get("/api/v1/seller/finance/dashboard"),
  ]);

  const getMeta = (result) => {
    if (result.status !== "fulfilled") return { total: 0 };
    const source = result.value?.data?.data ?? result.value?.data ?? result.value ?? {};
    const meta = source?.meta ?? {};
    return { total: meta.total ?? source?.total ?? 0 };
  };

  const storeData = storeRes.status === "fulfilled" ? (storeRes.value?.data?.data ?? storeRes.value?.data ?? null) : null;
  const financeSummary = financeRes.status === "fulfilled" ? (financeRes.value?.data?.data?.summary ?? financeRes.value?.data?.summary ?? {}) : {};

  const orders = getMeta(ordersRes);
  const users = getMeta(usersRes);
  const products = getMeta(productsRes);
  const revenue = Number(financeSummary.income ?? 0);

  return {
    stats: [
      { key: "orders", label: "Total Pesanan", value: orders.total.toLocaleString("id-ID"), change: "Data API", tone: "blue", icon: "receipt_long" },
      { key: "revenue", label: "Pendapatan", value: formatPrice(revenue), change: "Data API", tone: "emerald", icon: "monetization_on" },
      { key: "products", label: "Produk", value: products.total.toLocaleString("id-ID"), change: "Data API", tone: "teal", icon: "inventory_2" },
      { key: "stores", label: "Toko", value: storeData ? "1" : "0", change: storeData?.store_name || storeData?.name || "Data API", tone: "amber", icon: "storefront" },
    ],
  };
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/**
 * Tren pendapatan 12 bulan.
 * Backend tidak punya `/admin/dashboard/revenue` (selalu 404); sumber yang ada
 * adalah `/seller/finance/dashboard/order-trend` (titik harian, berisi
 * `revenue`), jadi agregasi per bulan dilakukan di sini.
 */
async function fetchRevenueChart() {
  const response = await apiClient.get("/api/v1/seller/finance/dashboard/order-trend", { params: { period: "yearly" } });
  const payload = response.data?.data ?? response.data ?? {};
  const points = Array.isArray(payload?.points) ? payload.points : unwrapCollection(response.data);

  const buckets = new Map();
  points.forEach((point) => {
    const raw = point.date || point.bulan || point.month || point.label;
    if (!raw) return;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = buckets.get(key) || { month: MONTH_LABELS[date.getMonth()], revenue: 0, year: date.getFullYear() };
    current.revenue += Number(point.revenue ?? point.total ?? point.pendapatan ?? 0);
    buckets.set(key, current);
  });

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([, value]) => ({ month: value.month, revenue: value.revenue }));
}

async function fetchRecentOrders() {
  const response = await apiClient.get("/api/v1/order/orderings", { params: { per_page: 5, sort_by: "created_at", sort_direction: "desc" } });
  return unwrapCollection(response.data).map((row) => ({
    id: row.order_number || row.orderNumber || row.id || "-",
    buyer: row.user?.name || row.customer_name || row.customerName || "-",
    total: formatPrice(Number(row.grand_total ?? row.total ?? row.total_amount ?? 0)),
    status: row.status || row.payment_status || "pending",
    createdAt: row.created_at || row.createdAt || null,
  }));
}

async function fetchDashboardData() {
  const [statsResult, revenueResult, ordersResult] = await Promise.allSettled([
    fetchDashboardStats(),
    fetchRevenueChart().catch(() => []),
    fetchRecentOrders().catch(() => []),
  ]);

  const stats = statsResult.status === "fulfilled" ? statsResult.value.stats : [];
  const revenue = revenueResult.status === "fulfilled" ? revenueResult.value : [];
  const recentOrders = ordersResult.status === "fulfilled" ? ordersResult.value : [];

  return { stats, revenue, recentOrders };
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: keys.dashboard,
    queryFn: fetchDashboardData,
    staleTime: 60000,
  });
}

export { getApiMessage, formatPrice };
