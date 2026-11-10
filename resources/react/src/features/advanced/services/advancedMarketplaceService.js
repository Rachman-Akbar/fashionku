import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getEcho, getEchoStatus, subscribeEchoStatus } from "@/core/realtime/echo";
import { communicationRequest } from "@/features/communication/communicationApi";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";

function collection(payload) {
  const source = payload?.data ?? payload ?? {};
  const rows = Array.isArray(source) ? source : Array.isArray(source.data) ? source.data : [];
  const meta = payload?.meta || source?.meta || {
    current_page: source?.current_page || 1,
    last_page: source?.last_page || 1,
    total: source?.total || rows.length,
  };
  return { rows, meta };
}

function data(payload) {
  return payload?.data?.data ?? payload?.data ?? payload;
}

async function getList(path, params = {}) {
  const response = await apiClient.get(path, { params });
  return collection(response.data);
}

async function getOne(path) {
  const response = await apiClient.get(path);
  return data(response.data);
}

async function post(path, values) {
  const response = await apiClient.post(path, values);
  return data(response.data);
}

async function put(path, values) {
  const response = await apiClient.put(path, values);
  return data(response.data);
}

async function patch(path, values = {}) {
  const response = await apiClient.patch(path, values);
  return data(response.data);
}

async function remove(path) {
  const response = await apiClient.delete(path);
  return data(response.data);
}

async function communicationList(path, params = {}) {
  return collection(await communicationRequest(path, { params }));
}

async function communicationOne(path) {
  return data(await communicationRequest(path));
}

async function communicationPost(path, values) {
  return data(await communicationRequest(path, { method: "POST", body: values }));
}

async function communicationPatch(path, values = {}) {
  return data(await communicationRequest(path, { method: "PATCH", body: values }));
}

export const advancedKeys = {
  finance: ["advanced", "finance"],
  stock: ["advanced", "stock"],
  materials: ["advanced", "materials"],
  materialMovements: ["advanced", "material-movements"],
  costImpacts: ["advanced", "cost-impacts"],
  productCosting: ["advanced", "product-costing"],
  financePayments: ["advanced", "finance-payments"],
  customers: ["advanced", "customers"],
  showcases: ["advanced", "showcases"],
  tickets: ["advanced", "tickets"],
  ticketContext: ["advanced", "tickets", "context"],
  missions: ["advanced", "missions"],
  userMissions: ["advanced", "missions", "me"],
  promotionPayments: ["advanced", "promotion-payments"],
  conversations: ["communication", "conversations"],
  products: ["advanced", "products"],
  reviews: ["advanced", "reviews"],
};

function refresh(queryClient, key) {
  return queryClient.invalidateQueries({ queryKey: key });
}

function useMutationHelper(mutationFn, key) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => refresh(queryClient, key) });
}

export function useManageableProducts(params = {}) {
  const { activeRole } = useAuth();
  const path = activeRole === "admin" ? "/api/v1/catalog/admin/products" : "/api/v1/catalog/seller/products";
  return useQuery({ queryKey: [...advancedKeys.products, activeRole, params], queryFn: () => getList(path, params), enabled: ["admin", "seller"].includes(activeRole) });
}

export function useReviews(params = {}) {
  return useInfiniteList({ queryKey: advancedKeys.reviews, queryFn: (queryParams) => getList("/api/v1/order/reviews", queryParams), params });
}

export function usePublicReviews(productId, params = {}) {
  return useQuery({ queryKey: [...advancedKeys.reviews, "product", productId, params], queryFn: () => getList(`/api/v1/order/products/${productId}/reviews`, params), enabled: Boolean(productId) });
}

export function useCreateReview() {
  return useMutationHelper((values) => post("/api/v1/order/reviews", values), advancedKeys.reviews);
}

export function useUpdateReview() {
  return useMutationHelper(({ id, values }) => put(`/api/v1/order/reviews/${id}`, values), advancedKeys.reviews);
}

export function useDeleteReview() {
  return useMutationHelper((id) => remove(`/api/v1/order/reviews/${id}`), advancedKeys.reviews);
}

export function usePublicShowcases(storeId) {
  return useQuery({ queryKey: [...advancedKeys.showcases, "public", storeId], queryFn: () => getList(`/api/v1/seller/stores/${storeId}/showcases`, { per_page: 100 }), enabled: Boolean(storeId) });
}

export function useFinance(params = {}) {
  return useInfiniteList({ queryKey: advancedKeys.finance, queryFn: (queryParams) => getList("/api/v1/seller/finance", queryParams), params });
}

export function useSaveFinance() {
  return useMutationHelper(({ id, values }) => id ? put(`/api/v1/seller/finance/${id}`, values) : post("/api/v1/seller/finance", values), advancedKeys.finance);
}

export function useRecordFinancePayment() {
  return useMutationHelper(({ id, ...values }) => patch(`/api/v1/seller/finance/${id}/payments`, values), advancedKeys.finance);
}

