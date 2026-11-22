import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function showToast(type, title, message = "") {
  return Toast.fire({
    icon: type,
    title: message ? title : undefined,
    text: message || title,
  });
}

export function showSuccess(title, message = "") {
  return showToast("success", title, message);
}

export function showError(title, message = "") {
  return showToast("error", title, message);
}

export function showWarning(title, message = "") {
  return showToast("warning", title, message);
}

export function showInfo(title, message = "") {
  return showToast("info", title, message);
}

export function showLoading(title = "Memproses...", message = "") {
  return Swal.fire({
    title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function closeLoading() {
  Swal.close();
}

export function confirmAction({
  title = "Konfirmasi",
  text = "Apakah Anda yakin?",
  icon = "warning",
  confirmButtonText = "Ya, lanjutkan",
  cancelButtonText = "Batal",
  confirmButtonColor = "#059669",
  cancelButtonColor = "#64748b",
}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons: true,
  });
}

export function confirmDelete({ title = "Hapus Data", text = "Data yang dihapus tidak dapat dikembalikan.", confirmButtonText = "Hapus", cancelButtonText = "Batal" }) {
  return confirmAction({
    title,
    text,
    icon: "warning",
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#dc2626",
  });
}

export function confirmLogout() {
  return confirmAction({
    title: "Keluar dari Aplikasi?",
    text: "Anda akan keluar dari sesi saat ini. Lanjutkan?",
    icon: "question",
    confirmButtonText: "Keluar",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626",
  });
}

export function confirmLeaveUnsaved({ title = "Perubahan Belum Tersimpan", text = "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?", confirmButtonText = "Tetap Keluar", cancelButtonText = "Batal" }) {
  return confirmAction({
    title,
    text,
    icon: "warning",
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#d97706",
  });
}

export function confirmCancelChanges({ title = "Batalkan Perubahan?", text = "Semua perubahan yang belum disimpan akan hilang. Lanjutkan?", confirmButtonText = "Ya, Batalkan", cancelButtonText = "Lanjutkan Edit" }) {
  return confirmAction({
    title,
    text,
    icon: "warning",
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#d97706",
  });
}

export function showSuccessModal(title, message = "", confirmButtonText = "OK") {
  return Swal.fire({
    title,
    text: message,
    icon: "success",
    confirmButtonText,
    confirmButtonColor: "#059669",
    timer: 5000,
    timerProgressBar: true,
  });
}

export function showErrorModal(title, message = "", confirmButtonText = "OK") {
  return Swal.fire({
    title,
    text: message,
    icon: "error",
    confirmButtonText,
    confirmButtonColor: "#dc2626",
  });
}

export function showInputDialog({ title = "Masukkan Data", text = "", inputPlaceholder = "", inputValue = "", confirmButtonText = "Simpan", cancelButtonText = "Batal", inputType = "text" }) {
  return Swal.fire({
    title,
    text,
    input: inputType,
    inputPlaceholder,
    inputValue,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#059669",
    cancelButtonColor: "#64748b",
    inputValidator: (value) => {
      if (!value) {
        return "Field ini wajib diisi";
      }
      return null;
    },
  });
}