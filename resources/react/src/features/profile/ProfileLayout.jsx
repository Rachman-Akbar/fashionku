import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BellRing,
  ChevronRight,
  LifeBuoy,
  MessageSquare,
  Moon,
  Palette,
  Sun,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Navbar } from "@/shared/layout/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { profileLayout } from "@/features/profile/components/profileLayoutClasses";
import { RouteOutletBoundary } from "@/shared/layout/RouteOutletBoundary";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { cn } from "@/shared/utils/utils";
import PageTransitionLoader from "@/shared/layout/PageTransitionLoader";

const NAV_ITEMS = [
  {
    href: "/profile",
    label: "Biodata",
    description: "Kelola nama, email, dan foto profil akun.",
    icon: UserRound,
  },
  {
    href: "/profile/chat",
    label: "Chat",
    description: "Percakapan dengan toko dan admin.",
    icon: MessageSquare,
  },
  {
    href: "/profile/notifications",
    label: "Notifikasi",
    description: "Pembaruan status pesanan dan transaksi.",
    icon: BellRing,
  },
  {
    href: "/profile/payments",
    label: "Pembayaran",
    description: "Riwayat transaksi dan status pembayaran.",
    icon: WalletCards,
  },
  {
    href: "/profile/appearance",
    label: "Tampilan",
    description: "Atur mode terang/gelap dan palet warna.",
    icon: Palette,
  },
  {
    href: "/profile/help",
    label: "Pusat Bantuan",
    description: "Ajukan bantuan dan pantau riwayat tiket.",
    icon: LifeBuoy,
  },
];

function isActive(pathname, href) {
  if (href === "/profile") return pathname === "/profile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const railFlyoutClassName =
  "pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-64 -translate-y-1/2 translate-x-1 rounded-2xl border border-[#e5e7eb] bg-white p-3 opacity-0 shadow-xl shadow-slate-900/10 transition-all duration-150 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-within/item:translate-x-0 group-focus-within/item:opacity-100";

function RailFlyout({ icon: Icon, label, description, showChevron = true }) {
  return (
    <div aria-hidden="true" className={railFlyoutClassName}>
      <span
        aria-hidden
        className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l border-[#e5e7eb] bg-white"
      />
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-5 text-slate-900">{label}</p>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
            {description}
          </p>
        </div>
        {showChevron ? (
          <ChevronRight size={14} className="ml-auto mt-1 shrink-0 text-slate-300" />
        ) : null}
      </div>
      {showChevron ? (
        <p className="mt-2.5 flex items-center gap-1 border-t border-[#e5e7eb] pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Buka halaman
        </p>
      ) : null}
    </div>
  );
}

function RailIconButton({ to, label, description, icon: Icon, active }) {
  return (
    <div className="group/item relative flex w-full justify-center">
      <Link
        to={to}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
          active
            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
            : "text-slate-500 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]",
        )}
      >
        <Icon size={20} />
        {active ? (
          <span className="absolute -right-[10px] top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
        ) : null}
      </Link>
      <RailFlyout icon={Icon} label={label} description={description} />
    </div>
  );
}

const ProfileNavigation = memo(function ProfileNavigation() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { resolvedMode, toggleMode } = useTheme();
  const initial = user?.name?.slice(0, 1)?.toUpperCase() || "R";
  const ThemeIcon = resolvedMode === "dark" ? Sun : Moon;

  return (
    <>
      <aside className={cn(profileLayout.rail, "relative z-30")}>
        <nav className="flex w-full flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <RailIconButton
              key={item.href}
              to={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
              active={isActive(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="flex w-full flex-col items-center gap-2">
          <div className="group/item relative flex w-full justify-center">
            <button
              type="button"
              onClick={toggleMode}
              aria-label={
                resolvedMode === "dark"
                  ? "Aktifkan mode terang"
                  : "Aktifkan mode gelap"
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
            >
              <ThemeIcon size={19} />
            </button>
            <RailFlyout
              icon={ThemeIcon}
              label={resolvedMode === "dark" ? "Mode terang" : "Mode gelap"}
              description="Klik untuk mengganti mode tampilan area akun."
              showChevron={false}
            />
          </div>

          <Link
            to="/profile"
            title={user?.name || "Profile"}
            aria-label="Profile"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary)]"
          >
            {initial}
          </Link>
        </div>
      </aside>

      <nav className={profileLayout.mobileNav} aria-label="Navigasi akun buyer">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              to={href}
              title={label}
              aria-label={label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                active
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-slate-500",
              )}
            >
              <Icon size={19} />
            </Link>
          );
        })}
      </nav>
    </>
  );
});

export default function ProfileLayout() {
  const { resolvedMode, palette } = useTheme();

  return (
    <div
      data-mode={resolvedMode}
      data-palette={palette}
      className="profile-theme flex h-[100dvh] w-full max-w-full flex-col overflow-hidden bg-white text-slate-900"
    >
      <Navbar />
      <PageTransitionLoader />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <ProfileNavigation />
        <main className="relative min-w-0 max-w-full flex-1 overflow-hidden pb-16 md:pb-0">
          <RouteOutletBoundary className="h-full w-full min-w-0 max-w-full overflow-hidden" />
        </main>
      </div>
    </div>
  );
}
