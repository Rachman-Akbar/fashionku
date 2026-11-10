import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getStoredAccessToken } from "@/core/utils/apiClient";

let activeToken = "";
let activeSignature = "";
let status = "idle";
const listeners = new Set();

function booleanValue(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function broadcastAuthEndpoint() {
  return "/api/broadcasting/auth";
}

function emitStatus(nextStatus) {
  status = nextStatus;
  listeners.forEach((listener) => listener(nextStatus));
}

function disconnectActiveEcho() {
  if (typeof window === "undefined" || !window.Echo) return;
  window.Echo.disconnect();
  delete window.Echo;
  activeToken = "";
  activeSignature = "";
  emitStatus("disconnected");
}

function bindConnectionStatus(echo) {
  const connection = echo?.connector?.pusher?.connection;
  if (!connection?.bind) {
    emitStatus("connecting");
    return;
  }

  connection.bind("connecting", () => emitStatus("connecting"));
  connection.bind("connected", () => emitStatus("connected"));
  connection.bind("unavailable", () => emitStatus("unavailable"));
  connection.bind("disconnected", () => emitStatus("disconnected"));
  connection.bind("failed", () => emitStatus("failed"));
  connection.bind("error", () => emitStatus("error"));
}

function resolveDriver() {
  const explicit = String(import.meta.env.VITE_BROADCAST_DRIVER || import.meta.env.VITE_BROADCAST_CONNECTION || "").trim().toLowerCase();
  if (["pusher", "reverb"].includes(explicit)) return explicit;
  return String(import.meta.env.VITE_PUSHER_APP_KEY || "").trim() ? "pusher" : "reverb";
}

function createPusherOptions(token) {
  const key = String(import.meta.env.VITE_PUSHER_APP_KEY || "").trim();
  if (!key) return null;
  const cluster = String(import.meta.env.VITE_PUSHER_APP_CLUSTER || "mt1").trim();
  const forceTLS = booleanValue(import.meta.env.VITE_PUSHER_FORCE_TLS, true);

  return {
    signature: ["pusher", key, cluster, forceTLS ? "tls" : "plain"].join("|"),
    options: {
      broadcaster: "pusher",
      key,
      cluster,
      forceTLS,
      enabledTransports: ["ws", "wss"],
      authEndpoint: broadcastAuthEndpoint(),
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };
}

function createReverbOptions(token) {
  const key = String(import.meta.env.VITE_REVERB_APP_KEY || "").trim();
  if (!key) return null;

  const useDevProxy = import.meta.env.DEV && !booleanValue(import.meta.env.VITE_REVERB_DIRECT, false);
  const forceTLS = useDevProxy
    ? window.location.protocol === "https:"
    : booleanValue(import.meta.env.VITE_REVERB_FORCE_TLS, window.location.protocol === "https:");
  const wsPort = useDevProxy
    ? Number(window.location.port || (forceTLS ? 443 : 5173))
    : Number(import.meta.env.VITE_REVERB_PORT || (forceTLS ? 443 : 8080));
  const host = useDevProxy
    ? window.location.hostname
    : String(import.meta.env.VITE_REVERB_HOST || window.location.hostname).trim();

  return {
    signature: ["reverb", key, host, wsPort, forceTLS ? "tls" : "plain", useDevProxy ? "proxy" : "direct"].join("|"),
    options: {
      broadcaster: "reverb",
      key,
      wsHost: host,
      wsPort,
      wssPort: wsPort,
      forceTLS,
      enabledTransports: ["ws", "wss"],
      disableStats: true,
      authEndpoint: broadcastAuthEndpoint(),
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };
}

export function getEchoStatus() {
  return status;
}

export function subscribeEchoStatus(listener) {
  if (typeof listener !== "function") return () => {};
  listeners.add(listener);
  listener(status);
  return () => listeners.delete(listener);
}

export function resetEcho() {
  disconnectActiveEcho();
}

export function getEcho() {
  if (typeof window === "undefined") return null;

  const token = getStoredAccessToken();
  if (!token) {
    emitStatus("unauthenticated");
    return null;
  }

  const driver = resolveDriver();
  const config = driver === "pusher" ? createPusherOptions(token) : createReverbOptions(token);

  if (!config) {
    emitStatus("not_configured");
    return null;
  }

  if (window.Echo && activeToken === token && activeSignature === config.signature) {
    return window.Echo;
  }

  if (window.Echo) {
    disconnectActiveEcho();
  }

  window.Pusher = Pusher;
  activeToken = token;
  activeSignature = config.signature;
  emitStatus("connecting");
  window.Echo = new Echo(config.options);
  bindConnectionStatus(window.Echo);
  return window.Echo;
}

if (typeof window !== "undefined") {
  window.addEventListener("marketku:session-changed", resetEcho);
  window.addEventListener("marketku:unauthorized", resetEcho);
}