export function useFinancePaymentHistory(id, enabled = true) {
  return useQuery({ queryKey: [...advancedKeys.financePayments, id], queryFn: () => getOne(`/api/v1/seller/finance/${id}/payments`), enabled: Boolean(id && enabled) });
}

export function useDeleteFinance() {
  return useMutationHelper((id) => remove(`/api/v1/seller/finance/${id}`), advancedKeys.finance);
}

export function useFinanceDashboard(params = {}) {
  return useQuery({
    queryKey: [...advancedKeys.finance, "dashboard", params],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/seller/finance/dashboard", { params });
      return data(response.data);
    },
  });
}

export function useSellerOrderTrend(params = {}) {
  return useQuery({
    queryKey: [...advancedKeys.finance, "order-trend", params],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/seller/finance/dashboard/order-trend", { params });
      return data(response.data);
    },
  });
}

export function useStockMovements(params = {}) {
  return useQuery({ queryKey: [...advancedKeys.stock, params], queryFn: () => getList("/api/v1/seller/stock/movements", params) });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => post("/api/v1/seller/stock/adjustments", values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: advancedKeys.stock }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.materials }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.materialMovements }),
      ]);
    },
  });
}

export function useRawMaterials(params = {}) {
  return useQuery({ queryKey: [...advancedKeys.materials, params], queryFn: () => getList("/api/v1/seller/inventory/materials", params) });
}

export function useSaveRawMaterial() {
  return useMutationHelper(({ id, values }) => id ? put(`/api/v1/seller/inventory/materials/${id}`, values) : post("/api/v1/seller/inventory/materials", values), advancedKeys.materials);
}

export function useDeleteRawMaterial() {
  return useMutationHelper((id) => remove(`/api/v1/seller/inventory/materials/${id}`), advancedKeys.materials);
}

export function useAdjustRawMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }) => post(`/api/v1/seller/inventory/materials/${id}/stock`, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: advancedKeys.materials }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.materialMovements }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.costImpacts }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.productCosting }),
      ]);
    },
  });
}

export function useRawMaterialMovements(params = {}) {
  return useQuery({ queryKey: [...advancedKeys.materialMovements, params], queryFn: () => getList("/api/v1/seller/inventory/material-movements", params) });
}

export function useRawMaterialCostImpacts(params = {}) {
  return useQuery({ queryKey: [...advancedKeys.costImpacts, params], queryFn: () => getList("/api/v1/seller/inventory/cost-impacts", params) });
}

export function useProductCosting(productId, enabled = true) {
  const { activeRole } = useAuth();
  const scope = activeRole === "admin" ? "admin" : "seller";
  return useQuery({ queryKey: [...advancedKeys.productCosting, scope, productId], queryFn: () => getOne(`/api/v1/catalog/${scope}/products/${productId}/costing`), enabled: Boolean(productId && enabled) });
}

export function useSaveProductCosting() {
  const { activeRole } = useAuth();
  const queryClient = useQueryClient();
  const scope = activeRole === "admin" ? "admin" : "seller";
  return useMutation({
    mutationFn: ({ productId, values }) => put(`/api/v1/catalog/${scope}/products/${productId}/costing`, values),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [...advancedKeys.productCosting, scope, variables.productId] }),
        queryClient.invalidateQueries({ queryKey: advancedKeys.products }),
      ]);
    },
  });
}

export function useCustomers(params = {}, options = {}) {
  return useInfiniteList({
    queryKey: advancedKeys.customers,
    queryFn: (queryParams) => getList("/api/v1/seller/customers", queryParams),
    params,
    enabled: options.enabled !== false,
  });
}

export function useCreateCustomer() {
  return useMutationHelper((values) => post("/api/v1/seller/customers", values), advancedKeys.customers);
}

export function useUpdateCustomer() {
  return useMutationHelper(({ id, values }) => patch(`/api/v1/seller/customers/${id}`, values), advancedKeys.customers);
}

export function useDeleteCustomer() {
  return useMutationHelper((id) => remove(`/api/v1/seller/customers/${id}`), advancedKeys.customers);
}

export function useShowcases(params = {}) {
  return useInfiniteList({ queryKey: advancedKeys.showcases, queryFn: (queryParams) => getList("/api/v1/seller/showcases", queryParams), params });
}

export function useSaveShowcase() {
  return useMutationHelper(({ id, values }) => id ? put(`/api/v1/seller/showcases/${id}`, values) : post("/api/v1/seller/showcases", values), advancedKeys.showcases);
}

export function useDeleteShowcase() {
  return useMutationHelper((id) => remove(`/api/v1/seller/showcases/${id}`), advancedKeys.showcases);
}

export function useTickets(params = {}) {
  return useInfiniteList({ queryKey: advancedKeys.tickets, queryFn: (queryParams) => getList("/api/v1/support/tickets", queryParams), params });
}

export function useTicket(id, enabled = true) {
  return useQuery({ queryKey: [...advancedKeys.tickets, id], queryFn: () => getOne(`/api/v1/support/tickets/${id}`), enabled: Boolean(id && enabled) });
}

