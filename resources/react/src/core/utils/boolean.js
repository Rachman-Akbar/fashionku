export function toBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on", "active", "published", "approved"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "inactive", "disabled", "draft", "rejected"].includes(normalized)) return false;
  return fallback;
}
