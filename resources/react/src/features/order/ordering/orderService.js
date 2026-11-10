import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage, unwrapApiData } from "@/core/utils/apiClient";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { useAuth } from "@/features/auth/context/AuthContext";

export const orderKeys = {
  all: ["order", "orderings"],
  customer: (userId, filters = {}) => [
    "order",
    "orderings",
    "customer",
    userId,
    filters,
  ],
  detail: (id) => ["order", "orderings", "detail", String(id || "")],
  shipping: (payload) => ["order", "shipping-options", payload],
  seller: (storeId, filters = {}) => [
    "order",
    "orderings",
    "seller",
    storeId,
    filters,
  ],
};

function firstValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

function normalizeDirectOrderItem(item = {}) {
  const productVariantId = Number(
    item.variantId ?? item.variant_id ?? item.product_variant_id ?? 0,
  );
  const productId = Number(item.productId ?? item.product_id ?? item.id ?? 0);

  return {
    ...(productVariantId > 0 ? { product_variant_id: productVariantId } : {}),
    ...(productVariantId <= 0 && productId > 0
      ? { product_id: productId }
      : {}),
    quantity: Math.max(1, Number(item.quantity || 1)),
  };
}

function getDirectOrderItems(items = []) {
  return Array.isArray(items)
    ? items
        .map(normalizeDirectOrderItem)
        .filter((item) => item.product_variant_id > 0 || item.product_id > 0)
    : [];
}

function normalizeItem(item = {}) {
  return {
    id: item.id ?? null,
    productId: Number(item.product_id ?? item.productId ?? 0),
    variantId: Number(item.variant_id ?? item.variantId ?? 0),
    productName: item.product_name || item.productName || item.name || "Produk",
    variantLabel: item.variant_label || item.variantLabel || item.sku || "",
    sku: item.sku || "",
    quantity: Number(item.quantity || 0),
    price: Number(item.unit_price ?? item.price ?? 0),
    subtotal: Number(item.subtotal ?? 0),
    imageUrl: resolveMediaUrl(item.thumbnail || item.image || item.image_url || ""),
    storeId: Number(item.store_id ?? item.storeId ?? 0),
    storeName: item.store_name || item.storeName || "Toko",
  };
}

function resolveOrderResponse(payload = {}) {
  const source = unwrapApiData(payload) || {};
  const nestedData =
    source?.data && typeof source.data === "object" ? source.data : {};
  const order =
    source?.order ||
    nestedData?.order ||
    source?.ordering ||
    nestedData?.ordering ||
    source?.orders?.[0] ||
    nestedData?.orders?.[0] ||
    source?.orderings?.[0] ||
    nestedData?.orderings?.[0] ||
    source;
  const payment =
    source?.payment ||
    nestedData?.payment ||
    order?.payment ||
    source?.midtrans ||
    nestedData?.midtrans ||
    source ||
    {};

  return { order: order || {}, payment: payment || {} };
}

