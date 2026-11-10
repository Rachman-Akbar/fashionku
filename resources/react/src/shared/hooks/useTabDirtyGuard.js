import { useEffect } from "react";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";

export function useTabDirtyGuard(isDirty) {
  const tabs = usePanelTabs();
  const setTabDirty = tabs?.setTabDirty;
  const tabId = tabs?.activeTab?.id || "";

  useEffect(() => {
    if (!tabId || !setTabDirty) return undefined;
    setTabDirty(tabId, isDirty);
    return () => setTabDirty(tabId, false);
  }, [isDirty, setTabDirty, tabId]);
}
