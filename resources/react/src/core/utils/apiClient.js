import axios from "axios";

export const BASE_TOKEN_KEY = "marketku_auth_token";
export const BASE_SESSION_KEY = "marketku_auth_session";
export const WINDOW_TOKEN_KEY = "marketku_window_auth_token";
export const WINDOW_SESSION_KEY = "marketku_window_auth_session";

export const API_BASE_URL = "";

function migrateLegacySession() {
  if (typeof window === "undefined") {
    return;
  }

  const sessionStorage = window.sessionStorage;
  const localStorage = window.localStorage;
  const legacyToken = sessionStorage.getItem(BASE_TOKEN_KEY);
  const legacySession = sessionStorage.getItem(BASE_SESSION_KEY);
  const baseToken = localStorage.getItem(BASE_TOKEN_KEY);
  const baseSession = localStorage.getItem(BASE_SESSION_KEY);

  if (!baseToken && legacyToken) {
    localStorage.setItem(BASE_TOKEN_KEY, legacyToken);
  }

  if (!baseSession && legacySession) {
    localStorage.setItem(BASE_SESSION_KEY, legacySession);
  }

  sessionStorage.removeItem(BASE_TOKEN_KEY);
  sessionStorage.removeItem(BASE_SESSION_KEY);
}

if (typeof window !== "undefined") {
  migrateLegacySession();
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    window.sessionStorage.getItem(WINDOW_TOKEN_KEY) ||
    window.localStorage.getItem(BASE_TOKEN_KEY) ||
    ""
  );
}

export function getStoredSessionScope() {
  if (typeof window === "undefined") {
    return "base";
  }

  return window.sessionStorage.getItem(WINDOW_TOKEN_KEY) ? "window" : "base";
}

function hasAuthorizationHeader(headers) {
  if (!headers) {
    return false;
  }

  if (typeof headers.get === "function") {
    return Boolean(headers.get("Authorization"));
  }

  return Boolean(headers.Authorization || headers.authorization);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  config.headers = config.headers || {};

  if (token && !hasAuthorizationHeader(config.headers)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
    } else {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || "");
    const isPublicAuthRequest =
      url.includes("/password-login") ||
      url.includes("/password-register") ||
      url.includes("/firebase-login") ||
      url.includes("/forgot-password");

    if (
      status === 401 &&
      !isPublicAuthRequest &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(
        new CustomEvent("marketku:unauthorized", {
          detail: {
            scope: getStoredSessionScope(),
          },
        }),
      );
    }

    return Promise.reject(error);
  },
);

export function unwrapApiData(payload) {
  if (payload?.data?.data !== undefined) {
    return payload.data.data;
  }

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload;
}

export function unwrapCollection(payload) {
  const source = payload?.data?.data ?? payload?.data ?? payload ?? [];

  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.data)) {
    return source.data;
  }

  return [];
}

export function getApiMessage(
  error,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
) {
  const data = error?.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat().find(Boolean);
    if (first) {
      return String(first);
    }
  }

  return fallback;
}
