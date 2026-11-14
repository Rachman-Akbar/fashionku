import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "@/features/order/cart/context/CartContext";
import { CategoryDropdown } from "@/features/catalog/category/components/CategoryDropdown";
import { confirmLogout } from "@/shared/utils/userFeedback";
import { LogOut } from "lucide-react";

function ProfileTooltip({ onClose, onLogout, loading }) {
  const sharedItems = [
    { icon: "person", label: "Profil Saya", path: "/profile" },
    { icon: "location_on", label: "Alamat Saya", path: "/profile/addresses" },
    { icon: "history", label: "Riwayat Transaksi", path: "/cart?tab=order" },
    { icon: "chat", label: "Chat", path: "/chat" },
  ];

  return (
    <div className="absolute right-0 top-full z-[95] mt-2 w-56 overflow-hidden rounded-[10px] border border-slate-200 bg-white py-1">
      {sharedItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex w-full items-center gap-[5px] px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-[#047857]"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-500">
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}

      <hr className="my-1 border-slate-100" />
      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className="flex w-full items-center gap-[5px] px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        {loading ? "Keluar..." : "Logout"}
      </button>
    </div>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const [query, setQuery] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      const scrollingDown = currentY > lastScrollY.current;
      const threshold = 80; // Hide after scrolling down 80px

      if (scrollingDown && currentY > threshold) {
        setNavHidden(true);
      } else if (!scrollingDown) {
        setNavHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--main-nav-offset", navHidden ? "0px" : "96px");
  }, [navHidden]);

  function handleSearch(event) {
    event.preventDefault();

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function closeProfileMenu() {
    setProfileOpen(false);
  }

  async function handleLogout() {
    closeProfileMenu();
    if (logoutPending) return;
    if (!(await confirmLogout())) return;
    setLogoutPending(true);
    try {
      await logout?.();
      queryClient.clear();
      navigate("/", { replace: true });
    } finally {
      setLogoutPending(false);
    }
  }

  function toggleCategory(event) {
    event.preventDefault();
    event.stopPropagation();
    setProfileHover(false);
    setCategoryOpen((current) => !current);
  }

  return (
    <>
      <header className={`relative sticky top-0 z-[80] border-b border-slate-100 bg-white transition-transform duration-300 ease-in-out ${navHidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-between px-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#10B981]">
              smartphone
            </span>
            <span>
              <strong className="text-slate-700">
                Gratis Ongkir + Banyak Promo
              </strong>{" "}
              belanja di Fashionku
            </span>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
          </div>
<div className="hidden items-center gap-5 lg:flex">
            <Link to="/promotions" className="whitespace-nowrap transition-colors hover:text-[#10B981]">Promo</Link>
            <Link to="/cart?tab=order" className="whitespace-nowrap transition-colors hover:text-[#10B981]">Riwayat</Link>
            <Link to="/hubungi-kami" className="whitespace-nowrap transition-colors hover:text-[#10B981]">Hubungi Kami</Link>
            <button
              type="button"
              onClick={() => window.open("/toko-kami", "_blank", "noopener,noreferrer")}
              className="whitespace-nowrap transition-colors hover:text-[#10B981] text-slate-500 font-medium"
            >
              Toko Kami
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4">
          <Link
            to="/"
            className="flex-shrink-0 text-[22px] font-bold leading-none text-[#10B981]"
          >
            Fashionku
          </Link>

          <button
            type="button"
            data-category-trigger="true"
            aria-expanded={categoryOpen}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={toggleCategory}
            className={`btn-kategori-trigger ${categoryOpen ? "is-active" : ""}`}
          >
            <span>Kategori</span>
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${categoryOpen ? "rotate-180" : "rotate-0"}`}
            >
              expand_more
            </span>
          </button>

          <form onSubmit={handleSearch} className="min-w-0 flex-1">
            <div className="flex items-center rounded-lg border border-slate-300 px-3 py-2 transition-all focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-emerald-100">
              <span className="material-symbols-outlined mr-2 flex-shrink-0 text-[20px] text-slate-400">
                search
              </span>
              <input
                className="w-full min-w-0 border-none bg-transparent text-sm outline-none focus:ring-0"
                placeholder="Cari di Fashionku"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-shrink-0 items-center gap-[5px]">
            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-emerald-50 hover:text-[#10B981]"
              aria-label={`Cart${totalItems ? `, ${totalItems} item` : ""}`}
            >
              <span className="material-symbols-outlined text-[22px]">
                shopping_cart
              </span>
              {totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black leading-none text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => {
                  setCategoryOpen(false);
                  setProfileHover(true);
                }}
                onMouseLeave={() => setProfileHover(false)}
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-emerald-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileHover(false);
                  }}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10B981] text-sm font-bold text-white">
                    {(user.name || "G").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[72px] truncate text-sm text-slate-700 lg:inline">
                    {(user.name || "Guest").split(" ")[0]}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    expand_more
                  </span>
                </Link>
                {profileHover && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-[10px] border border-slate-200 bg-white py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex w-full items-center gap-[5px] px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={18} />
                      {loading ? "Keluar..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mx-1 h-6 w-px bg-slate-200" />
                <Link
                  to="/auth/login"
                  className="whitespace-nowrap rounded-lg border border-[#10B981] px-4 py-1.5 text-sm font-bold text-[#047857] transition-all hover:bg-emerald-50"
                >
                  Masuk
                </Link>
                <Link
                  to="/auth/register"
                  className="whitespace-nowrap rounded-lg bg-[#10B981] px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-[#059669]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <CategoryDropdown
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
      />
    </header>
    </>
  );
}
