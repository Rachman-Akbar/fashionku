import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MailCheck, RefreshCw, X } from "lucide-react";
import { emailVerificationEngine, toEmailVerificationError } from "./engine";

const OTP_INPUT_CLASS =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-center text-lg font-black tracking-[0.4em] text-slate-900 outline-none transition focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/10";

function normalizeCode(value) {
  return String(value || "").replace(/[^\d]/g, "").slice(0, 6);
}

export default function EmailVerifyDialog({
  open,
  onClose,
  title = "Verifikasi Email",
  description = "Kami telah mengirim kode verifikasi 6 digit ke email terdaftar akun kamu.",
  email = "",
  onVerify,
  onVerified,
  verifiedMessage = "Email berhasil diverifikasi.",
}) {
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);
  const inputRef = useRef(null);

  const sendCode = useCallback(async () => {
    setSending(true);
    setNotice({ type: "", text: "" });
    try {
      if (email) {
        await emailVerificationEngine.sendPasswordResetCode(email);
      } else {
        await emailVerificationEngine.sendCode();
      }
      setCooldown(30);
      setNotice({
        type: "success",
        text: "Kode verifikasi telah dikirim ke email kamu.",
      });
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } catch (error) {
      setNotice({
        type: "error",
        text: toEmailVerificationError(error, "Gagal mengirim kode verifikasi.").message,
      });
    } finally {
      setSending(false);
    }
  }, [email]);

  useEffect(() => {
    if (!open) {
      setCode("");
      setNotice({ type: "", text: "" });
      setCooldown(0);
      setVerified(false);
      return;
    }

    setCode("");
    setNotice({ type: "", text: "" });
    setCooldown(0);
    setVerified(false);
    sendCode();
  }, [open, sendCode]);

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown > 0]);

  const handleVerify = async () => {
    setNotice({ type: "", text: "" });

    if (!/^\d{6}$/.test(code)) {
      setNotice({
        type: "error",
        text: "Masukkan 6 digit kode verifikasi dari email kamu.",
      });
      return;
    }

    setVerifying(true);
    try {
      await onVerify?.(code);
      setNotice({ type: "", text: "" });
      setVerified(true);
      window.setTimeout(() => {
        onVerified?.();
        onClose?.();
      }, 1600);
    } catch (error) {
      setNotice({
        type: "error",
        text: toEmailVerificationError(
          error,
          "Kode verifikasi salah atau sudah kedaluwarsa. Silakan coba lagi."
        ).message,
      });
    } finally {
      setVerifying(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#10B981]">
              Keamanan akun
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup verifikasi"
          >
            <X size={20} />
          </button>
        </div>

        {verified ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF5]">
              <CheckCircle2 size={34} className="text-[#10B981]" />
            </span>
            <h3 className="mt-4 text-lg font-black text-slate-950">
              Verifikasi Berhasil
            </h3>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
              {verifiedMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-4 px-6 py-5">
            <div className="flex items-start gap-3 rounded-2xl border border-[#10B981]/20 bg-[#ECFDF5] px-4 py-3">
              <MailCheck className="mt-0.5 shrink-0 text-[#10B981]" size={18} />
              <p className="text-sm leading-6 text-slate-600">{description}</p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">
                Kode verifikasi (6 digit)
              </span>
              <input
                ref={inputRef}
                value={code}
                onChange={(event) => { setCode(normalizeCode(event.target.value)); setNotice({ type: "", text: "" }); }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleVerify();
                  }
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className={OTP_INPUT_CLASS}
              />
            </label>

            <button
              type="button"
              disabled={sending || cooldown > 0}
              onClick={sendCode}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Mengirim ulang...
                </>
              ) : (
                <>
                  <RefreshCw size={13} />
                  {cooldown > 0
                    ? "Kirim ulang kode dalam " + cooldown + " detik"
                    : "Kirim ulang kode"}
                </>
              )}
            </button>

            {notice.text ? (
              <p
                className={
                  notice.type === "error"
                    ? "rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                    : "rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
                }
              >
                {notice.text}
              </p>
            ) : null}
          </div>
        )}

        {!verified ? (
          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || code.length !== 6}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#10B981] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(3,172,14,0.24)] transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Verifikasi"
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}