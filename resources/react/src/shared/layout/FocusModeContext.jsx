import { createContext, useContext, useMemo } from "react";

export const FocusModeContext = createContext({ isFocus: false, toggle: () => {}, exit: () => {} });

export function useFocusMode() {
  return useContext(FocusModeContext);
}

export function useFocusModeValue(isFocus, setIsFocus) {
  return useMemo(() => ({
    isFocus,
    toggle: () => setIsFocus((current) => !current),
    exit: () => setIsFocus(false),
  }), [isFocus, setIsFocus]);
}
