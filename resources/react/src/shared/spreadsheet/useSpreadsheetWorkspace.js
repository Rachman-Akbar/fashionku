import { useMemo } from "react";
import { usePanelTabs } from "@/shared/layout/tabs";
import { exportSpreadsheet, getSpreadsheetError } from "@/shared/spreadsheet/spreadsheetService";
import { toastSuccess, toastError } from "@/shared/utils/userFeedback";

export function useSpreadsheetWorkspace({ module, label, selectedRows = [], onCompleted, allowImport = true, allowExport = true, allowBulkDelete = true, getRowId, rows = [] }) {
  const tabs = usePanelTabs();
  const selectedIds = useMemo(() => selectedRows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean), [selectedRows, getRowId]);
  const allIds = useMemo(() => rows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean), [rows, getRowId]);
  const activeOperation = ["import", "export", "bulk-delete"].includes(tabs?.activeTab?.type) ? tabs.activeTab : null;

  const openImport = () => tabs?.openOperationTab("import", { label: `Import ${label}`, payload: { module, label } });
  const openExport = async () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : allIds;
    if (!targetIds.length && rows.length === 0) {
      toastError(label, "Tidak ada data untuk diekspor.");
      return;
    }
    try {
      const result = await exportSpreadsheet(module, targetIds);
      toastSuccess(label, `Export selesai: ${result.filename}`);
    } catch (error) {
      toastError(label, getSpreadsheetError(error));
    }
  };
  const openBulkDelete = () => tabs?.openOperationTab("bulk-delete", { label: `Hapus ${label}`, payload: { module, label, ids: selectedIds, rows: selectedRows } });

  return {
    activeOperation,
    selectedIds,
    openImport,
    openExport,
    openBulkDelete,
    close: () => tabs?.closeActiveTab(),
    complete() {
      tabs?.markListDirty();
      onCompleted?.();
    },
    actions: [
      ...(allowImport ? [{ key: `${module}-import`, label: `Import ${label}`, icon: "upload_file", requiresSelection: false, onClick: openImport }] : []),
      ...(allowExport ? [{ key: `${module}-export`, label: selectedIds.length ? `Export ${selectedIds.length} ${label}` : `Export ${label}`, icon: "download", requiresSelection: false, onClick: openExport }] : []),
      ...(allowBulkDelete ? [{ key: `${module}-delete`, label: `Hapus ${label} terpilih`, icon: "delete", danger: true, requiresSelection: true, onClick: openBulkDelete }] : []),
    ],
  };
}
