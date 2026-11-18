import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PALETTE,
  THEME_MODE_STORAGE_KEY,
  THEME_MODE_VALUES,
  THEME_PALETTE_STORAGE_KEY,
  THEME_PALETTE_VALUES,
} from "@/shared/theme/themeConfig";

const ThemeContext = createContext(null);
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

function readPreference(key, allowed, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return allowed.includes(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage bisa diblokir (mode privat / kebijakan browser).
  }
}

function readSystemDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(SYSTEM_DARK_QUERY).matches;
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() =>
    readPreference(THEME_MODE_STORAGE_KEY, THEME_MODE_VALUES, DEFAULT_THEME_MODE),
  );
  const [palette, setPaletteState] = useState(() =>
    readPreference(
      THEME_PALETTE_STORAGE_KEY,
      THEME_PALETTE_VALUES,
      DEFAULT_THEME_PALETTE,
    ),
  );
  const [systemDark, setSystemDark] = useState(readSystemDark);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia(SYSTEM_DARK_QUERY);
    const handler = (event) => setSystemDark(event.matches);
    setSystemDark(media.matches);
    media.addEventListener?.("change", handler);
    return () => media.removeEventListener?.("change", handler);
  }, []);

  const resolvedMode = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  // Tema ditempel di <html> agar seluruh halaman (admin, marketplace, profil)
  // dan elemen portal (dialog, dropdown) ikut memakai mode & palet yang sama.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("profile-theme");
    root.setAttribute("data-mode", resolvedMode);
    root.setAttribute("data-palette", palette);
  }, [resolvedMode, palette]);

  const setMode = useCallback((value) => {
    if (!THEME_MODE_VALUES.includes(value)) return;
    setModeState(value);
    writePreference(THEME_MODE_STORAGE_KEY, value);
  }, []);

  const setPalette = useCallback((value) => {
    if (!THEME_PALETTE_VALUES.includes(value)) return;
    setPaletteState(value);
    writePreference(THEME_PALETTE_STORAGE_KEY, value);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(resolvedMode === "dark" ? "light" : "dark");
  }, [resolvedMode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      palette,
      setMode,
      setPalette,
      toggleMode,
    }),
    [mode, palette, resolvedMode, setMode, setPalette, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme harus dipakai di dalam ThemeProvider.");
  }
  return context;
}
