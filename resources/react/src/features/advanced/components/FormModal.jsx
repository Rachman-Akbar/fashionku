import { CrudDialog, FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";

export function FormModal({ open, title, subtitle, children, onClose, onSubmit, busy, submitLabel = "Simpan", onDelete, deleteLabel = "Hapus", tone = "emerald", saveIcon = "save", extraActions = [] }) {
  return (
    <CrudDialog presentation="page" open={open} title={title} subtitle={subtitle} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <FormEditorLayout
          actions={<FormActionDock tone={tone} save={{ icon: saveIcon, label: submitLabel }} disabled={busy} onDelete={onDelete} deleteLabel={deleteLabel} extraActions={extraActions} />}
        >
          <div className="grid gap-4">{children}</div>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onClose} submitLabel={submitLabel} submitIcon={saveIcon} disabled={busy} tone={tone} onDelete={onDelete} deleteLabel={deleteLabel} />
      </form>
    </CrudDialog>
  );
}

export function Field({ label, children, hint, required = false, error = "" }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-slate-700">
      <span>{label}{required ? <span className="ml-1 text-red-500">*</span> : null}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : hint ? <span className="text-xs font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}
