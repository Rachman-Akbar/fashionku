import { useMemo, useState } from "react";
import { usePanelTabs } from "@/shared/layout/tabs";
import { exportExcel } from "./excelService";
import { toastError } from "@/shared/utils/userFeedback";

export function useExcelWorkspace({ module, label, selectedRows = [], onCompleted, allowImport = true, allowExport = true, getRowId, rows = [] }) {
  const tabs = usePanelTabs();
  // Pilihan import (download template / upload file) tampil sebagai modal biasa,
  // BUKAN tab. Tab baru hanya dibuka saat proses import benar-benar dimulai.
  const [importOpen, setImportOpen] = useState(false);
  const selectedIds = useMemo(
    () => selectedRows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean),
    [selectedRows, getRowId]
  );
  const allIds = useMemo(
    () => rows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean),
    [rows, getRowId]
  );
  // Tab progres import adalah satu-satunya operasi yang hidup sebagai tab dan
  // dirender oleh ImportProgressHost di level layout.
  const openImport = () => setImportOpen(true);
  const closeImport = () => setImportOpen(false);

  // Dipanggil dari modal pilihan setelah user menekan "Mulai Import".
  // Modal pilihan ditutup lalu tab progres dibuka untuk menampilkan loading bar.
  // runId unik memastikan proses import hanya berjalan sekali per aksi.
  const beginImport = (payload = {}) => {
    setImportOpen(false);
    const runId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    tabs?.openOperationTab("import-progress", {
      label: `Import ${label}`,
      payload: { module, label, createMissingRelations: false, runId, ...payload },
    });
  };

  // Ekspor langsung mengunduh file (tanpa membuka tab/notifikasi apa pun).
  // Tanpa pilihan baris = ekspor seluruh data; dengan pilihan = hanya baris terpilih.
  const openExport = async () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : [];
    try {
      await exportExcel(module, targetIds);
    } catch (error) {
      toastError(label, error?.message || "Export gagal.");
    }
  };

  return {
    importOpen,
    selectedIds,
    openImport,
    closeImport,
    beginImport,
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