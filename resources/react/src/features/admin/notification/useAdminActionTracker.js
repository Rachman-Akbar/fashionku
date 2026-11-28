import { useCallback, useMemo, useRef, useState } from "react";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { showSuccess, showError, showLoading, closeLoading } from "@/shared/utils/sweetAlert";

const actionIdRef = { current: 0 };
const SUCCESS_DISMISS_MS = 2500;

function generateActionId() {
  actionIdRef.current += 1;
  return `action_${Date.now()}_${actionIdRef.current}`;
}

/**
 * Pelacak aksi admin yang mendorong progres ke NotificationCenter (antrean)
 * sekaligus menampilkan indikator loading SweetAlert2.
 *
 * Alur:
 * - startAction: tutup modal (onStart), buka dropdown notifikasi, tampilkan loading.
 * - completeAction sukses: notifikasi antrean otomatis hilang (tidak menumpuk) +
 *   popup sukses SweetAlert2.
 * - completeAction/failAction gagal: notifikasi tetap ada dengan tombol
 *   "Coba Lagi" dan "Lihat Detail" untuk kembali ke data yang gagal.
 */
export function useAdminActionTracker() {
  const center = useNotificationCenter();
  const pendingRef = useRef(new Map());
  const loadingRef = useRef(null);
  const [, forceRender] = useState(0);

  const clearLoading = useCallback(() => {
    if (loadingRef.current) {
      closeLoading();
      loadingRef.current = null;
    }
  }, []);

  const startAction = useCallback((action = {}) => {
    const id = generateActionId();
    const actionData = {
      id,
      title: action.title || "Memproses",
      message: action.message || "Sedang memproses...",
      module: action.module || "general",
      url: action.url || null,
      referenceId: action.referenceId ?? null,
      referenceType: action.referenceType || null,
      onRetry: action.onRetry || null,
      onDetail: action.onDetail || null,
      onStart: action.onStart || null,
      showLoading: action.showLoading !== false,
      loadingTitle: action.loadingTitle || "Memproses...",
      loadingMessage: action.loadingMessage || "",
      status: "processing",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    pendingRef.current.set(id, actionData);
    forceRender((n) => n + 1);

    center.push({
      id,
      type: "queue",
      title: actionData.title,
      message: actionData.message,
      status: "processing",
      progress: 0,
      createdAt: actionData.createdAt,
      module: actionData.module,
      url: actionData.url,
      referenceId: actionData.referenceId,
      referenceType: actionData.referenceType,
      actionLabel: "",
      onAction: null,
    });

    center.openPanel("queue");

    if (actionData.showLoading) {
      clearLoading();
      loadingRef.current = showLoading(actionData.loadingTitle, actionData.loadingMessage);
    }

    if (typeof actionData.onStart === "function") {
      actionData.onStart(id);
    }

    return id;
  }, [center, clearLoading]);

  const updateActionProgress = useCallback((id, progress, message) => {
    const action = pendingRef.current.get(id);
    if (action) {
      action.progress = progress;
      if (message) action.message = message;
    }
    center.update(id, { progress, ...(message ? { message } : {}) });
  }, [center]);

  const completeAction = useCallback((id, result = {}) => {
    const action = pendingRef.current.get(id);
    if (!action) return;

    clearLoading();

    if (result.success) {
      center.update(id, {
        status: "done",
        type: "success",
        message: result.message || "Berhasil",
        progress: 100,
        read_at: new Date().toISOString(),
      });

      pendingRef.current.delete(id);
      forceRender((n) => n + 1);

      if (result.showToast !== false) {
        showSuccess(result.toastTitle || "Sukses", result.toastMessage || "Operasi berhasil diselesaikan.");
      }

      window.setTimeout(() => center.remove(id), SUCCESS_DISMISS_MS);

      if (result.autoClosePanel) {
        window.setTimeout(() => center.closePanel(), SUCCESS_DISMISS_MS);
      }
      return;
    }

    center.update(id, {
      status: "failed",
      type: "error",
      message: result.message || "Gagal",
      progress: null,
      read_at: new Date().toISOString(),
      actionLabel: "Coba Lagi",
      onAction: result.onRetry || action.onRetry,
      secondaryActionLabel: "Lihat Detail",
      onSecondaryAction: result.onDetail || action.onDetail,
    });

    pendingRef.current.delete(id);
    forceRender((n) => n + 1);

    showError(result.toastTitle || "Gagal", result.message || "Operasi gagal diselesaikan.");
  }, [center, clearLoading]);

  const failAction = useCallback((id, error, options = {}) => {
    const action = pendingRef.current.get(id);
    clearLoading();

    center.update(id, {
      status: "failed",
      type: "error",
      message: error || "Operasi gagal",
      progress: null,
      read_at: new Date().toISOString(),
      actionLabel: options.retryLabel || "Coba Lagi",
      onAction: options.onRetry || action?.onRetry || null,
      secondaryActionLabel: options.detailLabel || "Lihat Detail",
      onSecondaryAction: options.onDetail || action?.onDetail || null,
    });

    pendingRef.current.delete(id);
    forceRender((n) => n + 1);

    showError(options.toastTitle || "Gagal", error || "Operasi gagal diselesaikan.");
  }, [center, clearLoading]);

  const dismiss = useCallback((id) => {
    pendingRef.current.delete(id);
    center.remove(id);
    forceRender((n) => n + 1);
  }, [center]);

  const pendingCount = pendingRef.current.size;
  const hasProcessing = useMemo(
    () => Array.from(pendingRef.current.values()).some((a) => a.status === "processing"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingCount],
  );

  return {
    startAction,
    updateActionProgress,
    completeAction,
    failAction,
    dismiss,
    items: center.items,
    pendingCount,
    hasProcessing,
  };
}

export function createAdminAction(title, options = {}) {
  return {
    title,
    module: options.module || "general",
    message: options.message || "Sedang memproses...",
    loadingTitle: options.loadingTitle,
    loadingMessage: options.loadingMessage,
    showLoading: options.showLoading !== false,
    url: options.url,
    referenceId: options.referenceId,
    referenceType: options.referenceType,
    onRetry: options.onRetry,
    onDetail: options.onDetail,
  };
}