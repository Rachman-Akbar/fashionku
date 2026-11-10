import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { ToolbarTableColumnsProvider, useToolbarTableColumns } from "./ToolbarTableColumnsContext";

function resolveColumnsProps(props, registration) {
  const hasExplicitColumns = Boolean(props.columns?.length);
  return {
    columns: hasExplicitColumns ? props.columns : registration?.columns || [],
    visibleColumns: hasExplicitColumns ? props.visibleColumns : registration?.visibleKeys || [],
    onToggleColumn: hasExplicitColumns ? props.onToggleColumn : registration?.onToggle,
    onShowAllColumns: hasExplicitColumns ? props.onShowAllColumns : registration?.onShowAll,
    onResetColumns: hasExplicitColumns ? props.onResetColumns : registration?.onReset,
    onApplyDefaultColumns: hasExplicitColumns ? props.onApplyDefaultColumns : registration?.onApplyDefault,
  };
}

function ModuleFrameInner({
  query,
  onQueryChange,
  onRefresh,
  onCreate,
  createLabel = "Tambah Data",
  children,
  filters,
  hideCreate = false,
  refreshing = false,
  placeholder = "Cari data",
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
  extraActions,
  totalCount,
  totalLabel = "Data",
  totalTitle = "",
}) {
  const { registration } = useToolbarTableColumns();
  const incomingProps = {
    columns,
    visibleColumns,
    onToggleColumn,
    onShowAllColumns,
    onResetColumns,
    onApplyDefaultColumns,
  };
  const resolved = resolveColumnsProps(incomingProps, registration);

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden">
      <EntityToolbar
        query={query}
        onQueryChange={onQueryChange}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onCreate={onCreate}
        createLabel={createLabel}
        placeholder={placeholder}
        filters={filters}
        hideCreate={hideCreate || !onCreate}
        selectionEnabled={selectionEnabled}
        selectedCount={selectedCount}
        onToggleSelection={onToggleSelection}
        bulkActions={bulkActions}
        columns={resolved.columns}
        visibleColumns={resolved.visibleColumns}
        onToggleColumn={resolved.onToggleColumn}
        onShowAllColumns={resolved.onShowAllColumns}
        onResetColumns={resolved.onResetColumns}
        onApplyDefaultColumns={resolved.onApplyDefaultColumns}
        extraActions={extraActions}
        totalCount={totalCount}
        totalLabel={totalLabel}
        totalTitle={totalTitle}
      />
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

export function ModuleFrame(props) {
  return (
    <ToolbarTableColumnsProvider>
      <ModuleFrameInner {...props} />
    </ToolbarTableColumnsProvider>
  );
}