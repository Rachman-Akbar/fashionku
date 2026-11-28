import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { CrudDialog, FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [anchorRect, setAnchorRect] = useState(null);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const node = rootRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      setAnchorRect({ top: box.top, left: box.left, width: box.width, bottom: box.bottom });
    };

    const close = (event) => {
      if (!rootRef.current?.contains(event.target) && !panelRef.current?.contains(event.target)) {
        setOpen(false);
        onSearch("");
      }
    };

    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, onSearch]);

  const openDropdown = () => {
    if (open) return;
    const node = rootRef.current;
    if (node) {
      const box = node.getBoundingClientRect();
      setAnchorRect({ top: box.top, left: box.left, width: box.width, bottom: box.bottom });
    }
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setActiveIndex(-1);
    onSearch("");
  };

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  const handleQuery = (next) => {
    onSearch(next);
    setActiveIndex(0);
    openDropdown();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeDropdown();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openDropdown();
      if (!options.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      let index = activeIndex;
      if (index < 0) index = step > 0 ? -1 : 0;
      setActiveIndex((index + step + options.length) % options.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) toggle(option.id);
    }
  };

  const panel = (() => {
    if (!open || !anchorRect || typeof document === "undefined") return null;
    const gap = 6;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - anchorRect.bottom - gap;
    const spaceAbove = anchorRect.top - gap;
    const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
    const width = Math.min(Math.max(anchorRect.width, 260), viewportWidth - 16);
    const left = Math.max(8, Math.min(anchorRect.left, viewportWidth - width - 8));
    const maxHeight = Math.max(140, Math.min(320, openUp ? spaceAbove : spaceBelow));
    const style = {
      position: "fixed",
      left,
      width,
      maxHeight,
      zIndex: 9999,
      ...(openUp ? { bottom: viewportHeight - anchorRect.top + gap } : { top: anchorRect.bottom + gap }),
    };

    return createPortal(
      <div ref={panelRef} style={style} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="overflow-y-auto py-1" role="listbox" aria-multiselectable="true" style={{ maxHeight }}>
          {loading && !options.length ? <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">Memuat produk...</p> : null}
          {!loading && !options.length ? <p className="px-3 py-5 text-center text-xs font-semibold text-slate-400">Produk tidak ditemukan.</p> : null}
          {options.map((option, index) => {
            const active = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-[5px] px-3 py-2 text-left text-sm ${active ? "bg-emerald-50 font-bold text-emerald-800" : "text-slate-700 hover:bg-slate-50"} ${index === activeIndex && !active ? "bg-slate-100" : ""}`}
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
      </div>,
      document.body,
    );
  })();

  return (
    <div ref={rootRef} className="relative min-w-0">
      <div
        onClick={openDropdown}
        className="flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-left text-sm outline-none transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
      >
        {selected.map((id) => (
          <span
            key={id}
            role="button"
            tabIndex={0}
            onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggle(id); }}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.stopPropagation(); toggle(id); } }}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700"
          >
            <span className="truncate">{labels[id] || `Produk #${id}`}</span>
            <span aria-hidden="true" className="material-symbols-outlined text-[13px]">close</span>
          </span>
        ))}
        <input
          ref={inputRef}
          value={search}
          onChange={(event) => handleQuery(event.target.value)}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className="min-w-[90px] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-slate-400"
          placeholder={selected.length ? "Tambah produk lain..." : "Semua produk · ketik untuk mencari"}
        />
        <span aria-hidden="true" className="material-symbols-outlined ml-auto shrink-0 text-[18px] text-slate-400">search</span>
      </div>

      {panel}
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
            <FormattedNumberInput decimal min="0.01" max={values.discountType === "percentage" ? 100 : undefined} step="0.01" value={values.discountValue} onChange={(value) => setField("discountValue", value)} className={inputClassName} />
          </FormField>
          <FormField label="Minimum belanja">
            <FormattedNumberInput min="0" value={values.minSpend} onChange={(value) => setField("minSpend", value)} className={inputClassName} />
          </FormField>
          <FormField label="Jumlah item minimal" hint="Total kuantitas item yang harus dibeli (kosongkan jika tanpa syarat).">
            <FormattedNumberInput min="0" value={values.minItems} onChange={(value) => setField("minItems", value)} className={inputClassName} />
          </FormField>
          <FormField label="Item produk berbeda" hint="Minimal jumlah produk berbeda dalam transaksi (mis. 2 = wajib 2 barang berbeda).">
            <FormattedNumberInput min="0" value={values.minDistinctProducts} onChange={(value) => setField("minDistinctProducts", value)} className={inputClassName} />
          </FormField>
          <FormField label="Min. pcs produk yang sama" hint="Wajib membeli minimal N pcs dari satu produk yang sama (mis. 3 = 3 pcs produk yang sama). Kosongkan jika tanpa syarat.">
            <FormattedNumberInput min="0" value={values.minSameProductQty} onChange={(value) => setField("minSameProductQty", value)} className={inputClassName} />
          </FormField>
          <FormField label="Syarat & ketentuan" hint="Ketentuan tambahan yang ditampilkan ke pembeli.">
            <textarea value={values.terms} onChange={(event) => setField("terms", event.target.value)} rows={2} className={inputClassName} />
          </FormField>
          <FormField label="Maksimum diskon" hint="Kosongkan jika tidak dibatasi.">
            <FormattedNumberInput min="0" value={values.maxDiscount} onChange={(value) => setField("maxDiscount", value)} className={inputClassName} />
          </FormField>
          <FormField label="Mulai" error={errors.startsAt} required>
            <input type="datetime-local" value={values.startsAt} onChange={(event) => setField("startsAt", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Berakhir" error={errors.endsAt} required>
            <input type="datetime-local" value={values.endsAt} onChange={(event) => setField("endsAt", event.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Batas penggunaan">
            <FormattedNumberInput min="0" value={values.usageLimit} onChange={(value) => setField("usageLimit", value)} className={inputClassName} />
          </FormField>
          <FormField label="Maks. pemakaian per user" hint="0 atau kosong = tanpa batas per akun.">
            <FormattedNumberInput min="0" value={values.usageLimitPerUser} onChange={(value) => setField("usageLimitPerUser", value)} className={inputClassName} />
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
