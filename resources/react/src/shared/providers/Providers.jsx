import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useState } from "react";
import { createAppQueryClient } from "@/core/api/queryClient";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { CartProvider } from "@/features/order/cart/context/CartContext";
import { WishlistProvider } from "@/features/order/wishlist/context/WishlistContext";
import { NotificationCenterProvider, useNotificationCenter } from "@/shared/notifications/NotificationCenterContext";

const NotificationCenterPage = lazy(() =>
  import("@/shared/notifications/NotificationCenterPage").then((module) => ({
    default: module.NotificationCenterPage,
  })),
);

function NotificationLayer({ children }) {
  const center = useNotificationCenter();
  return (
    <>
      {children}
      {center.open && center.openMode === "modal" ? (
        <Suspense fallback={null}>
          <NotificationCenterPage />
        </Suspense>
      ) : null}
    </>
  );
}

export function Providers({ children }) {
  const [queryClient] = useState(createAppQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationCenterProvider>
          <NotificationLayer>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </NotificationLayer>
        </NotificationCenterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
