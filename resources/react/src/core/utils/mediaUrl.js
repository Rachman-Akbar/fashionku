function trimTrailingSlash(value = "") {
  return String(value || "").trim().replace(/\/+$/, "");
}

export function getAssetBaseUrl() {
  if (typeof window === "undefined") return "";
  return trimTrailingSlash(window.location.origin);
}

function resolveLocalAbsoluteUrl(raw) {
  try {
    const parsed = new URL(raw);
    const storageIndex = parsed.pathname.indexOf("/storage/");
    const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
    const isLocalHost = localHosts.has(parsed.hostname);

    if (import.meta.env.DEV) {
      if (!isLocalHost && storageIndex >= 0) {
        return `${getAssetBaseUrl()}${parsed.pathname.slice(storageIndex)}${parsed.search}${parsed.hash}`;
      }

      return raw;
    }

    if (!isLocalHost) {
      return raw;
    }

    if (storageIndex >= 0) {
      return `${getAssetBaseUrl()}${parsed.pathname.slice(storageIndex)}${parsed.search}${parsed.hash}`;
    }

    return raw;
  } catch {
    const storageIndex = raw.indexOf("/storage/");

    if (storageIndex >= 0) {
      return `${getAssetBaseUrl()}${raw.slice(storageIndex)}`;
    }

    return raw;
  }
}

export function resolveMediaUrl(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^(data:|blob:)/i.test(raw)) return raw;

  if (/^https?:\/\//i.test(raw)) {
    return resolveLocalAbsoluteUrl(raw);
  }

  if (raw.startsWith("//")) {
    const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
    return `${protocol}${raw}`;
  }

  const base = getAssetBaseUrl();
  const normalized = raw.replace(/^\/+/, "");
  const storagePath = normalized.startsWith("storage/")
    ? normalized
    : `storage/${normalized}`;

  return base ? `${base}/${storagePath}` : `/${storagePath}`;
}
