import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

let feedbackSink = null;

export function registerFeedbackSink(sink) {
  feedbackSink = sink || null;
  return () => {
    if (feedbackSink === sink) feedbackSink = null;
  };
}

function forwardToPanel(type, title, message) {
  if (!feedbackSink) return false;
  return feedbackSink({ type, title, message: message || "" }) === true;
}

export function toastSuccess(title, message = "") {
  if (forwardToPanel("success", title, message)) return;
  toast.fire({ icon: "success", title, text: message || "" });
}

export function toastError(title, message = "") {
  if (forwardToPanel("error", title, message)) return;
  toast.fire({ icon: "error", title, text: message || "" });
}

export function toastInfo(title, message = "") {
  if (forwardToPanel("info", title, message)) return;
  toast.fire({ icon: "info", title, text: message || "" });
}

export function confirmDiscardChanges(label = "tab ini") {
  return Swal.fire({
    title: "Perubahan belum disimpan",
    text: `Perubahan pada tab "${label}" belum disimpan. Tutup tab dan abaikan perubahan?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Tutup & abaikan",
    cancelButtonText: "Kembali",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
  }).then((result) => result.isConfirmed);
}
export function confirmClearNotifications(label = "notifikasi ini") {
  return Swal.fire({
    title: "Kosongkan notifikasi?",
    text: `Semua ${label} akan dihapus dari pusat notifikasi. Tindakan ini tidak dapat dibatalkan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, kosongkan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
  }).then((result) => result.isConfirmed);
}

export function confirmLogout() {
  return Swal.fire({
    title: "Keluar dari akun?",
    text: "Anda akan keluar dari sesi ini. Progres yang belum selesai perlu dicek kembali setelah login berikutnya.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
  }).then((result) => result.isConfirmed);
}

export function confirmRoleSwitch(roleLabel, redirectLabel = "panel") {
  return Swal.fire({
    title: `Beralih ke ${roleLabel}?`,
    text: `Sesi akan berpindah ke ${redirectLabel}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, beralih",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
  }).then((result) => result.isConfirmed);
}

export function confirmPanelModeSwitch(targetLabel, description) {
  return Swal.fire({
    title: `Beralih ke ${targetLabel}?`,
    text: description,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, beralih",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
  }).then((result) => result.isConfirmed);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

export function showOrderCreatedAlert({ orderNumber, orderId, totalLabel, requiresPayment }) {
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeTotal = escapeHtml(totalLabel);
  const safeOrderId = escapeHtml(orderId);

  return Swal.fire({
    title: "Transaksi berhasil dibuat",
    html: [
      '<p class="text-sm text-slate-600">Pesanan Anda sudah tersimpan.</p>',
      safeOrderNumber ? `<p class="mt-2 text-sm"><span class="text-slate-500">Nomor pesanan</span> <strong>${safeOrderNumber}</strong></p>` : "",
      safeTotal ? `<p class="text-sm"><span class="text-slate-500">Total</span> <strong>${safeTotal}</strong></p>` : "",
      `<p class="mt-2 text-xs text-slate-500">${requiresPayment ? "Lanjutkan pembayaran untuk menyelesaikan pesanan." : "Simpan nomor pesanan untuk pengecekan status."}</p>`,
      safeOrderId ? `<p class="mt-1 text-xs text-slate-400">Ref: ${safeOrderId}</p>` : "",
    ].join(""),
    icon: "success",
    confirmButtonText: requiresPayment ? "Lanjut pembayaran" : "Lihat pesanan",
    showCancelButton: false,
    allowOutsideClick: false,
    allowEnterKey: false,
    customClass: { htmlContainer: "text-left" },
  });
}
