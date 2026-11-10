import { useMemo, useState } from "react";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { useTableSearch } from "@/core/hooks/useTableSearch";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { useRefreshOnListActivation } from "@/shared/hooks/useRefreshOnListActivation";
import { PromotionFormDialog } from "@/features/catalog/promotion/components/PromotionFormDialog";
import { PROMOTION_TABLE_COLUMNS, PromotionManagementTable } from "@/features/catalog/promotion/components/PromotionManagementTable";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { getPromotionError, useDeleteSellerPromotion, useSellerPromotions, useUpdateSellerPromotion } from "@/features/catalog/promotion/services/promotionManagementService";

export default function SellerPromotionPage() {
  const [approvalStatus, setApprovalStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const editor = useEntityEditor();
  const notifications = useNotificationCenter();
  const promotionsQuery = useSellerPromotions(approvalStatus ? { approval_status: approvalStatus } : {});
  const deleteMutation = useDeleteSellerPromotion();
  const quickUpdateMutation = useUpdateSellerPromotion();
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: promotionsQuery.refetch });
  const rows = promotionsQuery.data || [];
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Promosi" });
  const { query, setQuery, filteredRows } = useTableSearch(rows, ["name", "approvalStatus", "targetUrl"]);
  const columns = useMemo(() => mergeColumns(PROMOTION_TABLE_COLUMNS.filter((column) => column.key !== "store"), buildRawColumns(rows, ["id", "store_id", "name", "image_url", "mobile_image_url", "click_action", "target_id", "target_url", "sort_order", "is_active", "approval_status", "rejection_reason", "submitted_at", "approved_at", "approved_by"])), [rows]);
  const selection = useTableSelection(filteredRows);
  const columnVisibility = useColumnVisibility(columns, "seller-promotions");
  const spreadsheet = useSpreadsheetWorkspace({ module: "promotion", label: "Promotion", selectedRows: selection.selectedRows, onCompleted: () => { selection.clear(); promotionsQuery.refetch(); } });

  const remove = async () => {
    if (!deleteTarget) return;
    const task = notifications.startTask({ title: "Hapus Promosi", message: `Menghapus promosi "${deleteTarget.name}"...` });
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      editor.markListDirty();
      setDeleteTarget(null);
      task.success("Promosi berhasil dihapus.");
    } catch (error) {
      task.fail(getPromotionError(error));
    }
  };

  const toggleActive = (row, isActive) => {
    const task = notifications.startTask({ title: "Ubah Status Promosi", message: `Memproses promosi "${row.name}"...` });
    quickUpdateMutation.mutate(
      { id: row.id, values: { ...row, isActive } },
      {
        onSuccess: () => task.success(`Promosi "${row.name}" berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.`),
        onError: (error) => task.fail(getPromotionError(error)),
      },
    );
  };

  return (
    <SellerPanelShell title="Promosi Toko" subtitle="Ajukan promotion homepage, import/export Excel, dan pantau status approval admin.">
      {editor.isListActive ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            onCreate={editor.create}
            onRefresh={() => promotionsQuery.refetch()}
            refreshing={promotionsQuery.isFetching}
            createLabel="Ajukan Promosi"
            placeholder="Cari nama atau target promosi"
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
            filters={<SearchableSelect value={approvalStatus} onChange={setApprovalStatus} options={[{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" }]} placeholder="Semua approval" className="w-44" buttonClassName="h-9" />}
          />
          )}
        >
          <AsyncState loading={promotionsQuery.isLoading} error={promotionsQuery.error ? getPromotionError(promotionsQuery.error) : ""} empty={!promotionsQuery.isLoading && !filteredRows.length} emptyText="Belum ada pengajuan promosi." />
          {filteredRows.length ? (
            <PromotionManagementTable
              rows={filteredRows}
              columns={columns}
              portal="seller"
              onEdit={editor.edit}
              visibleSet={columnVisibility.visibleSet}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onToggleActive={toggleActive}
              pendingId={quickUpdateMutation.variables?.id}
            />
          ) : null}
        </ListPageFrame>
      ) : null}

      <SpreadsheetOperationPanel workspace={spreadsheet} />

      <PromotionFormDialog
        open={editor.open}
        entity={editor.entity}
        portal="seller"
        onDelete={(entity) => setDeleteTarget(entity)}
        onClose={editor.close}
        onSaved={() => {
          editor.markListDirty();
          const task = notifications.startTask({ title: editor.entity ? "Perbarui Promosi" : "Ajukan Promosi", message: editor.entity ? "Menyimpan perubahan promosi..." : "Mengajukan promosi ke admin..." });
          task.success(editor.entity ? "Promosi berhasil diperbarui dan menunggu approval admin." : "Promosi berhasil diajukan dan menunggu approval admin.");
          editor.completeSave();
        }}
      />
      <ConfirmDialog open={Boolean(deleteTarget)} title="Hapus Promosi" message={`Promosi “${deleteTarget?.name || ""}” akan dihapus.`} pending={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
    </SellerPanelShell>
  );
}
