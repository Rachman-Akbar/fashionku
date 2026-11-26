import { useMemo } from "react";
import { usePanelTabs } from "@/shared/layout/tabs";
import { exportExcel } from "./excelService";
import { toastError } from "@/shared/utils/userFeedback";

export function useExcelWorkspace({ module, label, selectedRows = [], onCompleted, allowImport = true, allowExport = true, getRowId, rows = [] }) {
  const tabs = usePanelTabs();
  const selectedIds = useMemo(
    () => selectedRows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean),
    [selectedRows, getRowId]
  );
  const allIds = useMemo(
    () => rows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean),
    [rows, getRowId]
  );
  const activeOperation = ["import", "import-progress", "export"].includes(tabs?.activeTab?.type) ? tabs.activeTab : null;

  const openImport = () => tabs?.openOperationTab("import", { label: `Import ${label}`, payload: { module, label } });

  // Ekspor langsung mengunduh file (tanpa membuka tab/notifikasi apa pun).
  const openExport = async () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : allIds;
    if (!targetIds.length && rows.length === 0) {
      toastError(label, "Tidak ada data untuk diekspor.");
      return;
    }
    try {
      await exportExcel(module, targetIds);
    } catch (error) {
      toastError(label, error?.message || "Export gagal.");
    }
  };

  return {
    activeOperation,
    selectedIds,
    openImport,
    openExport,
    close: () => tabs?.closeActiveTab(),
    complete() {
      tabs?.markListDirty();
      onCompleted?.();
    },
    actions: [
      ...(allowImport ? [{ key: `${module}-import`, label: `Import ${label}`, icon: "upload_file", requiresSelection: false, onClick: openImport }] : []),
      ...(allowExport ? [{ key: `${module}-export`, label: selectedIds.length ? `Export ${selectedIds.length} ${label}` : `Export ${label}`, icon: "download", requiresSelection: false, onClick: openExport }] : []),
    ],
  };
}