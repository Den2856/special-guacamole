import React from "react";
import { Link } from "react-router-dom";

type IconButtonProps = {
  children: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  className?: string;
  disabled?: boolean;
};

export default function IconButton({ children, label, onClick, badge, href, target, className, disabled, }: IconButtonProps) {
  const base =
    "relative inline-flex items-center justify-center rounded-xl p-2 " +
    "text-emerald-100 outline-none transition hover:bg-white/5 " +
    "focus-visible:ring-2 focus-visible:ring-emerald-400 " +
    "disabled:opacity-50 disabled:pointer-events-none";
  const classes = className ? `${base} ${className}` : base;

  const Badge =
    typeof badge === "number" && badge > 0 ? (
      <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-emerald-950 shadow-md shadow-emerald-900/30">
        {badge}
      </span>
    ) : null;

  if (href) {
    return (
      <Link
        to={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={classes}
        aria-label={label}
        title={label}
      >
        {children}
        {Badge}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
      {Badge}
    </button>
  );
}
