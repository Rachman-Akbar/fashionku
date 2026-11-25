import { beforeEach, describe, expect, it, vi } from "vitest";

// Modul asli dipertahankan (unwrapCollection, getApiMessage, dst); hanya
// `apiClient.get` yang dimock agar alur agregasi dashboard bisa diuji.
vi.mock("@/core/utils/apiClient", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, apiClient: { get: vi.fn() } };
});

import { apiClient } from "@/core/utils/apiClient";
import { fetchDashboardData } from "@/features/admin/services/adminDashboardService";

function pad(value) {
  return String(value).padStart(2, "0");
}

function iso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const NOW = new Date();
const TODAY = iso(NOW);
const YESTERDAY = iso(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 1));
const WEEK_AGO = iso(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 6));

const FIXTURES = {
  [`/api/v1/seller/finance/dashboard/cashflow?date_from=${WEEK_AGO}&date_to=${TODAY}`]: {
    data: {
      data: {
        daily: [
          { date: WEEK_AGO, income: 100000, expense: 40000 },
          { date: YESTERDAY, income: 300000, expense: 50000 },
          { date: TODAY, income: 500000, expense: 200000 },
        ],
        totals: { income: 900000, expense: 290000 },
      },
    },
  },
  "/api/v1/seller/finance/dashboard/order-trend?period=daily": {
    data: {
      data: {
        points: [
          { date: YESTERDAY, orders: 2, revenue: 500000 },
          { date: TODAY, orders: 3, revenue: 750000 },
        ],
      },
    },
  },
  "/api/v1/seller/finance/hutang-piutang/summary": {
    data: { data: { receivable: { remaining: 150000, open_count: 2 }, payable: { remaining: 0, open_count: 0 } } },
  },
  "/api/v1/seller/finance/hutang-piutang/receivable": {
    data: {
      data: [
        { id: 1, title: "Bu Sari", amount: 100000, remaining: 60000, due_date: "2026-11-01", days_overdue: 24 },
        { id: 2, title: "Pak Budi", amount: 50000, remaining: 50000, due_date: null, days_overdue: 0 },
      ],
    },
  },
  "/api/v1/order/orderings?status=pending&per_page=20": {
    data: {
      data: [
        {
          id: 10,
          order_number: "INV-10",
          status: "pending",
          payment_method: "cod",
          grand_total: 50000,
          created_at: `${TODAY}T09:00:00.000Z`,
          user: { name: "Andi" },
          items: [{ id: 1, product_name: "Kopi", quantity: 2, unit_price: 20000, subtotal: 40000 }],
        },
      ],
      meta: { total: 1 },
    },
  },
  "/api/v1/order/orderings?status=processing&per_page=10": {
    data: {
      data: [
        {
          id: 11,
          order_number: "INV-11",
          status: "processing",
          payment_method: "transfer_manual",
          grand_total: 90000,
          created_at: `${TODAY}T10:00:00.000Z`,
          user: { name: "Bela" },
          items: [{ id: 2, product_name: "Kopi", quantity: 3, unit_price: 20000, subtotal: 60000 }],
        },
      ],
      meta: { total: 1 },
    },
  },
  "/api/v1/order/orderings?status=shipped&per_page=10": {
    data: {
      data: [
        {
          id: 12,
          order_number: "INV-12",
          status: "shipped",
          payment_method: "midtrans",
          grand_total: 30000,
          created_at: `${YESTERDAY}T08:00:00.000Z`,
          user: { name: "Citra" },
          items: [{ id: 3, product_name: "Teh", quantity: 1, unit_price: 10000, subtotal: 10000 }],
        },
      ],
      meta: { total: 1 },
    },
  },
  [`/api/v1/order/orderings?date_from=${WEEK_AGO}&date_to=${TODAY}&per_page=100`]: {
    data: {
      data: [
        {
          id: 10,
          order_number: "INV-10",
          status: "pending",
          grand_total: 50000,
          items: [
            { id: 1, product_id: 9, product_name: "Kopi", quantity: 2, unit_price: 20000, subtotal: 40000 },
            { id: 2, product_name: "Teh", quantity: 1, unit_price: 10000, subtotal: 10000 },
          ],
        },
        {
          id: 11,
          order_number: "INV-11",
          status: "processing",
          grand_total: 90000,
          items: [{ id: 3, product_id: 9, product_name: "Kopi", quantity: 3, unit_price: 20000, subtotal: 60000 }],
        },
        {
          id: 99,
          order_number: "INV-99",
          status: "cancelled",
          grand_total: 999000,
          items: [{ id: 4, product_name: "Kopi", quantity: 100, unit_price: 9990, subtotal: 999000 }],
        },
      ],
    },
  },
  "/api/v1/catalog/admin/products?per_page=100": {
    data: {
      data: [
        { id: 1, name: "Gula", sku: "G-1", stock: 2, min_stock: 10 },
        { id: 2, name: "Beras", sku: "B-1", stock: 50, min_stock: 10 },
        { id: 3, name: "Kopi Instan", sku: "K-1", stock: 0, min_stock: 0 },
        { id: 9, name: "Kopi", sku: "KOP-1", stock: 40, min_stock: 5, thumbnail: "/storage/kopi.jpg" },
      ],
    },
  },
  "/api/v1/seller/customers?per_page=100": {
    data: { data: [{ id: 1, name: "Bu Sari", phone: "08123456789" }] },
  },
};

