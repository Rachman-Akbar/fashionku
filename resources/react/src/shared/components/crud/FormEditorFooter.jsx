import {
  DOCK_ICON_SIZE,
  FOOTER_BUTTON_BASE,
  FOOTER_DISABLED_SUBMIT,
  SOFT_TONES,
  resolveFilledTone,
} from "./formActionTones";

export function FormEditorFooter({
  onCancel,
  onSave,
  submitLabel = "Simpan",
  submitIcon,
  disabled = false,
  tone = "teal",
  onDelete,
  deleteLabel = "Hapus",
  cancelLabel = "Batal",
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-[5px] border-t border-slate-200 bg-slate-50 px-5 py-4 lg:hidden">
      {onDelete ? <button type="button" onClick={onDelete} className={`${FOOTER_BUTTON_BASE} ${SOFT_TONES.rose}`}>{deleteLabel}</button> : null}
      <button type="button" onClick={onCancel} className={`${FOOTER_BUTTON_BASE} ${SOFT_TONES.slate}`}>{cancelLabel}</button>
      <button type={onSave ? "button" : "submit"} onClick={onSave} disabled={disabled} className={`${FOOTER_BUTTON_BASE} ${disabled ? FOOTER_DISABLED_SUBMIT : resolveFilledTone(tone)}`}>
        {submitIcon ? <span className={`material-symbols-outlined ${DOCK_ICON_SIZE}`}>{submitIcon}</span> : null}
        {submitLabel}
      </button>
    </div>
  );
}
