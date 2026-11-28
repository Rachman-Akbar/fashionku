import { useLocation } from "react-router-dom";

const PANEL_PREFIXES = ["/admin"];
/** Apakah path ini bagian dari panel admin (bukan permukaan buyer)? */
export function isBuyerSurfacePath(pathname = "") {
  return !PANEL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Panel admin tidak membutuhkan data keranjang & wishlist.
 *
 * Tanpa pembatas ini, provider global tetap memanggil `/order/carts` dan
 * `/order/wishlist` setiap panel dibuka. Di server dev yang single-thread
 * request itu memblokir request lain sehingga halaman panel terasa "nyandet".
 */
export function useBuyerSurface() {
  const { pathname } = useLocation();
  return isBuyerSurfacePath(pathname);
}
