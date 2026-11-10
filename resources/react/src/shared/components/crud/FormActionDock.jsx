import {
  DOCK_BUTTON_BASE,
  DOCK_BUTTON_BASE_FILLED,
  DOCK_ICON_BASE,
  DOCK_ICON_SIZE,
  DOCK_LABEL_CLASS,
  FILLED_ICON_TONES,
  FILLED_TONES,
  SOFT_ICON_TONES,
  SOFT_TONES,
} from "./formActionTones";

export function FormDockButton({ icon, label, tone = "slate", variant = "soft", type = "button", onClick, disabled = false }) {
  const soft = variant === "soft";
  const base = soft ? DOCK_BUTTON_BASE : DOCK_BUTTON_BASE_FILLED;
  const tones = soft ? SOFT_TONES[tone] : FILLED_TONES[tone];
  const iconTones = soft ? SOFT_ICON_TONES[tone] : FILLED_ICON_TONES[tone];

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${tones || ""}`}>
      <span className={`${DOCK_ICON_BASE} ${iconTones || ""}`}>
        <span className={`material-symbols-outlined ${DOCK_ICON_SIZE}`}>{icon}</span>
      </span>
      <span className={DOCK_LABEL_CLASS}>{label}</span>
    </button>
  );
}

export function FormActionDock({ tone = "emerald", save = { icon: "save", label: "Simpan" }, disabled = false, onSave, onDelete, deleteLabel = "Hapus", extraActions = [], showSave = true, className = "" }) {
  return (
    <div aria-label="Aksi" className={`flex flex-col gap-[5px] ${className}`}>
      {showSave ? <FormDockButton type={onSave ? "button" : "submit"} onClick={onSave} disabled={disabled} icon={save.icon} label={save.label} tone={tone} /> : null}
      {extraActions.map((action) => (
        <FormDockButton key={`${action.label}-${action.icon}`} icon={action.icon} label={action.label} tone={action.tone || "slate"} onClick={action.onClick} disabled={Boolean(action.disabled)} />
      ))}
      {onDelete ? <FormDockButton icon="delete" label={deleteLabel} tone="rose" onClick={onDelete} /> : null}
    </div>
  );
}
