import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { MailCheck, Loader2, Mail, AlertCircle } from "lucide-react";import { emailVerificationEngine, toEmailVerificationError } from "@/core/engine/engine";

export default function OtpLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [cooldown, setCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300);

  const sendOtp = async () => {
    setNotice({ type: "", text: "" });
    if (!email) {
      setNotice({ type: "error", text: "Email wajib diisi." });
      return;
    }
    setSending(true);
    try {
      await emailVerificationEngine.sendPasswordResetCode(email);
      setCooldown(60);
      setTimeRemaining(300);
      setNotice({ type: "success", text: "Kode OTP telah dikirim ke email kamu." });
      setStep("otp");
    } catch (error) {
      setNotice({ type: "error", text: toEmailVerificationError(error, "Gagal mengirim kode OTP.").message });
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setNotice({ type: "", text: "" });
    if (!/^\d{6}$/.test(code)) {
      setNotice({ type: "error", text: "Masukkan kode OTP 6 digit." });
      return;
    }
    setVerifying(true);
    try {
      await emailVerificationEngine.verifyEmailCode(email, code);
      navigate(`/auth/login?email=${encodeURIComponent(email)}&otp_verified=true`, { replace: true });
    } catch (error) {
      setNotice({ type: "error", text: toEmailVerificationError(error, "Kode OTP salah atau kedaluwarsa.").message });
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    await sendOtp();
  };

  if (step === "email") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white mx-auto mb-4">
              <Mail size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Masuk dengan OTP</h2>
            <p className="mt-2 text-sm text-slate-500">Masukkan email untuk menerima kode verifikasi</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 focus:bg-white focus:ring-[#10B981]"
              />
            </div>

            {notice.text && (
              <div className={`rounded-xl p-3 text-sm font-semibold ${
                notice.type === "error" ? "border border-red-100 bg-red-50 text-red-600" : "border border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}>{notice.text}</div>
            )}

            <Button type="submit" size="lg" disabled={sending || !email} className="w-full">
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Mengirim OTP...
                </>
              ) : (
                <>
                  <MailCheck size={18} className="mr-2" />
                  Kirim Kode OTP
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Sudah punya password?{" "}
              <Link to="/auth/login" className="font-black text-[#10B981] hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white mx-auto mb-4">
            <MailCheck size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-950">Verifikasi OTP</h2>
          <p className="mt-2 text-sm text-slate-500">Masukkan kode 6 digit yang dikirim ke <span className="font-black">{email}</span></p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Kode OTP</label>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-center font-black tracking-[0.4em] focus:bg-white focus:ring-[#10B981]"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-slate-500">
              {timeRemaining > 0 ? `Kadaluarsa: ${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, "0")}` : <span className="text-red-500">Kedaluwarsa</span>}
            </span>
            <button
              type="button"
              onClick={resendOtp}
              disabled={cooldown > 0 || sending}
              className={`text-xs font-semibold transition ${
                cooldown > 0 || sending ? "text-slate-400 cursor-not-allowed" : "text-[#10B981] hover:underline"
              }`}
            >
              {sending ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1" />
                  Mengirim...
                </>
              ) : cooldown > 0 ? `Kirim ulang dalam ${cooldown}d` : "Kirim ulang OTP"}
            </button>
          </div>

          {notice.text && (
            <div className={`rounded-xl p-3 text-sm font-semibold ${
              notice.type === "error" ? "border border-red-100 bg-red-50 text-red-600" : "border border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}>{notice.text}</div>
          )}

          <Button type="submit" size="lg" disabled={verifying || code.length !== 6 || timeRemaining <= 0} className="w-full">
            {verifying ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Memverifikasi...
              </>
            ) : (
              <>
                <AlertCircle size={18} className="mr-2" />
                Verifikasi & Masuk
              </>
            )}
          </Button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Kembali ke{" "}
            <Link to="/auth/login" className="font-black text-[#10B981] hover:underline">halaman masuk</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
