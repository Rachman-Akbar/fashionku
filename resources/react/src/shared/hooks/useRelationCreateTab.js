import { useCallback } from "react";
import { useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";
import { usePanelTabs } from "@/shared/layout/tabs";

export function useRelationCreateTab() {
  const tabs = usePanelTabs();
  const notifications = useNotificationCenter();

  return useCallback(async ({ href, relationLabel, searchName }) => {
    const item = tabs?.items?.find((candidate) => candidate.href === href);

    if (!item) {
      notifications.push({
        type: "error",
        title: `${relationLabel} belum dapat dibuat`,
        message: `Menu ${relationLabel} tidak tersedia pada portal ini.`,
      });
      return { close: true };
    }

    tabs.openParent(item, { openCreate: true, resetToCreate: true });
    notifications.push({
      type: "info",
      title: `Tab Data Baru ${relationLabel} dibuka`,
      message: `Lengkapi data “${searchName}”, simpan, lalu kembali ke form sebelumnya untuk memilihnya.`,
    });

    return { close: true };
  }, [notifications, tabs]);
}
