import { useEffect, useRef } from "react";

/**
 * Muat sisa halaman daftar selama filter kolom aktif.
 *
 * Halaman daftar mengambil data per halaman (mis. 20 baris). Filter kolom
 * dijalankan di client atas baris yang sudah dimuat, sehingga tanpa ini baris
 * pada halaman berikutnya tidak pernah ikut tersaring dan tabel menampilkan
 * "tidak ada data" padahal datanya ada di database.
 *
 * Permintaan dibatasi `maxPages` agar dataset besar tidak ditarik seluruhnya
 * hanya karena satu filter diisi; batas ini juga mencegah request berulang.
 */
export function useColumnFilterAutoLoad({ activeCount = 0, query, maxPages = 20, enabled = true } = {}) {
  const busy = useRef(false);
  const fetchNextPage = query?.fetchNextPage;
  const hasNextPage = Boolean(query?.hasNextPage);
  const isFetching = Boolean(query?.isFetchingNextPage || query?.isFetching);
  const pageCount = query?.data?.pages?.length || 0;

  useEffect(() => {
    if (!enabled || !activeCount || !fetchNextPage || !hasNextPage || isFetching || busy.current) return;
    if (pageCount >= maxPages) return;
    busy.current = true;
    Promise.resolve(fetchNextPage()).finally(() => {
      busy.current = false;
    });
  }, [activeCount, enabled, fetchNextPage, hasNextPage, isFetching, maxPages, pageCount]);
}
