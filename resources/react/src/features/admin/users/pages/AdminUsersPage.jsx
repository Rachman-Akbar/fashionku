import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/features/admin/users/services/usersService";
import { useListTotalCount } from "@/shared/hooks/useListTotalCount";
import { toastError, toastSuccess } from "@/shared/utils/userFeedback";
import { cn } from "@/shared/utils/utils";

const ROLES = ["buyer", "seller", "admin"];

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
  });

  const resetForm = useCallback(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "buyer",
      is_active: user?.status !== "Nonaktif",
    });
  }, [user]);

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
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="h-9 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
            disabled={saving}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role === "admin" ? "Administrator" : role === "seller" ? "Penjual" : "Pembeli"}
              </option>
            ))}
          </select>
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

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const deferredQuery = useDeferredValue(query.trim());
  const usersQuery = useUsers({ ...(deferredQuery ? { search: deferredQuery } : {}), per_page: 100 });
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const rows = usersQuery.data || [];
  const total = useListTotalCount(usersQuery.meta || {}, { label: "Pengguna" });
  const columnVisibility = useColumnVisibility(
    [
      { key: "name", label: "Nama", filterable: true },
      { key: "email", label: "Email", filterable: true },
      { key: "role", label: "Role", filterable: true },
      { key: "status", label: "Status", filterable: true },
      { key: "createdAt", label: "Daftar", filterable: false },
    ],
    "admin-users",
  );
  const selection = useTableSelection(rows);

  const visibleColumns = useMemo(
    () =>
      [{ key: "name", label: "Nama" }, { key: "email", label: "Email" }, { key: "role", label: "Role" }, { key: "status", label: "Status" }, { key: "createdAt", label: "Daftar" }].filter(
        (column) => columnVisibility.visibleSet.has(column.key),
      ),
    [columnVisibility.visibleSet],
  );

  const handleSave = (form) => {
    if (!form.name.trim() || !form.email.trim()) {
      toastError("Pengguna", "Nama dan email wajib diisi.");
      return;
    }
    const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active };
    if (editUser) {
      updateMutation.mutate({ id: editUser.id, values: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleActivate = (user, nextActive) => {
    updateMutation.mutate({ id: user.id, values: { ...user.raw, is_active: nextActive } });
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      usersQuery.refetch();
    } catch {
      // error handled by mutation
    }
  };

  return (
    <>
      {editUser ? (
        <UserEditor open user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} saving={updateMutation.isPending || createMutation.isPending} />
      ) : (
        <ListPageFrame
          toolbar={(
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={() => setEditUser(null)}
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
              columns={[
                { key: "name", label: "Nama" },
                { key: "email", label: "Email" },
                { key: "role", label: "Role" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Daftar" },
              ]}
              visibleColumns={columnVisibility.visibleKeys}
              onToggleColumn={columnVisibility.toggleColumn}
              onShowAllColumns={columnVisibility.showAll}
              onResetColumns={columnVisibility.reset}
              onApplyDefaultColumns={columnVisibility.applyAsDefault}
            />
          )}
        >
          <AsyncState loading={usersQuery.isLoading} error={usersQuery.error ? String(usersQuery.error) : ""} empty={!usersQuery.isLoading && !rows.length} emptyText="Pengguna belum tersedia." />
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
                  {rows.map((user, index) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                      <td className="px-4 py-3">{index + 1}</td>
                      {visibleColumns.map((column) => {
                        const value = user[column.key];
                        return (
                          <td key={column.key} className="px-4 py-3 text-slate-700">
                            {column.key === "role" ? (
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${user.role === "admin" ? "bg-amber-50 text-amber-700" : user.role === "seller" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
                                {user.role === "admin" ? "Administrator" : user.role === "seller" ? "Penjual" : "Pembeli"}
                              </span>
                            ) : column.key === "status" ? (
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${user.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
                                {user.status}
                              </span>
                            ) : column.key === "createdAt" ? (
                              formatDate(value)
                            ) : (
                              value || "-"
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditUser(user)}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            aria-label="Edit pengguna"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActivate(user, user.status === "Aktif")}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            aria-label={user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <span className="material-symbols-outlined text-[16px]">{user.status === "Aktif" ? "block" : "check_circle"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(user)}
                            className="h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            aria-label="Hapus pengguna"
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
        title="Hapus Pengguna"
        message={`Pengguna “${deleteTarget?.name || ""}” akan dihapus dari platform.`}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </>
  );
}