export function normalizeOrder(row = {}, payment = {}) {
  const items = Array.isArray(row.items) ? row.items.map(normalizeItem) : [];
  const subOrders = Array.isArray(row.sub_orders)
    ? row.sub_orders.map((subOrder) => ({
        id: subOrder.id ?? null,
        storeId: Number(subOrder.store_id),
        storeName: subOrder.store_name || "Toko",
        subOrderNumber: subOrder.sub_order_number || "",
        status: subOrder.status || "pending",
        courier: subOrder.courier || "",
        service: subOrder.service || "",
        shippingCost: Number(subOrder.shipping_cost || 0),
        trackingNumber: subOrder.tracking_number || null,
        items: Array.isArray(subOrder.items)
          ? subOrder.items.map(normalizeItem)
          : [],
      }))
    : [];
  const paymentSource = {
    ...(payment && typeof payment === "object" ? payment : {}),
    ...(row.payment && typeof row.payment === "object" ? row.payment : {}),
  };
  const rawId = firstValue(
    row.id,
    row.order_id,
    row.orderId,
    paymentSource.order_id,
  );

  return {
    id: rawId === undefined ? "" : String(rawId),
    orderNumber: row.order_number || row.orderNumber || String(rawId || ""),
    orderType: row.order_type || row.orderType || "normal",
    preorderReleaseAt: row.preorder_release_at || row.preorderReleaseAt || null,
    scheduledAt: row.scheduled_at || row.scheduledAt || null,
    receivedAt: row.received_at || row.receivedAt || null,
    userId: row.user_id ? String(row.user_id) : "",
    status: row.status || "pending",
    paymentStatus:
      row.payment_status ||
      paymentSource.payment_status ||
      paymentSource.transaction_status ||
      "unpaid",
    paymentMethod: row.payment_method || paymentSource.payment_method || null,
    subtotal: Number(
      row.subtotal ?? row.items_total ?? row.total_items_price ?? 0,
    ),
    totalAmount: Number(row.total_amount || 0),
    shippingCost: Number(row.shipping_cost || 0),
    discountAmount: Number(row.discount_amount || 0),
    shippingDiscountAmount: Number(row.shipping_discount_amount || 0),
    grandTotal: Number(
      row.grand_total ?? row.final_total ?? row.total_amount ?? 0,
    ),
    shippingAddress: row.shipping_address || "",
    courier: row.courier || "",
    service: row.service || "",
    snapToken: firstValue(
      row.snap_token,
      row.midtrans_snap_token,
      row.snapToken,
      paymentSource.snap_token,
      paymentSource.midtrans_snap_token,
      paymentSource.token,
    ),
    paymentUrl: firstValue(
      row.payment_url,
      row.redirect_url,
      paymentSource.payment_url,
      paymentSource.redirect_url,
      paymentSource.invoice_url,
    ),
    redirectUrl: firstValue(
      row.redirect_url,
      paymentSource.redirect_url,
      paymentSource.payment_url,
    ),
    midtransClientKey: firstValue(
      row.midtrans_client_key,
      paymentSource.client_key,
      paymentSource.midtrans_client_key,
    ),
    midtransIsProduction:
      firstValue(
        row.midtrans_is_production,
        paymentSource.is_production,
        paymentSource.production,
      ) ?? null,
    items,
    subOrders,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function normalizePagination(payload) {
  const source = payload?.data ?? payload ?? {};
  const rows = Array.isArray(source)
    ? source
    : Array.isArray(source.data)
      ? source.data
      : [];
  const meta = payload?.meta ||
    source.meta || {
      current_page: source.current_page || 1,
      last_page: source.last_page || 1,
      per_page: source.per_page || rows.length,
      total: source.total || rows.length,
    };

  return { data: rows.map((row) => normalizeOrder(row)), meta };
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["1", "true", "yes", "on"].includes(normalized);
}

function normalizeCourierCode(value) {
  const courier = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");

  if (["pickup", "ambil_sendiri"].includes(courier)) {
    return "ambil_sendiri";
  }

  if (
    [
      "express",
      "internal",
      "local",
      "kurir_toko",
      "store_delivery",
      "haversine",
    ].includes(courier)
  ) {
    return "haversine";
  }

  return courier;
}

function getShippingMessage(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value) {
    return "";
  }

  const prefix = firstValue(
    value.store_name,
    value.storeName,
    value.store,
    value.label,
  );
  const directMessage = firstValue(
    value.message,
    value.error,
    value.detail,
    value.meta?.message,
  );

  if (directMessage) {
    const message = String(directMessage).trim();

    return prefix ? `${String(prefix).trim()}: ${message}` : message;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value).trim();
  }
}

function getShippingErrorSearchText(value, status = null) {
  let serializedValue = "";

  if (typeof value === "string") {
    serializedValue = value;
  } else if (value) {
    try {
      serializedValue = JSON.stringify(value);
    } catch {
      serializedValue = String(value);
    }
  }

  return [serializedValue, status !== null ? String(status) : ""]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();
}

function isRajaOngkirLocationNotFound(value, status = null) {
  const searchText = getShippingErrorSearchText(value, status);
  const locationNotFound =
    searchText.includes("origin not found") ||
    searchText.includes("destination not found");

  if (!locationNotFound) {
    return false;
  }

  const hasRajaOngkirReference =
    searchText.includes("rajaongkir") || searchText.includes("raja ongkir");
  const hasNotFoundStatus =
    Number(status) === 404 ||
    searchText.includes('"code":404') ||
    searchText.includes('"code": 404') ||
    searchText.includes("status code 404") ||
    searchText.includes("http 404");

  return hasRajaOngkirReference || hasNotFoundStatus;
}

function normalizeShippingWarning(value) {
  if (isRajaOngkirLocationNotFound(value)) {
    return "";
  }

  return getShippingMessage(value);
}

function isIgnoredShippingError(error) {
  const status = Number(error?.response?.status || 0);
  const errorPayload = {
    response: error?.response?.data,
    message: error?.message,
    url: error?.config?.url,
    status,
  };

  return isRajaOngkirLocationNotFound(errorPayload, status);
}

