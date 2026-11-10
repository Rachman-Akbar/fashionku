import { API_BASE_URL } from "@/core/utils/apiClient";

function normalizeOrigin(value = "") {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

export function toAppPath(value, fallback = "/") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  if (raw.startsWith("#")) return raw;

  try {
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const apiOrigin = normalizeOrigin(API_BASE_URL);
    const parsed = new URL(raw, currentOrigin || apiOrigin || "http://localhost");
    const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
    const isCurrentOrigin = Boolean(currentOrigin && parsed.origin === currentOrigin);
    const isApiOrigin = Boolean(apiOrigin && parsed.origin === apiOrigin);
    const isLegacyViteTarget = localHosts.has(parsed.hostname) && ["5173", "4173"].includes(parsed.port);

    if (isCurrentOrigin || isApiOrigin || isLegacyViteTarget) {
      return `${parsed.pathname || "/"}${parsed.search || ""}${parsed.hash || ""}`;
    }

    return parsed.toString();
  } catch {
    return raw.startsWith("/") ? raw : `/${raw.replace(/^\/+/, "")}`;
  }
}

export function isExternalUrl(value) {
  const raw = String(value || "").trim();
  if (!/^https?:\/\//i.test(raw)) return false;
  return /^https?:\/\//i.test(toAppPath(raw)) && toAppPath(raw) === raw;
}
