import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

const STORAGE_PREFIX = "marketku_violation_seen:";

function hashMessage(message) {
  let hash = 0;
  for (let index = 0; index < message.length; index += 1) {
    hash = ((hash << 5) - hash + message.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Modal pemberitahuan pelanggaran untuk buyer. Pesan diisi admin saat
 * menonaktifkan akun (`violation_message`), lalu ditampilkan sekali per sesi
 * agar buyer sempat membacanya tanpa menutupi halaman terus-menerus.
 */
export function ViolationNoticeModal() {
  const { user } = useAuth();
  const message = String(user?.violation_message || "").trim();
  const isSuspended = user && user.is_active === false;
  const storageKey = useMemo(() => (message ? `${STORAGE_PREFIX}${hashMessage(message)}` : ""), [message]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!message || !storageKey) {
      setOpen(false);
      return;
    }
    if (isSuspended) {
      // Akun nonaktif: pesan selalu ditampilkan, tidak bisa ditutup permanen.
      setOpen(true);
      return;
    }
    try {
      setOpen(window.sessionStorage.getItem(storageKey) !== "1");
    } catch {
      setOpen(true);
    }
  }, [message, storageKey, isSuspended]);

  if (!open || !message) return null;

  const dismiss = () => {
    if (isSuspended) return;
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // abaikan bila storage diblokir
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="violation-title">
      <div className="w-full max-w-lg rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <span className="material-symbols-outlined text-[24px]">report</span>
          </span>
          <div className="min-w-0">
            <h2 id="violation-title" className="text-lg font-extrabold text-slate-900">Pemberitahuan Pelanggaran</h2>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-500">
              {isSuspended ? "Akun Anda dinonaktifkan" : "Akun Anda dalam peninjauan"}
            </p>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-line rounded-[10px] border border-red-100 bg-red-50/60 px-4 py-3 text-sm leading-6 text-slate-700">
          {message}
        </p>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          {isSuspended
            ? "Hubungi admin melalui kanal bantuan untuk memulihkan akun setelah kewajiban Anda dipenuhi."
            : "Mohon perbaiki hal tersebut agar akun Anda tidak dinonaktifkan."}
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={dismiss}
            disabled={isSuspended}
            className="h-10 rounded-[10px] bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSuspended ? "Akun dinonaktifkan" : "Saya mengerti"}
          </button>
        </div>
      </div>
    </div>
  );
}