export function normalizeShippingOption(option = {}, index = 0) {
  const provider = String(option.provider || option.source || "")
    .trim()
    .toLowerCase();
  const courier = normalizeCourierCode(
    option.courier ||
      option.courier_code ||
      option.code ||
      option.shipping_code ||
      provider,
  );
  const service = String(
    option.service ||
      option.service_code ||
      option.shipping_service ||
      option.name ||
      (courier === "haversine" ? "HAVERSINE" : "REG"),
  ).trim();
  const costValue =
    option.price ??
    option.cost ??
    option.shipping_cost ??
    option.value ??
    option.amount ??
    0;
  const cost = Number.isFinite(Number(costValue)) ? Number(costValue) : 0;
  const label =
    option.courier_label ||
    option.courier_name ||
    option.provider_name ||
    option.label ||
    (courier === "haversine"
      ? "Haversine"
      : courier === "ambil_sendiri"
        ? "Ambil Sendiri"
        : "");

  const rawBreakdown = option.store_breakdown || option.storeBreakdown || option.breakdown || null;
  const storeBreakdown = Array.isArray(rawBreakdown)
    ? rawBreakdown.map((row) => ({
        ...row,
        storeId: Number(row.storeId ?? row.store_id ?? row.id ?? 0),
        price: Number(row.price ?? row.cost ?? row.shipping_cost ?? 0),
      })).filter((row) => row.storeId)
    : rawBreakdown;

  return {
    ...option,
    storeBreakdown,
    id:
      option.id ||
      `${courier || "shipping"}:${service || index}:${cost || index}`,
    courier,
    courier_label: label,
    service,
    price: cost,
    cost,
    description:
      option.description ||
      option.etd ||
      option.estimated_days ||
      option.estimate ||
      "",
    provider,
    requiresDestinationId: normalizeBoolean(
      option.requires_destination_id ??
        option.requires_komerce_destination_id ??
        option.requiresDestinationId,
    ),
  };
}

export function isDestinationShippingOption(option = {}) {
  if (option.requiresDestinationId) {
    return true;
  }

  const provider = String(option.provider || option.source || "").toLowerCase();
  const courier = String(option.courier || "").toLowerCase();
  const localCouriers = [
    "ambil_sendiri",
    "pickup",
    "haversine",
    "internal",
    "local",
    "kurir_toko",
    "store_delivery",
  ];

  if (localCouriers.some((name) => courier.includes(name))) {
    return false;
  }

  const destinationProviders = ["rajaongkir", "komerce"];
  const destinationCouriers = [
    "jne",
    "jnt",
    "j&t",
    "sicepat",
    "anteraja",
    "pos",
    "tiki",
    "ninja",
    "lion",
    "rex",
    "idexpress",
    "sap",
    "wahana",
  ];

  return (
    destinationProviders.some(
      (name) => provider.includes(name) || courier.includes(name),
    ) || destinationCouriers.some((name) => courier.includes(name))
  );
}

export async function getCustomerOrders(userId, filters = {}) {
  const response = await apiClient.get(
    `/api/v1/order/orderings/customers/${userId}`,
    { params: filters },
  );
  return normalizePagination(response.data);
}

export async function getOrderDetail(id) {
  const response = await apiClient.get(`/api/v1/order/orderings/${id}`);
  const resolved = resolveOrderResponse(response.data);
  return normalizeOrder(resolved.order, resolved.payment);
}

export async function getSellerOrders(storeId, filters = {}) {
  const response = await apiClient.get(
    `/api/v1/order/orderings/stores/${storeId}`,
    { params: filters },
  );
  const source = response.data?.data ?? response.data ?? {};
  const rows = Array.isArray(source)
    ? source
    : Array.isArray(source.data)
      ? source.data
      : [];

  return {
    data: rows.map((row) => ({
      id: row.id ?? null,
      orderId: row.order_id ?? null,
      orderNumber: row.order_number || row.sub_order_number || "",
      subOrderNumber: row.sub_order_number || "",
      storeId: Number(row.store_id || 0),
      storeName: row.store_name || "",
      status: row.status || "pending",
      paymentStatus: row.payment_status || "unpaid",
      totalItemsPrice: Number(row.total_items_price || 0),
      shippingCost: Number(row.shipping_cost || 0),
      courier: row.courier || "",
      service: row.service || "",
      trackingNumber: row.tracking_number || null,
      items: Array.isArray(row.items) ? row.items.map(normalizeItem) : [],
      createdAt: row.created_at || null,
    })),
    meta: source.meta || response.data?.meta || null,
  };
}

