import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Mengukur tinggi toolbar daftar (search bar) yang sticky di atas isi halaman.
 *
 * Hasilnya dipakai sebagai CSS variable `--list-toolbar-h` pada container,
 * sehingga header tabel bisa `sticky top-[var(--list-toolbar-h)]` dan tidak
 * tertutup toolbar pencarian saat halaman di-scroll.
 *
 * Toolbar memakai `position: sticky; top: 0` sehingga tetap menempel tepat di
 * bawah header + tab bar panel (keduanya berada di luar area scroll `<main>`)
 * selama halaman digulir. Karena sticky tetap berada di alur layout, tingginya
 * TIDAK perlu di-offset lewat padding-top pada konten.
 *
 * Pengukuran memakai polling singkat (requestAnimationFrame) karena tinggi
 * toolbar berubah setelah data/filter selesai dimuat, ditambah ResizeObserver
 * agar perubahan tinggi (wrap di layar kecil, munculnya filter) ikut terukur.
 */
export function useStickyToolbarHeight() {
  const ref = useRef(null);
  const observerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    let frame = 0;
    let ticks = 0;
    let stableTicks = 0;
    let lastHeight = -1;
    const measure = () => {
      const element = ref.current;
      if (element) {
        const next = Math.round(element.getBoundingClientRect().height || 0);
        if (next === lastHeight) stableTicks += 1;
        else {
          lastHeight = next;
          stableTicks = 0;
        }
        setHeight((previous) => (previous === next ? previous : next));
      }
      ticks += 1;
      // Berhenti lebih awal setelah tinggi stabil: pengukuran memaksa layout,
      // jadi jangan terus berjalan di halaman yang tabelnya besar.
      if (ticks < 150 && stableTicks < 12) frame = requestAnimationFrame(measure);
    };
    measure();

    // Pertahankan pengukuran setelah polling awal selesai: perubahan tinggi
    // saat resize window atau toolbar membungkus (filter muncul/hilang) harus
    // ikut terupdate supaya `--list-toolbar-h` selalu sama dengan toolbar.
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => {
        const element = ref.current;
        if (!element) return;
        const next = Math.round(element.getBoundingClientRect().height || 0);
        setHeight((previous) => (previous === next ? previous : next));
      });
      observerRef.current = observer;
      if (ref.current) observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(frame);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const connect = useCallback((node) => {
    ref.current = node;
    const observer = observerRef.current;
    if (!observer) return;
    observer.disconnect();
    if (node) observer.observe(node);
  }, []);

  return {
    connect,
    style: { "--list-toolbar-h": `${height}px` },
    height,
    // Sticky: search bar menempel tepat di bawah header + tab bar panel yang
    // posisinya fixed (di luar area scroll `<main>`), jadi selalu terlihat
    // saat halaman digulir.
    toolbarStyle: { position: "sticky", top: 0, zIndex: 20 },
    // Sticky tetap berada di alur layout, sehingga konten tidak perlu
    // padding-top kompensasi seperti saat toolbar berposition absolute.
    contentStyle: { paddingTop: 0 },
  };
}
