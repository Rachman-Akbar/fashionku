export function isOperatorRole(role) {
  const normalized = String(role || "").toLowerCase().trim();
  return normalized === "admin";
}

export function isBuyerRole(role) {
  return String(role || "").toLowerCase().trim() === "buyer";
}
