const STORAGE_KEY = "fashionku_admin_mode";

const EVENT = "fashionku:admin-mode-changed";

let current = read();

function read() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "monitor" ? "monitor" : "seller";
  } catch {
    return "seller";
  }
}

export function getAdminMode() {
  return current;
}

export function setAdminMode(mode) {
  const next = mode === "monitor" ? "monitor" : "seller";
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore storage errors
  }
  current = next;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { mode: next } }));
}

export function subscribeAdminMode(listener) {
  const handler = () => listener(getAdminMode());
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