export async function getShippingOptions(payload) {
  const cartItemIds = Array.isArray(payload.cartItemIds)
    ? payload.cartItemIds.map(Number).filter(Boolean)
    : [];
  const directItems = getDirectOrderItems(payload.items);

  if (
    !payload.addressId ||
    (!cartItemIds.length && !directItems.length)
  ) {
    return {
      options: [],
      warnings: [],
      cartItemIds: [],
    };
  }

  const body = { address_id: payload.addressId };

  if (cartItemIds.length) {
    body.cart_item_ids = cartItemIds;
  } else {
    body.items = directItems;
  }

  let response;

  try {
    response = await apiClient.post(
      "/api/v1/order/orderings/shipping-options",
      body,
    );
  } catch (error) {
    if (isIgnoredShippingError(error)) {
      return {
        options: [],
        warnings: ["Ongkir tidak tersedia untuk area ini."],
        cartItemIds,
      };
    }

    throw error;
  }

  const source = unwrapApiData(response.data) || {};
  const rows = Array.isArray(source?.options)
    ? source.options
    : Array.isArray(source)
      ? source
      : [];
  const warningSource = Array.isArray(source?.warnings)
    ? source.warnings
    : Array.isArray(source?.shipping_warnings)
      ? source.shipping_warnings
      : [];
  const warnings = warningSource.map(normalizeShippingWarning).filter(Boolean);

  return {
    options: rows.map(normalizeShippingOption),
    warnings,
    cartItemIds,
  };
}

function buildOrderPayload(payload, cartItemIds = payload.cartItemIds) {
  const items = getDirectOrderItems(payload.items);
  const requestPayload = {
    address_id: payload.courier === "ambil_sendiri" ? null : payload.addressId,
    courier: payload.courier,
    service: payload.service || null,
    payment_method: payload.paymentMethod,
    voucher_code: payload.voucherCode || null,
    order_type: payload.orderType || "normal",
    preorder_release_at: payload.preorderReleaseAt || null,
    scheduled_at: payload.orderType === "booking" ? payload.scheduledAt || null : null,
  };

  if (Array.isArray(cartItemIds) && cartItemIds.length) {
    requestPayload.cart_item_ids = cartItemIds.filter(Boolean);
  }

  if (items.length && !requestPayload.cart_item_ids?.length) {
    requestPayload.items = items;
  }

  return requestPayload;
}

async function postOrder(requestPayload) {
  const response = await apiClient.post(
    "/api/v1/order/orderings",
    requestPayload,
  );
  const resolved = resolveOrderResponse(response.data);
  return normalizeOrder(resolved.order, resolved.payment);
}

export async function createOrder(payload) {
  return postOrder(buildOrderPayload(payload));
}

export async function cancelOrder(id) {
  const response = await apiClient.post(`/api/v1/order/orderings/${id}/cancel`);
  return response.data;
}

export async function confirmOrderReceived(id) {
  const response = await apiClient.patch(`/api/v1/order/orderings/${id}/status`, { status: "received" });
  return response.data;
}

export function useOrders(filters = {}) {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || "";

  return useQuery({
    queryKey: orderKeys.customer(userId, filters),
    queryFn: () => getCustomerOrders(userId, filters),
    enabled: Boolean(isAuthenticated && userId),
    staleTime: 60000,
  });
}

export function useOrderDetail(id) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      try {
        return await getOrderDetail(id);
      } catch (error) {
        if (error?.response?.status !== 404 || !user?.id) {
          throw error;
        }

        const result = await getCustomerOrders(user.id, {
          search: id,
          per_page: 100,
        });
        const match = result.data.find(
          (order) =>
            String(order.id) === String(id) ||
            String(order.orderNumber) === String(id),
        );

        if (!match) {
          throw error;
        }

        if (String(match.id) === String(id)) {
          return match;
        }

        try {
          return await getOrderDetail(match.id);
        } catch {
          return match;
        }
      }
    },
    enabled: Boolean(isAuthenticated && id),
    staleTime: 30000,
    retry: (failureCount, error) =>
      error?.response?.status === 404 && failureCount < 2,
    retryDelay: 500,
    refetchInterval: (query) => {
      const order = query.state.data;
      return order && ["pending", "unpaid"].includes(order.paymentStatus)
        ? 5000
        : false;
    },
  });
}

export function useShippingOptions(payload, enabled = true) {
  return useQuery({
    queryKey: orderKeys.shipping(payload),
    queryFn: () => getShippingOptions(payload),
    enabled: Boolean(
      enabled &&
        payload?.addressId &&
        (payload?.cartItemIds?.length || payload?.items?.length),
    ),
    staleTime: 60000,
    retry: false,
  });
}

export function useSellerOrders(storeId, filters = {}) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: orderKeys.seller(storeId, filters),
    queryFn: () => getSellerOrders(storeId, filters),
    enabled: Boolean(isAuthenticated && storeId),
    staleTime: 30000,
  });
}

export function useConfirmOrderReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmOrderReceived,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["order", "cart"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

export function getOrderError(error) {
  return getApiMessage(error, "Pesanan gagal diproses.");
}

export function getShippingError(error) {
  if (isIgnoredShippingError(error)) {
    return "";
  }

  return getApiMessage(error, "Ongkir belum dapat dihitung.");
}
