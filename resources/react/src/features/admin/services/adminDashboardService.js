import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";
import { formatPrice } from "@/shared/utils/utils";
import { normalizeOrder } from "@/features/admin/order/services/orderManagementService";
import { normalizeSellerProduct } from "@/features/seller/product/services/sellerProductService";

/**
 * Dashboard Admin (warung kelontong).
 *
 * Satu hook mengambil seluruh data ringkasan sekaligus (semua request paralel
 * memakai `Promise.allSettled`), sehingga satu endpoint yang gagal tidak
 * menjatuhkan seluruh halaman — panel yang bersangkutan hanya tampil kosong
 * dan nama endpoint yang gagal dicatat di `failed` untuk ditampilkan sebagai
 * peringatan ringan.
 */

const keys = {
  dashboard: () => ["admin", "dashboard"],
};

const PAYMENT_LABELS = {
  cod: "COD",
  transfer_manual: "Transfer",
  midtrans: "Bayar Online",
  qris: "QRIS",
  tunai_toko: "Tunai",
  manual: "Manual",
};

const STATUS_LABELS = {
  pending: "Menunggu",
  processing: "Disiapkan",
  shipped: "Diantar",
  received: "Diterima",
  completed: "Selesai",
  rejected: "Ditolak",
  cancelled: "Batal",
};

/**
 * Aksi cepat berikutnya untuk antrean pesanan online.
 * Pemetaan ini mengikuti aturan transisi status di backend
 * (UpdateOrderStatusUseCase::TRANSITIONS).
 */
const NEXT_STATUS = {
  pending: { status: "processing", label: "Siapkan", icon: "checklist" },
  processing: { status: "shipped", label: "Diantar", icon: "local_shipping" },
  shipped: { status: "completed", label: "Selesai", icon: "task_alt" },
  received: { status: "completed", label: "Selesai", icon: "task_alt" },
};

const ACTIONABLE_STATUSES = ["pending", "processing", "shipped", "received"];

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function unwrapData(response) {
  return response?.data?.data ?? response?.data ?? {};
}

function unwrapRows(response) {
  const payload = response?.data ?? {};
  const source = payload?.data ?? payload;
  if (Array.isArray(source)) return source;
  return Array.isArray(source?.data) ? source.data : [];
}

function unwrapTotal(response, fallback = 0) {
  const payload = response?.data ?? {};
  const source = payload?.data ?? payload;
  const total = payload?.meta?.total ?? source?.meta?.total;
  return Number(total ?? fallback);
}

function isFulfilled(result) {
  return result?.status === "fulfilled";
}

function fulfilledValue(result) {
  return isFulfilled(result) ? result.value : null;
}

/** Nomor WhatsApp internasional (62...) untuk tautan wa.me. */
function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

function buildCustomerPhoneMap(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const name = String(row.name || "").trim().toLowerCase();
    const phone = normalizePhone(row.phone);
    if (name && phone && !map.has(name)) map.set(name, phone);
  });
  return map;
}

function findCustomerPhone(phoneMap, name) {
  const key = String(name || "").trim().toLowerCase();
  if (!key || !phoneMap) return "";
  if (phoneMap.has(key)) return phoneMap.get(key);
  // Judul kasbon sering berupa "Kasbon Bu Sari" — cocokkan sebagian nama.
  for (const [customerName, phone] of phoneMap.entries()) {
    if (customerName.includes(key) || key.includes(customerName)) return phone;
  }
  return "";
}

function buildKasbonRows(response, phoneMap) {
  return unwrapRows(response)
    .map((row) => ({
      id: Number(row.id || 0),
      name: row.title || row.counterparty_name || "Pelanggan",
      remaining: Number(row.remaining ?? row.outstanding_amount ?? 0),
      amount: Number(row.amount || 0),
      dueDate: row.due_date || null,
      overdueDays: Number(row.days_overdue || 0),
      phone: normalizePhone(row.counterparty_phone) || findCustomerPhone(phoneMap, row.title),
    }))
    .sort((left, right) => {
      if (right.overdueDays !== left.overdueDays) return right.overdueDays - left.overdueDays;
      return right.remaining - left.remaining;
    });
}

