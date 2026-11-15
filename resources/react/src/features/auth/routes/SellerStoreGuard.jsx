import { Outlet } from "react-router-dom";

export default function SellerStoreGuard({ children }) {
  return children || <Outlet />;
}
