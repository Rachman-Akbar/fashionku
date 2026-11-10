import { apiClient } from "@/core/utils/apiClient";

const AUTH_PATH = "/api/v1/identity/auth";
const RECEIPT_PATH = "/api/v1/ppob/receipts";

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

// ── Receipt Email Engine ────────────────────────────────────────────────

export class ReceiptEmailEngineError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "ReceiptEmailEngineError";
    this.cause = cause;
  }
}

export function toReceiptEmailError(error, fallback = "Gagal mengirim bukti pembayaran.") {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return new ReceiptEmailEngineError(responseData.message, error);
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const first = Object.values(responseData.errors).flat().find(Boolean);
    if (first) return new ReceiptEmailEngineError(String(first), error);
  }

  if (typeof error?.message === "string" && error.message.trim() && !/^request failed/i.test(error.message)) {
    return new ReceiptEmailEngineError(error.message, error);
  }

  return new ReceiptEmailEngineError(fallback, error);
}

export const receiptEmailEngine = Object.freeze({
  async sendEmail(referenceOrId) {
    const ref = String(referenceOrId || "").trim();

    if (!ref) {
      throw new ReceiptEmailEngineError("Referensi bukti pembayaran wajib diisi.");
    }

    const response = await apiClient.post(
      `${RECEIPT_PATH}/${encodeURIComponent(ref)}/send-email`,
      {},
    );

    return response.data;
  },
});

// ── Status Notification Engines ──────────────────────────────────────────
// Memberi tahu buyer lewat chat + email saat order disetujui/diproses,
// order selesai, atau transaksi produk digital (pulsa, listrik, dll) selesai.
// Backend idempotent: memanggil berulang untuk status yang sama tidak
// menghasilkan chat/email ganda.

const ORDER_PATH = "/api/v1/order/orderings";
const PPOB_TRANSACTION_PATH = "/api/v1/ppob/transactions";

export class StatusNotificationEngineError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "StatusNotificationEngineError";
    this.cause = cause;
  }
}

export function toStatusNotificationError(error, fallback = "Gagal mengirim notifikasi status.") {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return new StatusNotificationEngineError(responseData.message, error);
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const first = Object.values(responseData.errors).flat().find(Boolean);
    if (first) return new StatusNotificationEngineError(String(first), error);
  }

  if (typeof error?.message === "string" && error.message.trim() && !/^request failed/i.test(error.message)) {
    return new StatusNotificationEngineError(error.message, error);
  }

  return new StatusNotificationEngineError(fallback, error);
}

export const orderStatusEngine = Object.freeze({
  async notify(referenceOrId, status) {
    const ref = String(referenceOrId || "").trim();

    if (!ref) {
      throw new StatusNotificationEngineError("Order wajib diisi.");
    }

    const payload = status ? { status: String(status).trim() } : {};
    const response = await apiClient.post(
      `${ORDER_PATH}/${encodeURIComponent(ref)}/notify-status`,
      payload,
    );

    return response.data;
  },

  async notifyApproved(referenceOrId) {
    return this.notify(referenceOrId, "processing");
  },

  async notifyCompleted(referenceOrId) {
    return this.notify(referenceOrId, "completed");
  },
});

export const ppobStatusEngine = Object.freeze({
  async notify(referenceOrId) {
    const ref = String(referenceOrId || "").trim();

    if (!ref) {
      throw new StatusNotificationEngineError("Transaksi digital wajib diisi.");
    }

    const response = await apiClient.post(
      `${PPOB_TRANSACTION_PATH}/${encodeURIComponent(ref)}/notify-status`,
      {},
    );

    return response.data;
  },
});