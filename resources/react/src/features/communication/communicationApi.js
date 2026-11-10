import { apiClient } from "@/core/utils/apiClient";

export const COMMUNICATION_API_PREFIX = "/api/v1/communication";

function normalizeCommunicationPath(path) {
  const raw = String(path || "").trim();

  if (/^https?:\/\//i.test(raw)) {
    throw new Error("Communication API harus menggunakan path relatif melalui proxy /api.");
  }

  if (raw === COMMUNICATION_API_PREFIX) {
    return "/";
  }

  if (raw.startsWith(`${COMMUNICATION_API_PREFIX}/`)) {
    return raw.slice(COMMUNICATION_API_PREFIX.length);
  }

  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function buildCommunicationUrl(path, params = {}) {
  const cleanPath = normalizeCommunicationPath(path);
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") query.append(key, item);
      });
      return;
    }
    query.set(key, value);
  });

  const qs = query.toString();
  return `${COMMUNICATION_API_PREFIX}${cleanPath}${qs ? `${cleanPath.includes("?") ? "&" : "?"}${qs}` : ""}`;
}

export async function communicationRequest(path, options = {}) {
  const {
    params,
    method = "GET",
    body,
    headers,
    signal,
  } = options;
  const response = await apiClient.request({
    url: buildCommunicationUrl(path, params),
    method: String(method).toUpperCase(),
    data: body,
    headers,
    signal,
  });

  return response.data;
}
