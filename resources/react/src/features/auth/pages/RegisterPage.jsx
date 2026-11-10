import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export default function RegisterPage() {
  const { registerWithPassword, loginWithGoogle, loading, clearError } =
    useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [localError, setLocalError] = useState("");
  const message = localError;

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

    try {
      await registerWithPassword({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      navigate("/", { replace: true });
    } catch (submitError) {
      setLocalError(submitError.message);
    }
  };

  const handleGoogleRegister = async () => {
    setLocalError("");
    clearError();

    try {
      await loginWithGoogle();
      navigate("/", { replace: true });
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
            Daftar akun
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Buat akun baru
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Daftar sebagai pembeli untuk mulai belanja, menyimpan wishlist, dan
            melacak pesanan.
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
          {loading ? "Memproses..." : "Daftar Sekarang"}
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
          Google
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
