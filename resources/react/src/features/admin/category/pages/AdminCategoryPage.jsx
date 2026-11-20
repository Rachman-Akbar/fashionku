import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { CrudDialog } from "@/shared/components/crud/CrudDialog"; 
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useColumnVisibility, useTableSelection, useViewMode } from "@/shared/hooks";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/admin/category/services/categoryService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError } from "@/shared/utils/userFeedback";

function CategoryEditor({ open, category, onClose, onSave, saving, parents }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    parent_id: category?.parentId ?? "",
    sort_order: category?.sortOrder ?? 0,
    is_active: category?.isActive !== false,
    description: category?.description || "",
  });

  return (
    <CrudDialog open={open} title={category ? "Edit Kategori" : "Tambah Kategori"} subtitle="Kelola kategori produk untuk katalog marketplace." onClose={onClose} size="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="space-y-4 p-5"
      >
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Nama Kategori</label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Slug</label>
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
            placeholder="Otomatis dari nama jika kosong"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Kategori Induk</label>
          <select
            value={form.parent_id ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          >
            <option value="">Tidak ada (root)</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Urutan</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))}
              className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
              disabled={saving}
            />
          </div>
          <div className="space-y-2 pt-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600 disabled:opacity-60"
                disabled={saving}
              />
              Aktif
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-[10px] border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60">
            Batal
          </button>
          <button type="submit" disabled={saving} className="h-10 rounded-[10px] bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </CrudDialog>
  );
}

