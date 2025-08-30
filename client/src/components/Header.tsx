import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, ChevronDown, ChevronRight, Menu, X, Leaf, } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProfileMenu from "../components/ui/ProfileSideBar"

type NavItem =
  | { label: string; href: string; hasDropdown?: false }
  | {
      label: string;
      href: string;
      hasDropdown: true;
      items: { label: string; href: string }[];
    };

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Plants Type",
    href: "",
    hasDropdown: true,
    items: [
      { label: "Indoor Plants", href: "/indoor-plants" },
      { label: "Outdoor Plants", href: "/outdoor-plants" },
      { label: "Succulents", href: "/succulents" },
      { label: "Air Purifying", href: "/air-purifying" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { cartItems } = useCart(); 
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  // popover для профиля
  const [profileOpen, setProfileOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);

  // инициалы
  const initials = useMemo(() => {
    if (!user?.name && !user?.email) return "U";
    const s = (user?.name || user?.email || "U").trim().split(" ");
    return ((s[0]?.[0] ?? "U") + (s[1]?.[0] ?? "")).toUpperCase();
  }, [user]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 14 }}
        className="mx-auto mt-3 w-[min(1200px,95%)] rounded-2xl border border-white/10 bg-emerald-950/60 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/40 shadow-lg shadow-emerald-950/20"
        role="navigation"
        aria-label="Main"
      >
        <div className="flex items-center gap-2">
          {/* Лого */}
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-xl px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-emerald-600/90 text-white shadow-md shadow-emerald-900/30">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <span className="block text-sm tracking-wide text-emerald-200">
                Planto
              </span>
              <span className="block -mt-0.5 text-[10px] text-emerald-400/80">
                . since 2022
              </span>
            </div>
          </Link>

          {/* Десктоп-меню */}
          <div className="ml-1 hidden flex-1 items-center justify-center md:flex">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="relative">
                  {"hasDropdown" in link && link.hasDropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        onBlur={(e) => {
                          if (
                            !e.currentTarget.parentElement?.contains(
                              e.relatedTarget as Node
                            )
                          ) {
                            setDropdownOpen(false);
                          }
                        }}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="menu"
                        className="group flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-emerald-100/90 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-1/2 z-40 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-emerald-900/90 p-1 shadow-2xl backdrop-blur"
                            role="menu"
                          >
                            {link.items.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-emerald-100/90 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                role="menuitem"
                              >
                                {item.label}
                                <ChevronRight className="h-4 w-4 opacity-60" />
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="rounded-xl px-3 py-2 text-sm text-emerald-100/90 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Правые экшены */}
          <div className="ml-auto flex items-center gap-1 md:gap-2">
            {/* Поиск */}
            <button
              type="button"
              aria-label="Search"
              className="relative inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Аккаунт */}
            {isAuthenticated ? (
              <>
                <button
                  ref={avatarRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                  className="relative inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-emerald-950 text-xs font-bold shadow-inner">
                    {initials}
                  </span>
                </button>

                {/* Popover под аватаром */}
                <ProfileMenu
                  open={profileOpen}
                  anchorEl={avatarRef.current}
                  onClose={() => setProfileOpen(false)}
                />
              </>
            ) : (
              <Link
                to="/login"
                className="relative inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Login"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Корзина — бейдж из реального количества */}
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-emerald-950 shadow-md shadow-emerald-900/30">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Бургер для мобилки */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(true)}
              className="ml-1 inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Мобильный дровер */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className="fixed right-0 top-0 z-50 h-full w-[min(88vw,380px)] overflow-y-auto border-l border-white/10 bg-emerald-950/95 p-4 backdrop-blur"
              aria-label="Mobile menu"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shadow">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium tracking-wide text-emerald-200">
                    Planto
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded-xl p-2 text-emerald-100 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-2">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      {"hasDropdown" in link && link.hasDropdown ? (
                        <details className="group rounded-2xl border border-white/5 bg-white/0 p-1 open:bg-white/[0.03]">
                          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-emerald-100/90 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-400">
                            <span>{link.label}</span>
                            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                          </summary>
                          <div className="mt-1 space-y-1">
                            {link.items.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-emerald-100/90 transition hover:bg-white/5"
                                onClick={() => setMobileOpen(false)}
                              >
                                {item.label}
                                <ChevronRight className="h-4 w-4 opacity-60" />
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          to={link.href}
                          className="block rounded-xl px-3 py-2 text-emerald-100/90 transition hover:bg-white/5"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 p-4 text-emerald-100">
                  <p className="text-sm/6 opacity-90">
                    Trendy house plants, delivered fresh. Explore our curated collection
                    and bring a breath of nature into your home.
                  </p>
                </div>

                <p className="mt-6 text-center text-[11px] text-emerald-300/60">
                  © {new Date().getFullYear()} Planto
                </p>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
