import { useEffect, useState } from "react";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";
import { textAreaClassName } from "@/shared/components/form/FormField";

export function ReasonDialog({ open, title, message, confirmLabel = "Simpan", pending, initialValue = "", onClose, onConfirm }) {
  const [reason, setReason] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason(initialValue);
      setError("");
    }
  }, [initialValue, open]);

  const submit = (event) => {
    event.preventDefault();
    if (!reason.trim()) return setError("Alasan wajib diisi.");
    onConfirm?.(reason.trim());
  };

  return <CrudDialog presentation="modal" open={open} onClose={onClose} title={title} subtitle={message} size="max-w-lg"><form onSubmit={submit}><div className="p-6"><textarea value={reason} onChange={(event) => { setReason(event.target.value); setError(""); }} className={textAreaClassName} placeholder="Tuliskan alasan yang jelas untuk seller" />{error ? <p className="mt-1 text-xs font-semibold text-red-600">{error}</p> : null}</div><div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"><button type="button" onClick={onClose} className="h-10 rounded-[10px] border border-slate-200 px-4 text-sm font-bold text-slate-600">Batal</button><button type="submit" disabled={pending} className="h-10 rounded-[10px] bg-amber-600 px-4 text-sm font-extrabold text-white disabled:opacity-60">{confirmLabel}</button></div></form></CrudDialog>;
}
