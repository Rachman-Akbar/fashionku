import { memo, useEffect, useRef, useState } from "react";
import { getMediaUploadError, uploadMarketplaceImage } from "@/shared/services/mediaUploadService";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";

export const MultiImagePicker = memo(function MultiImagePicker({
  value = [],
  onChange,
  scope = "general",
  label = "Unggah bukti",
  accept = "image/png,image/jpeg,image/webp",
  maxSizeMb = 5,
  maxFiles = 5,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadedUrlsRef = useRef(value || []);

  useEffect(() => {
    if (value && value.length !== uploadedUrlsRef.current.length) {
      uploadedUrlsRef.current = value || [];
      setPreviews((value || []).map((url) => ({ url, uploaded: true })));
    }
  }, [value]);

  const removePreview = (index, isUploaded) => {
    setPreviews((current) => {
      const next = [...current];
      const removed = next.splice(index, 1)[0];
      if (isUploaded && removed.url) {
        uploadedUrlsRef.current = uploadedUrlsRef.current.filter((u) => u !== removed.url);
        onChange?.([...uploadedUrlsRef.current]);
      } else if (!isUploaded) {
        onChange?.([...uploadedUrlsRef.current]);
      }
      return next;
    });
  };

  const selectFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const currentCount = previews.length;
    const availableSlots = maxFiles - currentCount;
    const filesToUpload = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      setError(`Maksimal ${maxFiles} gambar. ${files.length - availableSlots} gambar diabaikan.`);
    }

    setUploading(true);
    setError("");

    for (const file of filesToUpload) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`Ukuran gambar maksimal ${maxSizeMb} MB.`);
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      const previewIndex = previews.length;
      setPreviews((current) => [...current, { url: objectUrl, file, uploaded: false, objectUrl }]);

      try {
        const uploaded = await uploadMarketplaceImage(file, scope);
        uploadedUrlsRef.current = [...uploadedUrlsRef.current, uploaded.url];
        onChange?.([...uploadedUrlsRef.current]);
        setPreviews((current) => {
          const next = [...current];
          next[previewIndex] = { url: uploaded.url, uploaded: true, objectUrl: null };
          if (next[previewIndex].objectUrl) URL.revokeObjectURL(next[previewIndex].objectUrl);
          return next;
        });
      } catch (uploadError) {
        setPreviews((current) => {
          const next = [...current];
          next.splice(previewIndex, 1);
          if (next[previewIndex]?.objectUrl) URL.revokeObjectURL(next[previewIndex].objectUrl);
          return next;
        });
        setError(getMediaUploadError(uploadError));
      }
    }

    setUploading(false);
  };

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.objectUrl) URL.revokeObjectURL(p.objectUrl);
      });
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || uploading || previews.length >= maxFiles}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-9 items-center gap-[5px] border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          {label} ({previews.length}/{maxFiles})
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={selectFiles} className="hidden" multiple />
        {uploading && <span className="text-xs text-slate-500 animate-pulse">Mengunggah...</span>}
      </div>

      {previews.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden ring-1 ring-slate-200">
              {preview.url ? (
                <img
                  src={preview.url}
                  alt={`Bukti ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={() => {
                    if (!preview.objectUrl) {
                      setError("Preview gambar tidak dapat dimuat.");
                    }
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl">image</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removePreview(index, preview.uploaded)}
                disabled={uploading}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-white/90 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full shadow-sm transition"
                aria-label="Hapus gambar"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              {!preview.uploaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium">
                  Mengunggah...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <p className="text-xs text-slate-500">Format: PNG, JPG, WebP. Maksimal {maxSizeMb} MB per file.</p>
    </div>
  );
});