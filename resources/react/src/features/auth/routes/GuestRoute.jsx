import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

function getRedirectPath(activeRole) {
  if (activeRole === "admin") return "/admin";
  if (activeRole === "seller") return "/seller";
  return "/";
}

export default function GuestRoute({ children }) {
  const { initializing, isAuthenticated, activeRole } = useAuth();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#10B981]" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(activeRole)} replace />;
  }

  return children || <Outlet />;
}
