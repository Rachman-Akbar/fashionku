import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { formatPrice } from "@/shared/utils/utils";
import { advancedError, useCreateCustomer, useDeleteCustomer, useUpdateCustomer } from "@/features/advanced/services/advancedMarketplaceService";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { ConfirmDialog } from "@/shared/components/crud";
import { Input } from "@/shared/components/ui/Input";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormActionDock, FormEditorLayout } from "@/shared/components/crud";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { toastError } from "@/shared/utils/userFeedback";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("id-ID");
}

const INITIAL_FORM = { name: "", email: "", is_active: true };

function CustomerDetailForm({ customer, admin = false, onSaved, onDeleted }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [pristine, setPristine] = useState(INITIAL_FORM);
  const dirty = useFormDirty(pristine, form);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const editing = Boolean(customer);
  const saving = createMutation.isPending || updateMutation.isPending;
  const busy = saving || deleteMutation.isPending;

  useEffect(() => {
    const initial = customer ? { name: customer.name || "", email: customer.email || "", is_active: customer.is_active !== false } : INITIAL_FORM;
    setPristine(initial);
    setForm(initial);
  }, [customer]);

  if (admin && !customer) return null;

  const avatar = resolveMediaUrl(customer?.avatar || "");
  const stats = [
    { label: "Jumlah Pesanan", value: Number(customer?.orders_count || 0).toLocaleString("id-ID"), icon: "receipt_long", tone: "bg-sky-50 text-sky-700" },
    { label: "Total Belanja", value: formatPrice(customer?.total_spent), icon: "payments", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Pesanan Terakhir", value: formatDate(customer?.last_order_at), icon: "schedule", tone: "bg-amber-50 text-amber-700" },
  ];

  const handleSave = async () => {
    try {
      const payload = { name: form.name.trim(), email: form.email.trim(), is_active: form.is_active };
      if (editing) {
        await updateMutation.mutateAsync({ id: customer.id, values: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSaved?.();
    } catch (error) {
      toastError("Simpan Pelanggan", advancedError(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(customer.id);
      setDeleteOpen(false);
      onDeleted?.();
    } catch (error) {
      toastError("Hapus Pelanggan", advancedError(error));
    }
  };

  return (
    <>
      <FormEditorLayout
        actions={admin ? undefined : (
          <FormActionDock
            tone="emerald"
            save={{ icon: editing ? "save" : "person_add", label: "Simpan" }}
            onSave={handleSave}
            disabled={busy || !dirty || !form.name.trim()}
            onDelete={editing ? () => setDeleteOpen(true) : undefined}
          />
        )}
      >
        <FormPageLayout
          title={editing ? "Detail Pelanggan" : "Tambah Pelanggan"}
          subtitle={editing ? `${customer.email || `ID ${customer.id}`} · Terdaftar ${formatDate(customer.registered_at)}` : "Buat pelanggan manual untuk toko ini."}
          lead={
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${customer?.is_active !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {customer?.is_active !== false ? "Aktif" : "Nonaktif"}
              </span>
              {customer?.is_manual ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold uppercase text-teal-700">Manual</span> : null}
            </div>
          }
        >
          {editing ? (
            <>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img src={avatar} alt={customer.name || "Pelanggan"} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200" />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-slate-400">
                      <span className="material-symbols-outlined text-[32px]">person</span>
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-slate-900">{customer.name || "Tanpa Nama"}</p>
                    <p className="truncate text-sm text-slate-500">{customer.email || "-"}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">Terdaftar {formatDate(customer.registered_at)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${item.tone}`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </span>
                    <p className="mt-3 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 truncate text-lg font-black text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">contact_page</span>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Data Pelanggan</h2>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Nama<span className="ml-1 text-red-500">*</span></span>
                <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama pelanggan" maxLength={255} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Email<span className="ml-1 text-red-500">*</span></span>
                <Input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="email@contoh.com" maxLength={255} />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:col-span-2">
                <span>Status aktif</span>
                <InlineActiveSwitch checked={form.is_active} onChange={(checked) => setForm((current) => ({ ...current, is_active: checked }))} showLabel={false} />
              </label>
            </div>
          </div>
        </FormPageLayout>
      </FormEditorLayout>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Pelanggan"
        message={`Pelanggan “${customer?.name || ""}” akan dihapus permanen (soft-delete akun) beserta riwayatnya dari daftar ini. Transaksi lama tetap tersimpan.`}
        confirmLabel="Hapus Pelanggan"
        pending={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}

export default CustomerDetailForm;
export { CustomerDetailForm };