import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import {
  getApiErrorMessage,
  handleGoogleRedirect,
  verifyPasswordLoginOtp,
  resendPasswordLoginOtp,
  verifyFirebaseLoginOtp,
  resendFirebaseLoginOtp,
} from "@/features/auth/services/authService";

const PORTALS = {
  buyer: {
    role: "buyer",
    redirect: "/",
    eyebrow: "Masuk akun",
    title: "Selamat datang kembali",
    description:
      "Masuk untuk melanjutkan belanja, mengelola pesanan, dan menggunakan seluruh fitur akun.",
    submitLabel: "Masuk",
    deviceName: "marketplace-web-buyer",
    showRegister: true,
    storageScope: "base",
  },
  admin: {
    role: "admin",
    redirect: "/admin",
    eyebrow: "Masuk akun",
    title: "Selamat datang kembali",
    description: "Masuk menggunakan akun yang memiliki akses admin.",
    submitLabel: "Masuk",
    deviceName: "marketplace-web-admin",
    showRegister: false,
    storageScope: "window",
  },
  chat: {
    role: "buyer",
    redirect: "/chat",
    eyebrow: "Chat portal",
    title: "Masuk ke Chat",
    description:
      "Masuk melalui halaman khusus agar sesi chat tidak bercampur dengan portal lain.",
    submitLabel: "Masuk ke Chat",
    deviceName: "marketplace-web-chat",
    showRegister: false,
    storageScope: "window",
  },
};