function resolveFixture(url, options) {
  const params = options?.params;
  const key = params
    ? `${url}?${Object.entries(params).map(([name, value]) => `${name}=${value}`).join("&")}`
    : url;
  const fixture = FIXTURES[key];
  return fixture ? Promise.resolve(fixture) : Promise.reject(new Error(`Unexpected request: ${key}`));
}

describe("fetchDashboardData", () => {
  beforeEach(() => {
    apiClient.get.mockReset();
    apiClient.get.mockImplementation(resolveFixture);
  });

  it("mengagregasi kpi, antrean pesanan, stok, kasbon, dan arus kas", async () => {
    const dashboard = await fetchDashboardData();

    expect(dashboard.failed).toEqual([]);

    // KPI
    expect(dashboard.kpi.omzet).toBe(750000);
    expect(dashboard.kpi.omzetYesterday).toBe(500000);
    expect(dashboard.kpi.omzetDeltaPct).toBe(50);
    expect(dashboard.kpi.omzetOrders).toBe(3);
    expect(dashboard.kpi.incomeToday).toBe(500000);
    expect(dashboard.kpi.expenseToday).toBe(200000);
    expect(dashboard.kpi.netToday).toBe(300000);
    expect(dashboard.kpi.receivable).toBe(150000);
    expect(dashboard.kpi.receivableCount).toBe(2);
    expect(dashboard.kpi.newOrders).toBe(2);
    expect(dashboard.kpi.pendingOrders).toBe(1);

    // Antrean pesanan: terbaru lebih dulu, status tetap bisa ditindaklanjuti
    expect(dashboard.queue.map((order) => order.orderNumber)).toEqual(["INV-11", "INV-10", "INV-12"]);
    expect(dashboard.queue[0].customerName).toBe("Bela");

    // Stok kritis: beras tidak ikut, kopi instan (stok 0) ikut
    expect(dashboard.lowStock.map((product) => product.name)).toEqual(["Kopi Instan", "Gula"]);
    expect(dashboard.lowStock[1]).toMatchObject({ stock: 2, minStock: 10 });

    // Barang terlaris minggu ini: pesanan batal dikecualikan
    expect(dashboard.topProducts).toEqual([
      { productId: 9, name: "Kopi", thumbnail: "/storage/kopi.jpg", qty: 5, revenue: 100000 },
      { productId: 0, name: "Teh", thumbnail: "", qty: 1, revenue: 10000 },
    ]);

    // Kasbon: terlama lebih dulu, nomor WhatsApp sudah internasional
    expect(dashboard.kasbon.map((entry) => entry.name)).toEqual(["Bu Sari", "Pak Budi"]);
    expect(dashboard.kasbon[0]).toMatchObject({ overdueDays: 24, phone: "628123456789" });
    expect(dashboard.kasbon[1].phone).toBe("");

    // Arus kas 7 hari selalu terisi (hari tanpa transaksi tetap tampil)
    expect(dashboard.cashflow).toHaveLength(7);
    expect(dashboard.cashflow.at(-1)).toEqual({ date: TODAY, income: 500000, expense: 200000 });
    expect(dashboard.cashflow[0].date).toBe(WEEK_AGO);
  });

  it("tetap mengembalikan data parsial ketika satu endpoint gagal", async () => {
    apiClient.get.mockImplementation((url, options) =>
      url === "/api/v1/seller/finance/hutang-piutang/summary"
        ? Promise.reject(new Error("403"))
        : resolveFixture(url, options),
    );

    const dashboard = await fetchDashboardData();

    expect(dashboard.failed).toContain("ringkasan kasbon");
    expect(dashboard.kpi.receivable).toBe(0);
    expect(dashboard.kpi.omzet).toBe(750000);
    expect(dashboard.queue).toHaveLength(3);
  });
});
