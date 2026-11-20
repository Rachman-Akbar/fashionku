const EVENT_NAME = "app:navigation-progress";

/**
 * Menandai dimulainya perpindahan halaman.
 *
 * Dipakai untuk navigasi yang tidak mengubah URL, misalnya berpindah tab
 * di panel admin/seller, sehingga indikator loading tetap muncul.
 */
export function startNavigationProgress() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

/**
 * Berlangganan sinyal mulai navigasi. Mengembalikan fungsi unsubscribe.
 */
export function subscribeNavigationProgress(listener) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
