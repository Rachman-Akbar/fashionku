import { useEffect } from "react";

function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}

export function useSaveShortcut({ enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handler = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      if (event.key.toLowerCase() !== "s") return;

      // Biarkan shortcut menarget tombol Simpan pada form CRUD yang sedang aktif.
      event.preventDefault();

      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      const visible = buttons.filter((button) => !button.disabled && isVisible(button));
      if (!visible.length) return;

      // Diutamakan tombol pada modal/dialog yang sedang terbuka (terakhir di DOM),
      // lalu fallback ke tombol simpan pada halaman.
      const target = visible[visible.length - 1];
      target.click();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled]);
}