import { useMemo } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export function usePermission(allowedRoles = []) {
  const { activeRole, roles } = useAuth();

  return useMemo(() => {
    if (!allowedRoles.length) return true;
    const allowed = allowedRoles.map((role) => String(role).toLowerCase());
    return allowed.includes(activeRole) || roles.some((role) => allowed.includes(role));
  }, [activeRole, allowedRoles, roles]);
}
