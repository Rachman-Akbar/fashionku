import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToolbarTableColumnsContext = createContext(null);

export function ToolbarTableColumnsProvider({ children }) {
  const [registration, setRegistration] = useState(null);

  const register = useCallback((next) => {
    setRegistration(next);
  }, []);

  const unregister = useCallback(() => {
    setRegistration(null);
  }, []);

  const value = useMemo(() => ({ registration, register, unregister }), [registration, register, unregister]);

  return <ToolbarTableColumnsContext.Provider value={value}>{children}</ToolbarTableColumnsContext.Provider>;
}

export function useToolbarTableColumns() {
  const context = useContext(ToolbarTableColumnsContext);
  if (!context) {
    return { registration: null, register: null, unregister: null };
  }
  return context;
}