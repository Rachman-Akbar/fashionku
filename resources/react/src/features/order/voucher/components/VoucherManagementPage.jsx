import { useMemo, useState } from "react";
import { useTableSearch } from "@/core/hooks/useTableSearch";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { useColumnVisibility, useRefreshOnListActivation, useTableSelection } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { useAuth } from "@/features/auth/context/AuthContext";
import { VoucherFormDialog } from "@/features/order/voucher/components/VoucherFormDialog";
import { VOUCHER_TABLE_COLUMNS, VoucherManagementTable } from "@/features/order/voucher/components/VoucherManagementTable";
import { getVoucherManagementError, useDeleteVoucher, useManagedVouchers, useUpdateVoucher } from "@/features/order/voucher/services/voucherManagementService";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";

export function VoucherManagementPage({ portal, children: wrap }) {
  const { store } = useAuth();
  const notifications = useNotificationCenter();
  const vouchersQuery = useManagedVouchers(portal, { include_inactive: 1 });
  const deleteMutation = useDeleteVoucher(portal);
  const quickUpdateMutation = useUpdateVoucher(portal);
  const editor = useEntityEditor();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useRefreshOnListActivation({
    isListActive: editor.isListActive,
    listRevision: editor.listRevision,
    refetch: vouchersQuery.refetch,
  });

  const rows = (vouchersQuery.data || []).filter((row) => {
    if (portal === "seller") return row.voucherScope === "store" && Number(row.storeId) === Number(store?.id);
    return true;
  });
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Voucher" });
  const { query, setQuery, filteredRows } = useTableSearch(rows, ["name", "code", "discountType", "storeName"]);
  const columns = useMemo(() => mergeColumns(VOUCHER_TABLE_COLUMNS, buildRawColumns(rows, ["id", "code", "name", "image", "image_url", "voucher_scope", "discount_target", "discount_type", "discount_value", "min_spend", "max_discount", "starts_at", "ends_at", "usage_limit", "used_count", "store_id", "is_active"])), [rows]);
  const selection = useTableSelection(filteredRows);
  const columnVisibility = useColumnVisibility(columns, `${portal}-vouchers`);
  const spreadsheet = useSpreadsheetWorkspace({ module: "voucher", label: "Voucher", selectedRows: selection.selectedRows, onCompleted: () => { selection.clear(); vouchersQuery.refetch(); } });

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      editor.markListDirty();
      setDeleteTarget(null);
      notifications.push({ type: "success", title: "Voucher", message: "Voucher berhasil dihapus." });
    } catch (error) {
      notifications.push({ type: "error", title: "Voucher", message: getVoucherManagementError(error) });
    }
  };

  const toggleActive = (row, isActive) => {
    quickUpdateMutation.mutate(
      { id: row.id, values: { ...row, isActive } },
      {
        onSuccess: () => notifications.push({ type: "success", title: "Voucher", message: `Voucher berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.` }),
        onError: (error) => notifications.push({ type: "error", title: "Voucher", message: getVoucherManagementError(error) }),
      },
    );
  };

  const content = (
    <>
      {editor.isListActive ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            onCreate={editor.create}
            onRefresh={() => vouchersQuery.refetch()}
            refreshing={vouchersQuery.isFetching}
            createLabel="Tambah Voucher"
            placeholder="Cari kode, nama, toko, atau tipe voucher"
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
          <AsyncState loading={vouchersQuery.isLoading} error={vouchersQuery.error ? getVoucherManagementError(vouchersQuery.error) : ""} empty={!vouchersQuery.isLoading && !filteredRows.length} emptyText="Voucher belum tersedia." />
          {filteredRows.length ? (
            <VoucherManagementTable
              rows={filteredRows}
              columns={columns}
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

      <VoucherFormDialog
        open={editor.open}
        entity={editor.entity}
        portal={portal}
        onDelete={(entity) => setDeleteTarget(entity)}
        onClose={editor.close}
        onSaved={() => {
          editor.markListDirty();
          notifications.push({ type: "success", title: "Voucher", message: editor.entity ? "Voucher berhasil diperbarui." : "Voucher berhasil ditambahkan." });
          editor.completeSave();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Voucher"
        message={`Voucher “${deleteTarget?.name || ""}” akan dihapus.`}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </>
  );

  return typeof wrap === "function" ? wrap(content) : content;
}
