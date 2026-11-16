import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { VoucherManagementPage } from "@/features/order/voucher/components/VoucherManagementPage";

export default function SellerVoucherPage() {
  return <VoucherManagementPage portal="seller">{(content) => <SellerPanelShell>{content}</SellerPanelShell>}</VoucherManagementPage>;
}
