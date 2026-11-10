import { memo, useEffect, useRef, useState } from "react";
import { isDeleteConfirmSkipped, setDeleteConfirmSkipped } from "@/shared/utils/skipConfirm";

export const ConfirmDialog = memo(function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Hapus",
  pending = false,
  onConfirm,
  onClose,
  snoozeable = true,
}) {
  const [dontAskToday, setDontAskToday] = useState(false);
  const autoFired = useRef(false);

  useEffect(() => {
    if (!open) {
      autoFired.current = false;
      return undefined;
    }

    if (snoozeable && isDeleteConfirmSkipped()) {
      if (!autoFired.current) {
        autoFired.current = true;
        onConfirm?.();
      }
      return undefined;
    }

    const handler = (event) => {
      if (event.key === "Escape" && !pending) onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onConfirm, open, pending, snoozeable]);

  if (!open) return null;
  if (snoozeable && isDeleteConfirmSkipped()) return null;

  const handleConfirm = () => {
    if (snoozeable && dontAskToday) setDeleteConfirmSkipped(true);
    onConfirm?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        {snoozeable ? (
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-[10px] bg-slate-50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={dontAskToday}
              onChange={(event) => setDontAskToday(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-red-600"
            />
            <span className="text-xs leading-5 text-slate-600">
              Jangan tanyakan lagi hari ini
            </span>
          </label>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={onClose}
            className="h-10 rounded-[10px] border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:border-slate-300 disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={handleConfirm}
            className="h-10 rounded-[10px] bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
});