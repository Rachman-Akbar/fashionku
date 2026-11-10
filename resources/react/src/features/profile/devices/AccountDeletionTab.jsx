import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2, X, CheckCircle2 } from "lucide-react";
import { requestAccountDeletionOtp, deleteAccount, resendAccountDeletionOtp } from "./accountDeletionService";
import OtpVerifyDialog from "@/core/engine/OtpVerifyDialog";
import { confirmLogout, toastSuccess, toastError } from "@/shared/utils/userFeedback";

export default function AccountDeletionTab({ onLogout, navigate }) {
  const queryClient = useQueryClient();
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const requestOtpMutation = useMutation({
    mutationFn: requestAccountDeletionOtp,
    onSuccess: () => {
      setShowOtp(true);
      setOtpSent(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Gagal mengirim kode verifikasi.");
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: resendAccountDeletionOtp,
    onSuccess: () => {
      setOtpSent(true);
      setError("");
      toastSuccess("Verifikasi", "Kode verifikasi baru telah dikirim.");
    },
    onError: (err) => {
      setError(err.message || "Gagal mengirim ulang kode verifikasi.");
    },
  });

  const handleVerify = useCallback(async (code) => {
    setDeleting(true);
    setError("");
    try {
      await deleteAccount(code);
      toastSuccess("Akun", "Akun berhasil dihapus secara permanen.");
      
      // Clear all sessions
      localStorage.clear();
      sessionStorage.clear();
      
      if (navigate) {
        navigate("/", { replace: true });
      } else if (window.close) {
        window.close();
      }
    } catch (err) {
      setError(err.message || "Kode verifikasi salah atau sudah kedaluwarsa.");
    } finally {
      setDeleting(false);
    }
  }, [navigate]);

  const handleRequestOtp = useCallback(() => {
    if (!showOtp) {
      requestOtpMutation.mutate();
    } else {
      resendOtpMutation.mutate();
    }
  }, [showOtp, requestOtpMutation, resendOtpMutation]);

  return (
    <div className="max-w-[760px]">
      <div className="mb-8 flex min-h-[64px] gap-3 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
        <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={18} />
        <div>
          <p className="font-black">Peringatan: Tindakan ini tidak dapat dibatalkan</p>
          <p className="mt-1">
            Menghapus akun akan menghapus semua data Anda termasuk riwayat pesanan,
            alamat, preferensi, dan data marketplace lainnya. Beberapa data transaksi
            mungkin tetap disimpan untuk kepatuhan hukum dan keperluan operasional.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-black text-red-700">Konsekuensi Penghapusan Akun</h3>
          <ul className="mt-4 space-y-3 text-sm text-red-600">
            <li className="flex items-start gap-2">
              <Trash2 className="mt-0.5 shrink-0 text-red-500" size={16} />
              <span>Akun akan dinonaktifkan dan tidak dapat diakses lagi</span>
            </li>
            <li className="flex items-start gap-2">
              <Trash2 className="mt-0.5 shrink-0 text-red-500" size={16} />
              <span>Profil, alamat, dan preferensi akan dihapus</span>
            </li>
            <li className="flex items-start gap-2">
              <Trash2 className="mt-0.5 shrink-0 text-red-500" size={16} />
              <span>Semua sesi login di semua perangkat akan logout</span>
            </li>
            <li className="flex items-start gap-2">
              <Trash2 className="mt-0.5 shrink-0 text-red-500" size={16} />
              <span>Koneksi Google OAuth akan diputus</span>
            </li>
            <li className="flex items-start gap-2">
              <Trash2 className="mt-0.5 shrink-0 text-red-500" size={16} />
              <span>Data transaksi wajib simpan hukum akan dianonimkan, tidak dihapus</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black text-slate-900">Verifikasi Identitas</h3>
          <p className="mt-2 text-sm text-slate-500">
            Untuk melanjutkan penghapusan akun, masukkan kode verifikasi 6 digit
            yang dikirim ke email terdaftar Anda.
          </p>

          {!showOtp ? (
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={requestOtpMutation.isPending || resendOtpMutation.isPending}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {requestOtpMutation.isPending || resendOtpMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mengirim kode...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Kirim Kode Verifikasi Hapus Akun
                </>
              )}
            </button>
          ) : (
            <OtpVerifyDialog
              open={showOtp}
              onClose={() => { setShowOtp(false); setOtpSent(false); setError(""); }}
              title="Konfirmasi Hapus Akun"
              description="Masukkan kode verifikasi 6 digit yang dikirim ke email Anda untuk menghapus akun secara permanen."
              onVerify={handleVerify}
              onVerified={() => { setShowOtp(false); setOtpSent(false); }}
              verifiedMessage="Akun berhasil dihapus secara permanen."
              purpose="delete_account"
              expiresInMinutes={5}
            />
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {showOtp && otpSent && (
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={resendOtpMutation.isPending}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={12} />
              Kirim ulang kode
            </button>
          )}
        </div>
      </div>
    </div>
  );
}