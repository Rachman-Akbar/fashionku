import { apiClient } from "@/core/utils/apiClient";

const AUTH_PATH = "/api/v1/identity/auth";

export class EmailVerificationEngineError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "EmailVerificationEngineError";
    this.cause = cause;
  }
}

export function toEmailVerificationError(error, fallback = "Gagal memverifikasi email.") {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return new EmailVerificationEngineError(responseData.message, error);
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const first = Object.values(responseData.errors).flat().find(Boolean);

    if (first) {
      return new EmailVerificationEngineError(String(first), error);
    }
  }

  if (typeof error?.message === "string" && error.message.trim() && !/^request failed/i.test(error.message)) {
    return new EmailVerificationEngineError(error.message, error);
  }

  return new EmailVerificationEngineError(fallback, error);
}

export const emailVerificationEngine = Object.freeze({
  async sendCode() {
    const response = await apiClient.post(`${AUTH_PATH}/send-verification-code`, {});
    return response.data;
  },

  async sendPasswordResetCode(email) {
    const targetEmail = String(email || "").trim();

    if (!targetEmail) {
      throw new EmailVerificationEngineError("Email wajib diisi.");
    }

    const response = await apiClient.post(`${AUTH_PATH}/send-password-reset-code`, {
      email: targetEmail,
    });

    return response.data;
  },

  async verifyEmailCode(email, code) {
    const response = await apiClient.post(`${AUTH_PATH}/verify-email-code`, {
      email,
      code,
    });

    return response.data;
  },

  async resetPasswordWithCode({ email, code, password, password_confirmation }) {
    const response = await apiClient.post(`${AUTH_PATH}/reset-password-with-code`, {
      email,
      code,
      password,
      password_confirmation,
    });

    return response.data;
  },
});

