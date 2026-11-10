import { useMemo, useState } from "react";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { BANNER_TABLE_COLUMNS, BannerManagementTable } from "@/features/seller/banner/components/BannerManagementTable";
import { SellerBannerForm } from "@/features/seller/banner/components/SellerBannerForm";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useRefreshOnListActivation } from "@/shared/hooks/useRefreshOnListActivation";
import { useTableSearch } from "@/core/hooks/useTableSearch";
import { getSellerBannerError, useDeleteSellerBanner, useSellerBanners, useUpdateSellerBanner } from "@/features/seller/banner/services/sellerBannerService";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";

export default function SellerBannerPage() {
  const bannersQuery = useSellerBanners();
  const deleteMutation = useDeleteSellerBanner();
  const quickUpdateMutation = useUpdateSellerBanner();
  const editor = useEntityEditor();
  const notifications = useNotificationCenter();
  const [deleteTarget, setDeleteTarget] = useState(null);
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: bannersQuery.refetch });
  const rows = bannersQuery.data || [];
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Banner" });
  const { query, setQuery, filteredRows } = useTableSearch(rows, ["name"]);
  const columns = useMemo(() => mergeColumns(BANNER_TABLE_COLUMNS.filter((column) => column.key !== "store"), buildRawColumns(rows, ["id", "store_id", "name", "image_url", "sort_order", "is_active"])), [rows]);
  const selection = useTableSelection(filteredRows);
  const columnVisibility = useColumnVisibility(columns, "seller-banners");
  const spreadsheet = useSpreadsheetWorkspace({ module: "banner", label: "Banner", selectedRows: selection.selectedRows, onCompleted: () => { selection.clear(); bannersQuery.refetch(); } });

  const remove = async () => {
    if (!deleteTarget) return;
    const task = notifications.startTask({ title: "Hapus Banner", message: `Menghapus banner "${deleteTarget.name}"...` });
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      editor.markListDirty();
      setDeleteTarget(null);
      task.success("Banner berhasil dihapus.");
    } catch (error) {
      task.fail(getSellerBannerError(error));
    }
  };

  const toggleActive = (row, isActive) => {
    const task = notifications.startTask({ title: "Ubah Status Banner", message: `Memproses banner "${row.name}"...` });
    quickUpdateMutation.mutate(
      { id: row.id, values: { ...row, isActive } },
      {
        onSuccess: () => task.success(`Banner "${row.name}" berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.`),
        onError: (error) => task.fail(getSellerBannerError(error)),
      },
    );
  };

  return (
    <SellerPanelShell title="Banner Toko" subtitle="Kelola banner halaman toko, import/export Excel, gambar, urutan, dan status active/non-active.">
      {editor.isListActive ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            onCreate={editor.create}
            onRefresh={() => bannersQuery.refetch()}
            refreshing={bannersQuery.isFetching}
            createLabel="Tambah Banner"
            placeholder="Cari nama banner"
            totalCount={total.totalCount}
            totalLabel={total.totalLabel}
            totalTitle={total.totalTitle}
            selectionEnabled={selection.enabled}
            selectedCount={selection.selectedCount}
            onToggleSelection={selection.toggleEnabled}
            bulkActions={spreadsheet.actions}
            columns={columns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
          />
          )}
        >
          <AsyncState loading={bannersQuery.isLoading} error={bannersQuery.error ? getSellerBannerError(bannersQuery.error) : ""} empty={!bannersQuery.isLoading && !filteredRows.length} emptyText="Banner toko belum tersedia." />
          {filteredRows.length ? (
            <BannerManagementTable
              rows={filteredRows}
              columns={columns}
              portal="seller"
              onEdit={editor.edit}
              onToggleActive={toggleActive}
              pendingId={quickUpdateMutation.variables?.id}
              visibleSet={columnVisibility.visibleSet}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
            />
          ) : null}
        </ListPageFrame>
      ) : null}

      <SpreadsheetOperationPanel workspace={spreadsheet} />

      <SellerBannerForm
        open={editor.open}
        entity={editor.entity}
        onDelete={(entity) => setDeleteTarget(entity)}
        onClose={editor.close}
        onSaved={() => {
          editor.markListDirty();
          const task = notifications.startTask({ title: editor.entity ? "Perbarui Banner" : "Tambah Banner", message: "Menyimpan banner..." });
          task.success(editor.entity ? "Banner berhasil diperbarui." : "Banner berhasil ditambahkan.");
          editor.completeSave();
        }}
      />
      <ConfirmDialog open={Boolean(deleteTarget)} title="Hapus Banner" message={`Banner “${deleteTarget?.name || ""}” akan dihapus.`} pending={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
    </SellerPanelShell>
  );
}
