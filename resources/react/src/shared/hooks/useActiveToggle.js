import { useCallback, useState } from "react";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";

function defaultActiveOf(row) {
  if (row?.isActive !== undefined) return Boolean(row.isActive);
  if (row?.is_active !== undefined) return Boolean(row.is_active);
  return String(row?.status || "").toLowerCase() !== "nonaktif"
    && String(row?.status || "").toLowerCase() !== "inactive";
}

/**
 * Toggle aktif/nonaktif yang langsung berubah di layar (optimistic) walau
 * backend belum selesai. Bila backend gagal, status dikembalikan dan
 * kegagalan dikirim ke notification center dengan tombol "Buka data" agar
 * pengguna bisa langsung memeriksa datanya.
 */
export function useActiveToggle({
  mutate,
  errorMessage,
  activeOf = defaultActiveOf,
  labelOf = (row) => row?.name || row?.title || row?.email || `#${row?.id}`,
  onSettled,
  openDetail,
  enabled = true,
}) {
  const notifications = useNotificationCenter();
  const [optimistic, setOptimistic] = useState({});

  const isActive = useCallback((row) => {
    const key = String(row?.id ?? "");
    if (key && key in optimistic) return optimistic[key];
    return activeOf(row);
  }, [optimistic, activeOf]);

  const pending = useCallback((row) => String(row?.id ?? "") in optimistic, [optimistic]);

  const toggle = useCallback((row, nextActive) => {
    if (!enabled || !row) return;
    const key = String(row.id);
    const previous = isActive(row);
    const label = labelOf(row);

    setOptimistic((prev) => ({ ...prev, [key]: nextActive }));

    const task = notifications.startTask({
      title: nextActive ? "Aktifkan Data" : "Nonaktifkan Data",
      message: `Memproses ${label}...`,
    });

    const settle = () => setOptimistic((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    Promise.resolve()
      .then(() => mutate(row, nextActive))
      .then(() => {
        settle();
        task.success(`${label} berhasil ${nextActive ? "diaktifkan" : "dinonaktifkan"}.`);
        onSettled?.(row, nextActive);
      })
      .catch((error) => {
        setOptimistic((prev) => ({ ...prev, [key]: previous }));
        const message = errorMessage?.(error) || "Status aktif gagal diubah.";
        task.fail(message);
        notifications.push({
          type: "error",
          status: "failed",
          title: nextActive ? "Gagal Mengaktifkan Data" : "Gagal Menonaktifkan Data",
          message: `${label}: ${message}`,
          actionLabel: openDetail ? "Buka data" : "Buka notifikasi",
          onAction: () => {
            if (openDetail) openDetail(row);
            else notifications.openPanel("info");
          },
        });
      });
  }, [enabled, errorMessage, isActive, labelOf, mutate, notifications, onSettled, openDetail]);

  return { isActive, toggle, pending, optimistic };
}
