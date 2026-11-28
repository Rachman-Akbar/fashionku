const STORAGE_KEY = "ziip.hpp.lastSeen";
const EVENT = "ziip:hpp-seen";

export function getHppLastSeen() {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function markHppSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // storage tidak tersedia — abaikan
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeHppSeen(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}