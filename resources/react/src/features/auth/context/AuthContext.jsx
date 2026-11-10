import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearStoredSession,
  fetchCurrentAuthUser,
  getApiErrorMessage,
  getCurrentSessionScope,
  loginWithGoogle as loginWithGoogleRequest,
  loginWithPassword as loginWithPasswordRequest,
  logoutFromApi,
  readStoredSession,
  registerWithPassword as registerWithPasswordRequest,
  requestPasswordResetCode,
  resetPassword as resetPasswordRequest,
  resetPasswordWithCode as resetPasswordWithCodeRequest,
  changePassword as changePasswordRequest,
  switchActiveRole,
} from "@/features/auth/services/authService";
import {
  BASE_SESSION_KEY,
  BASE_TOKEN_KEY,
  WINDOW_TOKEN_KEY,
} from "@/core/utils/apiClient";

const AuthContext = createContext(null);

function normalizeRole(value) {
  if (typeof value === "string") {
    return value.toLowerCase().trim();
  }

  return String(value?.name || value?.role || value?.value || value?.slug || "")
    .toLowerCase()
    .trim();
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const syncMe = useCallback(async () => {
    const currentSession = readStoredSession();

    if (!currentSession?.token) {
      setSession(null);
      setInitializing(false);
      return null;
    }

    try {
      const nextSession = await fetchCurrentAuthUser();
      setSession(nextSession);
      return nextSession;
    } catch (apiError) {
      if (apiError?.response?.status === 401) {
        clearStoredSession({
          scope: currentSession.storageScope || getCurrentSessionScope(),
        });
        const fallbackSession = readStoredSession();
        setSession(fallbackSession);
        return fallbackSession;
      }

      setSession(currentSession);
      return currentSession;
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    syncMe();
  }, [syncMe]);

  useEffect(() => {
    const handleUnauthorized = (event) => {
      const scope = event?.detail?.scope || getCurrentSessionScope();
      clearStoredSession({ scope });
      const fallbackSession = readStoredSession();
      setSession(fallbackSession);
      setError(
        fallbackSession
          ? "Sesi portal telah berakhir. Anda kembali menggunakan sesi akun utama."
          : "Sesi Anda telah berakhir. Silakan masuk kembali."
      );
    };

    const handleStorage = (event) => {
      if (![BASE_TOKEN_KEY, BASE_SESSION_KEY].includes(event.key)) {
        return;
      }

      if (sessionStorage.getItem(WINDOW_TOKEN_KEY)) {
        return;
      }

      setSession(readStoredSession());
    };

    const handleWindowSession = () => {
      setSession(readStoredSession());
    };

    window.addEventListener("marketku:unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("marketku:session-changed", handleWindowSession);

    return () => {
      window.removeEventListener("marketku:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("marketku:session-changed", handleWindowSession);
    };
  }, []);

  const runAuthAction = useCallback(async (action) => {
    setLoading(true);
    setError("");

    try {
      const nextSession = await action();

      if (!nextSession?.token) {
        throw new Error("Backend tidak mengembalikan token Sanctum.");
      }

      setSession(nextSession);
      window.dispatchEvent(new CustomEvent("marketku:session-changed"));
      return nextSession;
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithPassword = useCallback(
    (payload) => runAuthAction(() => loginWithPasswordRequest(payload)),
    [runAuthAction]
  );

  const registerWithPassword = useCallback(
    (payload) => runAuthAction(() => registerWithPasswordRequest(payload)),
    [runAuthAction]
  );

  const loginWithGoogle = useCallback(
    (options = {}) => runAuthAction(() => loginWithGoogleRequest(options)),
    [runAuthAction]
  );

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError("");

    try {
      await requestPasswordResetCode(email);
      return true;
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPasswordWithCode = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      await resetPasswordWithCodeRequest(payload);
      return true;
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      await resetPasswordRequest(payload);
      return true;
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      await changePasswordRequest(payload);
      return true;
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await logoutFromApi();
    } catch (authError) {
      const message = getApiErrorMessage(authError);
      setError(message);
    } finally {
      const fallbackSession = readStoredSession();
      setSession(fallbackSession);
      window.dispatchEvent(new CustomEvent("marketku:session-changed"));
      setLoading(false);
    }
  }, []);

  const switchRole = useCallback(
    (role, options = {}) =>
      runAuthAction(() =>
        switchActiveRole(role, {
          ...options,
          storageScope: options.storageScope || "window",
        })
      ),
    [runAuthAction]
  );

  const user = session?.user || null;

  const roles = useMemo(() => {
    const source = session?.roles || user?.roles || [];

    if (!Array.isArray(source)) {
      return [];
    }

    return [...new Set(source.map(normalizeRole).filter(Boolean))];
  }, [session?.roles, user?.roles]);

  const activeRole =
    normalizeRole(
      session?.activeRole ||
        session?.active_role ||
        user?.activeRole ||
        user?.active_role ||
        user?.role ||
        roles[0] ||
        "buyer"
    ) || "buyer";

  const isAuthenticated = Boolean(session?.token && user);

  const hasRole = useCallback(
    (role) => {
      const normalizedRole = normalizeRole(role);
      return activeRole === normalizedRole || roles.includes(normalizedRole);
    },
    [activeRole, roles]
  );

  const value = useMemo(
    () => ({
      user: isAuthenticated ? user : null,
      token: session?.token || null,
      roles,
      activeRole,
      store: session?.store || null,
      loading,
      initializing,
      error,
      isAuthenticated,
      hasRole,
      login: loginWithPassword,
      loginWithPassword,
      registerWithPassword,
      loginWithGoogle,
      forgotPassword,
      resetPassword,
      resetPasswordWithCode,
      changePassword,
      logout,
      switchRole,
      refreshMe: syncMe,
      clearError: () => setError(""),
    }),
    [
      activeRole,
      changePassword,
      error,
      forgotPassword,
      hasRole,
      initializing,
      isAuthenticated,
      loading,
      loginWithGoogle,
      loginWithPassword,
      logout,
      registerWithPassword,
      resetPassword,
      resetPasswordWithCode,
      roles,
      session?.store,
      session?.token,
      switchRole,
      syncMe,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
