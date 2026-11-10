export function ensureCanonicalDevOrigin() {
  if (typeof window === "undefined" || !import.meta.env.DEV) {
    return false;
  }

  const canonicalHost = import.meta.env.VITE_DEV_BROWSER_HOST || "127.0.0.1";
  const canonicalPort = String(import.meta.env.VITE_DEV_BROWSER_PORT || "5173");
  const currentHost = window.location.hostname;
  const currentPort = window.location.port || (window.location.protocol === "https:" ? "443" : "80");

  if (currentHost !== "localhost" || currentPort !== canonicalPort) {
    return false;
  }

  const target = new URL(window.location.href);
  target.hostname = canonicalHost;
  target.port = canonicalPort;
  window.location.replace(target.toString());
  return true;
}
