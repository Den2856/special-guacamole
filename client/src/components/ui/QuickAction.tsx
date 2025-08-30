import React from "react";
import { Link } from "react-router-dom";

type QuickActionProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  target?: React.HTMLAttributeAnchorTarget;
  className?: string;
};

export default function QuickAction({icon, label, href, onClick, target, className,}: QuickActionProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl " +
    "border border-white/10 bg-white/5 px-3 py-2 text-sm text-emerald-100/90 " +
    "transition hover:bg-white/10 focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-emerald-400";
  const classes = className ? `${base} ${className}` : base;

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
        {icon}
        <span className="text-xs">{label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
