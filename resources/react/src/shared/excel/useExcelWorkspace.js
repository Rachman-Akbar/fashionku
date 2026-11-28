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
  const openImport = () => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    tabs?.openOperationTab("excel-import", {
      id,
      label: `Import ${label}`,
      payload: { module, label, stage: "setup" },
    });
  };

  const openExport = async () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : [];
    try {
      await exportExcel(module, targetIds);
    } catch (error) {
      toastError(label, error?.message || "Export gagal.");
    }
  };

  return {
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