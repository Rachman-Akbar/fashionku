import { createContext, useContext, useMemo } from "react";
import { useAdminActionTracker } from "./useAdminActionTracker";

const AdminActionTrackerContext = createContext(null);

export function AdminActionTrackerProvider({ children }) {
  const tracker = useAdminActionTracker();

  const value = useMemo(() => tracker, [tracker]);

  return (
    <AdminActionTrackerContext.Provider value={value}>
      {children}
    </AdminActionTrackerContext.Provider>
  );
}

export function useAdminActionTrackerContext() {
  const context = useContext(AdminActionTrackerContext);
  if (!context) {
    throw new Error("useAdminActionTrackerContext harus digunakan di dalam AdminActionTrackerProvider");
  }
  return context;
}