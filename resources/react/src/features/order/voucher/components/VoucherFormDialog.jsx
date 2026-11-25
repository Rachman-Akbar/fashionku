import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CrudDialog, FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { minimumNumber, required, validateFields } from "@/core/utils/formValidation";
import { toDateTimeLocal } from "@/core/utils/dateTime";
import { apiClient, unwrapCollection } from "@/core/utils/apiClient";
import { getVoucherManagementError, useCreateVoucher, useUpdateVoucher } from "@/features/order/voucher/services/voucherManagementService";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { useObjectUrl } from "@/shared/hooks/useObjectUrl";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { toastError } from "@/shared/utils/userFeedback";

function productOptionsPath(portal) {
  return portal === "admin" ? "/api/v1/catalog/admin/products" : "/api/v1/catalog/seller/products";
}

async function getProductOptions(portal, query = "") {
  const search = query.trim();
  const response = await apiClient.get(productOptionsPath(portal), {
    params: { per_page: 20, ...(search ? { q: search } : {}) },
  });
  return unwrapCollection(response.data).map((row) => ({ id: Number(row.id), name: row.name || `Produk ${row.id}` }));
}

function ProductMultiSelect({ value, onChange, options, labels, loading, search, onSearch }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const selected = Array.isArray(value) ? value : [];

  useEffect(() => {
    if (!open) return undefined;

    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-left text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.length ? selected.map((id) => (
          <span
            key={id}
            role="button"
            tabIndex={0}
            onClick={(event) => { event.stopPropagation(); toggle(id); }}
            onKeyDown={(event) => { if (event.key === "Enter") { event.stopPropagation(); toggle(id); } }}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700"
          >
            <span className="truncate">{labels[id] || `Produk #${id}`}</span>
            <span aria-hidden="true" className="material-symbols-outlined text-[13px]">close</span>
          </span>
        )) : <span className="py-1 text-sm text-slate-400">Semua produk</span>}
        <span aria-hidden="true" className="material-symbols-outlined ml-auto shrink-0 text-[18px] text-slate-400">search</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-2">
            <div className="flex items-center gap-[5px] bg-slate-50 px-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[17px] text-slate-400">search</span>
              <input
                ref={inputRef}
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="Cari produk (maks. 20 hasil)"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1" role="listbox" aria-multiselectable="true">
            {loading && !options.length ? <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">Memuat produk...</p> : null}
            {!loading && !options.length ? <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">Produk tidak ditemukan.</p> : null}
            {options.map((option) => {
              const active = selected.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggle(option.id)}
                  className={`flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm ${active ? "bg-emerald-50 font-bold text-emerald-800" : "text-slate-700 hover:bg-slate-50"}`}
                  role="option"
                  aria-selected={active}
                >
                  <span aria-hidden="true" className={`material-symbols-outlined text-[17px] ${active ? "text-emerald-600" : "text-slate-300"}`}>{active ? "check_box" : "check_box_outline_blank"}</span>
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                </button>
              );
            })}
          </div>
          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-400">Kosongkan = semua produk.</p>
        </div>
      ) : null}
    </div>
  );
}

function initialValues(entity) {
  return {
    code: entity?.code || "",
    name: entity?.name || "",
    imageFile: null,
    imageUrl: entity?.imageUrl || "",
    discountTarget: entity?.discountTarget || "product",
    discountType: entity?.discountType || "fixed",
    discountValue: entity?.discountValue || 0,
    minSpend: entity?.minSpend || 0,
    minItems: entity?.minItems ?? "",
    minDistinctProducts: entity?.minDistinctProducts ?? "",
    minSameProductQty: entity?.minSameProductQty ?? "",
    terms: entity?.terms || "",
    maxDiscount: entity?.maxDiscount ?? "",
    startsAt: toDateTimeLocal(entity?.startsAt) || toDateTimeLocal(new Date()),
    endsAt: toDateTimeLocal(entity?.endsAt) || toDateTimeLocal(new Date(Date.now() + 7 * 86400000)),
    usageLimit: entity?.usageLimit || 0,
    usageLimitPerUser: entity?.usageLimitPerUser ?? "",
    productIds: (Array.isArray(entity?.productIds) ? entity.productIds : []).map(Number).filter((id) => Number.isFinite(id) && id > 0),
    isActive: entity?.isActive ?? true,
  };
}

