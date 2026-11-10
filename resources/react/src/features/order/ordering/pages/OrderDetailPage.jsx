import { Navigate, useParams } from "react-router-dom";

export default function OrderDetailPage() {
  const { id } = useParams();
  return <Navigate to={`/cart?tab=order&orderId=${encodeURIComponent(id || "")}`} replace state={{ checkoutStep: 3 }} />;
}
