import { useMemo, useState } from "react";
import { BellRing, PackageCheck } from "lucide-react";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { useOrders } from "@/features/order/ordering/orderService";

export default function NotificationsPage() {
  const ordersQuery = useOrders({ per_page: 50 });
  const notifications = useMemo(
    () =>
      (ordersQuery.data?.data || []).map((order) => ({
        id: order.id,
        title: `Pesanan ${order.orderNumber}`,
        description: `Status pesanan: ${String(order.status || "pending").replace(/_/g, " ")}`,
        detail: `Pembayaran ${String(order.paymentStatus || "unpaid").replace(/_/g, " ")} melalui ${order.paymentMethod || "metode pembayaran yang dipilih"}.`,
        time: order.updatedAt || order.createdAt,
      })),
    [ordersQuery.data],
  );
  const [activeId, setActiveId] = useState(null);
  const activeNotification =
    notifications.find((item) => item.id === activeId) ||
    notifications[0] ||
    null;

  return (
    <div className={profileLayout.page}>
      <aside className={profileLayout.sidebar}>
        <div className={profileLayout.sidebarHeader}>
          <h1 className={profileLayout.sidebarTitle}>Notifikasi</h1>
          <BellRing size={20} className="text-slate-500" />
        </div>
        <div className={profileLayout.listScroll}>
          {ordersQuery.isLoading ? (
            <p className="p-6 text-sm text-slate-500">Memuat notifikasi...</p>
          ) : null}
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`${profileLayout.listItem} ${activeNotification?.id === item.id ? "bg-[#ECFDF5]" : "hover:bg-[#f7f8fa]"}`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D1FAE5] text-[#10B981]">
                <PackageCheck size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
              <hr className={profileLayout.listDivider} />
            </button>
          ))}
          {!ordersQuery.isLoading && !notifications.length ? (
            <p className="p-6 text-sm text-slate-500">
              Belum ada notifikasi transaksi.
            </p>
          ) : null}
        </div>
      </aside>
      <section className={profileLayout.chatPanel}>
        {activeNotification ? (
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={profileLayout.contentEyebrow}>
                  Order update
                </span>
                <h2 className="mt-2 text-3xl font-light tracking-tight text-slate-950">
                  {activeNotification.title}
                </h2>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-400">
                {activeNotification.time
                  ? new Date(activeNotification.time).toLocaleString("id-ID")
                  : ""}
              </span>
            </div>
            <hr className={profileLayout.divider} />
            <div className="py-8">
              <p className="text-sm leading-7 text-slate-600">
                {activeNotification.detail}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f2f5] text-slate-400">
                <BellRing size={40} />
              </div>
              <h2 className="mb-2 text-2xl font-light text-slate-950">
                Pusat Notifikasi
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Perubahan status pesanan akan tampil di sini.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
