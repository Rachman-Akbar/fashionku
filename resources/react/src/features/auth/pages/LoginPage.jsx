import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { PasswordInput } from "@/shared/components/ui/PasswordInput";
import {
  getApiErrorMessage,
  handleGoogleRedirect,
  verifyPasswordLoginOtp,
  resendPasswordLoginOtp,
  verifyFirebaseLoginOtp,
  resendFirebaseLoginOtp,
} from "@/features/auth/services/authService";
import { applyResendCooldown } from "@/features/auth/services/otpResendCooldown";

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
    showGoogle: true,
    storageScope: "base",
  },
  admin: {
    role: "admin",
    redirect: "/admin",
    eyebrow: "Login Admin",
    title: "Masuk ke Panel Admin",
    description: "Gunakan akun admin untuk mengelola pesanan dan operasional marketplace.",
    submitLabel: "Masuk ke Admin",
    deviceName: "marketplace-web-admin",
    showRegister: false,
    showGoogle: false,
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
    showGoogle: true,
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
  const [resendExpiry, setResendExpiry] = useState(0);
  const [resendTick, setResendTick] = useState(0);

  const RESEND_STORAGE_KEY = "fashionku:resend_expiry:login";

  useEffect(() => {
    const stored = localStorage.getItem(RESEND_STORAGE_KEY);
    if (stored && !resendExpiry) {
      setResendExpiry(parseInt(stored, 10));
    }
  }, []);

  const resendRemaining = Math.max(0, resendExpiry - Math.floor(Date.now() / 1000));

  useEffect(() => {
    if (resendExpiry > 0) {
      const id = setInterval(() => setResendTick((t) => t + 1), 1000);
      return () => clearInterval(id);
    }
  }, [resendExpiry]);
  const redirectHandledRef = useRef(false);
  const message = localError;
  const busy = loading || googleBusy || submittingOtp;
  const isAdmin = config.role === "admin";
  const theme = isAdmin
    ? {
        accent: "text-red-400",
        heading: "text-white",
        body: "text-slate-400",
        strong: "text-slate-200",
        label: "text-slate-200",
        field:
          "border-slate-700 bg-slate-800/70 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:ring-red-500",
        error: "border-red-500/30 bg-red-500/10 text-red-300",
        button:
          "bg-red-600 shadow-[0_14px_30px_rgba(220,38,38,0.28)] hover:bg-red-700 focus-visible:ring-red-500",
        link: "text-red-400",
        mutedLink: "text-slate-400 hover:text-slate-200",
        divider: "border-slate-700",
        dividerLabel: "bg-[#111A2C] text-slate-500",
        google:
          "border-slate-700 text-slate-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300",
      }
    : {
        accent: "text-[#10B981]",
        heading: "text-slate-950",
        body: "text-slate-500",
        strong: "text-slate-700",
        label: "text-slate-700",
        field:
          "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-[#10B981]",
        error: "border-red-100 bg-red-50 text-red-600",
        button:
          "bg-[#10B981] shadow-[0_14px_30px_rgba(3,172,14,0.24)] hover:bg-[#059669] focus-visible:ring-[#10B981]",
        link: "text-[#10B981]",
        mutedLink: "text-slate-500 hover:text-slate-700",
        divider: "border-slate-200",
        dividerLabel: "bg-white text-slate-400",
        google:
          "border-slate-200 text-slate-700 hover:border-[#10B981]/40 hover:bg-[#ECFDF5] hover:text-[#10B981]",
      };

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
    const expiry = Math.floor(Date.now() / 1000) + 60;
    setResendExpiry(expiry);
    localStorage.setItem(RESEND_STORAGE_KEY, String(expiry));
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
    if (resendRemaining > 0) return;
    setSubmittingOtp(true);
    setLocalError("");
    try {
      if (otpMode === "google") {
        await resendFirebaseLoginOtp({ challenge_id: challengeId });
      } else {
        await resendPasswordLoginOtp({ challenge_id: challengeId });
      }
      const expiry = Math.floor(Date.now() / 1000) + 60;
      setResendExpiry(expiry);
      localStorage.setItem(RESEND_STORAGE_KEY, String(expiry));
      setLocalError("");
    } catch (err) {
      const cooldown = applyResendCooldown(err, setResendExpiry, RESEND_STORAGE_KEY);
      setLocalError(
        cooldown
          ? `Terlalu banyak permintaan. Tunggu ${cooldown} detik sebelum mengirim ulang kode.`
          : getApiErrorMessage(err, "Gagal mengirim ulang kode OTP."),
      );
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
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.accent}`}>
              Verifikasi OTP
            </p>
            <h1 className={`mt-3 text-2xl font-black tracking-tight ${theme.heading}`}>
              Masukkan kode verifikasi
            </h1>
            <p className={`mt-2 text-sm leading-6 ${theme.body}`}>
              Kode 6 digit telah dikirim ke{" "}
              <strong className={theme.strong}>{otpEmail || "email Anda"}</strong>{" "}
              untuk menyelesaikan login.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className={`mb-2 block text-sm font-bold ${theme.label}`}>
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
              className={`h-12 rounded-xl px-4 text-center text-lg font-black tracking-[0.4em] ${theme.field}`}
            />
          </div>

          {message && (
            <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${theme.error}`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={busy || otpCode.replace(/\D/g, "").length !== 6}
            className={`h-12 w-full rounded-xl font-black disabled:cursor-not-allowed disabled:opacity-70 ${theme.button}`}
          >
            {submittingOtp ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={busy || resendRemaining > 0}
              className={`font-bold hover:underline disabled:opacity-60 ${theme.link}`}
            >
              {resendRemaining > 0
                ? `Kirim ulang dalam ${String(Math.floor(resendRemaining / 60)).padStart(2, "0")}:${String(resendRemaining % 60).padStart(2, "0")}`
                : "Kirim ulang kode"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setChallengeId("");
                setOtpCode("");
                setLocalError("");
              }}
              className={`font-bold ${theme.mutedLink}`}
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
        <div>
          <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.accent}`}>
            {config.eyebrow}
          </p>
          <h1 className={`mt-3 text-2xl font-black tracking-tight ${theme.heading}`}>
            {config.title}
          </h1>
          <p className={`mt-2 text-sm leading-6 ${theme.body}`}>
            {config.description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={`mb-2 block text-sm font-bold ${theme.label}`}>
            Email
          </label>
          <Input
            name="email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className={`h-12 rounded-xl px-4 ${theme.field}`}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className={`block text-sm font-bold ${theme.label}`}>
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className={`text-xs font-black hover:underline ${theme.link}`}
            >
              Lupa password?
            </Link>
          </div>
          <PasswordInput
            name="password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className={`h-12 rounded-xl px-4 ${theme.field}`}
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
          className={`h-12 w-full rounded-xl font-black disabled:cursor-not-allowed disabled:opacity-70 ${theme.button}`}
        >
          {loading ? "Memproses..." : config.submitLabel}
        </Button>

        {config.showGoogle && (
          <>
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme.divider}`} />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400">
                <span className={`px-3 font-semibold ${theme.dividerLabel}`}>
                  atau masuk dengan
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={handleGoogleLogin}
              className={`h-12 w-full rounded-xl border font-bold disabled:cursor-not-allowed disabled:opacity-70 ${theme.google}`}
            >
              {googleBusy ? "Menghubungkan Google..." : "Google"}
            </Button>
          </>
        )}
      </form>

      {config.showRegister && (
        <p className={`mt-6 text-center text-sm ${theme.body}`}>
          Belum punya akun?{" "}
          <Link
            to="/auth/register"
            className={`font-black hover:underline ${theme.link}`}
          >
            Daftar sekarang
          </Link>
        </p>
      )}
    </div>
  );
}
