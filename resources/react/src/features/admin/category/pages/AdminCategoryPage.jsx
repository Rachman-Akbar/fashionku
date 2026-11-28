import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { FormActionDock, FormEditorLayout } from "@/shared/components/crud";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useDatabaseTableColumns, useTableSelection, useViewMode } from "@/shared/hooks";
import { useColumnFilterState } from "@/shared/hooks";
import { buildColumnFilterConfig } from "@/shared/utils/columnFilters";
import { ColumnFilterHeader } from "@/shared/components/crud/ColumnFilterHeader";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { FormField, inputClassName } from "@/shared/components/form/FormField";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { useTabDirtyGuard } from "@/shared/hooks/useTabDirtyGuard";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { FormattedNumberInput } from "@/shared/components/form/FormattedNumberInput";
import { useActiveToggle } from "@/shared/hooks/useActiveToggle";
import { InteractiveColGroup } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { ImageFilePicker } from "@/shared/components/form/ImageFilePicker";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/admin/category/services/categoryService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { confirmDelete } from "@/shared/utils/sweetAlert";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { ExcelActionButtons } from "@/shared/excel";
import { useAdminActionTrackerContext } from "@/features/admin/notification/AdminActionTrackerContext";

function CategoryFormPage({ category, parents = [], levelOf, onSave, onDelete, saving }) {
  const initial = useMemo(() => ({
    name: category?.name || "",
    parent_id: category?.parentId ?? "",
    sort_order: category?.sortOrder ?? 0,
    is_active: category?.isActive !== false,
    image_url: category?.imageUrl || "",
    icon_url: category?.iconUrl || "",
  }), [category]);
  const [form, setForm] = useState(initial);
  useEffect(() => { setForm(initial); }, [initial]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);
  useTabDirtyGuard(dirty);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const level = form.parent_id ? (levelOf(form.parent_id) || 1) + 1 : 1;
  const isLeafLevel = level === 3;

  // Induk hanya boleh level 1 & 2 (agar hasilnya maksimal level 3) dan tidak
  // boleh dirinya sendiri / turunannya, supaya hierarki tidak membentuk siklus.
  const parentOptions = useMemo(() => {
    const excluded = new Set();
    const categoryId = category?.id;

    if (categoryId) {
      excluded.add(String(categoryId));
      const childrenByParent = (parents || []).reduce((map, row) => {
        const key = String(row.parentId ?? "");
        (map[key] ||= []).push(String(row.id));
        return map;
      }, {});
      const stack = [String(categoryId)];

      while (stack.length) {
        const current = stack.pop();
        for (const childId of childrenByParent[current] || []) {
          if (!excluded.has(childId)) {
            excluded.add(childId);
            stack.push(childId);
          }
        }
      }
    }

    return (parents || [])
      .filter((row) => !excluded.has(String(row.id)))
      .filter((row) => (levelOf(row.id) || 1) < 3)
      .map((row) => {
        const parentLevel = levelOf(row.id) || 1;
        return {
          value: String(row.id),
          label: `L${parentLevel} · ${"— ".repeat(parentLevel - 1)}${toTitleCase(row.name)}`,
          keywords: row.fullSlug || row.slug || row.name,
        };
      })
      .sort((left, right) => left.label.localeCompare(right.label, "id"));
  }, [category?.id, levelOf, parents]);

  const submit = () => {
    if (!String(form.name || "").trim() || saving) return;
    onSave(form);
  };

  return (
    <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
      <FormEditorLayout
        actions={(
          <FormActionDock
            tone="emerald"
            save={{ icon: category ? "save" : "add", label: category ? "Simpan" : "Tambah" }}
            disabled={!dirty || saving}
            onDelete={category ? onDelete : undefined}
          />
        )}
      >
        <FormPageLayout header={null}>
          <div className="space-y-6">
            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-[5px]">
                <span className="material-symbols-outlined text-slate-400">description</span>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Informasi Umum</h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Data utama kategori untuk katalog marketplace dan navigasi menu.</p>

              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <FormField label="Nama kategori" required>
                  <input
                    value={form.name}
                    onChange={(event) => setField("name", event.target.value)}
                    className={inputClassName}
                    disabled={saving}
                  />
                </FormField>

                <FormField label="Kategori induk" hint="Kosongkan untuk kategori root (level 1). Level dibatasi sampai 3.">
                  <SearchableSelect
                    value={form.parent_id ?? ""}
                    onChange={(nextValue) => setField("parent_id", nextValue)}
                    options={parentOptions}
                    placeholder="Tidak ada (root)"
                    searchPlaceholder="Cari kategori induk"
                    emptyText="Semua kategori sudah menjadi induk"
                    disabled={saving}
                    clearable
                  />
                </FormField>

                <FormField label="Urutan" hint="Urutan tampil antar kategori dalam induk yang sama.">
                  <FormattedNumberInput
                    value={form.sort_order}
                    onChange={(value) => setField("sort_order", Number(value) || 0)}
                    className={inputClassName}
                    disabled={saving}
                  />
                </FormField>

                <FormField label="Status aktif" hint="Kategori nonaktif disembunyikan dari katalog dan menu.">
                  <InlineActiveSwitch
                    checked={form.is_active}
                    onChange={(checked) => setField("is_active", checked)}
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-[5px]">
                <span className="material-symbols-outlined text-slate-400">imagesmode</span>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Ikon & Gambar</h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">Gambar kategori hanya muncul saat kategori ini berada di level 3.</p>

              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <FormField label="Ikon kategori" hint="Dipakai pada menu/navigasi kecil. Boleh diisi semua level.">
                  <ImageFilePicker
                    value={form.icon_url}
                    onChange={(url) => setField("icon_url", url)}
                    scope="categories"
                    label="Unggah ikon kategori"
                    aspectClassName="aspect-square"
                    disabled={saving}
                  />
                </FormField>

                {isLeafLevel ? (
                  <FormField label="Gambar kategori" hint="Tampil sebagai ilustrasi kategori level 3 di katalog.">
                    <ImageFilePicker
                      value={form.image_url}
                      onChange={(url) => setField("image_url", url)}
                      scope="categories"
                      label="Unggah gambar kategori"
                      aspectClassName="aspect-square"
                      disabled={saving}
                    />
                  </FormField>
                ) : (
                  <div className="flex flex-col justify-center rounded-[10px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      Gambar belum tersedia
                    </span>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Pilih kategori induk level 2 agar kategori ini menjadi level 3, lalu form gambar akan muncul otomatis.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[10px] bg-white p-5 ring-1 ring-slate-200">
              <div className="flex items-center gap-[5px]">
                <span className="material-symbols-outlined text-slate-400">hub</span>
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Hierarki</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Level kategori</p>
                  <p className="text-sm font-extrabold text-slate-900">{level}</p>
                </div>
                <div className="rounded-[8px] bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Induk</p>
                  <p className="truncate text-sm font-extrabold text-slate-900">{parentOptions.find((option) => option.value === String(form.parent_id ?? ""))?.label || "Root"}</p>
                </div>
                <div className="rounded-[8px] bg-slate-50 px-3 py-2 ring-1 ring-inset ring-slate-200">
                  <p className="text-[11px] font-bold text-slate-500">Jumlah produk</p>
                  <p className="text-sm font-extrabold text-slate-900">{category?.productsCount ?? 0}</p>
                </div>
              </div>
            </section>
          </div>
        </FormPageLayout>
      </FormEditorLayout>
    </form>
  );
}

export default function AdminCategoryPage() {
  const [viewMode, setViewMode] = useViewMode("admin-categories");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  // Setiap tambah data / detail membuka tab anak sendiri di samping tab
  // daftar (hijau), sehingga admin bisa berpindah antar entitas tanpa
  // kehilangan isian yang sedang dikerjakan.
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || "Kategori" });
  const activeToggle = useActiveToggle({
    mutate: (category, nextActive) => updateMutation.mutateAsync({ id: category.id, values: { is_active: nextActive } }),
    errorMessage: () => "Status kategori gagal diubah.",
    activeOf: (category) => category?.isActive !== false,
    labelOf: (category) => category?.name || `#${category?.id}`,
    onSettled: () => categoriesQuery.refetch(),
    openDetail: (category) => editor.edit(category),
  });
  // Grup/subkategori terbuka secara default; admin cukup menutupnya bila perlu.
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const autoExpandedIds = useRef(new Set());
  const deferredQuery = useDeferredValue(query.trim());
  const categoriesQuery = useCategories({ ...(deferredQuery ? { search: deferredQuery } : {}), per_page: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const actionTracker = useAdminActionTrackerContext();
  const rows = categoriesQuery.data || [];
  const total = useListTotalCount({ total: rows.length }, { label: "Kategori" });
  // Kolom kurasi + semua kolom database lain (kecuali kolom ID).
  const curatedColumns = useMemo(
    () => [
      { key: "name", label: "Nama" },
      { key: "parentId", label: "Induk" },
      { key: "sortOrder", label: "Urutan" },
      { key: "isActive", label: "Aktif" },
      { key: "imageUrl", label: "Gambar" },
      { key: "iconUrl", label: "Ikon" },
    ],
    [],
  );
  const { columnVisibility, visibleColumns } = useDatabaseTableColumns(curatedColumns, rows, {
    storageKey: "admin-categories",
    // Slug/full_slug tetap dipakai untuk URL, tapi tidak ditampilkan ke user.
    omit: ["slug", "full_slug"],
    labels: {
      parent_scope_id: "Parent Scope",
      parent: "Induk",
      created_by_user: "Dibuat Oleh",
      updated_by_user: "Diubah Oleh",
      created_at: "Dibuat",
      updated_at: "Diubah",
      deleted_at: "Dihapus",
      is_active: "Aktif",
      sort_order: "Urutan",
      image_url: "Gambar",
      icon_url: "Ikon",
    },
  });

  // ── Filter per kolom ────────────────────────────────────────────────────
  // Semua kolom (kurasi maupun kolom database) bisa disaring.
  const parentNameById = useMemo(() => new Map(rows.map((item) => [String(item.id), item.name])), [rows]);
  const categoryFilterValue = useCallback((row, key) => {
    const columnKey = String(key);
    if (columnKey.startsWith("raw:")) return row?.raw?.[columnKey.slice(4)];
    if (columnKey === "name") return row.name;
    if (columnKey === "parentId") return parentNameById.get(String(row.parentId)) || "";
    if (columnKey === "isActive") return Boolean(row.isActive);
    if (columnKey === "imageUrl") return row.imageUrl;
    if (columnKey === "iconUrl") return row.iconUrl;
    if (columnKey === "sortOrder") return row.sortOrder;
    return resolveTableValue(row, columnKey);
  }, [parentNameById]);
  const filterConfig = useMemo(
    () => buildColumnFilterConfig(columnVisibility.allColumns, rows, categoryFilterValue),
    [categoryFilterValue, columnVisibility.allColumns, rows],
  );
  const filterTypes = useMemo(() => ({
    ...filterConfig.types,
    name: "text",
    parentId: "select",
    sortOrder: "range",
    isActive: "select",
    imageUrl: "text",
    iconUrl: "text",
  }), [filterConfig.types]);
  const filterOptions = useMemo(() => ({
    ...filterConfig.options,
    isActive: [{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }],
    parentId: [...parentNameById.values()]
      .sort((left, right) => String(left).localeCompare(String(right), "id"))
      .map((name) => ({ value: String(name), label: String(name) })),
  }), [filterConfig.options, parentNameById]);
  const filterState = useColumnFilterState({ rows, getValue: categoryFilterValue, filterTypes });
  const filteredRows = filterState.rows;
  const selection = useTableSelection(filteredRows);
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: categoriesQuery.refetch });

  // Header kategori bisa digeser (drag & drop) dan lebarnya ditarik, sama
  // seperti tabel produk/pesanan. Urutan & lebar disimpan di localStorage.
  const tableLayout = useTableColumnLayout({
    storageKey: "admin-categories-table",
    columns: visibleColumns.map((column) => ({ ...column, width: column.key === "name" ? 280 : 160 })),
    preferredOrder: columnVisibility.visibleKeys,
    onOrderChange: columnVisibility.syncVisibleOrder,
  });
  const hScroll = useHorizontalScroll();

  // Susun hierarki kategori: level 1 sebagai induk utama, level 2 sebagai
  // subinduk, dan level 3 sebagai anak. Baris anak hanya tampil ketika
  // container induknya dibuka (pola yang sama dengan daftar variant produk).
  const categoryTree = useMemo(() => {
    const byId = new Map(filteredRows.map((row) => [String(row.id), row]));
    const childrenByParent = new Map();
    const roots = [];
    const sortRows = (list) => [...list].sort((a, b) => {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });

    for (const row of filteredRows) {
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
  }, [filteredRows]);

  const expandableIds = useMemo(() => new Set(categoryTree.childrenByParent.keys()), [categoryTree]);
  const levelById = useMemo(() => {
    const levels = new Map();
    const byId = new Map(rows.map((row) => [String(row.id), row]));
    const resolve = (row, visiting = new Set()) => {
      const key = String(row.id);
      if (levels.has(key)) return levels.get(key);
      if (visiting.has(key)) return 1;
      visiting.add(key);
      const parentId = row.parentId === null || row.parentId === undefined || row.parentId === "" ? null : String(row.parentId);
      const parent = parentId ? byId.get(parentId) : null;
      const level = parent ? resolve(parent, visiting) + 1 : 1;
      levels.set(key, level);
      return level;
    };
    for (const row of rows) resolve(row);
    return levels;
  }, [rows]);
  const levelOf = useCallback((id) => levelById.get(String(id)) || 1, [levelById]);
  useEffect(() => {
    const unseen = [...expandableIds].filter((id) => !autoExpandedIds.current.has(id));
    if (!unseen.length) return;
    for (const id of unseen) autoExpandedIds.current.add(id);
    setExpandedIds((current) => new Set([...current, ...unseen]));
  }, [expandableIds]);
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
    // Hanya kategori level 3 yang menyimpan gambar, jadi gambar lama ikut
    // dibersihkan saat kategori dipindah ke level lain.
    const values = { parent_id: parentId };
    if ((parentId ? levelOf(parentId) + 1 : 1) !== 3) values.image_url = null;
    try {
      await updateMutation.mutateAsync({ id: category.id, values });
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
    subtitle: (category) => parentNameOf(category),
    badges: [
      (category) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          {category.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
    ],
    fields: [
      { label: "Gambar", render: (category) => levelOf(category.id) === 3 && category.imageUrl ? <img src={resolveMediaUrl(category.imageUrl)} alt="" className="h-12 w-12 rounded object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span> },
      { label: "Ikon", render: (category) => category.iconUrl ? <img src={resolveMediaUrl(category.iconUrl)} alt="" className="h-12 w-12 rounded object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span> },
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
    const level = form.parent_id ? levelOf(form.parent_id) + 1 : 1;
    const payload = {
      name: String(form.name).trim(),
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      sort_order: Number(form.sort_order) || 0,
      is_active: Boolean(form.is_active),
      image_url: level === 3 ? form.image_url || null : null,
      icon_url: form.icon_url || null,
    };
    const isEdit = Boolean(editor.entity?.id);
    const actionId = actionTracker.startAction({
      title: isEdit ? "Perbarui Kategori" : "Tambah Kategori",
      message: isEdit ? "Sedang menyimpan perubahan kategori..." : "Sedang membuat kategori baru...",
      module: "categories",
      loadingTitle: "Menyimpan...",
      loadingMessage: isEdit ? "Perbarui kategori..." : "Tambah kategori...",
      url: "/admin/categories",
      onStart: () => editor.completeSave(),
    });

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editor.entity.id, values: payload });
        actionTracker.completeAction(actionId, { success: true, message: "Perubahan kategori berhasil disimpan.", toastTitle: "Sukses", toastMessage: "Perubahan kategori berhasil disimpan.", autoClosePanel: false });
      } else {
        await createMutation.mutateAsync(payload);
        actionTracker.completeAction(actionId, { success: true, message: "Kategori baru berhasil dibuat.", toastTitle: "Sukses", toastMessage: "Kategori baru berhasil dibuat.", autoClosePanel: false });
      }
      editor.completeSave();
      categoriesQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal menyimpan kategori.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => handleSave(form), detailLabel: "Lihat Data", onDetail: () => editor.edit(editor.entity) });
    }
  };

  const handleActivate = async (category, next = !category.isActive) => {
    const actionId = actionTracker.startAction({
      title: "Ubah Status Kategori",
      message: `Sedang mengubah status ${category.name}...`,
      module: "categories",
      loadingTitle: "Mengubah status...",
      loadingMessage: `Mengubah status ${category.name}...`,
      url: "/admin/categories",
    });

    try {
      await updateMutation.mutateAsync({ id: category.id, values: { ...category, is_active: next } });
      actionTracker.completeAction(actionId, { success: true, message: "Status kategori berhasil diubah.", toastTitle: "Sukses", toastMessage: "Status berhasil diubah.", autoClosePanel: false });
      categoriesQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal mengubah status kategori.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => handleActivate(category, next), detailLabel: "Lihat Data", onDetail: () => editor.edit(category) });
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const confirmed = await confirmDelete({
      title: "Hapus Kategori",
      text: `Kategori "${deleteTarget.name}" akan dihapus.`,
    });
    if (!confirmed.isConfirmed) return;

    const actionId = actionTracker.startAction({
      title: "Hapus Kategori",
      message: `Sedang menghapus ${deleteTarget.name}...`,
      module: "categories",
      loadingTitle: "Menghapus...",
      loadingMessage: `Menghapus ${deleteTarget.name}...`,
      url: "/admin/categories",
      onStart: () => {
        setDeleteTarget(null);
        if (editor.entity && String(editor.entity.id) === String(deleteTarget.id)) editor.close();
      },
    });

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      actionTracker.completeAction(actionId, { success: true, message: "Kategori berhasil dihapus.", toastTitle: "Sukses", toastMessage: "Kategori berhasil dihapus.", autoClosePanel: false });
      if (editor.entity && String(editor.entity.id) === String(deleteTarget.id)) editor.close();
      categoriesQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal menghapus kategori.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => remove(), detailLabel: "Lihat Data", onDetail: () => editor.edit(editor.entity) });
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {editor.open ? (
        <CategoryFormPage
          key={editor.activeTab?.id || "category-form"}
          category={editor.entity || null}
          parents={rows}
          levelOf={levelOf}
          onSave={handleSave}
          onDelete={editor.entity ? () => setDeleteTarget(editor.entity) : undefined}
          saving={createMutation.isPending || updateMutation.isPending}
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
            placeholder="Cari nama kategori"
            totalCount={total.totalCount}
            totalLabel={total.totalLabel}
            totalTitle={total.totalTitle}
            selectionEnabled={selection.enabled}
            selectedCount={selection.selectedCount}
            onToggleSelection={selection.toggleEnabled}
            bulkActions={[]}
            columns={columnVisibility.allColumns}
            visibleColumns={columnVisibility.visibleKeys}
            onToggleColumn={columnVisibility.toggleColumn}
            onMoveColumn={columnVisibility.moveColumn}
            onShowAllColumns={columnVisibility.showAll}
            onResetColumns={columnVisibility.reset}
            onApplyDefaultColumns={columnVisibility.applyAsDefault}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            extraActions={
              <ExcelActionButtons
                module="category"
                label="Kategori"
                selection={selection}
                rows={rows}
                onRefresh={() => categoriesQuery.refetch()}
                onCompleted={() => {}}
                getRowId={(row) => row.id}
                allowImport={true}
                allowExport={true}
                allowDelete={true}
              />
            }
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
              <div className={viewMode === "grid" ? "sticky top-[var(--list-toolbar-h,0px)] z-30 bg-white [&_tbody]:hidden" : ""}>
              <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
                <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] border border-slate-200 bg-white">
                  <table className="table-fixed border-collapse text-left text-sm" style={{ width: Math.max(tableLayout.totalWidth, 760), minWidth: "100%" }}>
                    <InteractiveColGroup columns={tableLayout.orderedColumns} getColumnStyle={tableLayout.getColumnStyle} leadingWidth={40} />
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
                          <ColumnFilterHeader
                            key={column.key}
                            column={column}
                            filterType={filterTypes[column.key] || "text"}
                            filterValue={filterState.columnFilters[column.key]}
                            options={filterOptions[column.key] || []}
                            onFilterChange={(value) => filterState.changeFilter(column.key, value)}
                            headerProps={tableLayout.getHeaderProps(column.key)}
                            columnStyle={tableLayout.getColumnStyle(column.key)}
                            onResizeStart={tableLayout.startResize}
                            onResetWidth={tableLayout.resetWidth}
                            dragging={tableLayout.dragKey === column.key}
                            dropTarget={tableLayout.dropKey === column.key}
                            onClearAllFilters={filterState.resetFilters}
                            onResetSort={filterState.resetSort}
                            className="bg-slate-50 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-slate-400 shadow-[inset_0_-1px_0_0_#e2e8f0]"
                          />
                        ))}
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
                            const value = resolveTableValue(category, column.key);
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
                                  <SearchableSelect
                                    value={category.parentId ?? ""}
                                    disabled={pendingParent}
                                    onChange={(nextValue) => handleParentChange(category, nextValue)}
                                    options={[
                                      ...(currentParentMissing ? [{ value: String(category.parentId), label: parentNameOf(category) }] : []),
                                      ...availableParents.map((parent) => ({ value: String(parent.id), label: parent.name })),
                                    ]}
                                    placeholder="Tidak ada (root)"
                                    searchPlaceholder="Cari kategori induk"
                                    emptyText="Kategori induk tidak ditemukan"
                                    buttonClassName="h-8 min-w-[150px] rounded-[8px] px-2 text-sm font-semibold"
                                  />
                                </td>
                              );
                            }
                            if (column.key === "imageUrl") {
                              return (
                                <td key={column.key} className="px-4 py-3 text-slate-700">
                                  {levelOf(category.id) === 3 && category.imageUrl ? <img src={resolveMediaUrl(category.imageUrl)} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span>}
                                </td>
                              );
                            }
                            if (column.key === "iconUrl") {
                              return (
                                <td key={column.key} className="px-4 py-3 text-slate-700">
                                  {category.iconUrl ? <img src={resolveMediaUrl(category.iconUrl)} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span>}
                                </td>
                              );
                            }
                            return (
                              <td key={column.key} className="px-4 py-3 text-slate-700">
                                {formatTableValue(value)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {viewMode === "grid" ? (
                <RecordCardGrid
                  rows={filteredRows}
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
    </>
  );
}
