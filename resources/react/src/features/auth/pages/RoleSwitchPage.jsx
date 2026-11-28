import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { confirmRoleSwitch } from "@/shared/utils/userFeedback";

function normalizeRole(value) {
  return String(value || "").toLowerCase().trim();
}

function normalizeRoles(values = []) {
  return Array.isArray(values)
    ? values.map(normalizeRole).filter(Boolean)
    : [];
}

function getLoginPath(role, redirect) {
  const path = role === "admin" ? "/admin/login" : "/auth/login";
  const params = new URLSearchParams({ redirect });
  return `${path}?${params.toString()}`;
}

export default function RoleSwitchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshMe, switchRole } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const query = new URLSearchParams(location.search);
    const requestedRole = normalizeRole(query.get("role") || "buyer");
    const targetRole = requestedRole === "seller" ? "admin" : requestedRole;
    if (!["admin", "buyer"].includes(targetRole)) {
      navigate("/", { replace: true });
      return;
    }
    const defaultRedirect = targetRole === "admin" ? "/admin" : "/";
    const requestedRedirect = query.get("redirect") || defaultRedirect;
    const redirect = requestedRedirect.replace(/^\/seller(?=\/|$)/, "/admin");

    const prepareSession = async () => {
      let currentSession = null;

      try {
        currentSession = await refreshMe();
      } catch {
        currentSession = null;
      }

      const roles = normalizeRoles(
        currentSession?.roles || currentSession?.user?.roles || [],
      );
      const activeRole = normalizeRole(
        currentSession?.activeRole ||
          currentSession?.active_role ||
          currentSession?.user?.role,
      );

      if (!roles.includes(targetRole) && activeRole !== targetRole) {
        navigate(getLoginPath(targetRole, redirect), { replace: true });
        return;
      }

      if (activeRole === targetRole) {
        navigate(redirect, { replace: true });
        return;
      }

      try {
        const targetLabel = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
        const confirmed = await confirmRoleSwitch(targetLabel, targetRole === "admin" ? "Panel Admin" : "panel peran tersebut");

        if (!confirmed) {
          if (window.opener) {
            window.close();
          } else {
            navigate("/", { replace: true });
          }
          return;
        }

        await switchRole(targetRole, {
          deviceName: `marketplace-web-${targetRole}`,
          storageScope: "window",
        });
        navigate(redirect, { replace: true });
      } catch {
        navigate(getLoginPath(targetRole, redirect), { replace: true });
      }
    };

    prepareSession();
  }, [location.search, navigate, refreshMe, switchRole]);

  return null;
}
