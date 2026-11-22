import { useEffect, useDeferredValue, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { PRODUCT_TABLE_COLUMNS, SellerProductTable } from "@/features/seller/product/components/SellerProductTable";
import { SellerProductGrid } from "@/features/seller/product/components/SellerProductGrid";
import { useViewMode } from "@/shared/hooks/useViewMode";
import { SellerProductEditor } from "@/features/seller/product/components/SellerProductEditor";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useActiveToggle } from "@/shared/hooks/useActiveToggle";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useRefreshOnListActivation } from "@/shared/hooks/useRefreshOnListActivation";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { getSellerProductError, useDeleteSellerProduct, useSellerProducts, useUpdateSellerProduct } from "@/features/seller/product/services/sellerProductService";
import { ExcelActionButtons } from "@/shared/excel";

const PER_PAGE = 20;
const EMPTY_COLUMN_FILTERS = { product: "", mode: "", price: { min: "", max: "" }, stock: { min: "", max: "", status: "" }, active: "" };

export default function SellerProductsPage() {
  const [columnFilters, setColumnFilters] = useState(EMPTY_COLUMN_FILTERS);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [sort, setSort] = useState({ by: "created_at", direction: "desc" });
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewMode, setViewMode] = useViewMode("products");
  const [initialSection, setInitialSection] = useState("general");
  const deferredQuery = useDeferredValue(query.trim());
  const editor = useEntityEditor();
  const tabs = usePanelTabs();
  const notifications = useNotificationCenter();
  const location = useLocation();
  const navigate = useNavigate();
  const productsQuery = useSellerProducts({
    per_page: PER_PAGE,
    sort_by: sort.by,
    sort_direction: sort.direction,
    ...(deferredQuery ? { search: deferredQuery } : {}),
    ...(columnFilters.product ? { name: columnFilters.product } : {}),
    ...(columnFilters.mode ? { mode: columnFilters.mode } : {}),
    ...(columnFilters.price.min !== "" ? { price_min: columnFilters.price.min } : {}),
    ...(columnFilters.price.max !== "" ? { price_max: columnFilters.price.max } : {}),
    ...(columnFilters.stock.min !== "" ? { stock_min: columnFilters.stock.min } : {}),
    ...(columnFilters.stock.max !== "" ? { stock_max: columnFilters.stock.max } : {}),
    ...(columnFilters.active ? { is_active: columnFilters.active === "active" } : {}),
    ...(columnFilters.stock.status === "low" ? { low_stock: true } : {}),
    ...(columnFilters.stock.status === "safe" ? { safe_stock: true } : {}),
  });
  const deleteMutation = useDeleteSellerProduct();
  const quickUpdateMutation = useUpdateSellerProduct();
  const isInitialLoading = productsQuery.isLoading && !productsQuery.data;
  const handleRefresh = async () => {
    setManualRefreshing(true);
    try {
      await productsQuery.refetch();
    } finally {
      setManualRefreshing(false);
    }
  };
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: productsQuery.refetch });
  const rows = productsQuery.data?.rows || [];
  const columns = useMemo(() => mergeColumns(PRODUCT_TABLE_COLUMNS.filter((column) => column.key !== "store" && column.key !== "status"), buildRawColumns(rows, ["id", "name", "thumbnail", "variants", "images", "price", "stock", "status", "is_active"])), [rows]);
  const columnVisibility = useColumnVisibility(columns, "seller-products");
  const selection = useTableSelection(rows);

  // Toggle aktif langsung berubah (optimistic); kegagalan masuk notifikasi.
  const activeToggle = useActiveToggle({
    mutate: (product, isActive) => quickUpdateMutation.mutateAsync({ id: product.id, values: { ...product, isActive } }),
    errorMessage: getSellerProductError,
    activeOf: (product) => Boolean(product?.isActive),
    onSettled: () => productsQuery.refetch(),
    openDetail: (product) => editor.edit(product),
  });
  const toggleActive = (product, isActive) => activeToggle.toggle(product, isActive);

  const remove = async () => {
    if (!deleteTarget) return;
    const task = notifications.startTask({ title: "Hapus Product", message: `Menghapus product "${deleteTarget.name}"...` });
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      editor.markListDirty();
      setDeleteTarget(null);
      editor.close();
      task.success(`Product "${deleteTarget.name}" berhasil dihapus.`);
    } catch (error) {
      task.fail(getSellerProductError(error));
    }
  };

  const pendingEntity = location.state?.editProduct || null;
  useEffect(() => {
    if (!pendingEntity) return;
    if (tabs?.activeParentId !== "/seller/products") return;
    editor.edit(pendingEntity);
    setInitialSection(location.state?.initialSection || "general");
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingEntity, tabs?.activeParentId]);

  useEffect(() => {
    if (!editor.open) setInitialSection("general");
  }, [editor.open]);

  // Prop header kolom dipakai bersama oleh mode list dan mode grid, supaya
  // header + filter tetap tampil saat tampilan diganti ke kartu (grid).
  const tableProps = {
    onEdit: editor.edit,
    onToggleActive: toggleActive,
    isActiveOf: activeToggle.isActive,
    pendingId: quickUpdateMutation.variables?.id,
    portal: "seller",
    columns,
    visibleSet: columnVisibility.visibleSet,
    columnOrder: columnVisibility.visibleKeys,
    onOrderChange: columnVisibility.syncVisibleOrder,
    selectionEnabled: selection.enabled,
    selectedIds: selection.selectedIds,
    allSelected: selection.allSelected,
    onToggleRow: selection.toggleRow,
    onToggleAll: selection.toggleAll,
    sortBy: sort.by,
    sortDirection: sort.direction,
    onSortChange: (by, direction) => setSort({ by, direction }),
    columnFilters,
    onColumnFilterChange: (key, value) => setColumnFilters((current) => ({ ...current, [key]: value })),
    onClearAllFilters: () => setColumnFilters(EMPTY_COLUMN_FILTERS),
    onResetSort: () => setSort({ by: "created_at", direction: "desc" }),
  };

  return (
    <SellerPanelShell>
      {editor.isListActive ? (
        <ListPageFrame
          toolbar={(
          <EntityToolbar
            query={query}
            onQueryChange={setQuery}
            onCreate={editor.create}
            onRefresh={handleRefresh}
            refreshing={manualRefreshing}
            createLabel="Tambah Produk"
            placeholder="Cari nama, toko, SKU, brand, atau variant"
            totalCount={productsQuery.data?.meta?.total}
            totalLabel=""
            selectionEnabled={selection.enabled}
            selectedCount={selection.selectedCount}
            onToggleSelection={selection.toggleEnabled}
            bulkActions={[]}
            columns={columnVisibility.allColumns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
            onMoveColumn={columnVisibility.moveColumn}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            extraActions={
              <ExcelActionButtons
                module="product"
                label="Produk"
                selection={selection}
                rows={rows}
                onRefresh={() => productsQuery.refetch()}
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
          <AsyncState loading={isInitialLoading} error={productsQuery.error ? getSellerProductError(productsQuery.error) : ""} />
          {!isInitialLoading ? (
            <>
              {viewMode === "grid" ? (
                <>
                  {/* Header + filter kolom tetap dirender di mode kartu (grid). */}
                  <SellerProductTable rows={[]} headerOnly isLoading={false} {...tableProps} />
                  <SellerProductGrid
                    rows={rows}
                    onEdit={editor.edit}
                    onToggleActive={toggleActive}
                    isActiveOf={activeToggle.isActive}
                    pendingId={quickUpdateMutation.variables?.id}
                    selectionEnabled={selection.enabled}
                    selectedIds={selection.selectedIds}
                    onToggleRow={selection.toggleRow}
                  />
                </>
              ) : (
                <SellerProductTable rows={rows} isLoading={Boolean(productsQuery.isPlaceholderData)} {...tableProps} />
              )}
              <InfiniteScrollSentinel hasNextPage={productsQuery.hasNextPage} isFetchingNextPage={productsQuery.isFetchingNextPage} onLoadMore={() => productsQuery.fetchNextPage()} />
            </>
          ) : null}
        </ListPageFrame>
      ) : null}

      <SellerProductEditor
        open={editor.open}
        product={editor.entity}
        initialSection={initialSection}
        suppressEscape={Boolean(deleteTarget)}
        onClose={editor.close}
        onDelete={(product) => { setDeleteTarget(product); }}
        onSaved={() => {
          editor.markListDirty();
          const task = notifications.startTask({ title: editor.entity ? "Perbarui Product" : "Tambah Product", message: `Menyimpan product "${editor.entity?.name || ""}"...` });
          task.success(editor.entity ? "Product berhasil diperbarui." : "Product berhasil ditambahkan.");
          editor.completeSave();
        }}
      />

      <ConfirmDialog open={Boolean(deleteTarget)} title="Hapus Product" message={`Product “${deleteTarget?.name || ""}” akan dihapus.`} pending={deleteMutation.isPending} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
    </SellerPanelShell>
  );
}
