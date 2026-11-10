import { SellerPanelShell } from "@/features/seller/dashboard/components/SellerPanelShell";
import { SellerStoreProfileCard } from "@/features/seller/store/components/SellerStoreProfileCard";
import { SellerStoreSettingsPanel } from "@/features/seller/store/components/SellerStoreSettingsPanel";
import { useSellerStore } from "@/features/seller/store/services/sellerStoreService";

export default function SellerStorePage() {
  const storeQuery = useSellerStore();
  const store = storeQuery.data || null;

  return (
    <SellerPanelShell title="Toko" subtitle="Atur identitas dan operasional toko Anda.">
      <div className="space-y-8">
        <SellerStoreProfileCard store={store} />
        <SellerStoreSettingsPanel store={store} />
      </div>
    </SellerPanelShell>
  );
}
