import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
// Import langsung ke modul tujuan (bukan lewat barrel ./index) supaya tidak
// terjadi circular dependency: barrel mengekspor ExcelActionButtons, jadi
// mengimpor barrel dari file ini membuat Rollup memecah chunk bermasalah.
import { ExcelImportExportModal } from "./ExcelImportExportModal";
import { useExcelWorkspace } from "./useExcelWorkspace";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { cn } from "@/shared/utils/utils";

const MENU_WIDTH = 224;
const MENU_MARGIN = 8;

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
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef(null);
  const menuRef = useRef(null);

  const workspace = useExcelWorkspace({
    module,
    label,
    rows,
    selectedRows: selection.selectedRows,
    onCompleted,
    allowImport,
    allowExport,
    allowBulkDelete: false,
    getRowId,
  });

  const selectedIds = workspace.selectedIds;

  const handleExport = () => {
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

  const actionItems = [
    allowImport && { key: "import", icon: "upload_file", label: "Import Excel", onClick: handleImport },
    allowExport && {
      key: "export",
      icon: "download",
      label: selectedIds.length > 0 ? `Export ${selectedIds.length} ${label} terpilih` : `Export ${label}`,
      onClick: handleExport,
    },
    allowDelete && {
      key: "delete",
      icon: "delete",
      label: selectedIds.length > 0 ? `Hapus ${selectedIds.length} ${label} terpilih` : `Hapus semua ${label}`,
      onClick: handleDelete,
      tone: "danger",
    },
  ].filter(Boolean);

  // Menu dirender lewat portal dengan posisi `fixed` agar tidak terpotong oleh
  // container toolbar/tabel yang punya overflow.
  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const margin = MENU_MARGIN;
      const left = Math.max(margin, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - margin));
      const menuHeight = menuRef.current?.getBoundingClientRect().height || 150;
      const below = rect.bottom + 5;
      const above = rect.top - 5 - menuHeight;
      const top = below + menuHeight > window.innerHeight - margin && above > margin ? above : Math.max(margin, below);
      setPosition({ top, left });
    };

    const close = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    updatePosition();
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  if (!actionItems.length) return null;

  return (
    <>
      <div ref={rootRef} className="shrink-0">
        <ActionIconButton
          icon="more_vert"
          title="Aksi data"
          active={open}
          onClick={() => setOpen((current) => !current)}
          className="h-9 w-12 rounded-[10px]"
        />
      </div>
      {open && typeof document !== "undefined" ? createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-[300] overflow-hidden rounded-[10px] bg-white py-1 shadow-xl ring-1 ring-slate-200"
          style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
        >
          {actionItems.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold transition-colors",
                item.tone === "danger" ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50",
              )}
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      ) : null}
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
