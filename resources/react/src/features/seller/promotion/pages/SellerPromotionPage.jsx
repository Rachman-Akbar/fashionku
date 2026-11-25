import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { useTableSearch } from "@/core/hooks/useTableSearch";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useActiveToggle } from "@/shared/hooks/useActiveToggle";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { useColumnVisibility, useTableSelection, useViewMode } from "@/shared/hooks";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { StatusBadge } from "@/shared/components/feedback/StatusBadge";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { useRefreshOnListActivation } from "@/shared/hooks/useRefreshOnListActivation";
import { PromotionFormDialog } from "@/features/catalog/promotion/components/PromotionFormDialog";
import { PROMOTION_TABLE_COLUMNS, PromotionManagementTable } from "@/features/catalog/promotion/components/PromotionManagementTable";
import { buildDatabaseColumns, mergeColumns } from "@/shared/utils/tableData";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { getPromotionError, useDeleteSellerPromotion, useSellerPromotions, useUpdateSellerPromotion } from "@/features/catalog/promotion/services/promotionManagementService";
import { ExcelActionButtons } from "@/shared/excel";

export default function SellerPromotionPage() {
  // /admin/promotions = tampilan admin, /seller/promotions = tampilan operator toko.
  // Promosi tidak memakai approval: simpan = langsung tayang.
  const location = useLocation();
  const portal = location.pathname.startsWith("/admin") ? "admin" : "seller";
  const [viewMode, setViewMode] = useViewMode("promotions");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const editor = useEntityEditor();
  const notifications = useNotificationCenter();
  const promotionsQuery = useSellerPromotions();
  const deleteMutation = useDeleteSellerPromotion();
  const quickUpdateMutation = useUpdateSellerPromotion();
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: promotionsQuery.refetch });
  const rows = promotionsQuery.data || [];
  const total = useListTotalCount(undefined, { fallbackTotal: rows.length, label: "Promosi" });
  const { query, setQuery, filteredRows } = useTableSearch(rows, ["name", "targetUrl"]);
  // Kolom kurasi + semua kolom database lain (kecuali kolom ID).
  const columns = useMemo(() => mergeColumns(PROMOTION_TABLE_COLUMNS.filter((column) => column.key !== "store"), buildDatabaseColumns(rows, {
    omit: ["id", "name", "image_url", "mobile_image_url", "click_action", "target_id", "target_url", "sort_order", "is_active", "store_name", "resolved_url"],
    labels: {
      created_by_user: "Dibuat Oleh",
      updated_by_user: "Diubah Oleh",
      created_at: "Dibuat",
      updated_at: "Diubah",
      deleted_at: "Dihapus",
    },
  })), [rows]);
  const selection = useTableSelection(filteredRows);
  const columnVisibility = useColumnVisibility(columns, "seller-promotions");

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

  const promotionCard = {
    title: (row) => toTitleCase(row.name),
    subtitle: (row) => row.badge || row.targetUrl || "-",
    image: (row) => row.imageUrl || null,
    badges: [(row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />],
    fields: [
      { label: "Toko", render: (row) => toTitleCase(row.storeName) || "Platform" },
      {
        label: "Target",
        render: (row) => `${row.clickAction || "-"}${row.targetId ? ` #${row.targetId}` : ""}`,
      },
      { label: "Urutan", render: (row) => row.sortOrder ?? "-" },
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

  // Toggle aktif langsung berubah (optimistic); kegagalan masuk notifikasi.
  const activeToggle = useActiveToggle({
    mutate: (row, isActive) => quickUpdateMutation.mutateAsync({ id: row.id, values: { ...row, isActive } }),
    errorMessage: getPromotionError,
    activeOf: (row) => Boolean(row?.isActive),
    labelOf: (row) => row?.name || `#${row?.id}`,
    onSettled: () => promotionsQuery.refetch(),
    openDetail: (row) => editor.edit(row),
  });
  const toggleActive = (row, isActive) => activeToggle.toggle(row, isActive);

  return (
    <SellerPanelShell>
      {editor.isListActive ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            onCreate={editor.create}
            onRefresh={() => promotionsQuery.refetch()}
            refreshing={promotionsQuery.isFetching}
            createLabel="Tambah Promosi"
            placeholder="Cari nama atau target promosi"
            totalCount={total.totalCount}
            totalLabel={total.totalLabel}
            totalTitle={total.totalTitle}
            selectionEnabled={selection.enabled}
            selectedCount={selection.selectedCount}
            onToggleSelection={selection.toggleEnabled}
            bulkActions={[]}
            columns={columnVisibility.allColumns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onMoveColumn={columnVisibility.moveColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            extraActions={
              <ExcelActionButtons
                module="promotion"
                label="Promosi"
                selection={selection}
                rows={filteredRows}
                onRefresh={() => promotionsQuery.refetch()}
                onCompleted={() => {}}
                getRowId={(row) => row.id}
                allowImport={true}
                allowExport={true}
                allowDelete={true}
              />
            }
          />
          )}
        >
          <AsyncState loading={promotionsQuery.isLoading} error={promotionsQuery.error ? getPromotionError(promotionsQuery.error) : ""} empty={!promotionsQuery.isLoading && !filteredRows.length} emptyText="Belum ada pengajuan promosi." />
          {filteredRows.length && viewMode === "grid" ? (
            <>
            {/* Header tabel tetap tampil di mode kartu sebagai filter & sort. */}
            <PromotionManagementTable
              rows={[]}
              columns={columns}
              portal={portal}
              headerOnly
              visibleSet={columnVisibility.visibleSet}
              columnOrder={columnVisibility.visibleKeys}
              onOrderChange={columnVisibility.syncVisibleOrder}
            />
            <RecordCardGrid
              rows={filteredRows}
              columns={columns}
              card={promotionCard}
              onRowClick={editor.edit}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              onToggleRow={selection.toggleRow}
              rowKey={(row) => row.id}
            />
            </>
          ) : null}
          {filteredRows.length && viewMode !== "grid" ? (
            <PromotionManagementTable
              rows={filteredRows}
              columns={columns}
              portal={portal}
              onEdit={editor.edit}
              visibleSet={columnVisibility.visibleSet}
              columnOrder={columnVisibility.visibleKeys}
              onOrderChange={columnVisibility.syncVisibleOrder}
              selectionEnabled={selection.enabled}
              selectedIds={selection.selectedIds}
              allSelected={selection.allSelected}
              onToggleRow={selection.toggleRow}
              onToggleAll={selection.toggleAll}
              onToggleActive={toggleActive}
              isActiveOf={activeToggle.isActive}
              pendingId={quickUpdateMutation.variables?.id}
            />
          ) : null}
        </ListPageFrame>
      ) : null}

      <PromotionFormDialog
        open={editor.open}
        entity={editor.entity}
        portal="seller"
        onDelete={(entity) => setDeleteTarget(entity)}
        onClose={editor.close}
        onSaved={() => {
          editor.markListDirty();
          const task = notifications.startTask({ title: editor.entity ? "Perbarui Promosi" : "Tambah Promosi", message: editor.entity ? "Menyimpan perubahan promosi..." : "Menyimpan promosi..." });
             task.success(editor.entity ? "Promosi berhasil diperbarui." : "Promosi berhasil dibuat dan langsung aktif.");
          editor.completeSave();
        }}
      />
      <ConfirmDialog open={Boolean(deleteTarget)} title="Hapus Promosi" message={`Promosi “${deleteTarget?.name || ""}” akan dihapus.`} pending={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
    </SellerPanelShell>
  );
}
