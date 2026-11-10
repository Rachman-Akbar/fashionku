import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { advancedError, useCreateReview } from "@/features/advanced/services/advancedMarketplaceService";
import { uploadMarketplaceImage, getMediaUploadError } from "@/shared/services/mediaUploadService";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

function RatingStars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} bintang`}
          className="transition hover:scale-110"
        >
          <Star
            size={26}
            className={
              star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function OrderReviewModal({
  item,
  open,
  onClose,
  onSaved,
}) {
  const fileInputRef = useRef(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const reviewMutation = useCreateReview();

  useEffect(() => {
    if (open) {
      setRating(5);
      setReviewText("");
      setMedia([]);
      setUploading(false);
    }
  }, [open, item?.id]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open || !item) {
    return null;
  }

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);

    try {
      const uploaded = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} melebihi batas 5 MB.`);
        }
        const result = await uploadMarketplaceImage(file, "reviews");
        uploaded.push(result.url);
        if (uploaded.length + media.length >= 5) break;
      }

      setMedia((current) =>
        [...current, ...uploaded].filter(Boolean).slice(0, 5),
      );
    } catch (error) {
      toastError("Upload Foto Review", getMediaUploadError(error));
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (url) => {
    setMedia((current) => current.filter((item) => item !== url));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      order_item_id: Number(item.id),
      rating: Number(rating),
      review: reviewText.trim() || null,
    };

    if (media.length) {
      payload.media = media;
    }

    try {
      await reviewMutation.mutateAsync(payload);
      onSaved?.(item);
      onClose?.();
      toastSuccess("Kirim Review", "Terima kasih! Review Anda berhasil dikirim.");
    } catch (error) {
      toastError("Kirim Review", advancedError(error));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Beri review ${item.productName || "produk"}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-40px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.productName || "Produk"}
                className="h-12 w-12 rounded-xl border border-slate-100 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                <Star size={22} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#10B981]">
                Review Produk
              </p>
              <h3 className="mt-0.5 truncate font-black text-slate-900">
                {item.productName || "Produk"}
              </h3>
              {item.variantLabel ? (
                <p className="truncate text-xs text-slate-500">
                  Varian: {item.variantLabel}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-slate-700">
            Rating Anda
            <span className="ml-1 text-xs font-normal text-slate-400">
              (wajib)
            </span>
          </p>
          <div className="mt-2">
            <RatingStars value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold text-slate-700">Ulasan</p>
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Bagaimana kualitas produknya? Tulis pengalaman Anda di sini..."
            className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold text-slate-700">
            Tambah Foto
            <span className="ml-1 text-xs font-normal text-slate-400">
              opsional, maksimal 5 foto (masing-masing 5 MB)
            </span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFiles}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading || media.length >= 5}
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 text-sm font-bold text-slate-600 transition hover:border-[#10B981] hover:text-[#10B981] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImagePlus size={16} />
            )}
            {uploading ? "Mengunggah..." : "Pilih Foto"}
          </button>

          {media.length ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {media.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                >
                  <img
                    src={resolveMediaUrl(url)}
                    alt="Lampiran review"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(url)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                    aria-label="Hapus foto"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={reviewMutation.isPending || uploading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#10B981] px-6 text-sm font-bold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            {reviewMutation.isPending ? "Mengirim..." : "Kirim Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