export default function LoginPage({ portal = "buyer" }) {
  const config = useMemo(() => PORTALS[portal] || PORTALS.buyer, [portal]);
  const { loginWithPassword, loginWithGoogle, logout, loading, clearError } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("credentials"); // credentials | otp
  const [otpMode, setOtpMode] = useState("password"); // password | google
  const [challengeId, setChallengeId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const redirectHandledRef = useRef(false);
  const message = localError;
  const busy = loading || googleBusy || submittingOtp;

  const getRedirectPath = useCallback(() => {
    const query = new URLSearchParams(location.search);
    const redirect = query.get("redirect");
    const statePath = location.state?.from?.pathname;
    return redirect || statePath || config.redirect;
  }, [location, config.redirect]);

  const ensurePortalAccess = useCallback(
    async (session) => {
      const activeRole = String(
        session?.activeRole || session?.active_role || session?.user?.role || "",
      ).toLowerCase();
      const sessionRoles = session?.roles || session?.user?.roles || [];
      const roles = Array.isArray(sessionRoles)
        ? sessionRoles.map((role) =>
            String(role?.name || role || "").toLowerCase(),
          )
        : [];

      if (activeRole === config.role || roles.includes(config.role)) {
        return;
      }

      await logout();
      throw new Error(
        config.role === "admin"
          ? "Akun ini tidak memiliki akses Admin."
          : "Akun tidak memiliki akses ke portal yang dipilih.",
      );
    },
    [config.role, logout],
  );

  const beginOtpStep = useCallback((mode, payload) => {
    const cid = payload?.challenge_id || payload?.challengeId;
    if (!cid) {
      throw new Error("Sesi verifikasi OTP tidak valid. Silakan coba lagi.");
    }
    setOtpMode(mode);
    setChallengeId(cid);
    setOtpEmail(payload?.email || form.email || "");
    setOtpCode("");
    setStep("otp");
  }, [form.email]);

  useEffect(() => {
    let mounted = true;

    if (redirectHandledRef.current) {
      return undefined;
    }
    redirectHandledRef.current = true;

    (async () => {
      try {
        const result = await handleGoogleRedirect({
          role: config.role,
          deviceName: config.deviceName,
          storageScope: config.storageScope,
        });

        if (!mounted || !result) {
          return;
        }

        if (result?.otp_required) {
          beginOtpStep("google", result);
          return;
        }

        window.dispatchEvent(new CustomEvent("marketku:session-changed"));
        await ensurePortalAccess(result);
        navigate(getRedirectPath(), { replace: true });
      } catch (err) {
        if (!mounted) return;
        setLocalError(getApiErrorMessage(err, "Login Google gagal. Silakan coba lagi."));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [
    config.role,
    config.deviceName,
    config.storageScope,
    ensurePortalAccess,
    getRedirectPath,
    navigate,
    beginOtpStep,
  ]);

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

    if (!form.email.trim()) {
      setLocalError("Email wajib diisi");
      return;
    }

    if (!form.password) {
      setLocalError("Password wajib diisi");
      return;
    }

    try {
      const result = await loginWithPassword({
        ...form,
        role: config.role,
        deviceName: config.deviceName,
        storageScope: config.storageScope,
      });

      if (result?.otp_required) {
        beginOtpStep("password", result);
        return;
      }

      await ensurePortalAccess(result);
      navigate(getRedirectPath(), { replace: true });
    } catch (submitError) {
      setLocalError(getApiErrorMessage(submitError, submitError.message));
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const code = String(otpCode || "").replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      setLocalError("Masukkan 6 digit kode OTP.");
      return;
    }
    setSubmittingOtp(true);
    setLocalError("");
    try {
      const session =
        otpMode === "google"
          ? await verifyFirebaseLoginOtp({
              challenge_id: challengeId,
              code,
              deviceName: config.deviceName,
              storageScope: config.storageScope,
            })
          : await verifyPasswordLoginOtp({
              challenge_id: challengeId,
              code,
              deviceName: config.deviceName,
              storageScope: config.storageScope,
            });

      window.dispatchEvent(new CustomEvent("marketku:session-changed"));
      await ensurePortalAccess(session);
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setLocalError(getApiErrorMessage(err, "Verifikasi OTP gagal."));
    } finally {
      setSubmittingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!challengeId) return;
    setSubmittingOtp(true);
    setLocalError("");
    try {
      if (otpMode === "google") {
        await resendFirebaseLoginOtp({ challenge_id: challengeId });
      } else {
        await resendPasswordLoginOtp({ challenge_id: challengeId });
      }
    } catch (err) {
      setLocalError(getApiErrorMessage(err, "Gagal mengirim ulang kode OTP."));
    } finally {
      setSubmittingOtp(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError("");
    clearError();
    setGoogleBusy(true);

    try {
      const result = await loginWithGoogle({
        role: config.role,
        deviceName: config.deviceName,
        storageScope: config.storageScope,
      });

      if (result?.redirected) {
        return;
      }

      if (result?.otp_required) {
        beginOtpStep("google", result);
        return;
      }

      await ensurePortalAccess(result);
      navigate(getRedirectPath(), { replace: true });
    } catch (submitError) {
      setLocalError(getApiErrorMessage(submitError, "Login Google gagal. Silakan coba lagi."));
    } finally {
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
              Verifikasi OTP
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Masukkan kode verifikasi
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kode 6 digit telah dikirim ke{" "}
              <strong className="text-slate-700">{otpEmail || "email Anda"}</strong>{" "}
              untuk menyelesaikan login.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Kode OTP
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
            disabled={busy || otpCode.replace(/\D/g, "").length !== 6}
            className="h-12 w-full rounded-xl bg-[#10B981] font-black shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submittingOtp ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={busy}
              className="font-bold text-[#10B981] hover:underline disabled:opacity-60"
            >
              Kirim ulang kode
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setChallengeId("");
                setOtpCode("");
                setLocalError("");
              }}
              className="font-bold text-slate-500 hover:text-slate-700"
            >
              Kembali
            </button>
          </div>
        </form>
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
            {config.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {config.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {config.description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-bold text-slate-700">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-black text-[#10B981] hover:underline"
            >
              Lupa password?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
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
          disabled={busy}
          className="h-12 w-full rounded-xl bg-[#10B981] font-black shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Memproses..." : config.submitLabel}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400">
            <span className="bg-white px-3 font-semibold">
              atau masuk dengan
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleGoogleLogin}
          className="h-12 w-full rounded-xl border-slate-200 font-bold text-slate-700 hover:border-[#10B981]/40 hover:bg-[#ECFDF5] hover:text-[#10B981] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googleBusy ? "Menghubungkan Google..." : "Google"}
        </Button>
      </form>

      {config.showRegister ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link
            to="/auth/register"
            className="font-black text-[#10B981] hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            to="/auth/login"
            className="font-black text-[#10B981] hover:underline"
          >
            Kembali ke login pengguna
          </Link>
        </p>
      )}
    </div>
  );
}
