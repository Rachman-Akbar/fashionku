import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Menyediakan scrollbar horizontal di atas tabel yang selalu bisa dijangkau,
 * tersinkron dua arah dengan kontainer scroll tabel (yang biasanya berada di
 * bawah daftar panjang / infinite scroll).
 *
 * Pakai:
 *   const scroll = useHorizontalScroll();
 *   <TopScrollbar {...scroll} />
 *   <div ref={scroll.scrollRef} onScroll={scroll.handleTableScroll}>…</div>
 */
export function useHorizontalScroll() {
  const scrollRef = useRef(null);
  const topScrollRef = useRef(null);
  const syncingRef = useRef(null);
  const [metrics, setMetrics] = useState({ scrollWidth: 0, clientWidth: 0 });

  const measure = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const next = { scrollWidth: node.scrollWidth, clientWidth: node.clientWidth };
    setMetrics((current) =>
      current.scrollWidth === next.scrollWidth && current.clientWidth === next.clientWidth ? current : next,
    );
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    const onWindowResize = () => measure();
    window.addEventListener("resize", onWindowResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [measure]);

  // Isi tabel bisa bertambah/berkurang tanpa mengubah ukuran kotak kontainernya
  // (mis. kolom baru dicentang, baris termuat). Ukur ulang setiap render supaya
  // scrollbar atas tahu kapan harus muncul/hilang.
  useEffect(() => {
    const frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(cb, 0);
    const id = frame(measure);
    return () => {
      if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(id);
      else clearTimeout(id);
    };
  });

  const sync = useCallback((from, to, value) => {
    syncingRef.current = from;
    const target = to.current;
    if (target && Math.abs(target.scrollLeft - value) > 1) target.scrollLeft = value;
    const frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb) => setTimeout(cb, 0);
    frame(() => {
      if (syncingRef.current === from) syncingRef.current = null;
    });
  }, []);

  const handleTableScroll = useCallback(
    (event) => {
      const node = event.currentTarget;
      measure();
      if (syncingRef.current === "top") return;
      sync("table", topScrollRef, node.scrollLeft);
    },
    [measure, sync],
  );

  const handleTopScroll = useCallback(
    (event) => {
      if (syncingRef.current === "table") return;
      sync("top", scrollRef, event.currentTarget.scrollLeft);
    },
    [sync],
  );

  const hasOverflow = metrics.scrollWidth - metrics.clientWidth > 1;

  return { scrollRef, topScrollRef, metrics, hasOverflow, handleTableScroll, handleTopScroll };
}
