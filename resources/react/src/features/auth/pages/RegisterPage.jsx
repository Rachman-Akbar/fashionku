import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import {
  registerWithOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  getApiErrorMessage,
} from "@/features/auth/services/authService";

export default function RegisterPage() {
  const { loginWithGoogle, loading: authLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [challengeId, setChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const message = localError;
  const loading = authLoading || submitting || googleBusy;

  const handleChange = (event) => {
    setLocalError("");
    clearError();
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setLocalError("Nama wajib diisi");
      return;
    }

    if (!form.email.trim()) {
      setLocalError("Email wajib diisi");
      return;
    }

    if (form.password.length < 8) {
      setLocalError("Password minimal 8 karakter");
      return;
    }

    if (form.password !== form.confirm) {
      setLocalError("Konfirmasi password tidak cocok");
      return;
    }

    setSubmitting(true);
    setLocalError("");
    clearError();
    try {
      const result = await registerWithOtp({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      const cid = result?.challenge_id || result?.challengeId;
      if (!cid) {
        throw new Error("Gagal memulai verifikasi pendaftaran.");
      }
      setChallengeId(cid);
      setOtpCode("");
      setStep("otp");
    } catch (submitError) {
      setLocalError(getApiErrorMessage(submitError, submitError?.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const code = String(otpCode || "").replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setLocalError("Masukkan 6 digit kode verifikasi.");
      return;
    }

    setSubmitting(true);
    setLocalError("");
    try {
      await verifyRegistrationOtp({
        challenge_id: challengeId,
        code,
      });
      window.dispatchEvent(new CustomEvent("marketku:session-changed"));
      navigate("/", { replace: true });
    } catch (err) {
      setLocalError(getApiErrorMessage(err, err?.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!challengeId) return;
    setSubmitting(true);
    setLocalError("");
    try {
      await resendRegistrationOtp({ challenge_id: challengeId });
      setLocalError("");
    } catch (err) {
      setLocalError(getApiErrorMessage(err, err?.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLocalError("");
    clearError();
    setGoogleBusy(true);

    try {
      const result = await loginWithGoogle();

      if (result?.redirected) {
        return;
      }

      window.dispatchEvent(new CustomEvent("marketku:session-changed"));
      navigate("/", { replace: true });
    } catch (submitError) {
      setLocalError(getApiErrorMessage(submitError, submitError?.message));
      setGoogleBusy(false);
    }
  };

  if (step === "otp") {
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
              Verifikasi email
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Masukkan kode OTP
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kode 6 digit telah dikirim ke <strong className="text-slate-700">{form.email}</strong>.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Kode verifikasi
            </label>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                setLocalError("");
              }}
              className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-center text-lg font-black tracking-[0.4em] focus:bg-white focus:ring-[#10B981]"
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {message}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading || otpCode.replace(/\D/g, "").length !== 6}
            className="h-12 w-full rounded-xl bg-[#10B981] font-black shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Memverifikasi..." : "Verifikasi & Buat Akun"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={submitting}
              className="font-bold text-[#10B981] hover:underline disabled:opacity-60"
            >
              Kirim ulang kode
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtpCode("");
                setLocalError("");
              }}
              className="font-bold text-slate-500 hover:text-slate-700"
            >
              Ubah data
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
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
            Daftar akun
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Buat akun baru
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Daftar sebagai pembeli untuk mulai belanja, menyimpan wishlist, dan
            melacak pesanan. Kode verifikasi akan dikirim ke email kamu.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Nama lengkap
          </label>
          <Input
            name="name"
            placeholder="Masukkan nama lengkap"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Konfirmasi password
          </label>
          <Input
            name="confirm"
            type="password"
            placeholder="Ulangi password"
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
          />
        </div>

        {message && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#10B981] font-black shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Mengirim kode..." : "Daftar & Verifikasi Email"}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400">
            <span className="bg-white px-3 font-semibold">
              atau daftar dengan
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleRegister}
          className="h-12 w-full rounded-xl border-slate-200 font-bold text-slate-700 hover:border-[#10B981]/40 hover:bg-[#ECFDF5] hover:text-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googleBusy ? "Menghubungkan Google..." : "Google"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
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