function buildQueueRows(...responses) {
  return responses
    .flatMap((response) => unwrapRows(response))
    .map((row) => normalizeOrder(row))
    .filter((order) => ACTIONABLE_STATUSES.includes(order.status))
    .sort((left, right) => {
      const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
      return rightTime - leftTime;
    });
}

/**
 * Barang terlaris dihitung dari pesanan 7 hari terakhir. Produk digabung
 * berdasarkan `product_id` (bukan nama) agar dua produk bernama sama tidak
 * tercampur, lalu dilengkapi thumbnail dari daftar produk admin.
 */
function buildTopProducts(response, products = []) {
  const productMap = new Map(products.filter((product) => product.id).map((product) => [product.id, product]));
  const totals = new Map();

  unwrapRows(response).forEach((row) => {
    const order = normalizeOrder(row);
    if (["cancelled", "rejected"].includes(order.status)) return;

    order.items.forEach((item) => {
      const name = item.productName || item.sku || "Produk";
      const qty = Number(item.quantity || 0);
      const revenue = Number(item.subtotal || item.unitPrice * qty || 0);
      const key = item.productId ? `id:${item.productId}` : `name:${name}`;
      const product = item.productId ? productMap.get(item.productId) : null;
      const current = totals.get(key) || {
        productId: item.productId || 0,
        name,
        thumbnail: product?.thumbnail || item.thumbnail || "",
        qty: 0,
        revenue: 0,
      };
      current.qty += qty;
      current.revenue += revenue;
      totals.set(key, current);
    });
  });

  return [...totals.values()]
    .sort((left, right) => right.qty - left.qty || right.revenue - left.revenue)
    .slice(0, 5);
}

function buildLowStock(products) {
  return products
    .filter((product) => {
      const stock = Number(product.stock || 0);
      const minStock = Number(product.minStock || 0);
      return stock === 0 || (minStock > 0 && stock <= minStock);
    })
    .sort((left, right) => left.stock - right.stock)
    .slice(0, 6);
}

/** Perubahan persen dibanding kemarin; null bila kemarin belum ada data. */
function percentChange(today, yesterday) {
  if (!Number.isFinite(yesterday) || yesterday <= 0) return null;
  return ((today - yesterday) / yesterday) * 100;
}

