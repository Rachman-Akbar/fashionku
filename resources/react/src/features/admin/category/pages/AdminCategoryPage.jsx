import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/admin/category/services/categoryService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";

function CategoryEditor({ open, category, onClose, onSave, saving, parents }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    parent_id: category?.parentId ?? "",
    sort_order: category?.sortOrder ?? 0,
    is_active: category?.isActive !== false,
    description: category?.description || "",
  });

  const resetForm = useCallback(() => {
    setForm({
      name: category?.name || "",
      slug: category?.slug || "",
      parent_id: category?.parentId ?? "",
      sort_order: category?.sortOrder ?? 0,
      is_active: category?.isActive !== false,
      description: category?.description || "",
    });
  }, [category]);

  return (
    <CrudDialog open={open} title={category ? "Edit Kategori" : "Tambah Kategori"} subtitle="Kelola kategori produk untuk katalog marketplace." onClose={onClose} size="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
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
            required
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Kategori Induk</label>
          <select
            value={form.parent_id}
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
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"></label>
            <div className="flex items-center gap-3">
              <input
                id="category-is-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600 disabled:opacity-60"
                disabled={saving}
              />
              <label htmlFor="category-is-active" className="text-sm font-semibold text-slate-700 disabled:opacity-60">
                Aktif
              </label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={2}
            className="h-24 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
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

export default function AdminCategoryPage() {
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const deferredQuery = useDeferredValue(query.trim());
  const categoriesQuery = useCategories({ ...(deferredQuery ? { search: deferredQuery } : {}), per_page: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const rows = categoriesQuery.data || [];
  const total = useListTotalCount(categoriesQuery.meta || {}, { label: "Kategori" });
  const columnVisibility = useColumnVisibility(
    [
      { key: "name", label: "Nama", filterable: true },
      { key: "slug", label: "Slug", filterable: true },
      { key: "parentId", label: "Induk", filterable: false },
      { key: "sortOrder", label: "Urutan", filterable: false },
      { key: "isActive", label: "Aktif", filterable: true },
    ],
    "admin-categories",
  );

  const parentOptions = useMemo(
    () => rows.filter((c) => !editCategory || c.id !== editCategory.id).map((c) => ({ id: c.id, name: c.name })),
    [rows, editCategory?.id],
  );

  const visibleColumns = useMemo(
    () =>
      [{ key: "name", label: "Nama" }, { key: "slug", label: "Slug" }, { key: "parentId", label: "Induk" }, { key: "sortOrder", label: "Urutan" }, { key: "isActive", label: "Aktif" }].filter(
        (column) => columnVisibility.visibleSet.has(column.key),
      ),
    [columnVisibility.visibleSet],
  );

  const handleSave = (form) => {
    if (!form.name.trim() || !form.slug.trim()) {
      toastError("Kategori", "Nama dan slug wajib diisi.");
      return;
    }
    const payload = {
      name: form.name,
      slug: form.slug,
      parent_id: form.parent_id || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
      description: form.description,
    };
    if (editCategory) {
      updateMutation.mutate({ id: editCategory.id, values: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleActivate = (category, nextActive) => {
    updateMutation.mutate({ id: category.id, values: { ...category.raw, is_active: nextActive } });
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      categoriesQuery.refetch();
    } catch {
      // error handled by mutation
    }
  };

  return (
    <>
      {editCategory ? (
        <CategoryEditor open category={editCategory} onClose={() => setEditCategory(null)} onSave={handleSave} saving={updateMutation.isPending || createMutation.isPending} parents={parentOptions} />
      ) : (
        <ListPageFrame
          toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={() => setEditCategory(null)}
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
            />
          )}
        >
          <AsyncState loading={categoriesQuery.isLoading} error={categoriesQuery.error ? String(categoriesQuery.error) : ""} empty={!categoriesQuery.isLoading && !rows.length} emptyText="Kategori belum tersedia." />
          {rows.length ? (
            <div className="border border-slate-200 bg-white">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    {visibleColumns.map((column) => (
                      <th key={column.key} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{column.label}</th>
                    ))}
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((category, index) => (
                    <tr key={category.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                      <td className="px-4 py-3">{index + 1}</td>
                      {visibleColumns.map((column) => {
                        const value = category[column.key];
                        if (column.key === "isActive") {
                          return (
                            <td key={column.key} className="px-4 py-3 text-slate-700">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
                                {category.isActive ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                          );
                        }
                        if (column.key === "parentId") {
                          return (
                            <td key={column.key} className="px-4 py-3 text-slate-700">
                              {value ? String(value) : "-"}
                            </td>
                          );
                        }
                        return (
                          <td key={column.key} className="px-4 py-3 text-slate-700">
                            {value || "-"}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditCategory(category)}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            aria-label="Edit kategori"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActivate(category, !category.isActive)}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            aria-label={category.isActive ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <span className="material-symbols-outlined text-[16px]">{category.isActive ? "block" : "check_circle"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(category)}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            aria-label="Hapus kategori"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
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
        message={`Kategori “${deleteTarget?.name || ""}” akan dihapus.`}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </>
  );
}
