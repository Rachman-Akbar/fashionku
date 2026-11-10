import { useCallback, useMemo, useState } from "react";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";

export function useEntityEditor(options = {}) {
  const tabs = usePanelTabs();
  const [localState, setLocalState] = useState({ open: false, entity: null });

  const create = useCallback(() => {
    if (tabs) {
      tabs.openCreateTab();
      return;
    }
    setLocalState({ open: true, entity: null });
  }, [tabs]);

  const edit = useCallback((entity) => {
    if (tabs) {
      tabs.openEditTab(entity, { label: options.getEditLabel?.(entity) });
      return;
    }
    setLocalState({ open: true, entity });
  }, [options, tabs]);

  const close = useCallback(() => {
    if (tabs) {
      tabs.closeActiveTab();
      return;
    }
    setLocalState({ open: false, entity: null });
  }, [tabs]);

  const completeSave = useCallback(() => {
    if (tabs?.activeTab && (tabs.activeTab.type === "create" || tabs.activeTab.type === "edit")) {
      tabs.markTabClean?.(tabs.activeTab.id);
      tabs.closeActiveTab();
      return;
    }
    if (!tabs && localState.entity) {
      setLocalState({ open: false, entity: null });
    }
  }, [localState.entity, tabs]);

  return useMemo(() => {
    if (!tabs) {
      return {
        ...localState,
        isEditing: Boolean(localState.entity),
        isListActive: !localState.open,
        create,
        edit,
        close,
        completeSave,
        markListDirty: () => {},
        listRevision: 0,
      };
    }

    const isEditorTab = tabs.activeTab?.type === "create" || tabs.activeTab?.type === "edit";
    const entity = tabs.activeTab?.type === "edit" ? tabs.activeTab.entity : null;

    return {
      open: isEditorTab,
      entity,
      isEditing: Boolean(entity),
      isListActive: tabs.activeTab?.type === "list",
      activeTab: tabs.activeTab,
      listRevision: tabs.listRevision || 0,
      markListDirty: tabs.markListDirty,
      create,
      edit,
      close,
      completeSave,
    };
  }, [close, completeSave, create, edit, localState, tabs]);
}
