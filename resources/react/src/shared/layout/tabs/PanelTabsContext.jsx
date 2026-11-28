import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toTitleCase } from "@/shared/utils/textFormatter";
import { startNavigationProgress } from "@/shared/layout/navigationProgress";
import { confirmDiscardChanges } from "@/shared/utils/userFeedback";

const PanelTabsContext = createContext(null);

function matchMenu(items, pathname) {
  const matches = items.filter((item) => item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
  return matches.sort((left, right) => {
    const leftExact = left.href === pathname ? 1 : 0;
    const rightExact = right.href === pathname ? 1 : 0;
    if (rightExact !== leftExact) return rightExact - leftExact;
    return right.href.length - left.href.length;
  })[0] || items[0] || null;
}

function createParentTab(item) {
  return {
    id: item.href,
    href: item.href,
    label: item.label,
    icon: item.icon,
    exact: Boolean(item.exact),
    noChildTabs: Boolean(item.noChildTabs),
    pinned: Boolean(item.pinned || item.exact),
    closable: item.closable !== false && !item.exact && !item.pinned,
  };
}

function createListTab(parent) {
  return {
    id: `${parent.id}:list`,
    parentId: parent.id,
    type: "list",
    label: "Daftar",
    closable: false,
    entity: null,
  };
}

function createDefaultChildren(parent, openCreate = false) {
  if (parent.exact || parent.noChildTabs) return [];
  const list = createListTab(parent);
  if (!openCreate) return [list];
  return [
    list,
    {
      id: `${parent.id}:create:default`,
      parentId: parent.id,
      type: "create",
      label: "Data Baru",
      closable: true,
      entity: null,
    },
  ];
}

export function PanelTabsProvider({ children, items = [] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMenu = matchMenu(items, location.pathname);
  const dashboardItem = items[0] || initialMenu;
  const dashboardParent = dashboardItem ? createParentTab(dashboardItem, 0) : null;
  const initialParent = initialMenu ? createParentTab(initialMenu, items.indexOf(initialMenu)) : dashboardParent;
  const [parentTabs, setParentTabs] = useState(() => {
    if (!dashboardParent) return [];
    return initialParent?.id !== dashboardParent.id ? [dashboardParent, initialParent] : [dashboardParent];
  });
  const [activeParentId, setActiveParentId] = useState(initialParent?.id || dashboardParent?.id || "");
  const [childrenByParent, setChildrenByParent] = useState(() => {
    const state = {};
    if (dashboardParent) state[dashboardParent.id] = createDefaultChildren(dashboardParent, false);
    if (initialParent && !state[initialParent.id]) state[initialParent.id] = createDefaultChildren(initialParent, false);
    return state;
  });
  const [listRevisionByParent, setListRevisionByParent] = useState({});
  const [dirtyTabIds, setDirtyTabIds] = useState({});
  const dirtyTabIdsRef = useRef(dirtyTabIds);
  const draftRef = useRef({});

  useEffect(() => {
    dirtyTabIdsRef.current = dirtyTabIds;
  }, [dirtyTabIds]);
  const [activeChildByParent, setActiveChildByParent] = useState(() => {
    const state = {};
    if (dashboardParent) state[dashboardParent.id] = "";
    if (initialParent) state[initialParent.id] = (initialParent.exact || initialParent.noChildTabs) ? "" : `${initialParent.id}:list`;
    return state;
  });

  const ensureParent = useCallback((item, options = {}) => {
    if (!item) return null;
    const parent = createParentTab(item, items.indexOf(item));
    const openCreate = options.openCreate === true;

    setParentTabs((current) => current.some((tab) => tab.id === parent.id) ? current : [...current, parent]);
    setChildrenByParent((current) => current[parent.id]
      ? current
      : { ...current, [parent.id]: createDefaultChildren(parent, openCreate) });
    setActiveChildByParent((current) => current[parent.id]
      ? current
      : { ...current, [parent.id]: (item.exact || item.noChildTabs) ? "" : (openCreate ? `${parent.id}:create:default` : `${parent.id}:list`) });
    setActiveParentId(parent.id);
    return parent;
  }, [items]);

  useEffect(() => {
    const item = matchMenu(items, location.pathname);
    if (!item) return;
    ensureParent(item, { openCreate: false });
  }, [ensureParent, items, location.pathname]);

  const activeParent = parentTabs.find((tab) => tab.id === activeParentId) || parentTabs[0] || null;
  const tabs = activeParent ? (childrenByParent[activeParent.id] || createDefaultChildren(activeParent, false)) : [];
  const activeTabId = activeParent ? (activeChildByParent[activeParent.id] || (activeParent.exact ? "" : `${activeParent.id}:list`)) : "";
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0] || null;

  // Perpindahan tab anak (daftar/create/detail) tidak mengubah URL, jadi
  // indikator loading halaman perlu dipicu manual agar selalu terlihat.
  useEffect(() => {
    startNavigationProgress();
  }, [activeParentId, activeTabId]);

  const openParent = useCallback((item, options = {}) => {
    const parent = ensureParent(item, { openCreate: options.openCreate === true });
    if (!parent) return;
    if (options.resetToCreate && !item.exact && !item.noChildTabs) {
      const createId = `${parent.id}:create:default`;
      setChildrenByParent((current) => {
        const childTabs = current[parent.id] || createDefaultChildren(parent, true);
        return childTabs.some((tab) => tab.id === createId)
          ? current
          : { ...current, [parent.id]: [...childTabs, { id: createId, parentId: parent.id, type: "create", label: "Data Baru", closable: true, entity: null }] };
      });
      setActiveChildByParent((current) => ({ ...current, [parent.id]: createId }));
    } else if (!item.exact && !item.noChildTabs) {
      // Menu dari sidebar selalu membuka tab Daftar, bukan tab detail terakhir.
      setActiveChildByParent((current) => ({ ...current, [parent.id]: `${parent.id}:list` }));
    }
    navigate(item.href);
  }, [ensureParent, navigate]);

  const setTabDirty = useCallback((tabId, dirty) => {
    if (!tabId) return;
    setDirtyTabIds((current) => {
      if (Boolean(current[tabId]) === Boolean(dirty)) return current;
      const next = { ...current };
      if (dirty) next[tabId] = true;
      else delete next[tabId];
      return next;
    });
  }, []);

  const clearDirtyTabs = useCallback((tabIds = []) => {
    setDirtyTabIds((current) => {
      const next = { ...current };
      let changed = false;
      tabIds.forEach((tabId) => {
        if (next[tabId]) {
          delete next[tabId];
          changed = true;
        }
      });
      return changed ? next : current;
    });
  }, []);

  /**
   * Menyimpan isi form yang belum disimpan sebagai draft milik tab, supaya
   * pengguna bisa pindah tab lain (atau membuka halaman lain) tanpa kehilangan
   * pekerjaan dan tanpa dialog konfirmasi.
   */
  const setTabDraft = useCallback((tabId, draft) => {
    if (!tabId) return;
    if (draft) {
      draftRef.current = { ...draftRef.current, [tabId]: draft };
    } else {
      const next = { ...draftRef.current };
      delete next[tabId];
      draftRef.current = next;
    }
    setChildrenByParent((current) => {
      let changed = false;
      const next = {};
      Object.entries(current).forEach(([parentId, childTabs]) => {
        if (!childTabs.some((tab) => tab.id === tabId)) {
          next[parentId] = childTabs;
          return;
        }
        next[parentId] = childTabs.map((tab) => {
          if (tab.id !== tabId) return tab;
          changed = true;
          return { ...tab, draft: draft || null };
        });
      });
      return changed ? next : current;
    });
  }, []);

  const markTabClean = useCallback((tabId) => {
    if (!tabId) return;
    if (!dirtyTabIdsRef.current[tabId]) return;
    dirtyTabIdsRef.current = { ...dirtyTabIdsRef.current, [tabId]: false };
    clearDirtyTabs([tabId]);
    setTabDraft(tabId, null);
  }, [clearDirtyTabs, setTabDraft]);

  const confirmDirtyTabs = useCallback(async (tabsToCheck) => {
    // Tab yang punya draft tersimpan juga dianggap belum disimpan, supaya
    // menutup tab dengan sengaja tetap meminta konfirmasi.
    const dirtyTargets = tabsToCheck.filter((tab) => dirtyTabIdsRef.current[tab.id] || draftRef.current[tab.id]);
    if (!dirtyTargets.length) return true;
    const confirmed = await confirmDiscardChanges(dirtyTargets.length === 1 ? dirtyTargets[0].label : `${dirtyTargets.length} tab`);
    if (!confirmed) return false;
    clearDirtyTabs(dirtyTargets.map((tab) => tab.id));
    return true;
  }, [clearDirtyTabs]);

  /**
   * Klik tab menu (tab induk): pindah menu sekaligus fokus ke tab Daftar.
   *
   * Tanpa ini, klik tab menu induk bisa terasa "tidak berpindah" karena tab
   * anak yang terakhir aktif (mis. detail/data baru) yang ditampilkan lagi.
   */
  const activateParent = useCallback(async (parentId) => {
    const item = items.find((it) => it.href === parentId);
    if (!item) return;
    const parent = ensureParent(item);
    if (!parent) return;

    const hasChildTabs = !parent.exact && !parent.noChildTabs;
    const listTabId = `${parentId}:list`;

    // Berpindah tab TIDAK menutup tab lain: form yang belum disimpan tetap
    // hidup sebagai draft di tabnya masing-masing. Konfirmasi hanya muncul saat
    // user benar-benar menutup tab (closeTab/closeParent).
    setActiveParentId(parentId);
    if (hasChildTabs) {
      setActiveChildByParent((current) => ({ ...current, [parentId]: listTabId }));
    }
    navigate(parent.href);
  }, [ensureParent, items, navigate]);

  const closeParent = useCallback(async (parentId) => {
    const index = parentTabs.findIndex((tab) => tab.id === parentId);
    const target = parentTabs[index];
    if (!target?.closable || target?.pinned) return;
    if (!(await confirmDirtyTabs(childrenByParent[parentId] || []))) return;
    const nextTabs = parentTabs.filter((tab) => tab.id !== parentId);
    setParentTabs(nextTabs);
    setChildrenByParent((current) => {
      const next = { ...current };
      delete next[parentId];
      return next;
    });
    setActiveChildByParent((current) => {
      const next = { ...current };
      delete next[parentId];
      return next;
    });
    if (activeParentId === parentId) {
      const fallback = nextTabs[Math.max(0, index - 1)] || nextTabs[0];
      if (fallback) {
        setActiveParentId(fallback.id);
        navigate(fallback.href);
      }
    }
  }, [activeParentId, childrenByParent, confirmDirtyTabs, navigate, parentTabs]);

  const activateTab = useCallback((tabId) => {
    if (!activeParent) return;
    setActiveChildByParent((current) => ({ ...current, [activeParent.id]: tabId }));
  }, [activeParent]);

  const markListDirty = useCallback((parentId = activeParent?.id) => {
    if (!parentId) return;
    setListRevisionByParent((current) => ({
      ...current,
      [parentId]: Number(current[parentId] || 0) + 1,
    }));
  }, [activeParent?.id]);

  const openCreateTab = useCallback((options = {}) => {
    if (!activeParent) return null;
    const id = options.reuseDefault === false ? `${activeParent.id}:create:${Date.now()}` : `${activeParent.id}:create:default`;
    const tab = {
      id,
      parentId: activeParent.id,
      type: "create",
      label: options.label || "Data Baru",
      closable: true,
      entity: null,
    };
    setChildrenByParent((current) => {
      const childTabs = current[activeParent.id] || [createListTab(activeParent)];
      return {
        ...current,
        [activeParent.id]: childTabs.some((item) => item.id === id)
          ? childTabs.map((item) => item.id === id ? { ...item, ...tab, draft: item.draft ?? null } : item)
          : [...childTabs, tab],
      };
    });
    setActiveChildByParent((current) => ({ ...current, [activeParent.id]: id }));
    return id;
  }, [activeParent]);

  const openOperationTab = useCallback((type, options = {}) => {
    if (!activeParent) return null;
    const id = `${activeParent.id}:${type}:${options.id || "default"}`;
    const tab = {
      id,
      parentId: activeParent.id,
      type,
      label: options.label || toTitleCase(type),
      closable: true,
      entity: options.entity || null,
      payload: options.payload || null,
    };
    setChildrenByParent((current) => {
      const childTabs = current[activeParent.id] || [createListTab(activeParent)];
      return {
        ...current,
        [activeParent.id]: childTabs.some((item) => item.id === id)
          ? childTabs.map((item) => item.id === id ? { ...item, ...tab, draft: item.draft ?? null } : item)
          : [...childTabs, tab],
      };
    });
    setActiveChildByParent((current) => ({ ...current, [activeParent.id]: id }));
    return id;
  }, [activeParent]);

  const openEditTab = useCallback((entity, options = {}) => {
    if (!activeParent) return null;
    const entityId = entity?.id ?? entity?.slug ?? Date.now();
    const id = `${activeParent.id}:edit:${entityId}`;
    const label = options.label || toTitleCase(entity?.name || entity?.title || entity?.code || "Edit Data");
    const tab = { id, parentId: activeParent.id, type: "edit", label, closable: true, entity };
    setChildrenByParent((current) => {
      const childTabs = current[activeParent.id] || [createListTab(activeParent)];
      return {
        ...current,
        [activeParent.id]: childTabs.some((item) => item.id === id)
          ? childTabs.map((item) => item.id === id ? { ...tab, draft: item.draft ?? null } : item)
          : [...childTabs, tab],
      };
    });
    setActiveChildByParent((current) => ({ ...current, [activeParent.id]: id }));
    return id;
  }, [activeParent]);

  const closeTab = useCallback(async (tabId) => {
    if (!activeParent) return;
    const childTabs = childrenByParent[activeParent.id] || [];
    const target = childTabs.find((tab) => tab.id === tabId);
    if (!target?.closable) return;
    if (!(await confirmDirtyTabs(childTabs.filter((tab) => tab.id === tabId)))) return;
    const index = childTabs.findIndex((tab) => tab.id === tabId);
    const remaining = childTabs.filter((tab) => tab.id !== tabId);
    const nextTabs = remaining.length ? remaining : [createListTab(activeParent)];
    const fallback = nextTabs[Math.max(0, index - 1)] || nextTabs[0];

    // Jangan panggil setState di dalam updater setState lain: React bisa
    // menjalankan updater dua kali (StrictMode) dan hasilnya jadi tidak stabil
    // (tab aktif menunjuk ke tab yang sudah ditutup → halaman tampak nyangkut).
    setChildrenByParent((current) => ({ ...current, [activeParent.id]: nextTabs }));
    if (activeChildByParent[activeParent.id] === tabId) {
      setActiveChildByParent((active) => ({ ...active, [activeParent.id]: fallback?.id || `${activeParent.id}:list` }));
    }
  }, [activeChildByParent, activeParent, childrenByParent, confirmDirtyTabs]);

  const updateTab = useCallback((tabId, updates = {}) => {
    if (!tabId) return;
    setChildrenByParent((current) => {
      let found = false;
      const next = {};
      Object.entries(current).forEach(([parentId, childTabs]) => {
        next[parentId] = childTabs.map((tab) => {
          if (tab.id !== tabId) return tab;
          found = true;
          return { ...tab, ...updates, id: tab.id, parentId: tab.parentId };
        });
      });
      return found ? next : current;
    });
  }, []);

  const closeActiveTab = useCallback(() => {
    if (activeTab?.closable) closeTab(activeTab.id);
    else if (activeParent) activateTab(`${activeParent.id}:list`);
  }, [activateTab, activeParent, activeTab, closeTab]);

  const closeAllChildren = useCallback(async () => {
    if (!activeParent) return;
    const parentId = activeParent.id;
    if (activeParent.exact || activeParent.noChildTabs) return;
    if (!(await confirmDirtyTabs(childrenByParent[parentId] || []))) return;
    setChildrenByParent((current) => ({ ...current, [parentId]: [createListTab(activeParent)] }));
    setActiveChildByParent((current) => ({ ...current, [parentId]: `${parentId}:list` }));
  }, [activeParent, childrenByParent, confirmDirtyTabs]);

  const closeAllParents = useCallback(async () => {
    const allTabs = Object.values(childrenByParent).flat();
    if (!(await confirmDirtyTabs(allTabs))) return;
    const remaining = parentTabs.filter((tab) => !tab.closable);
    const nextTabs = remaining.length ? remaining : [parentTabs[0]].filter(Boolean);
    const nextIds = new Set(nextTabs.map((tab) => tab.id));
    setParentTabs(nextTabs);
    setChildrenByParent((current) => {
      const next = {};
      Object.keys(current).forEach((parentId) => {
        if (nextIds.has(parentId)) next[parentId] = current[parentId];
      });
      return next;
    });
    setActiveChildByParent((current) => {
      const next = {};
      Object.keys(current).forEach((parentId) => {
        if (nextIds.has(parentId)) next[parentId] = current[parentId];
      });
      return next;
    });
    setActiveParentId((current) => {
      if (nextIds.has(current)) return current;
      const fallback = nextTabs[0];
      if (fallback) navigate(fallback.href);
      return fallback?.id || "";
    });
  }, [childrenByParent, confirmDirtyTabs, navigate, parentTabs]);

  const openList = useCallback(() => {
    if (activeParent) activateTab(`${activeParent.id}:list`);
  }, [activateTab, activeParent]);

  useEffect(() => {
    const handler = (event) => {
      if (!event.ctrlKey) return;
      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        openCreateTab({ reuseDefault: false });
      }
      if (event.key.toLowerCase() === "w") {
        event.preventDefault();
        closeActiveTab();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeActiveTab, openCreateTab]);

  // Tab dengan draft tersimpan juga ditandai "belum disimpan" pada tab bar.
  const dirtyTabIdsWithDrafts = useMemo(() => {
    const withDrafts = Object.values(childrenByParent).flat().reduce((next, tab) => {
      if (draftRef.current[tab.id]) next[tab.id] = true;
      return next;
    }, { ...dirtyTabIds });

    return withDrafts;
  }, [childrenByParent, dirtyTabIds]);
  const allTabs = useMemo(() => Object.values(childrenByParent).flat(), [childrenByParent]);

  const value = useMemo(() => ({
    items,
    parentTabs,
    activeParent,
    activeParentId,
    openParent,
    activateParent,
    closeParent,
    tabs,
    allTabs,
    activeTab,
    activeTabId,
    activateTab,
    openCreateTab,
    openEditTab,
    openOperationTab,
    updateTab,
    closeTab,
    closeActiveTab,
    closeAllChildren,
    closeAllParents,
    openList,
    markListDirty,
    listRevision: Number(listRevisionByParent[activeParent?.id] || 0),
    setTabDirty,
    setTabDraft,
    markTabClean,
    dirtyTabIds: dirtyTabIdsWithDrafts,
    navigate,
  }), [activateParent, activateTab, activeParent, activeParentId, activeTab, activeTabId, allTabs, closeActiveTab, closeAllChildren, closeAllParents, closeParent, closeTab, dirtyTabIdsWithDrafts, items, listRevisionByParent, markListDirty, markTabClean, navigate, openCreateTab, openEditTab, openList, openOperationTab, openParent, parentTabs, setTabDirty, setTabDraft, tabs, updateTab]);

  return <PanelTabsContext.Provider value={value}>{children}</PanelTabsContext.Provider>;
}

export function usePanelTabs() {
  return useContext(PanelTabsContext);
}