function buildCashflow(response, weekAgo, today) {
  const payload = unwrapData(response);
  const daily = Array.isArray(payload?.daily) ? payload.daily : [];
  const byDate = new Map(daily.map((row) => [row.date, row]));

  const days = [];
  const cursor = new Date(`${weekAgo}T00:00:00`);
  const end = new Date(`${today}T00:00:00`);

  while (cursor <= end) {
    const date = toDateString(cursor);
    const row = byDate.get(date) || {};
    days.push({
      date,
      income: Number(row.income || 0),
      expense: Number(row.expense || 0),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const todayRow = byDate.get(today) || {};
  return {
    days,
    todayIncome: Number(todayRow.income || 0),
    todayExpense: Number(todayRow.expense || 0),
    totals: payload?.totals || {},
  };
}

function buildOrderTrend(response, today) {
  const payload = unwrapData(response);
  const points = Array.isArray(payload?.points) ? payload.points : [];
  const byDate = new Map(points.map((point) => [String(point.date || "").slice(0, 10), point]));
  const yesterday = toDateString(subDays(new Date(`${today}T00:00:00`), 1));

  return {
    revenue: Number(byDate.get(today)?.revenue || 0),
    orders: Number(byDate.get(today)?.orders || 0),
    yesterdayRevenue: Number(byDate.get(yesterday)?.revenue || 0),
  };
}

const SECTION_LABELS = {
  cashflow: "arus kas",
  trend: "omzet hari ini",
  summary: "ringkasan kasbon",
  receivable: "daftar kasbon",
  pending: "pesanan menunggu",
  processing: "pesanan disiapkan",
  shipped: "pesanan dikirim",
  weekOrders: "pesanan minggu ini",
  products: "stok produk",
  customers: "data pelanggan",
};

/**
 * Di-export untuk unit test; aplikasi memakainya lewat `useAdminDashboard`.
 */
export async function fetchDashboardData() {
  const now = new Date();
  const today = toDateString(now);
  const weekAgo = toDateString(subDays(now, 6));

  const [
    cashflowRes,
    trendRes,
    summaryRes,
    receivableRes,
    pendingRes,
    processingRes,
    shippedRes,
    weekOrdersRes,
    productsRes,
    customersRes,
  ] = await Promise.allSettled([
    apiClient.get("/api/v1/seller/finance/dashboard/cashflow", { params: { date_from: weekAgo, date_to: today } }),
    apiClient.get("/api/v1/seller/finance/dashboard/order-trend", { params: { period: "daily" } }),
    apiClient.get("/api/v1/seller/finance/hutang-piutang/summary"),
    apiClient.get("/api/v1/seller/finance/hutang-piutang/receivable"),
    apiClient.get("/api/v1/order/orderings", { params: { status: "pending", per_page: 20 } }),
    apiClient.get("/api/v1/order/orderings", { params: { status: "processing", per_page: 10 } }),
    apiClient.get("/api/v1/order/orderings", { params: { status: "shipped", per_page: 10 } }),
    apiClient.get("/api/v1/order/orderings", { params: { date_from: weekAgo, date_to: today, per_page: 100 } }),
    apiClient.get("/api/v1/catalog/admin/products", { params: { per_page: 100 } }),
    apiClient.get("/api/v1/seller/customers", { params: { per_page: 100 } }),
  ]);

  const requests = {
    cashflow: cashflowRes,
    trend: trendRes,
    summary: summaryRes,
    receivable: receivableRes,
    pending: pendingRes,
    processing: processingRes,
    shipped: shippedRes,
    weekOrders: weekOrdersRes,
    products: productsRes,
    customers: customersRes,
  };

  const failed = Object.entries(requests)
    .filter(([, result]) => !isFulfilled(result))
    .map(([key]) => SECTION_LABELS[key] || key);

  const summary = unwrapData(fulfilledValue(summaryRes));
  const receivableSummary = summary?.receivable || {};
  const cashflow = buildCashflow(fulfilledValue(cashflowRes), weekAgo, today);
  const orderTrend = buildOrderTrend(fulfilledValue(trendRes), today);
  const products = unwrapRows(fulfilledValue(productsRes)).map((row) => normalizeSellerProduct(row));
  const phoneMap = buildCustomerPhoneMap(unwrapRows(fulfilledValue(customersRes)));

  const pendingValue = fulfilledValue(pendingRes);
  const processingValue = fulfilledValue(processingRes);
  const pendingTotal = isFulfilled(pendingRes) ? unwrapTotal(pendingValue, unwrapRows(pendingValue).length) : 0;
  const processingTotal = isFulfilled(processingRes) ? unwrapTotal(processingValue, unwrapRows(processingValue).length) : 0;

  const queue = buildQueueRows(pendingValue, processingValue, fulfilledValue(shippedRes));
  const kasbon = buildKasbonRows(fulfilledValue(receivableRes), phoneMap);

  return {
    today,
    kpi: {
      omzet: orderTrend.revenue,
      omzetYesterday: orderTrend.yesterdayRevenue,
      omzetDeltaPct: percentChange(orderTrend.revenue, orderTrend.yesterdayRevenue),
      omzetOrders: orderTrend.orders,
      incomeToday: cashflow.todayIncome,
      expenseToday: cashflow.todayExpense,
      netToday: cashflow.todayIncome - cashflow.todayExpense,
      receivable: Number(receivableSummary.remaining || 0),
      receivableCount: Number(receivableSummary.open_count || 0),
      newOrders: pendingTotal + processingTotal,
      pendingOrders: pendingTotal,
    },
    cashflow: cashflow.days,
    queue,
    lowStock: buildLowStock(products),
    topProducts: buildTopProducts(fulfilledValue(weekOrdersRes), products),
    kasbon,
    failed,
  };
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: keys.dashboard(),
    queryFn: fetchDashboardData,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export {
  getApiMessage,
  formatPrice,
  PAYMENT_LABELS,
  STATUS_LABELS,
  NEXT_STATUS,
};
