import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { emailVerificationEngine } from "@/core/engine/engine";

function normalizeCode(value) {
  return String(value || "").replace(/[^\d]/g, "").slice(0, 6);
}

export default function ResetPasswordPage() {
  const { resetPasswordWithCode, loading, clearError } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const targetEmail = String(email).trim();

  const [form, setForm] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
  const message = localError;

  const handleResend = async () => {
    if (!targetEmail) return;
    setResendMsg("");
    setResending(true);
    try {
      await emailVerificationEngine.sendPasswordResetCode(targetEmail);
      setResendMsg("Kode verifikasi baru sudah dikirim ke email kamu.");
    } catch (submitError) {
      setResendMsg(getResetMessage(submitError, "Gagal mengirim ulang kode."));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    setSuccess("");
    setResendMsg("");
    clearError();

    if (!targetEmail) {
      setLocalError("Email tidak ditemukan. Silakan mulai dari lupa password.");
      return;
    }

    if (!/^\d{6}$/.test(form.code)) {
      setLocalError("Masukkan 6 digit kode verifikasi dari email kamu.");
      return;
    }

    if (!form.password) {
      setLocalError("Password wajib diisi.");
      return;
    }

    if (form.password.length < 8) {
      setLocalError("Password minimal 8 karakter.");
      return;
    }

    if (form.password !== form.password_confirmation) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await resetPasswordWithCode({
        email: targetEmail,
        code: form.code,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setSuccess("Password berhasil diubah! Silakan masuk dengan password baru.");
    } catch (submitError) {
      setLocalError(submitError.message);
    }
  };

  if (!targetEmail) {
    return (
      <div>
        <div className="mb-8">
          <Link to="/" className="hidden items-center gap-2 lg:inline-flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-lg font-black text-white">
              M
            </span>
            <span className="text-xl font-black text-[#10B981]">MarketKu</span>
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Email Tidak Ditemukan
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Silakan mulai dari lupa password untuk mengirim kode verifikasi ke
              email kamu.
            </p>
          </div>
        </div>

        <Link
          to="/auth/forgot-password"
          className="inline-flex h-12 items-center rounded-xl bg-[#10B981] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669]"
        >
          Lupa Password
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/" className="hidden items-center gap-2 lg:inline-flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-lg font-black text-white">
            M
          </span>
          <span className="text-xl font-black text-[#10B981]">MarketKu</span>
        </Link>

        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#10B981]">
            Reset password
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Buat password baru
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Kode verifikasi dikirim ke{" "}
            <b className="text-slate-700">{targetEmail}</b>. Masukkan kode dan
            password baru kamu di bawah ini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Kode Verifikasi (6 digit)
          </label>
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={form.code}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                code: normalizeCode(event.target.value),
              }));
              setLocalError("");
              setSuccess("");
              clearError();
            }}
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-center text-lg font-black tracking-[0.4em] focus:bg-white focus:ring-[#10B981]"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Belum menerima kode?
            </span>
            <button
              type="button"
              disabled={resending}
              onClick={handleResend}
              className="text-xs font-bold text-[#10B981] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resending ? "Mengirim ulang..." : "Kirim ulang kode"}
            </button>
          </div>
          {resendMsg ? (
            <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {resendMsg}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Password Baru
          </label>
          <Input
            type="password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, password: event.target.value }));
              setLocalError("");
              setSuccess("");
              clearError();
            }}
            autoComplete="new-password"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Konfirmasi Password
          </label>
          <Input
            type="password"
            placeholder="Ulangi password baru"
            value={form.password_confirmation}
            onChange={(event) => {
              setForm((prev) => ({
                ...prev,
                password_confirmation: event.target.value,
              }));
              setLocalError("");
              setSuccess("");
              clearError();
            }}
            autoComplete="new-password"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        {message && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading || !!success}
          className="h-12 w-full rounded-xl bg-[#10B981] font-black shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {success ? "Berhasil!" : "Reset Password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ingat password?{" "}
        <Link
          to="/auth/login"
          className="font-black text-[#10B981] hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}

function getResetMessage(error, fallback) {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const first = Object.values(responseData.errors).flat().find(Boolean);

    if (first) {
      return String(first);
    }
  }

  return error?.message || fallback;
}