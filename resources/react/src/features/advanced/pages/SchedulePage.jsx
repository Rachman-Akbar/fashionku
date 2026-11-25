import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ListPageFrame } from "@/shared/components/crud/ListPageFrame";
import { useEntityEditor } from "@/shared/hooks/useEntityEditor";
import { ConfirmDialog } from "@/shared/components/crud/ConfirmDialog";
import { CrudDialog } from "@/shared/components/crud/CrudDialog";
import { AsyncState } from "@/shared/components/feedback/AsyncState";
import { useFocusMode } from "@/shared/layout/FocusModeContext";
import { useColumnVisibility, useTableSelection } from "@/shared/hooks";
import { useColumnFilterState } from "@/shared/hooks";
import { buildColumnFilterConfig } from "@/shared/utils/columnFilters";
import { ColumnFilterHeader } from "@/shared/components/crud/ColumnFilterHeader";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { buildDatabaseColumns, formatTableValue, resolveTableValue } from "@/shared/utils/tableData";
import { TopScrollbar } from "@/shared/components/table/TopScrollbar";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";
import { Input } from "@/shared/components/ui/Input";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";
import { cn } from "@/shared/utils/utils";
import {
  getScheduleError,
  useCreateSchedule,
  useDeleteSchedule,
  useSchedules,
  useUpdateSchedule,
} from "@/features/admin/schedule/services/scheduleService";

// Tab tampilan cukup ikon; label tetap dipakai sebagai tooltip & aria-label.
const VIEW_OPTIONS = [
  { key: "kanban", icon: "view_kanban", label: "Kanban board" },
  { key: "list", icon: "view_list", label: "Tampilan list" },
  { key: "kalender", icon: "calendar_month", label: "Kalender" },
];

const STATUS_COLUMNS = [
  { key: "todo", label: "To Do", color: "slate" },
  { key: "in_progress", label: "Proses", color: "amber" },
  { key: "done", label: "Selesai", color: "emerald" },
];

const TYPE_OPTIONS = ["Umum", "Stok", "Transaksi", "Laporan", "Produksi", "Meeting"];
const PRIORITY_OPTIONS = [
  { value: "low", label: "Rendah" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Tinggi" },
];

function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function normalizeStatus(item) {
  if (item?.isCompleted || item?.status === "done" || item?.status === "completed") return "done";
  if (item?.status === "in_progress" || item?.status === "doing" || item?.status === "process") return "in_progress";
  return "todo";
}

function statusLabel(key) {
  return STATUS_COLUMNS.find((s) => s.key === key)?.label || "To Do";
}

function formatDate(value) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(value);
  }
}

function ScheduleEditor({ open, schedule, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => ({
    title: schedule?.title || "",
    description: schedule?.description || "",
    type: schedule?.type || "Umum",
    priority: schedule?.priority || "normal",
    date: schedule?.date ? String(schedule.date).slice(0, 10) : todayString(),
    start_time: schedule?.startTime || "",
    end_time: schedule?.endTime || "",
    is_all_day: Boolean(schedule?.isAllDay),
    is_active: schedule?.isActive !== false,
    status: normalizeStatus(schedule),
    is_completed: Boolean(schedule?.isCompleted || normalizeStatus(schedule) === "done"),
    assignee: schedule?.assignee || "",
    color: schedule?.color || "#10B981",
  }));

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <CrudDialog
      open={open}
      title={schedule?.id ? "Edit Jadwal" : "Tambah Jadwal"}
      subtitle="Kelola jadwal operasional, agenda, dan pengingat."
      onClose={onClose}
      size="max-w-xl"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="space-y-5 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Judul</span>
            <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Contoh: Cek stok gudang" disabled={saving} className="h-10 rounded-[10px]" />
          </label>
          <label className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Tanggal</span>
            <Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} disabled={saving} className="h-10 rounded-[10px]" />
          </label>
          <div className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Tipe</span>
            <SearchableSelect
              value={form.type}
              onChange={(next) => set("type", next)}
              options={TYPE_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
              clearable={false}
              disabled={saving}
              buttonClassName="h-10 rounded-[10px]"
            />
          </div>
          <label className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Mulai</span>
            <Input type="time" value={form.start_time || ""} onChange={(e) => set("start_time", e.target.value)} disabled={saving || form.is_all_day} className="h-10 rounded-[10px]" />
          </label>
          <label className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Selesai</span>
            <Input type="time" value={form.end_time || ""} onChange={(e) => set("end_time", e.target.value)} disabled={saving || form.is_all_day} className="h-10 rounded-[10px]" />
          </label>
          <div className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Status</span>
            <SearchableSelect
              value={form.status}
              onChange={(next) => {
                set("status", next);
                set("is_completed", next === "done");
              }}
              options={STATUS_COLUMNS.map((s) => ({ value: s.key, label: s.label }))}
              clearable={false}
              disabled={saving}
              buttonClassName="h-10 rounded-[10px]"
            />
          </div>
          <div className="space-y-1.5">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Prioritas</span>
            <SearchableSelect
              value={form.priority}
              onChange={(next) => set("priority", next)}
              options={PRIORITY_OPTIONS}
              clearable={false}
              disabled={saving}
              buttonClassName="h-10 rounded-[10px]"
            />
          </div>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Deskripsi</span>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Detail agenda atau catatan tambahan (opsional)"
              className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
              disabled={saving}
            />
          </label>
          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={form.is_all_day} onChange={(e) => set("is_all_day", e.target.checked)} className="h-4 w-4 accent-emerald-600" disabled={saving} />
              Seharian
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 accent-emerald-600" disabled={saving} />
              Aktif
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-[10px] border border-slate-200 px-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">Batal</button>
          <button type="submit" disabled={saving} className="h-10 rounded-[10px] bg-emerald-600 px-4 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-60">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </CrudDialog>
  );
}

