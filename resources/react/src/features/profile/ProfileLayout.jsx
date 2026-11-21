import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BellRing,
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
import { RailTooltip, useRailTooltip } from "@/shared/layout/RailTooltip";

const NAV_ITEMS = [
  { href: "/profile", label: "Biodata", icon: UserRound },
  { href: "/profile/chat", label: "Chat", icon: MessageSquare },
  { href: "/profile/notifications", label: "Notifikasi", icon: BellRing },
  { href: "/profile/payments", label: "Pembayaran", icon: WalletCards },
  { href: "/profile/appearance", label: "Tampilan", icon: Palette },
  { href: "/profile/help", label: "Pusat Bantuan", icon: LifeBuoy },
];

function isActive(pathname, href) {
  if (href === "/profile") return pathname === "/profile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function RailIconButton({ to, label, icon: Icon, active, onShowTip, onClearTip }) {
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onMouseEnter={(event) => onShowTip(event, label)}
      onMouseLeave={onClearTip}
      onFocus={(event) => onShowTip(event, label)}
      onBlur={onClearTip}
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
  );
}

const ProfileNavigation = memo(function ProfileNavigation() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { resolvedMode, toggleMode } = useTheme();
  const { tooltip, showTip, clearTip } = useRailTooltip();
  const initial = user?.name?.slice(0, 1)?.toUpperCase() || "R";
  const ThemeIcon = resolvedMode === "dark" ? Sun : Moon;
  const themeLabel = resolvedMode === "dark" ? "Mode terang" : "Mode gelap";

  return (
    <>
      <aside className={cn(profileLayout.rail, "relative z-30")}>
        <nav className="flex w-full flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <RailIconButton
              key={item.href}
              to={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(pathname, item.href)}
              onShowTip={showTip}
              onClearTip={clearTip}
            />
          ))}
        </nav>

        <div className="flex w-full flex-col items-center gap-2">
          <button
            type="button"
            onClick={toggleMode}
            onMouseEnter={(event) => showTip(event, themeLabel)}
            onMouseLeave={clearTip}
            onFocus={(event) => showTip(event, themeLabel)}
            onBlur={clearTip}
            aria-label={
              resolvedMode === "dark"
                ? "Aktifkan mode terang"
                : "Aktifkan mode gelap"
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
          >
            <ThemeIcon size={19} />
          </button>

          <Link
            to="/profile"
            title={user?.name || "Profile"}
            aria-label="Profile"
            onMouseEnter={(event) => showTip(event, user?.name || "Profil saya")}
            onMouseLeave={clearTip}
            onFocus={(event) => showTip(event, user?.name || "Profil saya")}
            onBlur={clearTip}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-hover)]"
          >
            {initial}
          </Link>
        </div>

        <RailTooltip tooltip={tooltip} />
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
      <PageTransitionLoader variant="below-header" />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <ProfileNavigation />
        <main className="relative min-w-0 max-w-full flex-1 overflow-hidden pb-16 md:pb-0">
          <RouteOutletBoundary className="h-full w-full min-w-0 max-w-full overflow-hidden" />
        </main>
      </div>
    </div>
  );
}
