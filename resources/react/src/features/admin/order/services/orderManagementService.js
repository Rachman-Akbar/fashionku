import { useMutation } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapCollection } from "@/core/utils/apiClient";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";

export const orderManagementKeys = {
  admin: (params = {}) => ["admin", "orders", params],
  seller: (params = {}) => ["seller", "orders", params],
};

export function normalizeOrderItem(item = {}, index = 0) {
  return {
    id: Number(item.id || index),
    productId: Number(item.product_id || item.productId || 0),
    variantId: item.variant_id || item.variantId || null,
    productName: item.product_name || item.productName || item.name || "",
    sku: item.sku || "",
    thumbnail: item.thumbnail || item.image_url || item.image || "",
    quantity: Number(item.quantity || 0),
    unitPrice: Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0),
    subtotal: Number(item.subtotal ?? 0),
  };
}

export function normalizeOrder(row = {}) {
  return {
    id: Number(row.id || 0),
    orderId: Number(row.order_id || row.orderId || row.id || 0),
    orderNumber: row.order_number || row.orderNumber || "",
    orderType: row.order_type || row.orderType || "normal",
    preorderReleaseAt: row.preorder_release_at || row.preorderReleaseAt || null,
    scheduledAt: row.scheduled_at || row.scheduledAt || null,
    receivedAt: row.received_at || row.receivedAt || null,
    customerName: row.user?.name || row.customer_name || row.customerName || "",
    total: Number(row.grand_total ?? row.total ?? row.total_items_price ?? 0) + Number(row.shipping_cost || 0),
    status: row.status || "pending",
    paymentStatus: row.payment_status || row.paymentStatus || "pending",
    trackingNumber: row.tracking_number || row.trackingNumber || "",
    items: Array.isArray(row.items) ? row.items.map(normalizeOrderItem) : [],
    createdAt: row.created_at || row.createdAt || null,
    raw: row,
  };
}

function normalizePage(payload) {
  const source = payload?.data?.data ?? payload?.data ?? payload ?? {};
  const rows = Array.isArray(source) ? source : Array.isArray(source.data) ? source.data : unwrapCollection(payload);
  return {
    rows: rows.map(normalizeOrder),
    meta: payload?.meta || source?.meta || {
      current_page: source?.current_page || 1,
      last_page: source?.last_page || 1,
      total: source?.total || rows.length,
    },
  };
}

export async function getAdminOrders(params = {}) {
  const response = await apiClient.get("/api/v1/order/orderings", { params });
  return normalizePage(response.data);
}

export async function getSellerOrders(params = {}) {
  const response = await apiClient.get("/api/v1/order/orderings", { params });
  return normalizePage(response.data);
}

export async function updateOrderStatus(id, status, trackingNumber = "") {
  const response = await apiClient.patch(`/api/v1/order/orderings/${id}/status`, {
    status,
    tracking_number: trackingNumber || null,
  });
  return response.data;
}

export async function deleteOrder(id) {
  const response = await apiClient.delete(`/api/v1/order/orderings/${id}`);
  return response.data;
}

export async function updateOrder(id, payload) {
  const response = await apiClient.patch(`/api/v1/order/orderings/${id}`, payload);
  return response.data;
}

export function useAdminOrders(params = {}) {
  const { enabled = true, ...queryParams } = params;
  return useInfiniteList({
    queryKey: ["admin", "orders"],
    queryFn: (queryParams) => getAdminOrders(queryParams),
    params: queryParams,
    enabled,
  });
}

export function useSellerOrders(params = {}) {
  const { enabled = true, ...queryParams } = params;
  return useInfiniteList({
    queryKey: ["seller", "orders"],
    queryFn: (queryParams) => getSellerOrders(queryParams),
    params: queryParams,
    enabled,
  });
}

export function useUpdateOrderStatus() {
  return useMutation({ mutationFn: ({ id, status, trackingNumber }) => updateOrderStatus(id, status, trackingNumber) });
}

export function useDeleteOrder() {
  return useMutation({ mutationFn: (id) => deleteOrder(id) });
}

export function useUpdateOrder() {
  return useMutation({ mutationFn: ({ id, payload }) => updateOrder(id, payload) });
}

export function getOrderManagementError(error) {
  return getApiMessage(error, "Data pesanan gagal diproses.");
}