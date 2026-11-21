import { cn } from "@/shared/utils/utils";
import { useStickyToolbarHeight } from "@/shared/hooks/useStickyToolbarHeight";

/**
 * Kerangka halaman daftar: toolbar (pencarian) + isi daftar.
 *
 * - Hanya ada SATU area scroll (yaitu `<main>` di layout panel). Sebelumnya
 *   toolbar dan isi daftar punya scroll sendiri-sendiri sehingga header tabel
 *   yang sticky "tenggelam" di bawah toolbar dan tampak hilang.
 * - Toolbar diukur tingginya lalu dibagikan sebagai CSS variable
 *   `--list-toolbar-h`, supaya header tabel bisa sticky tepat di bawah toolbar.
 * - Toolbar menggunakan position sticky sehingga search bar tetap menempel di
 *   bawah header + tab bar panel (fixed) saat halaman digulir, tanpa perlu
 *   padding-top pada konten.
 */
export function ListPageFrame({ toolbar, children, className = "" }) {
  const { connect, style, toolbarStyle, contentStyle } = useStickyToolbarHeight();

  return (
    <div className={cn("relative min-h-0 w-full min-w-0", className)} style={style}>
      {toolbar ? (
        <div ref={connect} className="bg-white" style={toolbarStyle}>
          {toolbar}
        </div>
      ) : null}
      <div className="min-h-0 w-full min-w-0" style={contentStyle}>{children}</div>
    </div>
  );
}
