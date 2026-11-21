import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { CrudDialog } from "@/shared/components/crud/CrudDialog"; 
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useColumnVisibility, useTableSelection, useViewMode } from "@/shared/hooks";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { useActiveToggle } from "@/shared/hooks/useActiveToggle";
import { InteractiveColGroup, InteractiveTableHeader } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
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
  // Setiap tambah data / detail membuka tab anak sendiri di samping tab
  // daftar (hijau), sehingga admin bisa berpindah antar entitas tanpa
  // kehilangan isian yang sedang dikerjakan.
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || row.slug || "Kategori" });
  const activeToggle = useActiveToggle({
    mutate: (category, nextActive) => updateMutation.mutateAsync({ id: category.id, values: { is_active: nextActive } }),
    errorMessage: () => "Status kategori gagal diubah.",
    activeOf: (category) => category?.isActive !== false,
    labelOf: (category) => category?.name || `#${category?.id}`,
    onSettled: () => categoriesQuery.refetch(),
    openDetail: (category) => editor.edit(category),
  });
  const [expandedIds, setExpandedIds] = useState(() => new Set());
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
    () => rows.filter((c) => !editor.entity || c.id !== editor.entity.id).map((c) => ({ id: c.id, name: c.name })),
    [rows, editor.entity],
  );
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: categoriesQuery.refetch });

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

  const closeEditor = editor.close;

  // Header kategori bisa digeser (drag & drop) dan lebarnya ditarik, sama
  // seperti tabel produk/pesanan. Urutan & lebar disimpan di localStorage.
  const tableLayout = useTableColumnLayout({
    storageKey: "admin-categories-table",
    columns: visibleColumns.map((column) => ({ ...column, width: column.key === "name" ? 280 : 160 })),
  });

  // Susun hierarki kategori: level 1 sebagai induk utama, level 2 sebagai
  // subinduk, dan level 3 sebagai anak. Baris anak hanya tampil ketika
  // container induknya dibuka (pola yang sama dengan daftar variant produk).
  const categoryTree = useMemo(() => {
    const byId = new Map(rows.map((row) => [String(row.id), row]));
    const childrenByParent = new Map();
    const roots = [];
    const sortRows = (list) => [...list].sort((a, b) => {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

    for (const row of rows) {
      const parentId = row.parentId === null || row.parentId === undefined || row.parentId === "" ? null : String(row.parentId);
      if (parentId && parentId !== String(row.id) && byId.has(parentId)) {
        if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
        childrenByParent.get(parentId).push(row);
      } else {
        roots.push(row);
      }
    }
    for (const [parentId, children] of childrenByParent) childrenByParent.set(parentId, sortRows(children));
    return { roots: sortRows(roots), childrenByParent };
  }, [rows]);

  const expandableIds = useMemo(() => new Set(categoryTree.childrenByParent.keys()), [categoryTree]);
  const allExpanded = expandableIds.size > 0 && [...expandableIds].every((id) => expandedIds.has(id));

  const toggleExpanded = (id) => {
    const key = String(id);
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAllExpanded = () => {
    setExpandedIds(allExpanded ? new Set() : new Set(expandableIds));
  };

  const treeRows = useMemo(() => {
    const flattened = [];
    const walk = (list, depth) => {
      for (const row of list) {
        const children = categoryTree.childrenByParent.get(String(row.id)) || [];
        const expanded = expandedIds.has(String(row.id));
        flattened.push({ category: row, depth, hasChildren: children.length > 0, expanded, childrenCount: children.length });
        if (children.length && expanded) walk(children, depth + 1);
      }
    };
    walk(categoryTree.roots, 0);
    return flattened;
  }, [categoryTree, expandedIds]);

  const parentNameOf = (category) => {
    const parent = rows.find((row) => String(row.id) === String(category.parentId));
    return parent?.name || (category.parentId ? String(category.parentId) : "-");
  };

  // Kategori sendiri beserta seluruh keturunannya dikeluarkan dari pilihan
  // dropdown induk agar hierarki tidak membentuk siklus (cycle) atau
  // menjadikan kategori sebagai anak dirinya sendiri.
  const selectableParentsFor = (category) => {
    const excluded = new Set([String(category.id)]);
    const childrenByParent = rows.reduce((map, row) => {
      const key = String(row.parentId ?? "");
      (map[key] ||= []).push(String(row.id));
      return map;
    }, {});
    const stack = [String(category.id)];
    while (stack.length) {
      const current = stack.pop();
      for (const childId of childrenByParent[current] || []) {
        if (!excluded.has(childId)) {
          excluded.add(childId);
          stack.push(childId);
        }
      }
    }
    return rows.filter((row) => !excluded.has(String(row.id)));
  };

  const handleParentChange = async (category, value) => {
    const parentId = value === "" ? null : Number(value);
    const currentId = category.parentId === null || category.parentId === undefined || category.parentId === "" ? null : Number(category.parentId);
    if (currentId === parentId) return;
    try {
      await updateMutation.mutateAsync({ id: category.id, values: { parent_id: parentId } });
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hooks
    }
  };

  const rowActions = (category) => (
    <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => editor.edit(category)}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        aria-label="Edit kategori"
        title="Edit"
      >
        <span className="material-symbols-outlined text-[16px]">edit</span>
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
      if (editor.entity?.id) {
        await updateMutation.mutateAsync({ id: editor.entity.id, values: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      editor.completeSave();
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hooks
    }
  };

  const handleActivate = (category, next = !category.isActive) => {
    activeToggle.toggle(category, next);
  };

  const saveDetailCategory = async (form) => {
    if (!editor.entity) return;
    const payload = {
      name: String(form.name || "").trim(),
      slug: String(form.slug || "").trim() || undefined,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
    };
    try {
      await updateMutation.mutateAsync({ id: editor.entity.id, values: payload });
      toastSuccess("Simpan Kategori", "Perubahan kategori berhasil disimpan.");
      editor.completeSave();
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
      if (editor.entity && String(editor.entity.id) === String(deleteTarget.id)) editor.close();
      categoriesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  return (
    <>
      {editor.open && !editor.entity ? (
        <CategoryEditor
          open
          key="create"
          category={null}
          onClose={closeEditor}
          onSave={handleSave}
          saving={updateMutation.isPending || createMutation.isPending}
          parents={parentOptions}
        />
      ) : editor.open && editor.entity ? (
        <CategoryDetail
          key={editor.activeTab?.id || "detail"}
          category={editor.entity}
          parents={rows}
          onBack={closeEditor}
          onSave={(form) => saveDetailCategory(form)}
          onDelete={() => setDeleteTarget(editor.entity)}
          saving={updateMutation.isPending}
        />
      ) : (
        <ListPageFrame
          toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={() => editor.create()}
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
          {!categoriesQuery.isLoading && !categoriesQuery.error && rows.length ? (
            <>
              <div className={viewMode === "grid" ? "[&_tbody]:hidden" : ""}>
                <div className="overflow-x-auto [overflow-y:clip] border border-slate-200 bg-white">
                  <table className="table-fixed w-full border-collapse text-left text-sm" style={{ width: Math.max(tableLayout.totalWidth, 760), minWidth: "100%" }}>
                    <InteractiveColGroup columns={tableLayout.orderedColumns} getColumnStyle={tableLayout.getColumnStyle} leadingWidth={40} trailingWidth={112} />
                    <thead className="sticky top-[var(--list-toolbar-h,0px)] z-20 bg-slate-50">
                      <tr className="bg-slate-50">
                        <th className="w-10 bg-slate-50 px-2 py-3 shadow-[inset_0_-1px_0_0_#e2e8f0]">
                          <button
                            type="button"
                            onClick={toggleAllExpanded}
                            disabled={!expandableIds.size}
                            aria-label={allExpanded ? "Tutup semua subkategori" : "Buka semua subkategori"}
                            title={allExpanded ? "Tutup semua subkategori" : "Buka semua subkategori"}
                            className="mx-auto flex h-7 w-7 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-default disabled:opacity-40"
                          >
                            <span className={`material-symbols-outlined text-[18px] leading-none transition-transform duration-200 ${allExpanded ? "rotate-180" : ""}`}>expand_more</span>
                          </button>
                        </th>
                        {tableLayout.orderedColumns.map((column) => (
                          <InteractiveTableHeader
                            key={column.key}
                            columnKey={column.key}
                            headerProps={tableLayout.getHeaderProps(column.key)}
                            style={tableLayout.getColumnStyle(column.key)}
                            onResizeStart={tableLayout.startResize}
                            onResetWidth={tableLayout.resetWidth}
                            dragging={tableLayout.dragKey === column.key}
                            dropTarget={tableLayout.dropKey === column.key}
                            className="bg-slate-50 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-400 shadow-[inset_0_-1px_0_0_#e2e8f0]"
                          >
                            {column.label}
                          </InteractiveTableHeader>
                        ))}
                        <th className="w-28 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 shadow-[inset_0_-1px_0_0_#e2e8f0]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treeRows.map(({ category, depth, hasChildren, expanded, childrenCount }) => (
                        <tr
                          key={category.id}
                          onClick={() => editor.edit(category)}
                          className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${depth === 1 ? "bg-slate-50/60" : depth >= 2 ? "bg-slate-50" : ""}`}
                        >
                          <td className="px-2 py-3 text-center" onClick={(event) => event.stopPropagation()}>
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleExpanded(category.id)}
                                aria-expanded={expanded}
                                title={expanded ? "Tutup subkategori" : `Buka ${childrenCount} subkategori`}
                                className="mx-auto flex h-7 w-7 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                              >
                                <span className={`material-symbols-outlined text-[20px] leading-none transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>expand_more</span>
                              </button>
                            ) : null}
                          </td>
                          {tableLayout.orderedColumns.map((column) => {
                            const value = category[column.key];
                            if (column.key === "name") {
                              return (
                                <td key={column.key} className="px-4 py-3 text-slate-700">
                                  <div className="flex min-w-0 items-center gap-1.5" style={{ paddingLeft: depth * 20 }}>
                                    {depth > 0 ? <span className="material-symbols-outlined shrink-0 text-[16px] leading-none text-slate-400">subdirectory_arrow_right</span> : null}
                                    <span className={`truncate ${depth === 0 ? "font-extrabold text-slate-900" : "font-semibold"}`}>{category.name}</span>
                                    {depth > 0 ? (
                                      <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                        {depth === 1 ? "Subinduk" : "Anak"}
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                              );
                            }
                            if (column.key === "isActive") {
                              return (
                                <td key={column.key} className="px-4 py-3 text-slate-700">
                                  <span onClick={(event) => event.stopPropagation()}>
                                    <InlineActiveSwitch
                                      checked={activeToggle.isActive(category)}
                                      pending={activeToggle.pending(category)}
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
                              const availableParents = selectableParentsFor(category);
                              const pendingParent = updateMutation.isPending && updateMutation.variables?.id === category.id;
                              const currentParentMissing = category.parentId != null && category.parentId !== "" && !availableParents.some((parent) => String(parent.id) === String(category.parentId));
                              return (
                                <td key={column.key} className="px-4 py-3 text-slate-700" onClick={(event) => event.stopPropagation()}>
                                  <select
                                    value={category.parentId ?? ""}
                                    disabled={pendingParent}
                                    onChange={(event) => handleParentChange(category, event.target.value)}
                                    aria-label={`Kategori induk ${category.name}`}
                                    title="Pilih kategori induk"
                                    className="h-8 w-full min-w-[150px] cursor-pointer rounded-[8px] border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-wait disabled:opacity-60"
                                  >
                                    <option value="">Tidak ada (root)</option>
                                    {currentParentMissing ? (
                                      <option value={category.parentId}>{parentNameOf(category)}</option>
                                    ) : null}
                                    {availableParents.map((parent) => (
                                      <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                      </option>
                                    ))}
                                  </select>
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
              </div>
              {viewMode === "grid" ? (
                <RecordCardGrid
                  rows={rows}
                  columns={visibleColumns}
                  card={categoryCard}
                  onRowClick={(category) => editor.edit(category)}
                  rowKey={(category) => category.id}
                  emptyText="Kategori belum tersedia."
                />
              ) : null}
            </>
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
