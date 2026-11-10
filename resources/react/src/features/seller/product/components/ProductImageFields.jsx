import { memo, useRef, useState } from "react";
import { createClientId } from "@/core/utils/clientId";
import { getMediaUploadError, uploadMarketplaceImage } from "@/shared/services/mediaUploadService";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export const ProductImageFields = memo(function ProductImageFields({ images, error, onChange }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const remove = (index) => onChange(images.filter((_, imageIndex) => imageIndex !== index));

  const makePrimary = (index) => {
    if (index === 0) return;
    const selected = images[index];
    onChange([selected, ...images.filter((_, imageIndex) => imageIndex !== index)]);
  };

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setUploadError("");

    try {
      const uploaded = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} melebihi batas 5 MB.`);
        }
        const result = await uploadMarketplaceImage(file, "products");
        uploaded.push({
          clientId: createClientId("image"),
          url: result.url,
          altText: file.name.replace(/\.[^.]+$/, ""),
        });
      }
      onChange([...images.filter((image) => image.url), ...uploaded]);
    } catch (uploadException) {
      setUploadError(uploadException?.message || getMediaUploadError(uploadException));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={uploadFiles} className="hidden" />
      <div className="flex flex-wrap items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-[5px]">
          <span className="material-symbols-outlined text-slate-400">image</span>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Gambar Produk</h2>
            <p className="mt-0.5 text-xs text-slate-500">Pilih file JPG, PNG, atau WEBP. Gambar pertama menjadi gambar utama.</p>
          </div>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center justify-center gap-[5px] border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Pilih Gambar
        </button>
      </div>
      {error || uploadError ? <p className="text-xs font-semibold text-red-600">{error || uploadError}</p> : null}

      {images.filter((image) => image.url).length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.filter((image) => image.url).map((image, index) => (
            <div key={image.id || image.clientId || `image-${index}`} className="group relative aspect-square overflow-hidden border border-slate-200 bg-slate-100">
              <button
                type="button"
                onClick={() => setPreviewUrl(resolveMediaUrl(image.url))}
                className="block h-full w-full"
                title="Klik untuk memperbesar"
              >
                <img src={resolveMediaUrl(image.url)} alt={image.altText || `Gambar produk ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </button>
              {index === 0 ? <span className="absolute left-2 top-2 bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">Utama</span> : null}
              <div className="absolute right-2 top-1.5 flex gap-1.5">
                {index !== 0 ? (
                  <button
                    type="button"
                    onClick={() => makePrimary(images.indexOf(image))}
                    title="Jadikan utama"
                    aria-label="Jadikan utama"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow ring-1 ring-slate-200 transition-colors hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">star</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(images.indexOf(image))}
                  title="Hapus gambar"
                  aria-label="Hapus gambar"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-600 shadow ring-1 ring-slate-200 transition-colors hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-52 w-full flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100">
          <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
          <span className="mt-2 text-sm font-bold">Pilih gambar produk</span>
          <span className="mt-1 text-xs">Bisa memilih beberapa file sekaligus</span>
        </button>
      )}

      {previewUrl ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" onClick={() => setPreviewUrl("")}>
          <button type="button" onClick={() => setPreviewUrl("")} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-white text-slate-800" aria-label="Tutup preview">
            <span className="material-symbols-outlined">close</span>
          </button>
          <img src={resolveMediaUrl(previewUrl)} alt="Preview besar produk" className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </div>
  );
});
