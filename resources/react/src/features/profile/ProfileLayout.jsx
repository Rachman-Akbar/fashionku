import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BellRing,
  LifeBuoy,
  MessageSquare,
  TicketPercent,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import { cn } from "@/shared/utils/utils";

const NAV_ITEMS = [
  { href: "/profile/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile/notifications", label: "Notifikasi", icon: BellRing },
  { href: "/profile/payments", label: "Pembayaran", icon: WalletCards },
  { href: "/profile/vouchers", label: "Voucher", icon: TicketPercent },
  { href: "/profile/help", label: "Pusat Bantuan", icon: LifeBuoy },
];

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ProfileNavigation = memo(function ProfileNavigation() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const initial = user?.name?.slice(0, 1)?.toUpperCase() || "R";
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile/addresses") || pathname.startsWith("/profile/security");

  return (
    <>
      <aside className={profileLayout.rail}>
        <nav className="flex w-full flex-col items-center gap-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                to={href}
                title={label}
                aria-label={label}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                  active ? "bg-emerald-50 text-[#10B981]" : "text-slate-500 hover:bg-emerald-50 hover:text-[#10B981]",
                )}
              >
                <Icon size={20} />
                {active ? <span className="absolute -right-[10px] top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[#10B981]" /> : null}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/profile"
          title={user?.name || "Profile"}
          aria-label="Profile"
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all",
            profileActive ? "bg-[#10B981] text-white" : "bg-slate-900 text-white hover:bg-[#10B981]",
          )}
        >
          {profileActive ? <UserRound size={20} /> : <span className="text-sm font-bold">{initial}</span>}
          {profileActive ? <span className="absolute -right-[10px] top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[#10B981]" /> : null}
        </Link>
      </aside>

      <nav className={profileLayout.mobileNav} aria-label="Navigasi akun buyer">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link key={href} to={href} title={label} aria-label={label} className={cn("flex h-11 w-11 items-center justify-center rounded-xl", active ? "bg-emerald-50 text-[#10B981]" : "text-slate-500")}>
              <Icon size={19} />
            </Link>
          );
        })}
      </nav>
    </>
  );
});

export default function ProfileLayout() {
  return (
    <div className="flex h-[100dvh] w-full max-w-full overflow-hidden bg-white text-slate-900">
      <ProfileNavigation />
      <main className="relative min-w-0 max-w-full flex-1 overflow-hidden pb-16 md:pb-0">
        <RouteOutletBoundary className="h-full w-full min-w-0 max-w-full overflow-hidden" />
      </main>
    </div>
  );
}
