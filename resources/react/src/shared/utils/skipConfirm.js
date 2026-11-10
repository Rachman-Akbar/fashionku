function todayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function storageKey(scope) {
  return `ziip.skip-confirm:${scope}`;
}

export function isDeleteConfirmSkipped(scope = "delete") {
  try {
    return window.localStorage.getItem(storageKey(scope)) === todayString();
  } catch {
    return false;
  }
}

export function setDeleteConfirmSkipped(active, scope = "delete") {
  try {
    if (active) window.localStorage.setItem(storageKey(scope), todayString());
    else window.localStorage.removeItem(storageKey(scope));
  } catch {
    // storage tidak tersedia (private mode) — abaikan
  }
}