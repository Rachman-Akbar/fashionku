import { useEffect, useState } from "react";
import { CrudDialog, FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { ImageFilePicker } from "@/shared/components/form/ImageFilePicker";
import { required, validateFields, validAppUrl } from "@/core/utils/formValidation";
import { getCategories } from "@/features/catalog/category/services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { getSellerProducts } from "@/features/seller/product/services/sellerProductService";
import { getPublicCatalogProducts } from "@/features/catalog/product/services/productService";
import {
  getPromotionError,
  useCreateAdminPromotion,
  useCreateSellerPromotion,
  useUpdateAdminPromotion,
  useUpdateSellerPromotion,
} from "@/features/catalog/promotion/services/promotionManagementService";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { getRelationQuickCreateError, useQuickCreateCategory } from "@/shared/services/relationQuickCreateService";
import { useRelationCreateTab } from "@/shared/hooks/useRelationCreateTab";
import { usePromotionPayments } from "@/features/advanced/services/advancedMarketplaceService";
import { useFormDirty } from "@/shared/hooks/useFormDirty";
import { toastError } from "@/shared/utils/userFeedback";

function flattenCategories(rows = [], depth = 0, result = []) {
  rows.forEach((row) => {
    result.push({ id: Number(row.id), name: `${"— ".repeat(depth)}${row.name}` });
    flattenCategories(row.children || [], depth + 1, result);
  });
  return result;
}

async function getTargetCategories() {
  const result = await getCategories();
  return flattenCategories(result.data || []);
}

async function getPublicProducts(query = "") {
  const result = await getPublicCatalogProducts({
    per_page: 50,
    ...(query.trim() ? { q: query.trim() } : {}),
  });
  return result.data.map((row) => ({ id: Number(row.id), name: row.name || `Produk ${row.id}` }));
}

function initialValues(entity) {
  return {
    storeId: entity?.storeId || "",
    promotionPaymentId: entity?.promotionPaymentId || "",
    name: entity?.name || "",
    imageUrl: entity?.imageUrl || "",
    mobileImageUrl: entity?.mobileImageUrl || "",
    clickAction: entity?.clickAction || "none",
    targetId: entity?.targetId || "",
    targetUrl: entity?.targetUrl || "",
    sortOrder: entity?.sortOrder || 0,
    isActive: entity?.isActive ?? true,
  };
}

export function PromotionFormDialog({ open, entity, portal, onClose, onSaved, onDelete }) {
  const [values, setValues] = useState(() => initialValues(entity));
  const [errors, setErrors] = useState({});
  const pristine = initialValues(entity);
  const dirty = useFormDirty(pristine, values);
  const isSeller = portal === "seller";
  const notifications = useNotificationCenter();
  const quickCreateCategoryMutation = useQuickCreateCategory();
  const openRelationCreateTab = useRelationCreateTab();
  const categoriesQuery = useQuery({ queryKey: ["promotion", "target-categories"], queryFn: getTargetCategories, enabled: open, staleTime: 5 * 60 * 1000 });
  const paymentQuery = usePromotionPayments({ status: "approved", per_page: 100 });
  const paymentOptions = (paymentQuery.data?.rows || []).filter((row) => !row.promotion || Number(row.id) === Number(entity?.promotionPaymentId));
  const productsQuery = useQuery({
    queryKey: ["promotion", portal, "target-products"],
    queryFn: async () => {
      if (isSeller) {
        const result = await getSellerProducts({ per_page: 100, is_active: true, status: "published" });
        return result.rows.map((row) => ({ id: row.id, name: row.name }));
      }
      return getPublicProducts();
    },
    enabled: open && values.clickAction === "product",
    staleTime: 2 * 60 * 1000,
  });
  const createSellerMutation = useCreateSellerPromotion();
  const createAdminMutation = useCreateAdminPromotion();
  const updateSellerMutation = useUpdateSellerPromotion();
  const updateAdminMutation = useUpdateAdminPromotion();
  const createMutation = isSeller ? createSellerMutation : createAdminMutation;
  const updateMutation = isSeller ? updateSellerMutation : updateAdminMutation;
  const mutation = entity ? updateMutation : createMutation;

  useEffect(() => {
    if (open) {
      setValues(initialValues(entity));
      setErrors({});
    }
  }, [entity, open]);

  const setField = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "clickAction" ? { targetId: "", targetUrl: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const quickCreateCategory = async (name) => {
    try {
      const created = await quickCreateCategoryMutation.mutateAsync({ name, catalogGroupName: "Lainnya" });
      notifications.push({ type: "success", title: "Category siap digunakan", message: `${created.name} berhasil dibuat dan langsung dipilih sebagai target.` });
      return { value: created.id, label: toTitleCase(created.name) };
    } catch (error) {
      notifications.push({ type: "error", title: "Category gagal dibuat", message: getRelationQuickCreateError(error) });
      throw error;
    }
  };

  const openProductCreate = async (name) => {
    const normalizedName = name.trim().toLowerCase();
    const candidates = isSeller
      ? (await getSellerProducts({ q: name, per_page: 50 })).rows
      : await getPublicProducts(name);
    const exact = candidates.find((product) => String(product.name || "").trim().toLowerCase() === normalizedName);

    if (exact) {
      notifications.push({ type: "info", title: "Product sudah tersedia", message: `${exact.name} ditemukan dari pencarian backend dan langsung dipilih.` });
      return { value: exact.id, label: toTitleCase(exact.name) };
    }

    return openRelationCreateTab({
      href: isSeller ? "/seller/products" : "/admin/products",
      relationLabel: "Product",
      searchName: name,
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const rules = {
      name: required("Nama promosi"),
      imageUrl: required("Gambar desktop"),
      targetUrl: values.clickAction === "url" ? [required("URL target"), validAppUrl("URL target")] : () => "",
      targetId: ["product", "category"].includes(values.clickAction) ? required("Target") : () => "",
      promotionPaymentId: isSeller ? required("Pembayaran promosi") : () => "",
    };
    const nextErrors = validateFields(values, rules);
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    try {
      const saved = entity
        ? await updateMutation.mutateAsync({ id: entity.id, values })
        : await createMutation.mutateAsync(values);
      onSaved?.(saved);
            window.setTimeout(() => onClose?.(), 350);
    } catch (error) {
      toastError("Gagal menyimpan promosi", getPromotionError(error));
    }
  };

  return (
    <CrudDialog open={open} onClose={onClose} title={entity ? "Edit Promosi" : "Tambah Promosi"} subtitle={isSeller ? "Setiap pengajuan seller otomatis berstatus pending sampai disetujui admin." : "Promosi baru tetap pending dan harus melalui approval sebelum tampil di homepage."} size="max-w-3xl">
      <form onSubmit={submit}>
        <FormEditorLayout
          actions={
            <FormActionDock tone={isSeller ? "emerald" : "teal"} save={{ icon: isSeller ? "send" : "save", label: isSeller ? "Ajukan Promosi" : "Simpan Promosi" }} disabled={mutation.isPending || !dirty} onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
          }
        >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nama promosi" error={errors.name} required><input value={values.name} onChange={(event) => setField("name", event.target.value)} className={inputClassName} /></FormField>
          {isSeller ? <FormField label="Pembayaran promosi" error={errors.promotionPaymentId} required><SearchableSelect value={values.promotionPaymentId} onChange={(nextValue) => setField("promotionPaymentId", nextValue)} options={paymentOptions.map((row) => ({ value: row.id, label: `${row.payment_number} - ${row.package_name} - Rp${Number(row.amount || 0).toLocaleString("id-ID")}` }))} placeholder="Pilih pembayaran approved" searchPlaceholder="Cari nomor pembayaran" /></FormField> : null}
          <FormField label="Urutan"><input type="number" min="0" value={values.sortOrder} onChange={(event) => setField("sortOrder", event.target.value)} className={inputClassName} /></FormField>
          <FormField label="Gambar desktop" error={errors.imageUrl} required><ImageFilePicker value={values.imageUrl} onChange={(imageUrl) => setField("imageUrl", imageUrl)} scope="promotions/desktop" label="Pilih gambar desktop" aspectClassName="aspect-[4/1]" /></FormField>
          <FormField label="Gambar mobile" error={errors.mobileImageUrl}><ImageFilePicker value={values.mobileImageUrl} onChange={(mobileImageUrl) => setField("mobileImageUrl", mobileImageUrl)} scope="promotions/mobile" label="Pilih gambar mobile" aspectClassName="aspect-[16/9]" /></FormField>
          <FormField label="Aksi ketika diklik">
            <SearchableSelect value={values.clickAction} onChange={(nextValue) => setField("clickAction", nextValue)} options={[{ value: "none", label: "Tanpa aksi" }, { value: "product", label: "Buka produk" }, { value: "category", label: "Buka kategori" }, { value: "url", label: "Buka URL" }]} clearable={false} />
          </FormField>
          {values.clickAction === "product" ? <FormField label="Produk target" error={errors.targetId} required><SearchableSelect value={values.targetId} onChange={(nextValue) => setField("targetId", nextValue)} options={(productsQuery.data || []).map((product) => ({ value: product.id, label: product.name }))} placeholder="Pilih produk" searchPlaceholder="Cari produk" onCreate={openProductCreate} createLabel={(name) => `Data tidak ditemukan, buka Data Baru Product untuk “${name}”`} /></FormField> : null}
          {values.clickAction === "category" ? <FormField label="Kategori target" error={errors.targetId} required><SearchableSelect value={values.targetId} onChange={(nextValue) => setField("targetId", nextValue)} options={(categoriesQuery.data || []).map((category) => ({ value: category.id, label: toTitleCase(category.name) }))} placeholder="Pilih kategori" searchPlaceholder="Cari kategori" onCreate={quickCreateCategory} creating={quickCreateCategoryMutation.isPending} createLabel={(name) => `Data tidak ditemukan, tambahkan “${name}” sebagai Category baru`} /></FormField> : null}
          {values.clickAction === "url" ? <FormField label="URL target" error={errors.targetUrl} required><input value={values.targetUrl} onChange={(event) => setField("targetUrl", event.target.value)} className={inputClassName} placeholder="/search?q=promo atau https://..." /></FormField> : null}
          <div className="md:col-span-2">
            <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3">
              <div>
                <span className="block text-sm font-bold text-slate-700">Status aktif</span>
                <span className="block text-[11px] text-slate-400">Promosi tetap tidak tampil ke buyer sebelum approval admin.</span>
              </div>
              <InlineActiveSwitch checked={values.isActive} onChange={(isActive) => setField("isActive", isActive)} showLabel={false} />
            </div>
          </div>
          {values.imageUrl ? <picture className="md:col-span-2"><source media="(max-width: 640px)" srcSet={values.mobileImageUrl || values.imageUrl} /><img src={values.imageUrl} alt="Preview promosi" className="aspect-[4/1] w-full rounded-2xl bg-slate-100 object-cover" /></picture> : null}
        </div>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onClose} submitLabel={isSeller ? "Ajukan Promosi" : "Simpan Promosi"} submitIcon={isSeller ? "send" : "save"} disabled={mutation.isPending || !dirty} tone={isSeller ? "emerald" : "teal"} onDelete={entity && onDelete ? () => onDelete(entity) : undefined} />
      </form>
    </CrudDialog>
  );
}
