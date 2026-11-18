import { useMemo, useState } from "react";
import { useTableSearch } from "@/core/hooks/useTableSearch";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { useColumnVisibility, useRefreshOnListActivation, useTableSelection, useViewMode } from "@/shared/hooks";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { formatPrice } from "@/shared/utils/utils";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { VoucherFormDialog } from "@/features/order/voucher/components/VoucherFormDialog";
import { VOUCHER_TABLE_COLUMNS, VoucherManagementTable } from "@/features/order/voucher/components/VoucherManagementTable";
import { getVoucherManagementError, useDeleteVoucher, useManagedVouchers, useUpdateVoucher } from "@/features/order/voucher/services/voucherManagementService";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";

export function VoucherManagementPage({ portal, children: wrap }) {
  const [viewMode, setViewMode] = useViewMode(`${portal}-vouchers`);
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

  const rows = vouchersQuery.data || [];
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Voucher" });
  const { query, setQuery, filteredRows } = useTableSearch(rows, ["name", "code", "discountType"]);
  const columns = useMemo(() => mergeColumns(VOUCHER_TABLE_COLUMNS, buildRawColumns(rows, ["id", "code", "name", "image", "image_url", "discount_target", "discount_type", "discount_value", "min_spend", "max_discount", "starts_at", "ends_at", "usage_limit", "used_count", "is_active"])), [rows]);
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

  const voucherCard = {
    title: (row) => toTitleCase(row.name) || row.code || "Voucher",
    subtitle: (row) => row.code || "-",
    image: (row) => row.imageUrl || row.image || null,
    badges: [
      (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
    ],
    fields: [
      {
        label: "Diskon",
        render: (row) => `${row.discountTarget === "shipping" ? "Ongkir" : "Produk"} · ${row.discountType === "percentage" ? `${row.discountValue}%` : formatPrice(row.discountValue)}`,
      },
      { label: "Min. Belanja", render: (row) => formatPrice(row.minSpend) },
      { label: "Periode", render: (row) => `${row.startsAt || "-"} → ${row.endsAt || "-"}` },
      {
        label: "Pemakaian",
        render: (row) => `${Number(row.usedCount) || 0}${row.usageLimit ? ` / ${row.usageLimit}` : ""}`,
      },
    ],
    footer: (row) => (
      <>
        <span className="text-[11px] font-bold text-slate-500">Klik untuk edit</span>
        <InlineActiveSwitch
          checked={row.isActive}
          pending={quickUpdateMutation.variables?.id === row.id}
          onChange={(checked) => toggleActive(row, checked)}
          compact
        />
      </>
    ),
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
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          )}
        >
          <AsyncState loading={vouchersQuery.isLoading} error={vouchersQuery.error ? getVoucherManagementError(vouchersQuery.error) : ""} empty={!vouchersQuery.isLoading && !filteredRows.length} emptyText="Voucher belum tersedia." />
          {filteredRows.length && viewMode === "grid" ? (
            <RecordCardGrid
              rows={filteredRows}
              columns={columns}
              card={voucherCard}
              onRowClick={editor.edit}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              onToggleRow={selection.toggleRow}
              rowKey={(row) => row.id}
            />
          ) : null}
          {filteredRows.length && viewMode !== "grid" ? (
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
