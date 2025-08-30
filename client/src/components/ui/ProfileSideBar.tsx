import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, LogOut, User as UserIcon, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

type Coords = { top: number; left: number; width: number };

export default function ProfileMenu({ anchorEl, open, onClose }: Props) {
  const { user, logout } = useAuth();
  const [pos, setPos] = useState<Coords>({ top: 0, left: 12, width: 320 });


  const recalc = () => {
    const vw = window.innerWidth;
    const W = Math.min(vw * 0.92, 320);
    let left = 12;
    const safeLeft = (window as any).visualViewport?.offsetLeft ?? 0;
    const margin = Math.max(12 + safeLeft, 12);

    if (anchorEl) {
      const r = anchorEl.getBoundingClientRect();
      left = Math.min(Math.max(r.right - W, margin), vw - W - margin);
      if (vw < 420) left = Math.max(margin, (vw - W) / 2);
      setPos({ top: r.bottom + 10, left, width: W });
    } else {

      left = Math.max(margin, (vw - W) / 2);
      setPos({ top: 64, left, width: W });
    }
  };

  useLayoutEffect(() => {
    if (open) recalc();
  }, [open, anchorEl]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onRecalc = () => recalc();
    window.addEventListener("keydown", onEsc);
    window.addEventListener("resize", onRecalc);
    window.addEventListener("scroll", onRecalc, true);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("resize", onRecalc);
      window.removeEventListener("scroll", onRecalc, true);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const initials = useMemo(() => {
    if (!user?.name && !user?.email) return "U";
    const base = (user?.name || user?.email || "U").trim();
    const p = base.split(" ");
    return ((p[0]?.[0] ?? "U") + (p[1]?.[0] ?? "")).toUpperCase();
  }, [user]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* клик-аут */}
          <motion.button
            aria-label="Close profile menu"
            className="fixed inset-0 z-[60] bg-transparent"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* карточка-меню — всегда в пределах экрана, с прокруткой контента при необходимости */}
          <motion.div
            className="fixed z-[61] overflow-hidden rounded-2xl
                       bg-white/[0.65] dark:bg-white/[0.08] backdrop-blur-xl backdrop-saturate-150
                       shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              maxHeight: "min(70vh, 420px)",
            }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="menu"
            aria-label="Profile menu"
          >
            {/* шапка */}
            <div className="flex items-center gap-3 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-emerald-950 text-sm font-bold">
                {initials}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium text-emerald-950 dark:text-emerald-50">
                  {user?.name || "Your name"}
                </p>
                <p className="truncate text-xs text-emerald-800/80 dark:text-emerald-200/70">
                  {user?.email || "you@example.com"}
                </p>
              </div>
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            {/* список с прокруткой */}
            <div className="max-h-[calc(70vh-90px)] overflow-auto p-1">
              <ul className="space-y-1">
                <MenuItem to="/profile" icon={<UserIcon className="h-4 w-4" />} label="My Profile" onClick={onClose} />
                <MenuItem to="/favorites" icon={<Heart className="h-5 w-5" />} label="Favorites" onClick={onClose} />
              </ul>

              <div className="my-2 h-px bg-black/10 dark:bg-white/10" />

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="group flex w-full items-center justify-between rounded-xl p-3 text-left text-[13px] text-emerald-900 dark:text-emerald-100 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function MenuItem({ to, icon, label, trailing, onClick, }: { to?: string; icon: React.ReactNode; label: string; trailing?: React.ReactNode; onClick?: () => void; }) {
  const content = (
    <div className="group flex items-center justify-between rounded-xl p-3 text-[13px] text-emerald-900 dark:text-emerald-100 hover:bg-black/5 dark:hover:bg-white/5">
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {trailing ?? <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition" />}
    </div>
  );
  return to ? (
    <li role="none">
      <Link role="menuitem" to={to} onClick={onClick} className="block">
        {content}
      </Link>
    </li>
  ) : (
    <li role="menuitem" className="block">
      {content}
    </li>
  );
}
