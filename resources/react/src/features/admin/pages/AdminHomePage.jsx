import { Navigate } from "react-router-dom";

export default function AdminHomePage() {
  return <Navigate to="/admin/orders" replace />;
}
