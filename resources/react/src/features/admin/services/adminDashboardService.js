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
  const [ordersRes, usersRes, productsRes, storesRes] = await Promise.allSettled([
    apiClient.get("/api/v1/order/orderings", { params: { per_page: 1 } }),
    apiClient.get("/api/v1/identity/users", { params: { per_page: 1 } }),
    apiClient.get("/api/v1/catalog/products", { params: { per_page: 1 } }),
    apiClient.get("/api/v1/seller/stores/manage", { params: { per_page: 1 } }),
  ]);

  const getMeta = (result) => {
    if (result.status !== "fulfilled") return { total: 0 };
    const source = result.value?.data?.data ?? result.value?.data ?? result.value ?? {};
    const meta = source?.meta ?? {};
    return { total: meta.total ?? source?.total ?? 0 };
  };

  const orders = getMeta(ordersRes);
  const users = getMeta(usersRes);
  const products = getMeta(productsRes);
  const stores = getMeta(storesRes);

  return {
    stats: [
      { key: "orders", label: "Total Pesanan", value: orders.total.toLocaleString("id-ID"), change: "Data API", tone: "blue", icon: "receipt_long" },
      { key: "revenue", label: "Pendapatan", value: formatPrice(0), change: "Data API", tone: "emerald", icon: "monetization_on" },
      { key: "products", label: "Produk", value: products.total.toLocaleString("id-ID"), change: "Data API", tone: "teal", icon: "inventory_2" },
      { key: "stores", label: "Toko", value: stores.total.toLocaleString("id-ID"), change: "Data API", tone: "amber", icon: "storefront" },
    ],
  };
}

async function fetchRevenueChart() {
  const response = await apiClient.get("/api/v1/admin/dashboard/revenue", { params: { period: "12m" } });
  const data = unwrapCollection(response.data);
  return data.map((row) => ({
    month: row.month || row.bulan || row.label || "-",
    revenue: Number(row.revenue ?? row.total ?? row.pendapatan ?? 0),
  }));
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