export function useTicketContext(enabled = true) {
  return useQuery({ queryKey: advancedKeys.ticketContext, queryFn: () => getOne("/api/v1/support/tickets/context"), enabled: Boolean(enabled), staleTime: 60000 });
}

export function useCreateTicket() {
  return useMutationHelper((values) => post("/api/v1/support/tickets", values), advancedKeys.tickets);
}

export function useReplyTicket() {
  return useMutationHelper(({ id, values }) => post(`/api/v1/support/tickets/${id}/replies`, values), advancedKeys.tickets);
}

export function useUpdateTicketStatus() {
  return useMutationHelper(({ id, values }) => patch(`/api/v1/support/tickets/${id}/status`, values), advancedKeys.tickets);
}

export function useMissions(params = {}, admin = false) {
  const path = admin ? "/api/v1/engagement/missions" : "/api/v1/engagement/missions/me";
  const key = admin ? advancedKeys.missions : advancedKeys.userMissions;
  return useInfiniteList({
    queryKey: key,
    params,
    queryFn: async (queryParams) => {
      const response = await apiClient.get(path, { params: queryParams });
      if (admin) return collection(response.data);
      const rows = response.data?.data || [];
      return { rows, meta: { current_page: 1, last_page: 1, total: rows.length } };
    },
  });
}

export function useSaveMission() {
  return useMutationHelper(({ id, values }) => id ? put(`/api/v1/engagement/missions/${id}`, values) : post("/api/v1/engagement/missions", values), advancedKeys.missions);
}

export function useMissionEventTypes() {
  return useQuery({
    queryKey: ["advanced", "missions", "event-types"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/engagement/missions/event-types");
      return response.data?.data || {};
    },
    staleTime: 60_000,
  });
}

export function useDeleteMission() {
  return useMutationHelper((id) => remove(`/api/v1/engagement/missions/${id}`), advancedKeys.missions);
}

export function usePromotionPayments(params = {}) {
  return useInfiniteList({ queryKey: advancedKeys.promotionPayments, queryFn: (queryParams) => getList("/api/v1/catalog/promotion-payments", queryParams), params });
}

export function useCreatePromotionPayment() {
  return useMutationHelper((values) => post("/api/v1/catalog/promotion-payments", values), advancedKeys.promotionPayments);
}

export function useReviewPromotionPayment() {
  return useMutationHelper(({ id, status, reason }) => {
    if (status === "approve") return patch(`/api/v1/catalog/promotion-payments/${id}/approve`);
    if (status === "reject") return patch(`/api/v1/catalog/promotion-payments/${id}/reject`, { reason });
    throw new Error("Aksi review pembayaran promosi tidak valid.");
  }, advancedKeys.promotionPayments);
}

export function useConversations(params = {}) {
  return useQuery({
    queryKey: [...advancedKeys.conversations, params],
    queryFn: () => communicationList("/conversations", params),
    refetchInterval: () => getEchoStatus() === "connected" ? false : 10000,
    refetchOnWindowFocus: true,
  });
}

export function useConversation(id) {
  return useQuery({
    queryKey: [...advancedKeys.conversations, id],
    queryFn: () => communicationOne(`/conversations/${id}`),
    enabled: Boolean(id),
    refetchInterval: () => getEchoStatus() === "connected" ? false : 15000,
    refetchOnWindowFocus: true,
  });
}

export function useStartConversation() {
  return useMutationHelper((values) => communicationPost("/conversations", values), advancedKeys.conversations);
}

export function useSendMessage() {
  return useMutation({ mutationFn: ({ id, values }) => communicationPost(`/conversations/${id}/messages`, values) });
}

export function useMarkConversationRead() {
  return useMutation({ mutationFn: (id) => communicationPatch(`/conversations/${id}/read`) });
}

export function useSendAnnouncement() {
  return useMutationHelper((values) => communicationPost("/announcements", values), advancedKeys.conversations);
}

export function subscribeConversation(id, onMessage) {
  if (!id) return () => {};
  const echo = getEcho();
  if (!echo) return () => {};
  const channelName = `conversation.${id}`;
  const channel = echo.private(channelName);
  channel.listen(".chat.message.sent", (event) => onMessage?.(event?.message || event));
  return () => echo.leave(channelName);
}


export function subscribeChatInbox(userId, onMessage) {
  if (!userId) return () => {};
  const echo = getEcho();
  if (!echo) return () => {};
  const channelName = `chat.user.${userId}`;
  const channel = echo.private(channelName);
  channel.listen(".chat.message.sent", (event) => onMessage?.(event?.message || event));
  return () => echo.leave(channelName);
}

export function subscribeRealtimeStatus(listener) {
  const unsubscribe = subscribeEchoStatus(listener);
  getEcho();
  return unsubscribe;
}

export function advancedError(error, fallback = "Data gagal diproses.") {
  return getApiMessage(error, fallback);
}