function CategoryDetail({ category, parents, onBack, onSave, onDelete, saving }) {
  const initial = useMemo(() => ({
    name: category?.name || "",
    slug: category?.slug || "",
    parent_id: category?.parentId ?? "",
    sort_order: category?.sortOrder ?? 0,
    is_active: category?.isActive !== false,
  }), [category]);
  const [form, setForm] = useState(initial);
  useEffect(() => { setForm(initial); }, [initial]);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const fieldClass = "h-10 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60";
  const parentOptions = (parents || []).filter((parent) => String(parent.id) !== String(category?.id));

  return (
    <CrudDialog open presentation="page" title={category?.name || "Detail Kategori"} subtitle="Lihat dan ubah data kategori langsung pada halaman ini." onClose={onBack}>
      <form onSubmit={(event) => { event.preventDefault(); if (dirty && !saving) onSave(form); }}>
        <FormEditorLayout
          actions={<FormActionDock tone="emerald" save={{ icon: "save", label: "Simpan" }} disabled={!dirty || saving} onDelete={onDelete} deleteLabel="Hapus" />}
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-700">
                <span className="material-symbols-outlined text-[26px]">category</span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-extrabold text-slate-900">{form.name || "-"}</h2>
                <p className="truncate text-sm text-slate-500">{form.slug ? `/${form.slug}` : "Slug otomatis"}</p>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${form.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {form.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Nama Kategori<span className="ml-1 text-red-500">*</span></span>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={fieldClass} required />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Slug</span>
                <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className={fieldClass} placeholder="Otomatis dari nama jika kosong" />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Kategori Induk</span>
                <select value={form.parent_id ?? ""} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))} className={fieldClass}>
                  <option value="">Tidak ada (root)</option>
                  {parentOptions.map((parent) => (
                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Urutan</span>
                <input type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className={fieldClass} />
              </label>
              <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                <span>Status</span>
                <span className="flex h-10 items-center gap-2 rounded-[10px] border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-emerald-600" />
                  Aktif
                </span>
              </label>
              <div className="rounded-[10px] border border-slate-100 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Jumlah Produk</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{category?.productsCount ?? 0}</p>
              </div>
            </div>
          </div>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onBack} onSave={() => { if (dirty && !saving) onSave(form); }} submitLabel="Simpan" submitIcon="save" disabled={!dirty || saving} onDelete={onDelete} deleteLabel="Hapus" tone="emerald" />
      </form>
    </CrudDialog>
  );
}
export default function AdminCategoryPage() {
  const [viewMode, setViewMode] = useViewMode("admin-categories");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editor, setEditor] = useState({ open: false, category: null });
  const [detailCategory, setDetailCategory] = useState(null);
  const deferredQuery = useDeferredValue(query.trim());
  const categoriesQuery = useCategories({ ...(deferredQuery ? { search: deferredQuery } : {}), per_page: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const rows = categoriesQuery.data || [];
  const selection = useTableSelection(rows);
  const total = useListTotalCount({ total: rows.length }, { label: "Kategori" });
  const columnVisibility = useColumnVisibility(
    [
      { key: "name", label: "Nama" },
      { key: "slug", label: "Slug" },
      { key: "parentId", label: "Induk" },
      { key: "sortOrder", label: "Urutan" },
      { key: "isActive", label: "Aktif" },
    ],
    "admin-categories",
  );

  const parentOptions = useMemo(
    () => rows.filter((c) => !editor.category || c.id !== editor.category.id).map((c) => ({ id: c.id, name: c.name })),
    [rows, editor.category],
  );

  const visibleColumns = useMemo(
    () =>
      [
        { key: "name", label: "Nama" },
        { key: "slug", label: "Slug" },
        { key: "parentId", label: "Induk" },
        { key: "sortOrder", label: "Urutan" },
        { key: "isActive", label: "Aktif" },
      ].filter((column) => columnVisibility.visibleSet.has(column.key)),
    [columnVisibility.visibleSet],
  );

  const closeEditor = () => setEditor({ open: false, category: null });

  const parentNameOf = (category) => {
    const parent = rows.find((row) => String(row.id) === String(category.parentId));
    return parent?.name || (category.parentId ? String(category.parentId) : "-");
  };

  const rowActions = (category) => (
    <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setEditor({ open: true, category })}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        aria-label="Edit kategori"
        title="Edit"
      >
        <span className="material-symbols-outlined text-[16px]">edit</span>
      </button>
      <button
        type="button"
        onClick={() => handleActivate(category)}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-700"
        aria-label={category.isActive ? "Nonaktifkan" : "Aktifkan"}
        title={category.isActive ? "Nonaktifkan" : "Aktifkan"}
      >
        <span className="material-symbols-outlined text-[16px]">{category.isActive ? "toggle_on" : "toggle_off"}</span>
      </button>
      <button
        type="button"
        onClick={() => setDeleteTarget(category)}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
        aria-label="Hapus kategori"
        title="Hapus"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  );

  const categoryCard = {
    title: (category) => category.name,
    subtitle: (category) => (category.slug ? `/${category.slug}` : "Slug otomatis"),
    badges: [
      (category) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {category.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    ],
    fields: [
      { label: "Induk", render: (category) => parentNameOf(category) },
      { label: "Urutan", render: (category) => category.sortOrder ?? 0 },
    ],
    footer: (category) => rowActions(category),
  };

  const handleSave = async (form) => {
    if (!String(form.name || "").trim()) {
      toastError("Kategori", "Nama kategori wajib diisi.");
      return;
    }
    const payload = {
      name: String(form.name).trim(),
      slug: String(form.slug || "").trim() || undefined,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
    };
    try {
      if (editor.category?.id) {
        await updateMutation.mutateAsync({ id: editor.category.id, values: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      closeEditor();
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hooks
    }
  };

  const handleActivate = async (category, next = !category.isActive) => {
    try {
      await updateMutation.mutateAsync({ id: category.id, values: { is_active: next } });
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  const saveDetailCategory = async (form) => {
    if (!detailCategory) return;
    const payload = {
      name: String(form.name || "").trim(),
      slug: String(form.slug || "").trim() || undefined,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
    };
    try {
      await updateMutation.mutateAsync({ id: detailCategory.id, values: payload });
      setDetailCategory((current) => (current ? {
        ...current,
        name: payload.name,
        slug: form.slug || current.slug,
        parentId: payload.parent_id,
        sortOrder: payload.sort_order,
        isActive: payload.is_active,
      } : current));
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setDetailCategory(null);
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  return (
    <>
      {editor.open ? (
        <CategoryEditor
          open
          key={editor.category?.id || "new"}
          category={editor.category}
          onClose={closeEditor}
          onSave={handleSave}
          saving={updateMutation.isPending || createMutation.isPending}
          parents={parentOptions}
        />
      ) : detailCategory ? (
        <CategoryDetail
          category={detailCategory}
          parents={rows}
          onBack={() => setDetailCategory(null)}
          onSave={(form) => saveDetailCategory(form)}
          onDelete={() => setDeleteTarget(detailCategory)}
          saving={updateMutation.isPending}
        />
      ) : (
        <ListPageFrame
          toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={() => setEditor({ open: true, category: null })}
              onRefresh={() => categoriesQuery.refetch()}
              refreshing={categoriesQuery.isFetching}
              createLabel="Kategori"
              placeholder="Cari nama atau slug kategori"
              totalCount={total.totalCount}
              totalLabel={total.totalLabel}
              totalTitle={total.totalTitle}
              selectionEnabled={selection.enabled}
              selectedCount={selection.selectedCount}
              onToggleSelection={selection.toggleEnabled}
              bulkActions={[]}
              columns={[
                { key: "name", label: "Nama" },
                { key: "slug", label: "Slug" },
                { key: "parentId", label: "Induk" },
                { key: "sortOrder", label: "Urutan" },
                { key: "isActive", label: "Aktif" },
              ]}
              visibleColumns={columnVisibility.visibleKeys}
              onToggleColumn={columnVisibility.toggleColumn}
              onShowAllColumns={columnVisibility.showAll}
              onResetColumns={columnVisibility.reset}
              onApplyDefaultColumns={columnVisibility.applyAsDefault}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />
          )}
        >
          <AsyncState
            loading={categoriesQuery.isLoading}
            error={categoriesQuery.error ? (categoriesQuery.error?.message || "Gagal memuat kategori.") : ""}
            empty={!categoriesQuery.isLoading && !categoriesQuery.error && !rows.length}
            emptyText="Kategori belum tersedia."
          />
          {!categoriesQuery.isLoading && !categoriesQuery.error && rows.length && viewMode === "grid" ? (
            <RecordCardGrid
              rows={rows}
              columns={visibleColumns}
              card={categoryCard}
              onRowClick={(category) => setDetailCategory(category)}
              rowKey={(category) => category.id}
              emptyText="Kategori belum tersedia."
            />
          ) : null}
          {!categoriesQuery.isLoading && !categoriesQuery.error && rows.length && viewMode !== "grid" ? (
            <div className="border border-slate-200 bg-white">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {visibleColumns.map((column) => (
                      <th key={column.key} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        {column.label}
                      </th>
                    ))}
                    <th className="w-28 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((category) => (
                    <tr key={category.id} onClick={() => setDetailCategory(category)} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50">
                      {visibleColumns.map((column) => {
                        const value = category[column.key];
                        if (column.key === "isActive") {
                          return (
                            <td key={column.key} className="px-4 py-3 text-slate-700">
                              <span onClick={(event) => event.stopPropagation()}>
                                <InlineActiveSwitch
                                  checked={category.isActive !== false}
                                  pending={updateMutation.isPending && updateMutation.variables?.id === category.id}
                                  activeLabel="Aktif"
                                  inactiveLabel="Nonaktif"
                                  compact
                                  onChange={(next) => handleActivate(category, next)}
                                />
                              </span>
                            </td>
                          );
                        }
                        if (column.key === "parentId") {
                          return (
                            <td key={column.key} className="px-4 py-3 text-slate-700">
                              {parentNameOf(category)}
                            </td>
                          );
                        }
                        return (
                          <td key={column.key} className="px-4 py-3 text-slate-700">
                            {value ?? "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">{rowActions(category)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </ListPageFrame>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Kategori"
        message={`Kategori "${deleteTarget?.name || ""}" akan dihapus.`}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </>
  );
}
