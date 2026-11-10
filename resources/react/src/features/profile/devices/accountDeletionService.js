import { apiClient } from "@/core/utils/apiClient";

const ACCOUNT_PATH = "/api/v1/identity/auth/account";

export async function requestAccountDeletionOtp() {
  const response = await apiClient.post(`${ACCOUNT_PATH}/request-deletion-otp`);
  return response.data;
}

export async function deleteAccount(code) {
  const response = await apiClient.delete(ACCOUNT_PATH, {
    data: { code },
  });
  return response.data;
}

export async function resendAccountDeletionOtp() {
  const response = await apiClient.post(`${ACCOUNT_PATH}/resend-deletion-otp`);
  return response.data;
}