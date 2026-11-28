import { useDeferredValue, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";
import { FormActionDock, FormEditorFooter, FormEditorLayout } from "@/shared/components/crud";
import { FormPageLayout } from "@/shared/components/crud/FormPageLayout";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useDatabaseTableColumns, useTableSelection, useViewMode } from "@/shared/hooks";
import { useColumnFilterState } from "@/shared/hooks";
import { buildColumnFilterConfig } from "@/shared/utils/columnFilters";
import { ColumnFilterHeader } from "@/shared/components/crud/ColumnFilterHeader";
import { formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { useEntityEditor, useRefreshOnListActivation } from "@/shared/hooks";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";
import { useActiveToggle } from "@/shared/hooks/useActiveToggle";
import { cn } from "@/shared/utils/utils";
import { InteractiveColGroup } from "@/shared/components/table/InteractiveTableHeader";
import { useTableColumnLayout } from "@/shared/hooks/useTableColumnLayout";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { RecordCardGrid } from "@/shared/components/ui/RecordCardGrid";
import { ImageFilePicker } from "@/shared/components/form/ImageFilePicker";
import { useUsersPage, useCreateUser, useUpdateUser, useDeleteUser } from "@/features/admin/users/services/usersService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { confirmDelete } from "@/shared/utils/sweetAlert";
import { resolveMediaUrl } from "@/core/utils/mediaUrl";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { Input } from "@/shared/components/ui/Input";
import { ExcelActionButtons } from "@/shared/excel";
import { useAdminActionTrackerContext } from "@/features/admin/notification/AdminActionTrackerContext";

const ROLES = ["buyer", "admin"];

function roleLabel(role) {
  if (role === "admin") return "Administrator";
  return "Pembeli";
}

const ROLE_OPTIONS = ROLES.map((role) => ({ value: role, label: roleLabel(role) }));

function roleBadgeClass(role) {
  if (role === "admin") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "-";
  }
}

