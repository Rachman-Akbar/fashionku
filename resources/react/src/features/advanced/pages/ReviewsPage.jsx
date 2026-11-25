import { useState } from "react";
import { advancedError, useReviews, useUpdateReview } from "@/features/advanced/services/advancedMarketplaceService";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { ModuleFrame } from "@/features/advanced/components/ModuleFrame";
import { DataGrid } from "@/features/advanced/components/DataGrid";
import { buildDatabaseColumns } from "@/shared/utils/tableData";
import { ReviewDetailForm } from "@/features/advanced/pages/ReviewDetailPage";
import { SpreadsheetOperationPanel } from "@/shared/spreadsheet/SpreadsheetOperationPanel";
import { toolbarControlClassName } from "@/shared/components/crud/toolbarControlClassName";
import { useSpreadsheetWorkspace } from "@/shared/spreadsheet/useSpreadsheetWorkspace";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

function normalizeMedia(media) {
  if (!media) return null;
  if (Array.isArray(media)) return media;
  const list = media.urls || media.images || media.paths;
  if (Array.isArray(list)) return list;
  return typeof media === "string" ? [media] : null;
}

export default function ReviewsPage() {
  const viewMode = "list";
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState("");
  const listQuery = useReviews({ per_page: 20, ...(query.trim() ? { search: query.trim() } : {}), ...(rating ? { rating } : {}) });
  const updateReview = useUpdateReview();
  const [activeToggleId, setActiveToggleId] = useState(null);

  const toggleReviewActive = async (row, next) => {
    if (updateReview.isPending) return;
    setActiveToggleId(row.id);
    try {
      await updateReview.mutateAsync({
        id: row.id,
        values: { rating: Number(row.rating || 0), review: row.review || null, media: normalizeMedia(row.media), is_active: next },
      });
      toastSuccess("Status Review", `Review ${row.product_name ? `untuk ${row.product_name}` : ""}ditandai ${next ? "aktif" : "nonaktif"}.`);
    } catch (error) {
      toastError("Status Review", advancedError(error));
    } finally {
      setActiveToggleId(null);
    }
  };
  const spreadsheet = useSpreadsheetWorkspace({ module: "review", label: "Review & Rating", allowImport: false, allowBulkDelete: false });
  const rows = listQuery.data?.rows || [];
  const total = useListTotalCount(listQuery.data?.meta, { fallbackTotal: rows.length, label: "Review" });
  const editor = useEntityEditor({ getEditLabel: (row) => row.product_name || `Review #${row.id}` });
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: listQuery.refetch });
  const columns = [
    { key: "product_name", label: "Produk" },
    { key: "order_number", label: "Order" },
    { key: "user_name", label: "Buyer" },
    { key: "rating", label: "Rating", render: (row) => `${"★".repeat(Number(row.rating || 0))}${"☆".repeat(Math.max(0, 5 - Number(row.rating || 0)))}` },
    { key: "review", label: "Review" },
    { key: "is_active", label: "Status", filterable: false, render: (row) => <InlineActiveSwitch checked={row.is_active !== false} pending={activeToggleId === row.id} activeLabel="Aktif" inactiveLabel="Nonaktif" compact onChange={(next) => toggleReviewActive(row, next)} /> },
    { key: "created_at", label: "Tanggal", render: (row) => row.created_at ? new Date(row.created_at).toLocaleString("id-ID") : "-" },
    // Sisa kolom database review (relasi produk/user/order sudah ada di atas).
    ...buildDatabaseColumns(rows, {
      omit: ["id", "product_id", "review_id", "user_id", "order_id", "order_item_id", "product_name", "order_number", "user_name", "rating", "review", "is_active", "created_at", "product", "user", "order", "order_item"],
      labels: {
        comment: "Komentar",
        images: "Foto",
        reply: "Balasan Penjual",
        replied_at: "Dibalas",
        is_visible: "Tampil",
        created_by_user: "Dibuat Oleh",
        updated_by_user: "Diubah Oleh",
        updated_at: "Diubah",
        deleted_at: "Dihapus",
      },
    }),
  ];

  const reviewCard = {
    title: (row) => row.product_name || `Review #${row.id}`,
    subtitle: (row) => [row.user_name, row.order_number].filter(Boolean).join(" · ") || "-",
    fields: [
      { label: "Rating", render: (row) => `${"★".repeat(Number(row.rating || 0))}${"☆".repeat(Math.max(0, 5 - Number(row.rating || 0)))}` },
      { label: "Tanggal", render: (row) => (row.created_at ? new Date(row.created_at).toLocaleDateString("id-ID") : "-") },
      { label: "Review", render: (row) => row.review || "-" },
    ],
  };

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
            viewMode="list"
            card={reviewCard}
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