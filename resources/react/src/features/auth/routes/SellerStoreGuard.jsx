import { Link, Outlet } from "react-router-dom";
import { useSellerStore } from "@/features/seller/store/services/sellerStoreService";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-[#10B981]" />
    </div>
  );
}

function StoreUnavailableScreen({ title, message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-lg bg-white p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Status Toko</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center justify-center bg-slate-900 px-5 text-sm font-semibold text-white">Kembali ke Marketplace</Link>
      </section>
    </div>
  );
}

export default function SellerStoreGuard({ children }) {
  const storeQuery = useSellerStore();

  if (storeQuery.isLoading) {
    return <LoadingScreen />;
  }

  const store = storeQuery.data;

  if (!store?.id) {
    return (
      <StoreUnavailableScreen
        title="Toko belum tersedia"
        message="Toko Fashionku belum dikonfigurasi. Hubungi administrator untuk menyiapkan toko."
      />
    );
  }

  if (String(store?.status || "").toLowerCase() === "suspended") {
    return (
      <StoreUnavailableScreen
        title="Toko sedang ditangguhkan"
        message="Akses operasional seller dihentikan sementara oleh Admin. Hubungi Admin untuk meninjau kembali status toko."
      />
    );
  }

  return children || <Outlet />;
}
