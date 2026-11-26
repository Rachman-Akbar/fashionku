import { usePanelTabs } from "@/shared/layout/tabs";
import { ImportProgressTab } from "@/shared/excel/ImportProgressTab";

/**
 * Merender konten tab "import-progress" secara persisten di level layout.
 *
 * Modal pilihan import (ExcelImportExportModal) hidup di toolbar daftar yang
 * akan unmount saat tab progres aktif, sehingga dulu tab progres tampil blank.
 * Host ini membaca payload dari tab import-progress dan menampilkan loading bar
 * + hasil import tanpa bergantung pada halaman daftar yang sedang aktif.
 *
 * Komponen progres TIDAK di-unmount saat pindah tab (hanya disembunyikan),
 * sehingga efek import tidak berjalan ulang setiap kali tab dibuka kembali.
 * `key` diikat ke runId unik agar proses baru (runId baru) tetap memicu mount
 * sekali, sedangkan pindah tab yang sama tidak mengulang.
 */
export function ImportProgressHost() {
  const tabs = usePanelTabs();
  const importTab = tabs?.tabs?.find((tab) => tab.type === "import-progress") || null;

  if (!importTab) return null;

  const payload = importTab.payload || {};
  const isActive = tabs.activeTab?.id === importTab.id;
  const finish = () => tabs?.markListDirty?.(importTab.parentId);
  const close = () => tabs?.closeActiveTab?.();

  return (
    <div className={isActive ? "h-full min-h-[60vh] w-full" : "hidden"} aria-hidden={!isActive}>
      <ImportProgressTab
        key={payload.runId || importTab.id}
        module={payload.module}
        label={payload.label}
        file={payload.file}
        importMode={payload.importMode}
        createMissingRelations={payload.createMissingRelations}
        onComplete={finish}
        onCancel={close}
      />
    </div>
  );
}