function UserEditor({ open, user, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "buyer",
    is_active: user?.status !== "Nonaktif",
    avatar: user?.avatar || "",
  });

  return (
    <CrudDialog open={open} title={user ? "Edit Pengguna" : "Tambah Pengguna"} subtitle="Kelola data dan hak akses pengguna platform." onClose={onClose} size="max-w-md">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Nama Lengkap</label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Role</label>
          <SearchableSelect
            value={form.role}
            onChange={(nextValue) => setForm((current) => ({ ...current, role: nextValue }))}
            options={ROLE_OPTIONS}
            placeholder="Pilih role"
            searchPlaceholder="Cari role"
            clearable={false}
            buttonClassName="h-9 rounded-[10px]"
            disabled={saving}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Avatar</label>
          <ImageFilePicker value={form.avatar} onChange={(url) => setForm((current) => ({ ...current, avatar: url }))} scope="profiles" label="Unggah avatar" aspectClassName="aspect-square" disabled={saving} />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="user-is-active"
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
            className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600 disabled:opacity-60"
            disabled={saving}
          />
          <label htmlFor="user-is-active" className="text-sm font-semibold text-slate-700 disabled:opacity-60">
            Aktif
          </label>
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

function UserDetail({ user, onBack, onSave, onDelete, saving }) {
  const initial = useMemo(() => ({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "buyer",
    is_active: user?.status !== "Nonaktif",
    avatar: user?.avatar || "",
  }), [user]);
  const [form, setForm] = useState(initial);
  useEffect(() => { setForm(initial); }, [initial]);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const badgeClass = roleBadgeClass(user.role);
  const fieldClass = "h-10 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60";

  const avatarUrl = resolveMediaUrl(user?.avatar || "");

  return (
    <CrudDialog open presentation="page" title={user?.name || "Detail Pengguna"} subtitle="Lihat dan ubah data pengguna langsung pada halaman ini." onClose={onBack}>
      <form onSubmit={(event) => { event.preventDefault(); if (dirty && !saving) onSave(form); }}>
        <FormEditorLayout
          actions={<FormActionDock tone="emerald" save={{ icon: "save", label: "Simpan" }} disabled={!dirty || saving} onDelete={onDelete} deleteLabel="Hapus" />}
        >
          <FormPageLayout
            header={
              <div className="sticky top-0 z-30 -mx-3 -mt-px bg-slate-50 sm:-mx-4">
                <div className="px-3 pt-2 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                    <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">Detail Pengguna</h2>
                  </div>
                </div>
              </div>
            }
          >
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl font-black text-white">
                  {avatarUrl ? <img src={avatarUrl} alt={user.name || "User"} className="h-14 w-14 rounded-full object-cover" /> : (form.name || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold text-slate-900">{form.name || "-"}</h2>
                  <p className="truncate text-sm text-slate-500">{form.email || "-"}</p>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}>{roleLabel(form.role)}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${form.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{form.is_active ? "Aktif" : "Nonaktif"}</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Nama Lengkap<span className="ml-1 text-red-500">*</span></span>
                  <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={fieldClass} required />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Email<span className="ml-1 text-red-500">*</span></span>
                  <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={fieldClass} required />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Role</span>
                  <SearchableSelect
                    value={form.role}
                    onChange={(nextValue) => setForm((current) => ({ ...current, role: nextValue }))}
                    options={ROLE_OPTIONS}
                    placeholder="Pilih role"
                    searchPlaceholder="Cari role"
                    clearable={false}
                    buttonClassName="h-10 rounded-[10px]"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-bold text-slate-700">
                  <span>Status</span>
                  <span className="flex h-10 items-center gap-2 rounded-[10px] border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-emerald-600" />
                    Aktif
                  </span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Avatar</label>
                  <ImageFilePicker value={form.avatar} onChange={(url) => setForm((current) => ({ ...current, avatar: url }))} scope="profiles" label="Unggah avatar" aspectClassName="aspect-square" disabled={saving} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[10px] border border-slate-100 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Terdaftar</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(user.createdAt)}</p>
                </div>
                <div className="rounded-[10px] border border-slate-100 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">ID Pengguna</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{user.id || "-"}</p>
                </div>
              </div>
            </div>
          </FormPageLayout>
        </FormEditorLayout>
        <FormEditorFooter onCancel={onBack} onSave={() => { if (dirty && !saving) onSave(form); }} submitLabel="Simpan" submitIcon="save" disabled={!dirty || saving} onDelete={onDelete} deleteLabel="Hapus" tone="emerald" />
      </form>
    </CrudDialog>
  );
}

export default function AdminUsersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useViewMode("admin-users");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const activeToggle = useActiveToggle({
    mutate: (user, nextActive) => updateMutation.mutateAsync({
      id: user.id,
      values: {
        ...user.raw,
        is_active: nextActive,
      },
    }),
    errorMessage: () => "Status pengguna gagal diubah. Periksa kembali data lalu coba lagi.",
    activeOf: (user) => user?.status === "Aktif",
    labelOf: (user) => user?.name || user?.email || `#${user?.id}`,
    onSettled: () => usersQuery.refetch(),
    openDetail: (user) => editor.edit(user),
  });
  const editor = useEntityEditor({ getEditLabel: (row) => row.name || row.email || "Pengguna" });
  useEffect(() => {
    if (!location.state?.createBuyer) return;

    editor.create();
    navigate(location.pathname, { replace: true, state: null });
  }, [editor.create, location.pathname, location.state, navigate]);
  const editUser = editor.entity;
  const deferredQuery = useDeferredValue(query.trim());
  const usersQuery = useUsersPage({ ...(deferredQuery ? { search: deferredQuery } : {}), per_page: 100 });
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const actionTracker = useAdminActionTrackerContext();
  useRefreshOnListActivation({ isListActive: editor.isListActive, listRevision: editor.listRevision, refetch: usersQuery.refetch });
  const rows = usersQuery.data?.rows || [];
  const total = useListTotalCount(usersQuery.data?.meta || {}, { label: "Pengguna", fallbackTotal: rows.length });
  // Kolom kurasi + semua kolom database lain (kecuali kolom ID).
  const curatedColumns = useMemo(
    () => [
      { key: "name", label: "Nama", filterable: true },
      { key: "email", label: "Email", filterable: true },
      { key: "role", label: "Role", filterable: true },
      { key: "status", label: "Status", filterable: true },
      { key: "createdAt", label: "Daftar", filterable: true },
      { key: "avatar", label: "Avatar", filterable: true },
    ],
    [],
  );
  const { columnVisibility, visibleColumns } = useDatabaseTableColumns(curatedColumns, rows, {
    storageKey: "admin-users",
    omit: ["status"],
    labels: {
      is_active: "Aktif",
      firebase_uid: "Firebase UID",
      has_set_password: "Sudah Atur Password",
      deleted_at: "Dihapus",
      created_by_user: "Dibuat Oleh",
      updated_by_user: "Diubah Oleh",
      created_at: "Dibuat",
      updated_at: "Diubah",
    },
  });

  // ── Filter per kolom ────────────────────────────────────────────────────
  const userFilterValue = useCallback((row, key) => {
    const columnKey = String(key);
    if (columnKey.startsWith("raw:")) return row?.raw?.[columnKey.slice(4)];
    if (columnKey === "name") return row.name;
    if (columnKey === "email") return row.email;
    if (columnKey === "role") return roleLabel(row.role);
    if (columnKey === "status") return row.isActive ? "Aktif" : "Nonaktif";
    if (columnKey === "createdAt") return formatDate(row.createdAt);
    if (columnKey === "avatar") return row.avatar || row.raw?.avatar || "";
    return resolveTableValue(row, columnKey);
  }, []);
  const filterConfig = useMemo(
    () => buildColumnFilterConfig(columnVisibility.allColumns, rows, userFilterValue),
    [columnVisibility.allColumns, rows, userFilterValue],
  );
  const filterTypes = useMemo(() => ({
    ...filterConfig.types,
    name: "text",
    email: "text",
    role: "select",
    status: "select",
    createdAt: "text",
    avatar: "text",
  }), [filterConfig.types]);
  const filterOptions = useMemo(() => ({
    ...filterConfig.options,
    role: ROLES.map((role) => ({ value: roleLabel(role), label: roleLabel(role) })),
    status: [{ value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }],
  }), [filterConfig.options]);
  const filterState = useColumnFilterState({ rows, getValue: userFilterValue, filterTypes });
  const filteredRows = filterState.rows;
  // Jumlah data di toolbar mengikuti filter kolom yang aktif, sama seperti
  // halaman daftar lain (mis. "12 dari 98 data sesuai filter").
  const { onFilterStateChange: reportFilterState } = total;
  useEffect(() => {
    reportFilterState({
      activeCount: Object.keys(filterState.columnFilters).length,
      filteredCount: filteredRows.length,
      loadedCount: rows.length,
    });
  }, [filterState.columnFilters, filteredRows.length, reportFilterState, rows.length]);
  const selection = useTableSelection(filteredRows);

  const tableLayout = useTableColumnLayout({
    storageKey: "admin-users-table",
    columns: visibleColumns.map((column) => ({ ...column, width: column.key === "name" ? 260 : 170 })),
    preferredOrder: columnVisibility.visibleKeys,
    onOrderChange: columnVisibility.syncVisibleOrder,
  });
  const hScroll = useHorizontalScroll();

  const handleSave = (form) => {
    if (!form.name.trim() || !form.email.trim()) {
      toastError("Pengguna", "Nama dan email wajib diisi.");
      return;
    }
    const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active, avatar: form.avatar || null };
    const actionId = actionTracker.startAction({
      title: editUser ? "Perbarui Pengguna" : "Tambah Pengguna",
      message: "Sedang menyimpan data pengguna...",
      module: "users",
      loadingTitle: "Menyimpan...",
      loadingMessage: editUser ? "Perbarui pengguna..." : "Tambah pengguna...",
      url: "/admin/users",
      onStart: () => editor.completeSave(),
    });

    if (editUser) {
      updateMutation.mutate({ id: editUser.id, values: payload }, {
        onSuccess: () => {
          actionTracker.completeAction(actionId, { success: true, message: "Pengguna berhasil diperbarui.", toastTitle: "Sukses", toastMessage: "Pengguna berhasil diperbarui.", autoClosePanel: false });
          editor.completeSave();
        },
        onError: (error) => {
          const msg = error?.response?.data?.message || "Gagal memperbarui pengguna.";
          actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => handleSave(form), detailLabel: "Lihat Data", onDetail: () => editor.edit(editor.entity) });
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          actionTracker.completeAction(actionId, { success: true, message: "Pengguna berhasil ditambahkan.", toastTitle: "Sukses", toastMessage: "Pengguna berhasil ditambahkan.", autoClosePanel: false });
          editor.completeSave();
        },
        onError: (error) => {
          const msg = error?.response?.data?.message || "Gagal menambahkan pengguna.";
          actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => handleSave(form), detailLabel: "Lihat Data", onDetail: () => editor.create() });
        },
      });
    }
  };

  // Aktif / nonaktif cukup satu saklar (tanpa sistem banned).
  const handleActivate = async (user, nextActive) => {
    const actionId = actionTracker.startAction({
      title: "Ubah Status Pengguna",
      message: `Sedang mengubah status ${user.name}...`,
      module: "users",
      loadingTitle: "Mengubah status...",
      loadingMessage: `Mengubah status ${user.name}...`,
      url: "/admin/users",
    });

    try {
      await updateMutation.mutateAsync({
        id: user.id,
        values: { ...user.raw, is_active: nextActive },
      });
      actionTracker.completeAction(actionId, { success: true, message: "Status pengguna berhasil diubah.", toastTitle: "Sukses", toastMessage: "Status berhasil diubah.", autoClosePanel: false });
      usersQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal mengubah status pengguna.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => handleActivate(user, nextActive), detailLabel: "Lihat Data", onDetail: () => editor.edit(user) });
    }
  };

  const saveDetailUser = async (form) => {
    if (!editor.entity) return;
    const actionId = actionTracker.startAction({
      title: "Simpan Detail Pengguna",
      message: "Sedang menyimpan detail pengguna...",
      module: "users",
      loadingTitle: "Menyimpan...",
      loadingMessage: "Menyimpan detail pengguna...",
      url: "/admin/users",
      onStart: () => editor.close(),
    });

    try {
      await updateMutation.mutateAsync({
        id: editor.entity.id,
        values: { name: form.name, email: form.email, role: form.role, is_active: form.is_active, avatar: form.avatar || null },
      });
      actionTracker.completeAction(actionId, { success: true, message: "Perubahan data pengguna berhasil disimpan.", toastTitle: "Sukses", toastMessage: "Perubahan data pengguna berhasil disimpan.", autoClosePanel: false });
      editor.completeSave();
      usersQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal menyimpan detail pengguna.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => saveDetailUser(form), detailLabel: "Lihat Data", onDetail: () => editor.edit(editor.entity) });
    }
  };

  const userCard = {
    title: (user) => user.name,
    subtitle: (user) => user.email,
    badges: [
      (user) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${roleBadgeClass(user.role)}`}>
          {roleLabel(user.role)}
        </span>
      ),
      (user) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${user.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
          {user.status}
        </span>
      ),
    ],
    fields: [
      { label: "Avatar", render: (user) => user.avatar ? <img src={resolveMediaUrl(user.avatar)} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span> },
      { label: "Terdaftar", render: (user) => formatDate(user.createdAt) },
    ],
    footer: () => <span className="text-[11px] font-bold text-emerald-700">Klik untuk buka detail</span>,
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const confirmed = await confirmDelete({
      title: "Hapus Pengguna",
      text: `Pengguna "${deleteTarget.name}" akan dihapus dari platform.`,
    });
    if (!confirmed.isConfirmed) return;

    const actionId = actionTracker.startAction({
      title: "Hapus Pengguna",
      message: `Sedang menghapus ${deleteTarget.name}...`,
      module: "users",
      loadingTitle: "Menghapus...",
      loadingMessage: `Menghapus ${deleteTarget.name}...`,
      url: "/admin/users",
      onStart: () => {
        setDeleteTarget(null);
        if (editor.entity && String(editor.entity.id) === String(deleteTarget.id)) editor.close();
      },
    });

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      actionTracker.completeAction(actionId, { success: true, message: "Pengguna berhasil dihapus.", toastTitle: "Sukses", toastMessage: "Pengguna berhasil dihapus.", autoClosePanel: false });
      if (editor.entity && String(editor.entity.id) === String(deleteTarget.id)) editor.close();
      usersQuery.refetch();
    } catch (error) {
      const msg = error?.response?.data?.message || "Gagal menghapus pengguna.";
      actionTracker.failAction(actionId, msg, { retryLabel: "Coba Lagi", onRetry: () => remove(), detailLabel: "Lihat Data", onDetail: () => editor.edit(editor.entity) });
    }
    setDeleteTarget(null);
  };

  return (
    <>
      {editor.open && editor.entity ? (
        <UserDetail
          key={editor.activeTab?.id || "detail"}
          user={editor.entity}
          onBack={editor.close}
          onSave={(form) => saveDetailUser(form)}
          onDelete={() => setDeleteTarget(editor.entity)}
          saving={updateMutation.isPending}
        />
      ) : editor.open ? (
        <UserEditor open user={null} onClose={editor.close} onSave={handleSave} saving={updateMutation.isPending || createMutation.isPending} />
      ) : (
        <ListPageFrame
          toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={() => editor.create()}
              onRefresh={() => usersQuery.refetch()}
              refreshing={usersQuery.isFetching}
              createLabel="Pengguna"
              placeholder="Cari nama atau email pengguna"
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
                  module="user"
                  label="Pengguna"
                  selection={selection}
                  rows={rows}
                  onRefresh={() => usersQuery.refetch()}
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
          <AsyncState loading={usersQuery.isLoading} error={usersQuery.error ? String(usersQuery.error) : ""} empty={!usersQuery.isLoading && !rows.length} emptyText="Pengguna belum tersedia." />
          {!usersQuery.isLoading && !usersQuery.error && rows.length ? (
            <>
              <div className={viewMode === "grid" ? "sticky top-[var(--list-toolbar-h,0px)] z-30 bg-white [&_tbody]:hidden" : ""}>
              <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
                <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] border border-slate-200 bg-white">
                  <table className="table-fixed text-left text-sm border-collapse" style={{ width: Math.max(tableLayout.totalWidth, 760), minWidth: "100%" }}>
                    <InteractiveColGroup columns={tableLayout.orderedColumns} getColumnStyle={tableLayout.getColumnStyle} trailingWidth={0} />
                    <thead className="sticky top-[var(--list-toolbar-h,0px)] z-20 bg-slate-50">
                      <tr className="bg-slate-50">
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
                      {filteredRows.map((user) => (
                        <tr key={user.id} onClick={() => editor.edit(user)} className={cn("cursor-pointer border-b border-slate-100 hover:bg-slate-50 group", !activeToggle.isActive(user) && "bg-slate-50 text-slate-400 [&_td]:opacity-70")}>
                          {tableLayout.orderedColumns.map((column) => {
                            const value = resolveTableValue(user, column.key);
                            return (
                              <td key={column.key} className="px-4 py-3 text-slate-700">
                                {column.key === "role" ? (
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${roleBadgeClass(user.role)}`}>
                                    {roleLabel(user.role)}
                                  </span>
                                ) : column.key === "status" ? (
                                  <span onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-2">
                                    <InlineActiveSwitch
                                      checked={activeToggle.isActive(user)}
                                      pending={updateMutation.isPending && updateMutation.variables?.id === user.id}
                                      activeLabel="Aktif"
                                      inactiveLabel="Nonaktif"
                                      compact
                                      onChange={(next) => handleActivate(user, next)}
                                    />
                                  </span>
                                ) : column.key === "createdAt" ? (
                                  formatDate(value)
                                ) : column.key === "avatar" ? (
                                  value ? <img src={resolveMediaUrl(value)} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200" /> : <span className="text-slate-400 text-xs">—</span>
                                ) : (
                                  formatTableValue(value)
                                )}
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
                  card={userCard}
                  onRowClick={(user) => editor.edit(user)}
                  rowKey={(user) => user.id}
                  emptyText="Pengguna belum tersedia."
                />
              ) : null}
            </>
          ) : null}
        </ListPageFrame>
      )}
    </>
  );
}