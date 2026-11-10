import { useMutation } from "@tanstack/react-query";
import { apiClient, getApiMessage } from "@/core/utils/apiClient";

export async function createManualOrder(payload) {
  const response = await apiClient.post("/api/v1/order/orderings/manual", payload);
  return response.data?.data ?? response.data;
}

export function useCreateManualOrder() {
  return useMutation({ mutationFn: createManualOrder });
}

export function getManualOrderError(error) {
  return getApiMessage(error, "Order manual gagal dibuat.");
}