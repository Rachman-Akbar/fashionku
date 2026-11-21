import { Suspense, useEffect } from "react";
import { lazyWithRetry } from "@/core/utils/lazyWithRetry";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "@/shared/layout/AppLayout";
import BuyerLayout from "@/shared/layout/BuyerLayout";
import AuthLayout from "@/features/auth/AuthLayout";
import SellerLayout from "@/features/seller/SellerLayout";
import ProfileLayout from "@/features/profile/ProfileLayout";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";
import SellerStoreGuard from "@/features/auth/routes/SellerStoreGuard";
import GuestRoute from "@/features/auth/routes/GuestRoute";
import ErrorBoundary from "@/shared/components/feedback/ErrorBoundary";

const HomePage = lazyWithRetry(() => import("@/features/catalog/HomePage"));
const SearchPage = lazyWithRetry(() => import("@/features/catalog/product/pages/SearchPage"));
const ProductDetailPage = lazyWithRetry(() => import("@/features/catalog/product/pages/ProductDetailPage"));
const CategoryPage = lazyWithRetry(() => import("@/features/catalog/category/pages/CategoryPage"));
const PromotionPage = lazyWithRetry(() => import("@/features/catalog/promotion/pages/PromotionPage"));
const CompanyProfilePage = lazyWithRetry(() => import("@/features/catalog/company/pages/CompanyProfilePage"));
const CartPage = lazyWithRetry(() => import("@/features/order/cart/pages/CartPage"));
const CheckoutPage = lazyWithRetry(() => import("@/features/order/ordering/pages/CheckoutPage"));
const OrderDetailPage = lazyWithRetry(() => import("@/features/order/ordering/pages/OrderDetailPage"));
const LoginPage = lazyWithRetry(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazyWithRetry(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazyWithRetry(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazyWithRetry(() => import("@/features/auth/pages/ResetPasswordPage"));
const RoleSwitchPage = lazyWithRetry(() => import("@/features/auth/pages/RoleSwitchPage"));
const GoogleRedirectHandler = lazyWithRetry(() => import("@/features/auth/pages/GoogleRedirectHandler"));
const SellerDashboardPage = lazyWithRetry(() => import("@/features/seller/dashboard/pages/SellerDashboardPage"));
const SellerProductsPage = lazyWithRetry(() => import("@/features/seller/product/pages/SellerProductsPage"));
const SellerVoucherPage = lazyWithRetry(() => import("@/features/seller/voucher/pages/SellerVoucherPage"));
const SellerPromotionPage = lazyWithRetry(() => import("@/features/seller/promotion/pages/SellerPromotionPage"));
const SellerStorePage = lazyWithRetry(() => import("@/features/seller/store/pages/SellerStorePage"));
const SellerOrdersPage = lazyWithRetry(() => import("@/features/seller/order/pages/SellerOrdersPage"));
const AdminDashboardPage = lazyWithRetry(() => import("@/features/admin/pages/AdminDashboardPage"));
const AdminOrdersPage = lazyWithRetry(() => import("@/features/admin/order/pages/AdminOrdersPage"));
const AdminStoreSettingsPage = lazyWithRetry(() => import("@/features/admin/store/pages/AdminStoreSettingsPage"));
const AdminShell = lazyWithRetry(() => import("@/features/admin/layout/AdminShell"));
const AdminUsersPage = lazyWithRetry(() => import("@/features/admin/users/pages/AdminUsersPage"));
const AdminCategoryPage = lazyWithRetry(() => import("@/features/admin/category/pages/AdminCategoryPage"));
const ProfilePage = lazyWithRetry(() => import("@/features/profile/identity/pages/ProfilePage"));
const AddressesPage = lazyWithRetry(() => import("@/features/profile/address/pages/AddressesPage"));
const GroupChatPage = lazyWithRetry(() => import("@/features/profile/chat/pages/GroupChatPage"));
const NotificationsPage = lazyWithRetry(() => import("@/features/profile/notifications/pages/NotificationsPage"));
const PaymentsPage = lazyWithRetry(() => import("@/features/profile/payments/pages/PaymentsPage"));
const AppearancePage = lazyWithRetry(() => import("@/features/profile/appearance/pages/AppearancePage"));
const FinancePage = lazyWithRetry(() => import("@/features/advanced/pages/FinancePage"));
const StockPage = lazyWithRetry(() => import("@/features/advanced/pages/StockPage"));
const BahanBakuPage = lazyWithRetry(() => import("@/features/advanced/pages/BahanBakuPage"));
const HppReportPage = lazyWithRetry(() => import("@/features/advanced/pages/HppReportPage"));
const SchedulePage = lazyWithRetry(() => import("@/features/advanced/pages/SchedulePage"));
const CodePatternSettingsPage = lazyWithRetry(() => import("@/features/advanced/pages/CodePatternSettingsPage"));
const CustomersPage = lazyWithRetry(() => import("@/features/advanced/pages/CustomersPage"));
const HelpPage = lazyWithRetry(() => import("@/features/advanced/pages/HelpPage"));
const BuyerHelpPage = lazyWithRetry(() => import("@/features/profile/help/pages/BuyerHelpPage"));
const ReviewsPage = lazyWithRetry(() => import("@/features/advanced/pages/ReviewsPage"));
const RealtimeChatPage = lazyWithRetry(() => import("@/features/advanced/pages/RealtimeChatPage"));


/**
 * Reset posisi scroll saat pindah halaman.
 *
 * Selain window, beberapa layout (admin/seller/profile) memakai kontainer
 * scroll sendiri ber-overflow-y-auto sehingga posisi lama ikut terbawa ke
 * halaman berikutnya bila tidak direset.
 */
function resetScrollPosition() {
  window.scrollTo(0, 0);

  const containers = document.querySelectorAll(
    'main, [data-scroll-container], .overflow-y-auto, .overflow-scroll',
  );

  containers.forEach((container) => {
    if (container.scrollTop > 0) {
      container.scrollTop = 0;
    }
  });
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    resetScrollPosition();
  }, [pathname]);

  return null;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e0e3e7] border-t-[#10B981]" />
        <p className="text-sm text-[#5f5e5e]">Memuat...</p>
      </div>
    </div>
  );
}

