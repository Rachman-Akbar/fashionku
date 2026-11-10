import { useEffect, useDeferredValue, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { PRODUCT_TABLE_COLUMNS, SellerProductTable } from "@/features/seller/product/components/SellerProductTable";
import { SellerProductEditor } from "@/features/seller/product/components/SellerProductEditor";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { InfiniteScrollSentinel } from "@/shared/components/ui/InfiniteScrollSentinel";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { buildRawColumns, mergeColumns } from "@/shared/utils/tableData";
import { useRefreshOnListActivation } from "@/shared/hooks/useRefreshOnListActivation";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { getSellerProductError, useDeleteSellerProduct, useSellerProducts, useUpdateSellerProduct } from "@/features/seller/product/services/sellerProductService";

const PER_PAGE = 20;
const EMPTY_COLUMN_FILTERS = { product: "", mode: "", price: { min: "", max: "" }, stock: { min: "", max: "", status: "" }, active: "" };

export default function SellerProductsPage() {
  const [columnFilters, setColumnFilters] = useState(EMPTY_COLUMN_FILTERS);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [sort, setSort] = useState({ by: "created_at", direction: "desc" });
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
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
  const columns = useMemo(() => mergeColumns(PRODUCT_TABLE_COLUMNS.filter((column) => column.key !== "store" && column.key !== "status"), buildRawColumns(rows, ["id", "store_id", "name", "thumbnail", "variants", "images", "price", "stock", "status", "is_active"])), [rows]);
  const columnVisibility = useColumnVisibility(columns, "seller-products");
  const selection = useTableSelection(rows);
  const spreadsheet = useSpreadsheetWorkspace({ module: "product", label: "Product", selectedRows: selection.selectedRows, onCompleted: () => { selection.clear(); productsQuery.refetch(); } });
  const hppSpreadsheet = useSpreadsheetWorkspace({ module: "product-costing", label: "HPP & Harga Jual", allowBulkDelete: false, onCompleted: () => productsQuery.refetch() });
  const spreadsheetActions = [...spreadsheet.actions, ...hppSpreadsheet.actions];
  const activeSpreadsheet = spreadsheet.activeOperation?.payload?.module === "product-costing" ? hppSpreadsheet : spreadsheet;

  const toggleActive = (product, isActive) => {
    const task = notifications.startTask({ title: "Ubah Status Product", message: `Memproses product "${product.name}"...` });
    quickUpdateMutation.mutate(
      { id: product.id, values: { ...product, isActive } },
      {
        onSuccess: () => task.success(`Product "${product.name}" berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.`),
        onError: (error) => task.fail(getSellerProductError(error)),
      },
    );
  };

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

  return (
    <SellerPanelShell title="Produk Toko" subtitle="Kelola product, variant, gambar, harga, status, serta import/export. Saldo stok dikelola terpisah melalui Persediaan.">
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
            bulkActions={spreadsheetActions}
            columns={columns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
            onMoveColumn={columnVisibility.moveColumn}
          />
          )}
        >
          <AsyncState loading={isInitialLoading} error={productsQuery.error ? getSellerProductError(productsQuery.error) : ""} />
          {!isInitialLoading ? (
            <>
              <SellerProductTable
                rows={rows}
                isLoading={Boolean(productsQuery.isPlaceholderData)}
                onEdit={editor.edit}
                onToggleActive={toggleActive}
                pendingId={quickUpdateMutation.variables?.id}
                portal="seller"
                columns={columns}
                visibleSet={columnVisibility.visibleSet}
                selectionEnabled={selection.enabled}
                selectedIds={selection.selectedIds}
                allSelected={selection.allSelected}
                onToggleRow={selection.toggleRow}
                onToggleAll={selection.toggleAll}
                sortBy={sort.by}
                sortDirection={sort.direction}
                onSortChange={(by, direction) => setSort({ by, direction })}
                columnFilters={columnFilters}
                onColumnFilterChange={(key, value) => setColumnFilters((current) => ({ ...current, [key]: value }))}
                onClearAllFilters={() => setColumnFilters(EMPTY_COLUMN_FILTERS)}
                onResetSort={() => setSort({ by: "created_at", direction: "desc" })}
                columnOrder={columnVisibility.visibleKeys}
              />
              <InfiniteScrollSentinel hasNextPage={productsQuery.hasNextPage} isFetchingNextPage={productsQuery.isFetchingNextPage} onLoadMore={() => productsQuery.fetchNextPage()} />
            </>
          ) : null}
        </ListPageFrame>
      ) : null}

      <SpreadsheetOperationPanel workspace={activeSpreadsheet} />

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
