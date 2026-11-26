import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageErrorBoundary from "@/shared/components/feedback/PageErrorBoundary";
import { usePanelTabs } from "@/shared/layout/tabs/PanelTabsContext";
import { cn } from "@/shared/utils/utils";

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Memuat...</p>
      </div>
    </div>
  );
}

export function RouteOutletBoundary({ className }) {
  const { pathname, search } = useLocation();
  const tabs = usePanelTabs();

  // Pindah tab anak (Daftar / Data Baru / detail) tidak mengubah URL. Tanpa
  // id tab pada resetKey, layar "Halaman gagal dimuat" akan ikut terbawa ke
  // tab berikutnya sehingga panel terlihat macet sampai halaman dimuat ulang.
  const resetKey = `${pathname}${search}::${tabs?.activeTabId || ""}`;

  return (
    <div className={cn("min-w-0 max-w-full", className)}>
      <PageErrorBoundary resetKey={resetKey}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
      </PageErrorBoundary>
    </div>
  );
}
