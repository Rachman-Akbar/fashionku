import { memo, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { isDeleteConfirmSkipped, setDeleteConfirmSkipped } from "@/shared/utils/skipConfirm";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

/**
 * Dialog konfirmasi (mis. hapus) berbasis SweetAlert2. Menutup seketika saat
 * tombol konfirmasi ditekan (tidak menunggu proses async) agar tidak kalah
 * cepat dengan panel notifikasi. Opsi "jangan tanyakan lagi hari ini" tetap
 * didukung. `children`/`pending` tetap diterima demi kompatibilitas pemanggil
 * lama, tetapi diabaikan.
 */
export const ConfirmDialog = memo(function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Hapus",
  confirmTone = "danger",
  snoozeable = true,
  onConfirm,
  onClose,
}) {
  const activeRef = useRef(false);
  const confirmRef = useRef(onConfirm);
  const closeRef = useRef(onClose);
  confirmRef.current = onConfirm;
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      if (activeRef.current) {
        activeRef.current = false;
        Swal.close();
      }
      return undefined;
    }

    if (activeRef.current) return undefined;

    if (snoozeable && isDeleteConfirmSkipped()) {
      confirmRef.current?.();
      closeRef.current?.();
      return undefined;
    }

    activeRef.current = true;
    const confirmColor = confirmTone === "neutral" ? "#0f172a" : "#dc2626";
    const safeMessage = escapeHtml(message || "");
    const html = snoozeable
      ? `${safeMessage}<label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;font-weight:600;color:#64748b;cursor:pointer"><input id="ziip-snooze-confirm" type="checkbox" style="width:16px;height:16px;accent-color:#dc2626">Jangan tanyakan lagi hari ini</label>`
      : safeMessage;

    Swal.fire({
      title,
      html,
      icon: confirmTone === "neutral" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: confirmLabel,
      cancelButtonText: "Batal",
      confirmButtonColor: confirmColor,
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      allowOutsideClick: false,
      preConfirm: () => ({ snooze: Boolean(document.getElementById("ziip-snooze-confirm")?.checked) }),
    }).then((result) => {
      activeRef.current = false;
      if (result.isConfirmed) {
        if (snoozeable && result.value?.snooze) setDeleteConfirmSkipped(true);
        confirmRef.current?.();
      } else {
        closeRef.current?.();
      }
    });

    return undefined;
  }, [open, title, message, confirmLabel, confirmTone, snoozeable]);

  return null;
});