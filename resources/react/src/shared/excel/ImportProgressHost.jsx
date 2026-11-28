import { ExcelImportPage } from "@/shared/excel/ExcelImportPage";
import { ImportProgressTab } from "@/shared/excel/ImportProgressTab";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";

export function ImportProgressHost() {
  const tabs = usePanelTabs();
  const importTabs = (tabs?.allTabs || []).filter((tab) => tab.type === "excel-import");

  if (!importTabs.length) return null;

  return importTabs.map((tab) => {
    const payload = tab.payload || {};
    const isActive = tabs.activeParent?.id === tab.parentId && tabs.activeTab?.id === tab.id;
    const close = () => tabs.closeTab(tab.id);
    const start = ({ file, importMode }) => {
      const runId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      tabs.updateTab(tab.id, {
        closable: false,
        label: `Proses Import ${payload.label}`,
        payload: { ...payload, stage: "progress", file, importMode, runId },
      });
    };
    const finish = () => {
      tabs.markListDirty(tab.parentId);
      tabs.updateTab(tab.id, { closable: true, label: `Import ${payload.label}` });
    };
    const markClosable = () => tabs.updateTab(tab.id, { closable: true, label: `Import ${payload.label}` });

    return (
      <div key={tab.id} className={isActive ? "h-full min-h-[60vh] w-full" : "hidden"} aria-hidden={!isActive}>
        {payload.stage === "progress" ? (
          <ImportProgressTab
            key={payload.runId || tab.id}
            runId={payload.runId}
            module={payload.module}
            label={payload.label}
            file={payload.file}
            importMode={payload.importMode}
            createMissingRelations={payload.createMissingRelations}
            onComplete={finish}
            onError={markClosable}
            onCancel={markClosable}
            onClose={close}
          />
        ) : (
          <ExcelImportPage
            module={payload.module}
            label={payload.label}
            onStart={start}
            onClose={close}
          />
        )}
      </div>
    );
  });
}