export function VoucherFormDialog({ open, entity, portal, onClose, onSaved, onDelete }) {
  const [values, setValues] = useState(() => initialValues(entity));
  const [errors, setErrors] = useState({});
  const pristine = initialValues(entity);
  const dirty = useFormDirty(pristine, values);
  const createMutation = useCreateVoucher(portal);
  const updateMutation = useUpdateVoucher(portal);
  const mutation = entity ? updateMutation : createMutation;
  const selectedImageUrl = useObjectUrl(values.imageFile);
  const previewImageUrl = selectedImageUrl || resolveMediaUrl(values.imageUrl);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [productLabels, setProductLabels] = useState({});

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => setDebouncedProductSearch(productSearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [productSearch, open]);

  const productsQuery = useQuery({
    queryKey: ["voucher", "product-options", portal, debouncedProductSearch],
    queryFn: () => getProductOptions(portal, debouncedProductSearch),
    enabled: open,
    staleTime: 60000,
  });

  useEffect(() => {
    const rows = productsQuery.data || [];
    if (!rows.length) return;
    setProductLabels((current) => {
      let changed = false;
      const next = { ...current };
      rows.forEach((row) => {
        if (next[row.id] !== row.name) {
          next[row.id] = row.name;
          changed = true;
        }
      });
      return changed ? next : current;
    });
  }, [productsQuery.data]);

  useEffect(() => {
    if (open) {
      setValues(initialValues(entity));
      setErrors({});
      setProductSearch("");
      setDebouncedProductSearch("");
    }
  }, [entity, open]);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateFields(values, {
      code: required("Kode voucher"),
      name: required("Nama voucher"),
      discountValue: minimumNumber("Nilai diskon", 0.01),
      startsAt: required("Tanggal mulai"),
      endsAt: required("Tanggal berakhir"),
    });

    if (new Date(values.endsAt) <= new Date(values.startsAt)) nextErrors.endsAt = "Tanggal berakhir harus setelah tanggal mulai.";
    if (values.discountType === "percentage" && Number(values.discountValue) > 100) nextErrors.discountValue = "Persentase diskon maksimal 100%.";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      const saved = entity
        ? await updateMutation.mutateAsync({ id: entity.id, values })
        : await createMutation.mutateAsync(values);
      onSaved?.(saved);
            window.setTimeout(() => onClose?.(), 350);
    } catch (error) {
      toastError("Gagal menyimpan voucher", getVoucherManagementError(error));
    }
  };

  const targetLabel = values.discountTarget === "shipping" ? "ongkir" : "produk";

  return (
    <CrudDialog
      presentation="page"
      open={open}
      onClose={onClose}
      title={entity ? "Edit Voucher" : "Tambah Voucher"}
      subtitle={portal === "seller" ? "Kelola voucher toko." : "Kelola voucher toko."}
      size="max-w-3xl"
    >
      <form onSubmit={submit}>
        <FormEditorLayout
          actions={
            <FormActionDock tone={portal === "admin" ? "teal" : "emerald"} save={{ icon: "save", label: "Simpan" }} disabled={mutation.isPending || !dirty} onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
          }
        >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Kode voucher" error={errors.code} required>
            <input value={values.code} onChange={(event) => setField("code", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Nama voucher" error={errors.name} required>
            <input value={values.name} onChange={(event) => setField("name", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Target diskon">
            <SearchableSelect
              value={values.discountTarget}
              onChange={(nextValue) => setField("discountTarget", nextValue)}
              options={[{ value: "product", label: "Harga Produk" }, { value: "shipping", label: "Ongkos Kirim" }]}
              clearable={false}
            />
          </FormField>
          <FormField label="Tipe diskon">
            <SearchableSelect
              value={values.discountType}
              onChange={(nextValue) => setField("discountType", nextValue)}
              options={[{ value: "fixed", label: "Nominal" }, { value: "percentage", label: "Persentase" }]}
              clearable={false}
            />
          </FormField>
          <FormField label={`Nilai diskon ${targetLabel}`} error={errors.discountValue} required hint={values.discountTarget === "shipping" && values.discountType === "percentage" && Number(values.discountValue) === 100 ? "100% berarti gratis ongkir sesuai batas maksimum." : ""}>
            <input type="number" min="0.01" max={values.discountType === "percentage" ? 100 : undefined} step="0.01" value={values.discountValue} onChange={(event) => setField("discountValue", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Minimum belanja">
            <input type="number" min="0" value={values.minSpend} onChange={(event) => setField("minSpend", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Jumlah item minimal" hint="Total kuantitas item yang harus dibeli (kosongkan jika tanpa syarat).">
            <input type="number" min="0" value={values.minItems} onChange={(event) => setField("minItems", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Item produk berbeda" hint="Minimal jumlah produk berbeda dalam transaksi (mis. 2 = wajib 2 barang berbeda).">
            <input type="number" min="0" value={values.minDistinctProducts} onChange={(event) => setField("minDistinctProducts", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Min. pcs produk yang sama" hint="Wajib membeli minimal N pcs dari satu produk yang sama (mis. 3 = 3 pcs produk yang sama). Kosongkan jika tanpa syarat.">
            <input type="number" min="0" value={values.minSameProductQty} onChange={(event) => setField("minSameProductQty", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Syarat & ketentuan" hint="Ketentuan tambahan yang ditampilkan ke pembeli.">
            <textarea value={values.terms} onChange={(event) => setField("terms", event.target.value)} rows={2} className={inputClassName} />
          </FormField>
          <FormField label="Maksimum diskon" hint="Kosongkan jika tidak dibatasi.">
            <input type="number" min="0" value={values.maxDiscount} onChange={(event) => setField("maxDiscount", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Mulai" error={errors.startsAt} required>
            <input type="datetime-local" value={values.startsAt} onChange={(event) => setField("startsAt", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Berakhir" error={errors.endsAt} required>
            <input type="datetime-local" value={values.endsAt} onChange={(event) => setField("endsAt", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Batas penggunaan">
            <input type="number" min="0" value={values.usageLimit} onChange={(event) => setField("usageLimit", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Maks. pemakaian per user" hint="0 atau kosong = tanpa batas per akun.">
            <input type="number" min="0" value={values.usageLimitPerUser} onChange={(event) => setField("usageLimitPerUser", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Berlaku untuk produk (opsional)" hint="Kosongkan = semua produk." className="md:col-span-2">
            <ProductMultiSelect
              value={values.productIds}
              onChange={(nextProductIds) => setField("productIds", nextProductIds)}
              options={productsQuery.data || []}
              labels={productLabels}
              loading={productsQuery.isFetching}
              search={productSearch}
              onSearch={setProductSearch}
            />
          </FormField>
          <FormField label="Gambar voucher" hint="JPG, PNG, atau WEBP maksimal 3 MB.">
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setField("imageFile", event.target.files?.[0] || null)} className="block w-full bg-slate-50 p-2.5 text-sm" />
          </FormField>
          {previewImageUrl ? (
            <div className="md:col-span-2 overflow-hidden bg-slate-100">
              <img src={previewImageUrl} alt="Preview voucher" className="h-40 w-full object-cover" />
            </div>
          ) : null}
          <div className="md:col-span-2">
            <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3">
              <span className="text-sm font-bold text-slate-700">Status aktif</span>
              <InlineActiveSwitch checked={values.isActive} onChange={(isActive) => setField("isActive", isActive)} showLabel={false} />
            </div>
          </div>
        </div>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onClose} submitLabel="Simpan" submitIcon="save" disabled={mutation.isPending || !dirty} tone={portal === "admin" ? "teal" : "emerald"} onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
      </form>
    </CrudDialog>
  );
}
