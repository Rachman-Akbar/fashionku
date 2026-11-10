import { useMemo, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { advancedError, useDeleteReview, useUpdateReview } from "@/features/advanced/services/advancedMarketplaceService";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { Input } from "@/shared/components/ui/Input";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormActionDock, FormEditorLayout } from "@/shared/components/crud";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("id-ID");
}

function stars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating || 0)));
  return `${"★".repeat(value)}${"☆".repeat(5 - value)}`;
}

function mediaItems(media) {
  if (!media) return [];
  if (Array.isArray(media)) {
    return media
      .map((item) => (typeof item === "string" ? item : item?.url || item?.path || ""))
      .filter(Boolean);
  }
  const urls = media.urls || media.images || media.paths;
  if (Array.isArray(urls)) {
    return urls.filter(Boolean);
  }
  return typeof media === "string" ? [media] : [];
}

function ReviewDetailForm({ row, onClose, onSaved, onDeleted }) {
  const { activeRole } = useAuth();
  const admin = activeRole === "admin";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [active, setActive] = useState(Boolean(row?.is_active));
  const [busy, setBusy] = useState(false);
  const updateMutation = useUpdateReview();
  const deleteMutation = useDeleteReview();

  const rawMedia = useMemo(() => mediaItems(row?.media), [row]);
  const media = useMemo(() => rawMedia.map(resolveMediaUrl), [rawMedia]);
  const buyerAvatar = row?.user_avatar || row?.userAvatar || "";
  const productThumb = row?.product_thumbnail || row?.productThumbnail || row?.thumbnail || "";
  const productSlug = row?.product_slug || row?.productSlug || "";

  if (!row) return null;

  const handleSave = async () => {
    setBusy(true);
    try {
      await updateMutation.mutateAsync({
        id: row.id,
        values: {
          rating: Number(row.rating || 0),
          review: row.review || null,
          media: rawMedia.length ? rawMedia : null,
          is_active: active,
        },
      });
      onSaved?.();
      toastSuccess("Simpan Review", "Review berhasil diperbarui.");
    } catch (error) {
      toastError("Simpan Review", advancedError(error));
    } finally {
      setBusy(false);
    }
  };

  const handleOpenMarketplace = () => {
    if (!productSlug) return;
    window.open(`/products/${productSlug}`, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(row.id);
      setConfirmOpen(false);
      onDeleted?.();
      onClose?.();
      toastSuccess("Hapus Review", "Review berhasil dihapus.");
    } catch (error) {
      toastError("Hapus Review", advancedError(error));
    }
  };

  return (
    <>
      <FormEditorLayout
        actions={
          <FormActionDock
            tone="emerald"
            save={{ icon: "save", label: "Simpan" }}
            showSave={admin}
            onSave={handleSave}
            onDelete={admin ? () => setConfirmOpen(true) : undefined}
            deleteLabel="Hapus Review"
            extraActions={[{ icon: "storefront", label: "Kunjungi di Marketplace", onClick: handleOpenMarketplace, disabled: !productSlug }]}
          />
        }
      >
        <FormPageLayout
          title="Detail Review"
          subtitle={`Review #${row.id}${row.order_number ? ` · Order ${row.order_number}` : ""}`}
          lead={
            !active ? (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold uppercase text-rose-600">Nonaktif</span>
            ) : undefined
          }
        >
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              {productThumb ? (
                <img src={resolveMediaUrl(productThumb)} alt={row.product_name || "Produk"} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200" loading="lazy" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-black text-slate-900">{row.product_name || "Produk"}</p>
                <p className="text-sm text-slate-500">Order: {row.order_number || "-"}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{formatDate(row.created_at)}</p>
              </div>
              <div className="text-right text-2xl tracking-wide text-amber-400" title={`${Number(row.rating || 0)} dari 5`}>{stars(row.rating)}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              {buyerAvatar ? (
                <img src={resolveMediaUrl(buyerAvatar)} alt={row.user_name || "Buyer"} className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200" loading="lazy" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">{row.user_name || "Buyer"}</p>
                <p className="text-[11px] font-semibold text-slate-400">{formatDate(row.created_at)}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{row.review || "Tidak ada isi review."}</p>
            {media.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {media.map((url, index) => (
                  <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Lampiran ${index + 1}`} className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200" loading="lazy" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">description</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Detail Review</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Rating</span>
                <Input value={`${Number(row.rating || 0)} / 5`} disabled />
              </label>
              <div className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Status</span>
                <div className="flex h-11 items-center rounded-xl border border-slate-300 bg-white px-3">
                  <InlineActiveSwitch checked={active} onChange={setActive} disabled={!admin} pending={busy} showLabel={false} />
                </div>
              </div>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Produk</span>
                <Input value={row.product_name || "-"} disabled />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Order</span>
                <Input value={row.order_number || "-"} disabled />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Buyer</span>
                <Input value={row.user_name || "-"} disabled />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Dibuat</span>
                <Input value={formatDate(row.created_at)} disabled />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Diperbarui</span>
                <Input value={formatDate(row.updated_at)} disabled />
              </label>
            </div>
          </div>
        </FormPageLayout>
      </FormEditorLayout>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus Review"
        message={`Review untuk produk “${row.product_name || ""}” akan dihapus.`}
        pending={deleteMutation.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ReviewDetailForm;
export { ReviewDetailForm };
