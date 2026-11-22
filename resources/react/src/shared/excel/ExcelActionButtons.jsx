import { useState } from "react";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
// Import langsung ke modul tujuan (bukan lewat barrel ./index) supaya tidak
// terjadi circular dependency: barrel mengekspor ExcelActionButtons, jadi
// mengimpor barrel dari file ini membuat Rollup memecah chunk bermasalah.
import { ExcelImportExportModal } from "./ExcelImportExportModal";
import { useExcelWorkspace } from "./useExcelWorkspace";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

export function ExcelActionButtons({
  module,
  label,
  selection,
  rows,
  onRefresh,
  onCompleted,
  getRowId,
  allowImport = true,
  allowExport = true,
  allowDelete = true,
}) {
  const center = useNotificationCenter();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const workspace = useExcelWorkspace({
    module,
    label,
    selectedRows: selection.selectedRows,
    onCompleted,
    allowImport,
    allowExport,
    allowBulkDelete: false,
    getRowId,
  });

  const selectedIds = workspace.selectedIds;

  const handleExport = () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : rows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean);
    if (!targetIds.length && rows.length === 0) {
      toastError(label, "Tidak ada data untuk diekspor.");
      return;
    }
    workspace.openExport();
  };

  const handleImport = () => {
    workspace.openImport();
  };

  const handleDelete = async () => {
    const targetRows = selection.selectedRows.length > 0 ? selection.selectedRows : rows;
    const targetIds = targetRows.map((row) => Number(getRowId ? getRowId(row) : row?.id)).filter(Boolean);

    if (!targetIds.length) {
      toastError(label, "Tidak ada data untuk dihapus.");
      return;
    }

    setDeleteConfirm({
      count: targetIds.length,
      rows: targetRows,
      ids: targetIds,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/v1/excel/${module}/bulk-delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: targetIds }),
          });
          const data = await response.json();
          if (data.success) {
            toastSuccess(label, `${data.data.deleted_count} data berhasil dihapus.`);
            onRefresh?.();
            selection.clear();
          } else {
            toastError(label, data.message || "Gagal menghapus data.");
          }
        } catch (error) {
          toastError(label, "Terjadi kesalahan saat menghapus data.");
        }
      },
    });
  };

  const extraActions = (
    <>
      {allowImport && (
        <ActionIconButton
          icon="upload_file"
          title="Import Excel"
          onClick={handleImport}
          variant="secondary"
          className="h-9 w-12 rounded-[10px]"
        />
      )}
      {allowExport && (
        <ActionIconButton
          icon="download"
          title={selectedIds.length > 0 ? `Export ${selectedIds.length} ${label} terpilih` : `Export ${label}`}
          onClick={handleExport}
          variant="secondary"
          className="h-9 w-12 rounded-[10px]"
        />
      )}
      {allowDelete && (
        <ActionIconButton
          icon="delete"
          title={selectedIds.length > 0 ? `Hapus ${selectedIds.length} ${label} terpilih` : `Hapus semua ${label}`}
          onClick={handleDelete}
          variant="danger"
          className="h-9 w-12 rounded-[10px]"
        />
      )}
    </>
  );

  return (
    <>
      {extraActions}
      <ExcelImportExportModal
        workspace={workspace}
        module={module}
        label={label}
        selectedIds={selectedIds}
      />
      {deleteConfirm && (
        <ConfirmDialog
          open
          title={`Hapus ${label}`}
          message={`Yakin menghapus ${deleteConfirm.count} ${label.toLowerCase()}${deleteConfirm.count !== rows.length ? " terpilih" : ""}?`}
          confirmLabel="Hapus"
          confirmTone="red"
          pending={false}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={deleteConfirm.onConfirm}
        />
      )}
    </>
  );
}