function ScheduleCard({ item, onEdit, onDelete, onMove, compact = false }) {
  const status = normalizeStatus(item);
  return (
    <div className={cn("rounded-[10px] border border-slate-200 bg-white p-3.5 transition hover:border-emerald-200 hover:shadow-sm", compact ? "" : "min-h-[96px]")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900" title={item.title}>{item.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
            <span className="material-symbols-outlined text-[14px] leading-none text-slate-400">schedule</span>
            {formatDate(item.date)}{item.startTime ? ` · ${item.startTime}${item.endTime ? `-${item.endTime}` : ""}` : item.isAllDay ? " · Seharian" : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 ring-1 ring-inset ring-slate-200">{item.type || "Umum"}</span>
      </div>
      {item.description ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{item.description}</p> : null}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
        <div className="flex items-center gap-1">
          {STATUS_COLUMNS.filter((s) => s.key !== status).slice(0, 2).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onMove(item, s.key)}
              className="rounded-[6px] bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
              title={`Pindah ke ${s.label}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-[6px] text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700" aria-label="Edit">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button type="button" onClick={() => onDelete(item)} className="flex h-7 w-7 items-center justify-center rounded-[6px] text-slate-500 transition hover:bg-red-50 hover:text-red-700" aria-label="Hapus">
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanView({ rows, onEdit, onDelete, onMove }) {
  const grouped = useMemo(() => {
    const map = { todo: [], in_progress: [], done: [] };
    rows.forEach((item) => {
      const key = normalizeStatus(item);
      (map[key] || map.todo).push(item);
    });
    return map;
  }, [rows]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUS_COLUMNS.map((col) => (
        <div key={col.key} className="flex min-h-[420px] flex-col rounded-[12px] border border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", col.key === "done" ? "bg-emerald-500" : col.key === "in_progress" ? "bg-amber-500" : "bg-slate-400")} />
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{col.label}</h3>
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold tabular-nums text-slate-600 ring-1 ring-inset ring-slate-200">{grouped[col.key]?.length || 0}</span>
          </div>
          <div className="flex-1 space-y-2 overflow-auto p-2.5">
            {(grouped[col.key] || []).length ? grouped[col.key].map((item) => (
              <ScheduleCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
            )) : (
              <div className="rounded-[10px] border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs font-semibold text-slate-400">Belum ada jadwal.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ rows, onEdit }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const base = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-start
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  const byDate = useMemo(() => {
    const map = {};
    rows.forEach((item) => {
      const key = String(item.date || "").slice(0, 10);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => String(a.startTime || "").localeCompare(String(b.startTime || ""))));
    return map;
  }, [rows]);

  const monthLabel = base.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="rounded-[12px] border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMonthOffset((v) => v - 1)} className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Bulan sebelumnya">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button type="button" onClick={() => setMonthOffset(0)} className="h-9 rounded-[8px] border border-slate-200 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50">Hari ini</button>
          <button type="button" onClick={() => setMonthOffset((v) => v + 1)} className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label="Bulan berikutnya">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        <h3 className="text-sm font-extrabold capitalize text-slate-900">{monthLabel}</h3>
        <div className="w-[120px]" />
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100">
        {weekDays.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="min-h-[110px] border-b border-r border-slate-100 bg-slate-50/40" />;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const items = byDate[key] || [];
          const isToday = key === todayString();
          return (
            <div key={key} className="min-h-[110px] border-b border-r border-slate-100 p-1.5">
              <div className="mb-1 flex items-center justify-between">
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold", isToday ? "bg-emerald-600 text-white" : "text-slate-700")}>{day}</span>
                {items.length ? <span className="text-[10px] font-extrabold tabular-nums text-slate-400">{items.length}</span> : null}
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onEdit(item)}
                    className="block w-full truncate rounded-[6px] px-1.5 py-1 text-left text-[10px] font-extrabold text-white transition hover:opacity-90"
                    style={{ backgroundColor: item.color || "#10B981" }}
                    title={`${item.title}${item.startTime ? ` (${item.startTime})` : ""}`}
                  >
                    {item.startTime ? `${item.startTime} ` : ""}{item.title}
                  </button>
                ))}
                {items.length > 3 ? (
                  <div className="px-1 text-[10px] font-extrabold text-slate-500">+{items.length - 3} lainnya</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { isFocus, toggle: toggleFocus } = useFocusMode();
  const [viewMode, setViewMode] = useState("kanban");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  // Tab per entitas: tambah/edit jadwal mendapat tab sendiri di samping tab
  // daftar (hijau), jadi daftar tidak tertimpa lapisan editor.
  const editor = useEntityEditor({ getEditLabel: (row) => row.title || "Jadwal" });
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const schedulesQuery = useSchedules({ per_page: 200 });
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule();
  const deleteMutation = useDeleteSchedule();
  const allRows = schedulesQuery.data?.rows || [];
  const rows = useMemo(() => {
    if (!deferredQuery) return allRows;
    return allRows.filter((item) => {
      const hay = `${item.title} ${item.description || ""} ${item.type || ""} ${item.date || ""}`.toLowerCase();
      return hay.includes(deferredQuery);
    });
  }, [allRows, deferredQuery]);

  const columns = useMemo(() => ([
    { key: "title", label: "Judul" },
    { key: "date", label: "Tanggal" },
    { key: "time", label: "Waktu" },
    { key: "type", label: "Tipe" },
    { key: "status", label: "Status" },
    { key: "isActive", label: "Aktif" },
    // Sisa kolom database jadwal tampil otomatis (kecuali kolom ID).
    ...buildDatabaseColumns(allRows, {
      omit: ["id", "user_id", "title", "date", "type", "status", "is_active", "start_time", "end_time"],
      labels: {
        description: "Deskripsi",
        priority: "Prioritas",
        color: "Warna",
        is_all_day: "Seharian",
        is_completed: "Selesai",
        capacity: "Kapasitas",
        assignee: "Penanggung Jawab",
        label: "Label",
        position: "Posisi",
        recurrence: "Pengulangan",
        metadata: "Metadata",
        user_name: "Pengguna",
        created_by_name: "Dibuat Oleh",
        updated_by_name: "Diubah Oleh",
        created_at: "Dibuat",
        updated_at: "Diubah",
        deleted_at: "Dihapus",
      },
    }),
  ]), [allRows]);
  const columnVisibility = useColumnVisibility(columns, "admin-schedules");
  const visibleColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const ordered = columnVisibility.visibleKeys.map((key) => byKey.get(key)).filter(Boolean);
    return ordered.length ? ordered : columns.filter((c) => columnVisibility.visibleSet.has(c.key));
  }, [columnVisibility.visibleKeys, columnVisibility.visibleSet, columns]);

  // ── Filter per kolom ────────────────────────────────────────────────────
  const scheduleFilterValue = useCallback((row, key) => {
    const columnKey = String(key);
    if (columnKey.startsWith("raw:")) return row?.raw?.[columnKey.slice(4)];
    if (columnKey === "title") return row.title;
    if (columnKey === "date") return row.date ? formatDate(row.date) : "";
    if (columnKey === "time") return row.isAllDay ? "Seharian" : [row.startTime, row.endTime].filter(Boolean).join(" - ");
    if (columnKey === "type") return row.type;
    if (columnKey === "status") return statusLabel(normalizeStatus(row));
    if (columnKey === "isActive") return Boolean(row.isActive);
    return resolveTableValue(row, columnKey);
  }, []);
  const filterConfig = useMemo(
    () => buildColumnFilterConfig(columnVisibility.allColumns, allRows, scheduleFilterValue),
    [columnVisibility.allColumns, allRows, scheduleFilterValue],
  );
  const filterTypes = useMemo(() => ({
    ...filterConfig.types,
    title: "text",
    date: "text",
    time: "text",
    type: "select",
    status: "select",
    isActive: "select",
  }), [filterConfig.types]);
  const filterOptions = useMemo(() => ({
    ...filterConfig.options,
    type: TYPE_OPTIONS.map((value) => ({ value, label: value })),
    status: STATUS_COLUMNS.map((item) => ({ value: item.label, label: item.label })),
    isActive: [{ value: "true", label: "Aktif" }, { value: "false", label: "Nonaktif" }],
  }), [filterConfig.options]);
  const filterState = useColumnFilterState({ rows, getValue: scheduleFilterValue, filterTypes });
  const filteredRows = filterState.rows;
  const selection = useTableSelection(filteredRows);
  const hScroll = useHorizontalScroll();

  const saving = createMutation.isPending || updateMutation.isPending;

  const openCreate = () => editor.create();
  const openEdit = (schedule) => editor.edit(schedule);
  const closeEditor = () => editor.close();

  const handleSave = async (form) => {
    const payload = {
      title: String(form.title || "").trim(),
      description: form.description || null,
      type: form.type || "Umum",
      priority: form.priority || "normal",
      date: form.date,
      start_time: form.is_all_day ? null : (form.start_time || null),
      end_time: form.is_all_day ? null : (form.end_time || null),
      is_all_day: Boolean(form.is_all_day),
      is_active: Boolean(form.is_active),
      status: form.status || "todo",
      is_completed: form.status === "done" || Boolean(form.is_completed),
      assignee: form.assignee || null,
      color: form.color || "#10B981",
    };
    try {
      if (editor.entity?.id) {
        await updateMutation.mutateAsync({ id: editor.entity.id, values: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      closeEditor();
      schedulesQuery.refetch();
    } catch {
      // handled by mutation hooks
    }
  };

  const handleMoveStatus = async (item, status) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        values: { status, is_completed: status === "done" },
      });
      schedulesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      schedulesQuery.refetch();
    } catch {
      // handled by mutation hook
    }
  };

  const totalCount = schedulesQuery.data?.meta?.total ?? rows.length;

  return (
    <SellerPanelShell>
      {editor.isListActive ? <ListPageFrame
        toolbar={(
          <div className="space-y-[2px]">
            <EntityToolbar
              query={query}
              onQueryChange={setQuery}
              onCreate={openCreate}
              onRefresh={() => schedulesQuery.refetch()}
              refreshing={schedulesQuery.isFetching}
              createLabel="Tambah Jadwal"
              placeholder="Cari judul, tipe, atau tanggal jadwal"
              totalCount={totalCount}
              totalLabel=""
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
              viewModeOptions={VIEW_OPTIONS}
              extraActions={(
                <ActionIconButton
                  icon={isFocus ? "close_fullscreen" : "center_focus_strong"}
                  title={isFocus ? "Keluar mode fokus" : "Mode fokus"}
                  onClick={toggleFocus}
                  variant={isFocus ? "primary" : "default"}
                />
              )}
            />
          </div>
        )}
      >
        <AsyncState
          loading={schedulesQuery.isLoading}
          error={schedulesQuery.error ? getScheduleError(schedulesQuery.error, "Gagal memuat jadwal.") : ""}
          empty={!schedulesQuery.isLoading && !schedulesQuery.error && !rows.length}
          emptyText="Jadwal belum tersedia."
        />
        {!schedulesQuery.isLoading && !schedulesQuery.error ? (
          <>
            {viewMode === "kanban" ? (
              <KanbanView rows={filteredRows} onEdit={openEdit} onDelete={setDeleteTarget} onMove={handleMoveStatus} />
            ) : null}
            {viewMode === "list" ? (
              <div>
                <TopScrollbar {...hScroll} visible={hScroll.hasOverflow} width={hScroll.metrics.scrollWidth} />
                <div ref={hScroll.scrollRef} onScroll={hScroll.handleTableScroll} className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [overflow-y:clip] bg-white ring-1 ring-slate-200">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="sticky top-[var(--list-toolbar-h,0px)] z-20 bg-slate-100">
                    <tr className="bg-slate-100">
                      {visibleColumns.map((column) => (
                        <ColumnFilterHeader
                          key={column.key}
                          column={column}
                          filterType={filterTypes[column.key] || "text"}
                          filterValue={filterState.columnFilters[column.key]}
                          options={filterOptions[column.key] || []}
                          onFilterChange={(value) => filterState.changeFilter(column.key, value)}
                          onClearAllFilters={filterState.resetFilters}
                          onResetSort={filterState.resetSort}
                          className="bg-slate-100 px-4 py-3 text-xs font-extrabold text-slate-600 shadow-[inset_0_-1px_0_0_#e2e8f0]"
                        />
                      ))}
                      <th className="w-24 bg-slate-100 px-4 py-3 text-xs font-extrabold text-slate-600 shadow-[inset_0_-1px_0_0_#e2e8f0]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((item) => {
                      const st = normalizeStatus(item);
                      return (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                          {visibleColumns.map((column) => {
                            if (column.key === "title") return <td key={column.key} className="px-4 py-3 font-extrabold text-slate-900">{item.title || "-"}</td>;
                            if (column.key === "date") return <td key={column.key} className="px-4 py-3 text-slate-600">{formatDate(item.date)}</td>;
                            if (column.key === "time") return <td key={column.key} className="px-4 py-3 text-slate-600">{item.isAllDay ? "Seharian" : [item.startTime, item.endTime].filter(Boolean).join(" - ") || "-"}</td>;
                            if (column.key === "type") return <td key={column.key} className="px-4 py-3 text-slate-600">{item.type || "-"}</td>;
                            if (column.key === "status") return (
                              <td key={column.key} className="px-4 py-3">
                                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ring-inset", st === "done" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : st === "in_progress" ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-slate-100 text-slate-700 ring-slate-200")}>
                                  {statusLabel(st)}
                                </span>
                              </td>
                            );
                            if (column.key === "isActive") return (
                              <td key={column.key} className="px-4 py-3">
                                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ring-inset", item.isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200")}>
                                  {item.isActive ? "Aktif" : "Nonaktif"}
                                </span>
                              </td>
                            );
                            return <td key={column.key} className="px-4 py-3 text-slate-600">{formatTableValue(resolveTableValue(item, column.key))}</td>;
                          })}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => openEdit(item)} className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700" aria-label="Edit jadwal">
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button type="button" onClick={() => setDeleteTarget(item)} className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700" aria-label="Hapus jadwal">
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            ) : null}
            {viewMode === "kalender" ? (
              <CalendarView rows={filteredRows} onEdit={openEdit} onDelete={setDeleteTarget} />
            ) : null}
          </>
        ) : null}
        {!schedulesQuery.isLoading && !schedulesQuery.error && !rows.length ? (
          <>
            {viewMode === "kanban" ? <KanbanView rows={[]} onEdit={openEdit} onDelete={setDeleteTarget} onMove={handleMoveStatus} /> : null}
            {viewMode === "kalender" ? <CalendarView rows={[]} onEdit={openEdit} onDelete={setDeleteTarget} /> : null}
          </>
        ) : null}
      </ListPageFrame> : null}

      <ScheduleEditor
        open={editor.open}
        key={editor.activeTab?.id || "new"}
        schedule={editor.entity}
        onClose={closeEditor}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Jadwal"
        message={`Jadwal "${deleteTarget?.title || ""}" akan dihapus.`}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </SellerPanelShell>
  );
}

