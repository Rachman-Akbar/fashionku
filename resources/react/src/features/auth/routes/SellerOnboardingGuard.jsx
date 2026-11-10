import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  useSellerStore,
  useSellerStoreAddress,
} from "@/features/seller/store/services/sellerStoreService";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#10B981]" />
    </div>
  );
}


function SuspendedStoreScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-lg bg-white p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Status Toko</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">Toko sedang ditangguhkan</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Akses operasional Seller dihentikan sementara oleh Admin. Hubungi Admin untuk meninjau kembali status toko.</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center justify-center bg-slate-900 px-5 text-sm font-semibold text-white">Kembali ke Marketplace</Link>
      </section>
    </div>
  );
}

function isOperationalProfileComplete(store) {
  const detail = store?.detail || {};
  const required = [
    detail.openDays,
    detail.openTime,
    detail.closeTime,
    detail.shippingPolicy,
    detail.returnPolicy,
  ];

  return required.every((value) => String(value || "").trim());
}

export default function SellerOnboardingGuard({ children }) {
  const location = useLocation();
  const { store: sessionStore } = useAuth();
  const storeQuery = useSellerStore();
  const addressQuery = useSellerStoreAddress({
    enabled: Boolean(storeQuery.data?.id && !storeQuery.isError),
  });

  if (!sessionStore?.id) {
    return (
      <Navigate
        to="/auth/seller/onboarding"
        state={{ from: location, reason: "store_missing" }}
        replace
      />
    );
  }

  if (storeQuery.isLoading || addressQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (storeQuery.isError || addressQuery.isError) {
    return (
      <Navigate
        to="/auth/seller/onboarding"
        state={{ from: location, reason: "seller_access_unavailable" }}
        replace
      />
    );
  }

  const store = storeQuery.data;

  if (String(store?.status || sessionStore?.status || "").toLowerCase() === "suspended") {
    return <SuspendedStoreScreen />;
  }

  const address = addressQuery.data;
  const isComplete = Boolean(
    store?.id && address?.id && isOperationalProfileComplete(store),
  );

  if (!isComplete) {
    return (
      <Navigate
        to="/auth/seller/onboarding"
        state={{ from: location, reason: "onboarding_incomplete" }}
        replace
      />
    );
  }

  return children || <Outlet />;
}
