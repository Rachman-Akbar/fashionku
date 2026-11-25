import { useLocation } from "react-router-dom";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div
      className={`relative min-h-screen ${
        isAdmin ? "bg-[#0B1220]" : "bg-slate-50"
      }`}
    >
      <PageTransitionLoader />

      {isAdmin ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.18),transparent_70%)]" />
      ) : null}

      <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 ${
            isAdmin
              ? "border-slate-800 bg-[#111A2C] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <RouteOutletBoundary compact />
        </div>
      </main>
    </div>
  );
}
