import { useMemo, useState } from "react";
import { useReviews } from "@/features/advanced/services/advancedMarketplaceService";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { ReviewDetailForm } from "@/features/advanced/pages/ReviewDetailPage";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";

export default function ReviewsPage() {
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState("");
  const listQuery = useReviews({ per_page: 20, ...(query.trim() ? { search: query.trim() } : {}), ...(rating ? { rating } : {}) });
  const spreadsheet = useSpreadsheetWorkspace({ module: "review", label: "Review & Rating", allowImport: false, allowBulkDelete: false });
  const rows = listQuery.data?.rows || [];
  const total = useListTotalCount(listQuery.data?.meta, { fallbackTotal: rows.length, label: "Review" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.product_name || `Review #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  const columns = useMemo(() => [
    { key: "product_name", label: "Produk" },
    { key: "order_number", label: "Order" },
    { key: "user_name", label: "Buyer" },
    { key: "rating", label: "Rating", render: (row) => `${"★".repeat(Number(row.rating || 0))}${"☆".repeat(Math.max(0, 5 - Number(row.rating || 0)))}` },
    { key: "review", label: "Review" },
    { key: "created_at", label: "Tanggal", render: (row) => row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "-" },
  ], []);

  return (
    <>
      {editor.open && editor.entity ? (
        <ReviewDetailForm
          row={editor.entity}
          onClose={editor.close}
          onSaved={() => {
            editor.markListDirty();
            editor.completeSave();
          }}
          onDeleted={() => editor.markListDirty()}
        />
      ) : null}
      {editor.isListActive ? (
        <ModuleFrame title="Review dan Rating Produk" subtitle="Review berasal dari Buyer setelah transaksi selesai. Seller dapat mengekspor review untuk analisis, tetapi import review dinonaktifkan agar rating tetap berasal dari transaksi nyata." query={query} onQueryChange={setQuery} onRefresh={() => listQuery.refetch()} bulkActions={spreadsheet.actions} totalCount={total.totalCount} totalLabel={total.totalLabel} totalTitle={total.totalTitle} filters={<select value={rating} onChange={(event) => setRating(event.target.value)} className={toolbarControlClassName}><option value="">Semua rating</option>{[5, 4, 3, 2, 1].map((item) => <option key={item} value={item}>{item} bintang</option>)}</select>}>
          <DataGrid
            onFilterStateChange={total.onFilterStateChange}
            columns={columns}
            rows={rows}
            onRowClick={editor.edit}
            emptyText={listQuery.isLoading ? "" : "Review belum tersedia."}
            hasNextPage={listQuery.hasNextPage}
            isFetchingNextPage={listQuery.isFetchingNextPage}
            onLoadMore={() => listQuery.fetchNextPage()}
          />
        </ModuleFrame>
      ) : null}
      <SpreadsheetOperationPanel workspace={spreadsheet} />
    </>
  );
}