import { useLocation, useNavigate, useParams } from "react-router-dom";
import OrderDetailCard from "@/features/order/ordering/components/OrderDetailCard";
import { OrderFlowStepper } from "@/features/order/ordering/components/OrderFlowStepper";

/**
 * Langkah ke-3 alur pesanan buyer. Halaman berdiri sendiri supaya header,
 * stepper, dan navigasi sama persis dengan langkah 1 (checkout) dan 2 (review),
 * dengan pintasan "Lihat Keranjang" di header.
 */
export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const paymentNotice =
    location.state?.paymentError ||
    (location.state?.orderCreated ? "Pesanan berhasil dibuat." : "");

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:py-8">
      <OrderFlowStepper
        currentStep={3}
        title="Detail Pesanan"
        subtitle={id ? `Pesanan #${id}` : "Status dan pembayaran pesanan"}
        onBack={() => navigate("/cart?tab=order")}
        backLabel="Riwayat Pesanan"
      />

      <OrderDetailCard
        orderId={id}
        paymentNotice={paymentNotice}
        autoPay={Boolean(location.state?.autoPay)}
      />
    </div>
  );
}
