import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const message = localError;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");
    setSuccess("");
    clearError();

    if (!email.trim()) {
      setLocalError("Email wajib diisi");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess("Kode verifikasi sudah dikirim ke email kamu.");
    } catch (submitError) {
      setLocalError(submitError.message);
    }
  };

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
            Lupa password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Masukkan email akun kamu, lalu sistem akan mengirim kode verifikasi
            6 digit melalui email.
          </p>
        </div>
      </div>

      {success ? (
        <div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
          <Link
            to={`/auth/reset-password?email=${encodeURIComponent(email.trim())}`}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#10B981] px-6 text-sm font-black text-white shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669]"
          >
            Masukkan Kode &amp; Buat Password Baru
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setLocalError("");
                setSuccess("");
                clearError();
              }}
              autoComplete="email"
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
            Kirim Kode Verifikasi
          </Button>
        </form>
      )}

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