import { lazy } from "react";

const RELOAD_FLAG = "marketku_chunk_reload_at";
const RELOAD_COOLDOWN_MS = 30_000;

function describe(error) {
  return String(error?.message || error || "");
}

/**
 * Apakah error ini benar-benar kegagalan memuat berkas chunk?
 *
 * Penting: jangan menilai dari `error.name === "TypeError"` saja. TypeError
 * juga muncul dari bug di dalam modul (mis. `undefined.map`), dan dulu kasus
 * itu dianggap gagal chunk → halaman melakukan `location.reload()` berulang
 * sehingga panel tampak "nyandet" lalu muncul layar "Silakan muat ulang".
 */
export function isChunkLoadError(error) {
  if (!error) return false;
  const message = describe(error).toLowerCase();
  const name = String(error?.name || "");

  if (name === "ChunkLoadError") return true;
  if (message.includes("failed to fetch dynamically imported module")) return true;
  if (message.includes("error loading dynamically imported module")) return true;
  if (message.includes("importing a module script failed")) return true;
  if (message.includes("unable to preload css")) return true;
  if (message.includes("loading chunk")) return true;
  if (message.includes("failed to fetch")) return true;
  return false;
}

function reloadOnce() {
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_FLAG) || 0);
    if (Number.isFinite(last) && Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    window.sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    // sessionStorage bisa diblokir (mode privat ketat); tetap coba reload.
  }
  window.location.reload();
  return true;
}

/**
 * `React.lazy` dengan percobaan ulang untuk kegagalan jaringan.
 *
 * Perilaku penting:
 * - Jatah percobaan direset setelah berhasil, jadi satu gangguan jaringan
 *   tidak mematikan percobaan ulang untuk navigasi berikutnya.
 * - Saat semua percobaan habis, halaman dimuat ulang paling banyak sekali per
 *   30 detik. Jika reload sudah pernah dicoba, error dilempar ke
 *   PageErrorBoundary agar pengguna melihat tombol "Muat ulang" alih-alih
 *   spinner yang berputar selamanya.
 */
export function lazyWithRetry(factory, options = {}) {
  const { retries = 2, delayMs = 300, reloadOnFinalFailure = true } = options;
  let attempts = 0;

  const load = async () => {
    try {
      const module = await factory();
      attempts = 0;
      return module;
    } catch (error) {
      if (!isChunkLoadError(error)) throw error;

      attempts += 1;
      if (attempts > retries) {
        attempts = 0;
        if (reloadOnFinalFailure && reloadOnce()) {
          // Halaman sedang dimuat ulang: biarkan Suspense menampilkan indikator.
          return new Promise(() => {});
        }
        throw new Error(
          "Halaman gagal dimuat karena berkas aplikasi tidak tersedia. Muat ulang halaman ini.",
        );
      }

      await new Promise((resolve) => window.setTimeout(resolve, delayMs * attempts));
      return load();
    }
  };

  return lazy(load);
}
