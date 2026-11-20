import { memo, useEffect, useState } from "react";
import { ActionIconButton } from "@/shared/components/crud/ActionIconButton";
import { BulkActionsMenu } from "@/shared/components/crud/BulkActionsMenu";
import { ColumnVisibilityMenu } from "@/shared/components/crud/ColumnVisibilityMenu";
import { ViewModeToggle } from "@/shared/components/ui/ViewModeToggle";
import { cn } from "@/shared/utils/utils";

function getTotalCountSizeClass(value) {
  const digits = String(Math.max(0, Math.trunc(Number(value) || 0))).length;
  if (digits <= 3) return "text-base";
  if (digits === 4) return "text-sm";
  if (digits === 5) return "text-[13px]";
  if (digits === 6) return "text-xs";
  if (digits === 7) return "text-[11px]";
  return "text-[10px]";
}

export const EntityToolbar = memo(function EntityToolbar({
  query,
  onQueryChange,
  onCreate,
  onRefresh,
  refreshing = false,
  createLabel = "Tambah Data",
  placeholder = "Cari data lalu tekan Enter",
  totalCount,
  totalTitle = "",
  filters,
  hideCreate = false,
  selectionEnabled = false,
  selectedCount = 0,
  onToggleSelection,
  bulkActions = [],
  columns = [],
  visibleColumns = [],
  onToggleColumn,
  onShowAllColumns,
  onResetColumns,
  onApplyDefaultColumns,
  onMoveColumn,
  extraActions,
  viewMode,
  onChangeViewMode,
  viewModeOptions,
  viewModeLabel = "Mode tampilan data",
}) {
  const [draft, setDraft] = useState(query || "");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    setDraft(query || "");
  }, [query]);

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh?.();
    window.setTimeout(() => setSpinning(false), 900);
  };

  const isRefreshing = refreshing || spinning;

  const submitSearch = (event) => {
    event.preventDefault();
    onQueryChange?.(draft.trim());
  };

  const clearSearch = () => {
    setDraft("");
    onQueryChange?.("");
  };

  return (
    <div className="mb-0.5 flex min-w-0 flex-col gap-[2px] bg-white px-2 py-2">    <div className="flex min-w-0 flex-col gap-[5px] xl:flex-row xl:items-center">
      <form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-[5px]">
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-[10px] bg-slate-50 px-3 ring-1 ring-inset ring-slate-200 focus-within:bg-white focus-within:ring-emerald-500">
          <span className="material-symbols-outlined shrink-0 text-[19px] text-slate-400">search</span>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
          {draft ? (
            <button type="button" onClick={clearSearch} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-700" aria-label="Hapus pencarian">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>
      </form>

      {Number(totalCount) >= 0 ? (
        <span
          className="flex h-9 min-w-12 shrink-0 items-center justify-center self-end border-l-[3px] border-emerald-500 bg-emerald-50 px-2.5 leading-none text-emerald-800 ring-1 ring-inset ring-emerald-100 xl:self-auto"
          title={totalTitle || "Total data"}
          aria-label={totalTitle || "Total data"}
        >
          <span className={cn("font-extrabold tabular-nums tracking-tight", getTotalCountSizeClass(totalCount))}>
            {Number(totalCount).toLocaleString("id-ID")}
          </span>
        </span>
      ) : null}

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-[5px] xl:ml-auto">
        {filters}
        {extraActions}
        <ColumnVisibilityMenu
          columns={columns}
          visibleKeys={visibleColumns}
          onToggle={onToggleColumn}
          onShowAll={onShowAllColumns}
          onReset={onResetColumns}
          onApplyDefault={onApplyDefaultColumns}
          onMoveColumn={onMoveColumn}
          selectionEnabled={selectionEnabled}
          selectedCount={selectedCount}
          onToggleSelection={onToggleSelection}
        />
        <BulkActionsMenu selectedCount={selectedCount} actions={bulkActions} />
        <ActionIconButton
          icon="refresh"
          title={isRefreshing ? "Memuat..." : "Segarkan data"}
          iconClassName={isRefreshing ? "animate-spin" : undefined}
          onClick={handleRefresh}
          disabled={isRefreshing || !onRefresh}
        />
        {!hideCreate ? (
          <ActionIconButton icon="add" title={`Tambah${createLabel && createLabel !== "Tambah Data" ? ` ${createLabel.replace(/^Tambah\s*/i, "")}` : " data"}`} onClick={onCreate} variant="primary" className="h-9 w-12 rounded-[10px]" />
        ) : null}
      </div>
      </div>
      {onChangeViewMode ? (
        <div className="flex items-center justify-end">
          <ViewModeToggle
            value={viewMode}
            onChange={onChangeViewMode}
            options={viewModeOptions}
            className="h-8"
            label={viewModeLabel}
          />
        </div>
      ) : null}
    </div>
  );
});
