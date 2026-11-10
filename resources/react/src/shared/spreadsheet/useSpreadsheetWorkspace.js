import { useMemo } from "react";
import { usePanelTabs } from "@/shared/layout/tabs";

export function useSpreadsheetWorkspace({ module, label, selectedRows = [], onCompleted, allowImport = true, allowExport = true, allowBulkDelete = true, getRowId }) {
  const tabs = usePanelTabs();
  const selectedIds = useMemo(() => selectedRows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean), [selectedRows, getRowId]);
  const activeOperation = ["import", "export", "bulk-delete"].includes(tabs?.activeTab?.type) ? tabs.activeTab : null;

  const openImport = () => tabs?.openOperationTab("import", { label: `Import ${label}`, payload: { module, label } });
  const openExport = () => tabs?.openOperationTab("export", { label: `Export ${label}`, payload: { module, label, ids: selectedIds } });
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
