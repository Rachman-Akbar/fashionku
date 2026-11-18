import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  getApiMessage,
  unwrapApiData,
} from "@/core/utils/apiClient";
import {
  normalizePayment,
  sellerStoreKeys,
} from "@/features/seller/store/services/sellerStoreService";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { Button } from "@/shared/components/ui/Button";
import { useObjectUrl } from "@/shared/hooks/useObjectUrl";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

// Berada di bawah `sellerStoreKeys.all`, sehingga satu invalidasi setelah
// simpan ikut me-refresh preview QRIS ini dan cache `useSellerStore`.
const QRIS_SETTINGS_KEY = [...sellerStoreKeys.all, "qris"];

const MAX_IMAGE_KB = 2048;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = {
  qris_enabled: false,
  qris_merchant_name: "",
  qris_notes: "",
};

async function getQrisSettings() {
  const response = await apiClient.get("/api/v1/seller/settings/store");
  const profile = unwrapApiData(response.data) || {};
  return normalizePayment(profile.payment);
}

async function saveQrisSettings(formData) {
  const response = await apiClient.post(
    "/api/v1/seller/settings/store",
    formData,
  );
  const profile = unwrapApiData(response.data) || {};
  return normalizePayment(profile.payment);
}

function getImageError(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Gambar QRIS harus berformat JPG, PNG, atau Webp.";
  }

  if (file.size > MAX_IMAGE_KB * 1024) {
    return `Ukuran gambar QRIS maksimal ${MAX_IMAGE_KB} KB.`;
  }

  return "";
}

export default function AdminQrisSettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const imagePreviewUrl = useObjectUrl(image);

  const settingsQuery = useQuery({
    queryKey: QRIS_SETTINGS_KEY,
    queryFn: getQrisSettings,
    staleTime: 30000,
  });

  const saveMutation = useMutation({
    mutationFn: saveQrisSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerStoreKeys.all });
    },
  });

  const qris = settingsQuery.data || null;

  useEffect(() => {
    if (!qris) return;
    setForm({
      qris_enabled: qris.enabled,
      qris_merchant_name: qris.merchant_name,
      qris_notes: qris.notes ?? "",
    });
  }, [qris]);

  const change = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const previewUrl = imagePreviewUrl || qris?.image_url || "";
  const pending = saveMutation.isPending;

  const submit = async (event) => {
    event.preventDefault();

    if (image) {
      const imageError = getImageError(image);
      if (imageError) {
        toastError("Pembayaran QRIS", imageError);
        return;
      }
    }

    const formData = new FormData();
    formData.append("qris_enabled", form.qris_enabled ? "1" : "0");
    formData.append("qris_merchant_name", form.qris_merchant_name.trim());
    formData.append("qris_notes", form.qris_notes.trim());
    if (image) formData.append("qris_image", image);

    try {
      await saveMutation.mutateAsync(formData);
      setImage(null);
      toastSuccess("Pembayaran QRIS", "Pengaturan QRIS berhasil disimpan.");
    } catch (error) {
      toastError(
        "Pembayaran QRIS",
        getApiMessage(error, "Gagal menyimpan pengaturan QRIS."),
      );
    }
  };

  const removeImage = async () => {
    const formData = new FormData();
    formData.append("remove_qris_image", "1");

    try {
      await saveMutation.mutateAsync(formData);
      setImage(null);
      toastSuccess(
        "Pembayaran QRIS",
        "Gambar QRIS dihapus dan QRIS otomatis dinonaktifkan.",
      );
    } catch (error) {
      toastError(
        "Pembayaran QRIS",
        getApiMessage(error, "Gagal menghapus gambar QRIS."),
      );
    }
  };

  if (settingsQuery.isPending) {
    return <div className="mt-6 text-sm text-slate-500">Memuat...</div>;
  }

  return (
    <div className="max-w-3xl">
      <form
        onSubmit={submit}
        className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
      >
        {settingsQuery.isError ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {getApiMessage(
              settingsQuery.error,
              "Gagal memuat pengaturan QRIS.",
            )}
          </p>
        ) : null}

        <div className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">
            Gambar QRIS
          </span>
          <div className="flex flex-wrap items-start gap-4">
            <div className="h-44 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview gambar QRIS"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl">
                    qr_code
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-56 flex-1 space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500"
              />
              <p className="text-xs text-slate-500">
                Format JPG, PNG, atau Webp, maksimal {MAX_IMAGE_KB} KB.
                Mengunggah gambar baru otomatis mengaktifkan QRIS.
              </p>
              <div className="flex flex-wrap gap-2">
                {qris?.image_url && !image ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={removeImage}
                  >
                    Hapus gambar
                  </Button>
                ) : null}
                {image ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => setImage(null)}
                  >
                    Batalkan pilihan gambar
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <span className="block text-sm font-semibold text-slate-700">
              Aktifkan QRIS
            </span>
            <span className="text-xs text-slate-500">
              Tampilkan QRIS sebagai metode pembayaran pada halaman checkout
              pembeli.
            </span>
          </div>
          <InlineActiveSwitch
            checked={form.qris_enabled}
            onChange={(checked) =>
              setForm((current) => ({ ...current, qris_enabled: checked }))
            }
            disabled={pending}
            activeLabel="Aktif"
            inactiveLabel="Nonaktif"
          />
        </div>

        <label className="block text-sm">
          <span className="font-semibold text-slate-700">
            Nama merchant QRIS
          </span>
          <input
            type="text"
            maxLength={120}
            value={form.qris_merchant_name}
            onChange={change("qris_merchant_name")}
            placeholder="Contoh: Fashionku Store"
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 outline-none transition focus:border-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Maksimal 120 karakter. Tampil sebagai nama penerima pada QRIS.
          </span>
        </label>

        <label className="block text-sm">
          <span className="font-semibold text-slate-700">Catatan</span>
          <textarea
            rows={3}
            maxLength={500}
            value={form.qris_notes}
            onChange={change("qris_notes")}
            placeholder="Scan QRIS lalu kirim bukti transfer"
            className="mt-1 min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Maksimal 500 karakter. Ditampilkan di bawah gambar QRIS saat
            pembeli memilih metode pembayaran.
          </span>
        </label>

        <div className="pt-1">
          <Button type="submit" disabled={pending}>
            {pending ? "Menyimpan..." : "Simpan Pengaturan QRIS"}
          </Button>
        </div>
      </form>
    </div>
  );
}
