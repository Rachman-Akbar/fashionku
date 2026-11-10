import { useEffect, useState } from "react";
import { CrudDialog, FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { ImageFilePicker } from "@/shared/components/form/ImageFilePicker";
import { required, validateFields } from "@/core/utils/formValidation";
import { getSellerBannerError, useCreateSellerBanner, useUpdateSellerBanner } from "@/features/seller/banner/services/sellerBannerService";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { useTabDirtyGuard } from "@/shared/hooks/useTabDirtyGuard";
import { toastError } from "@/shared/utils/userFeedback";

function initialValues(entity) {
  return { name: entity?.name || "", imageUrl: entity?.imageUrl || "", sortOrder: entity?.sortOrder || 0, isActive: entity?.isActive ?? true };
}

export function SellerBannerForm({ open, entity, onClose, onSaved, onDelete }) {
  const [values, setValues] = useState(() => initialValues(entity));
  const [errors, setErrors] = useState({});
  const pristine = initialValues(entity);
  const dirty = useFormDirty(pristine, values);
  useTabDirtyGuard(dirty);
  const createMutation = useCreateSellerBanner();
  const updateMutation = useUpdateSellerBanner();
  const mutation = entity ? updateMutation : createMutation;

  useEffect(() => {
    if (open) {
      setValues(initialValues(entity));
      setErrors({});
    }
  }, [entity, open]);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateFields(values, { name: required("Nama banner"), imageUrl: required("Gambar banner") });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      const saved = entity ? await updateMutation.mutateAsync({ id: entity.id, values }) : await createMutation.mutateAsync(values);
      onSaved?.(saved);
            window.setTimeout(() => onClose?.(), 350);
    } catch (error) {
      toastError("Gagal menyimpan banner", getSellerBannerError(error));
    }
  };

  return (
    <CrudDialog open={open} onClose={onClose} title={entity ? "Edit Banner Toko" : "Tambah Banner Toko"} subtitle="Banner hanya ditampilkan pada halaman detail toko buyer." size="max-w-xl">
      <form onSubmit={submit}>
        <FormEditorLayout
          actions={
            <FormActionDock tone="emerald" save={{ icon: "save", label: "Simpan" }} disabled={mutation.isPending || !dirty} onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
          }
        >
          <div className="space-y-4">
            <FormField label="Nama banner" error={errors.name} required><input value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} className={inputClassName} /></FormField>
            <FormField label="Gambar banner" error={errors.imageUrl} required><ImageFilePicker value={values.imageUrl} onChange={(imageUrl) => setValues((current) => ({ ...current, imageUrl }))} scope="banners" label="Pilih gambar banner" aspectClassName="aspect-[3/1]" /></FormField>
            <FormField label="Urutan"><input type="number" min="0" value={values.sortOrder} onChange={(event) => setValues((current) => ({ ...current, sortOrder: event.target.value }))} className={inputClassName} /></FormField>
            <div className="flex h-11 items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3">
              <span className="text-sm font-bold text-slate-700">Status aktif</span>
              <InlineActiveSwitch checked={values.isActive} onChange={(isActive) => setValues((current) => ({ ...current, isActive }))} showLabel={false} />
            </div>
          </div>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onClose} submitLabel="Simpan" submitIcon="save" disabled={mutation.isPending || !dirty} tone="emerald" onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
      </form>
    </CrudDialog>
  );
}
