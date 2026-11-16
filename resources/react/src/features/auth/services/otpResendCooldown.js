import { getApiMessage } from "@/core/utils/apiClient";

// Backend membatasi kirim ulang OTP maksimal 1x per 60 detik
// (OtpSecurityEngine::RESEND_COOLDOWN_SECONDS) dan membalas 429 + header
// Retry-After. Helper ini memastikan frontend selalu menampilkan hitung mundur
// ketika backend menolak, bukan hanya menampilkan pesan error.

export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function buildResendExpiry(seconds = OTP_RESEND_COOLDOWN_SECONDS) {
  return nowInSeconds() + Math.max(1, Number(seconds) || OTP_RESEND_COOLDOWN_SECONDS);
}

function readRetryAfter(error) {
  const headers = error?.response?.headers;
  const raw =
    (typeof headers?.get === "function"
      ? headers.get("retry-after")
      : null) ??
    headers?.["retry-after"] ??
    headers?.["Retry-After"] ??
    error?.response?.data?.retry_after ??
    error?.response?.data?.retryAfter;

  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? Math.ceil(parsed) : null;
}

export function getResendCooldownSeconds(error) {
  const status = Number(error?.response?.status || 0);
  const message = String(error?.response?.data?.message || error?.message || "").toLowerCase();
  const isRateLimited =
    status === 429 ||
    message.includes("terlalu banyak permintaan") ||
    message.includes("rate limit") ||
    message.includes("coba lagi nanti");

  if (!isRateLimited) {
    return 0;
  }

  return readRetryAfter(error) || OTP_RESEND_COOLDOWN_SECONDS;
}

/**
 * Jika error berasal dari rate limit OTP, set hitung mundur resend dan
 * kembalikan sisa detiknya (0 bila bukan rate limit).
 */
export function applyResendCooldown(error, setResendExpiry, storageKey) {
  const seconds = getResendCooldownSeconds(error);

  if (!seconds) {
    return 0;
  }

  const expiry = buildResendExpiry(seconds);
  setResendExpiry(expiry);

  if (storageKey && typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, String(expiry));
  }

  return seconds;
}

export function getResendErrorMessage(error, fallback) {
  return getApiMessage(error, fallback);
}
