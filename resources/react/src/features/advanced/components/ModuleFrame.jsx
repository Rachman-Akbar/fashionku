import { EntityToolbar } from "@/shared/components/crud/EntityToolbar";
import { useStickyToolbarHeight } from "@/shared/hooks/useStickyToolbarHeight";
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
  viewMode,
  onChangeViewMode,
  viewModeOptions,
}) {
  const { registration } = useToolbarTableColumns();
  const { connect, style, toolbarStyle, contentStyle } = useStickyToolbarHeight();
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
    <section className="relative w-full min-w-0 max-w-full" style={style}>
      <div ref={connect} className="bg-white" style={toolbarStyle}>
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
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        viewModeOptions={viewModeOptions}
        />
      </div>
      <div className="space-y-0.5" style={contentStyle}>{children}</div>
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