function renderBuyerRoutes() {
  return (
    <Route element={<BuyerLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/category/*" element={<CategoryPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/promotions" element={<PromotionPage />} />
      <Route path="/toko-kami" element={<CompanyProfilePage />} />
      <Route path="/hubungi-kami" element={<Navigate to="/chat" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/*" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/riwayat" element={<Navigate to="/cart?tab=order" replace />} />
      </Route>
    </Route>
  );
}

function renderAuthenticationRoutes() {
  return (
    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage portal="buyer" />} />
        <Route path="/admin/login" element={<LoginPage portal="admin" />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/google-callback" element={<GoogleRedirectHandler />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Route>
  );
}

function renderAccountRoutes() {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/auth/role-switch" element={<RoleSwitchPage />} />
      <Route element={<ProfileLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/orders" element={<Navigate to="/cart?tab=order" replace />} />
        <Route path="/profile/addresses" element={<AddressesPage />} />
        <Route path="/profile/wishlist" element={<Navigate to="/cart?tab=wishlist" replace />} />
        <Route path="/profile/notifications" element={<NotificationsPage />} />
        <Route path="/profile/payments" element={<PaymentsPage />} />
        <Route path="/profile/appearance" element={<AppearancePage />} />
        <Route path="/profile/help" element={<BuyerHelpPage />} />
        <Route path="/chat" element={<RealtimeChatPage />} />
        <Route path="/chat/groups" element={<GroupChatPage />} />
      </Route>
      <Route path="/profile/chat" element={<Navigate to="/chat" replace />} />
      <Route path="/profile/groups" element={<Navigate to="/chat/groups" replace />} />
    </Route>
  );
}

function renderSellerRoutes() {
  return (
    <Route element={<ProtectedRoute roles={["seller", "admin"]} />}>
      <Route element={<SellerStoreGuard />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/stock" element={<StockPage />} />
          <Route path="/seller/hpp-report" element={<HppReportPage />} />
          <Route path="/seller/vouchers" element={<SellerVoucherPage />} />
          <Route path="/seller/promotions" element={<SellerPromotionPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/customers" element={<CustomersPage />} />
          <Route path="/seller/cashflow" element={<FinancePage mode="cashflow" />} />
          <Route path="/seller/receivables-payables" element={<FinancePage mode="receivables" />} />
          <Route path="/seller/reviews" element={<ReviewsPage />} />
          <Route path="/seller/help" element={<HelpPage />} />
          <Route path="/seller/chat" element={<RealtimeChatPage />} />
          <Route path="/seller/store" element={<SellerStorePage />} />
          <Route path="/seller/code-settings" element={<CodePatternSettingsPage />} />
        </Route>
      </Route>
    </Route>
  );
}

function renderAdminRoutes() {
  return (
    <Route element={<ProtectedRoute roles={["admin"]} loginPath="/admin/login" />}>
      <Route element={<AdminShell />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<SellerProductsPage />} />
        <Route path="/admin/stock" element={<StockPage />} />
        <Route path="/admin/hpp-report" element={<HppReportPage />} />
        <Route path="/admin/bahan-baku" element={<BahanBakuPage />} />
        <Route path="/admin/vouchers" element={<SellerVoucherPage />} />
        <Route path="/admin/promotions" element={<SellerPromotionPage />} />
        <Route path="/admin/reviews" element={<ReviewsPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/cashflow" element={<FinancePage mode="cashflow" />} />
        <Route path="/admin/receivables-payables" element={<FinancePage mode="receivables" />} />
        <Route path="/admin/categories" element={<AdminCategoryPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/planner" element={<SchedulePage />} />
        <Route path="/admin/chat" element={<RealtimeChatPage />} />
        <Route path="/admin/help" element={<HelpPage />} />
        <Route path="/admin/store" element={<AdminStoreSettingsPage />} />
        <Route path="/admin/shipping" element={<Navigate to="/admin/store" replace />} />
        <Route path="/admin/code-settings" element={<Navigate to="/admin/store" replace />} />
      </Route>
    </Route>
  );
}

function RouteErrorBoundary({ children }) {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
}

export default function App() {
  return (
    <AppLayout>
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          {/* Harus di luar <Routes>: React Router v7 hanya menerima <Route>/<React.Fragment> sebagai anak <Routes>. */}
          <ScrollToTop />
          <Routes>
            {renderBuyerRoutes()}
            {renderAuthenticationRoutes()}
            {renderAccountRoutes()}
            {renderSellerRoutes()}
            {renderAdminRoutes()}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </AppLayout>
  );
}
