import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { VoucherManagementPage } from "@/features/order/voucher/components/VoucherManagementPage";

export default function SellerVoucherPage() {
  return <VoucherManagementPage portal="seller">{(content) => <SellerPanelShell title="Voucher Toko" subtitle="Kelola voucher toko, periode berlaku, batas penggunaan, dan status active/non-active.">{content}</SellerPanelShell>}</VoucherManagementPage>;
}
