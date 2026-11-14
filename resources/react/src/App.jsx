import { Suspense } from "react";
import { lazyWithRetry } from "@/core/utils/lazyWithRetry";
import { Navigate, Route, Routes } from "react-router-dom";
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
const ProfilePage = lazyWithRetry(() => import("@/features/profile/identity/pages/ProfilePage"));
const AddressesPage = lazyWithRetry(() => import("@/features/profile/address/pages/AddressesPage"));
const GroupChatPage = lazyWithRetry(() => import("@/features/profile/chat/pages/GroupChatPage"));
const NotificationsPage = lazyWithRetry(() => import("@/features/profile/notifications/pages/NotificationsPage"));
const PaymentsPage = lazyWithRetry(() => import("@/features/profile/payments/pages/PaymentsPage"));
const FinancePage = lazyWithRetry(() => import("@/features/advanced/pages/FinancePage"));
const StockPage = lazyWithRetry(() => import("@/features/advanced/pages/StockPage"));
const CodePatternSettingsPage = lazyWithRetry(() => import("@/features/advanced/pages/CodePatternSettingsPage"));
const CustomersPage = lazyWithRetry(() => import("@/features/advanced/pages/CustomersPage"));
const HelpPage = lazyWithRetry(() => import("@/features/advanced/pages/HelpPage"));
const BuyerHelpPage = lazyWithRetry(() => import("@/features/profile/help/pages/BuyerHelpPage"));
const ReviewsPage = lazyWithRetry(() => import("@/features/advanced/pages/ReviewsPage"));
const RealtimeChatPage = lazyWithRetry(() => import("@/features/advanced/pages/RealtimeChatPage"));


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

export default function App() {
  return (
    <AppLayout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {renderBuyerRoutes()}
            {renderAuthenticationRoutes()}
            {renderAccountRoutes()}
            {renderSellerRoutes()}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppLayout>
  );
}
