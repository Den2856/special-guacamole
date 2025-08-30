import React from "react";
import { motion } from "framer-motion";
import type { JSX } from "react/jsx-runtime";

type Align = "left" | "center" | "right";
type Size = "sm" | "md" | "lg";

type SectionHeadingProps = {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  align?: Align;
  size?: Size;
  className?: string;
  accentFrom?: string;
  accentTo?: string;
  showCorners?: boolean;
};

const cx = (...cls: Array<string | false | null | undefined>) =>
  cls.filter(Boolean).join(" ");

export default function SectionHeading({
  children,
  as = "h2",
  align = "center",
  size = "md",
  className,
  accentFrom = "#55B000",
  accentTo = "#50790B",
  showCorners = true,
}: SectionHeadingProps) {
  const Tag = as as any;

  const alignCls =
    align === "left"
      ? "mx-0 ml-0 text-left"
      : align === "right"
      ? "mx-0 mr-0 text-right"
      : "mx-auto text-center";

  const sizeCls =
    size === "sm"
      ? "text-[clamp(16px,4vw,22px)]"
      : size === "lg"
      ? "text-[clamp(22px,5.5vw,36px)]"
      : "text-[clamp(18px,4.6vw,28px)]";

  const gradH = `linear-gradient(90deg, ${accentFrom}, ${accentTo})`;
  const gradV = `linear-gradient(180deg, ${accentFrom}, ${accentTo})`;
  const gradHRev = `linear-gradient(270deg, ${accentFrom}, ${accentTo})`;
  const gradVRev = `linear-gradient(0deg, ${accentFrom},  ${accentTo})`;

  return (
    <div className={cx("relative w-max select-none mb-6", alignCls, className)}>
      {/* Сам заголовок */}
      <Tag className={cx("font-semibold tracking-tight text-emerald-50", sizeCls)}>
        {children}
      </Tag>

      {/* Декоративные уголки */}
      {showCorners && (
        <>
          {/* Top-right */}
          <div className="pointer-events-none absolute -right-4 -top-3 flex flex-col items-end gap-1">
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ transformOrigin: "right", background: gradH  }}
              className={cx(
                "h-[6px] relative top-2 w-14 rounded-full bg-gradient-to-r",
                accentFrom,
                accentTo
              )}
            />
            <motion.span
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              style={{ transformOrigin: "top", background: gradV }}
              className={cx(
                "h-8 w-[6px] rounded-full bg-gradient-to-b",
                accentFrom,
                accentTo
              )}
            />
          </div>

          {/* Bottom-left */}
          <div className="pointer-events-none absolute -left-3 -bottom-1 flex flex-col gap-1">
            <motion.span
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              style={{ transformOrigin: "bottom", background: gradVRev }}
              className={cx( "h-8 w-[6px] relative top-2.5 rounded-full bg-gradient-to-t" )}
            />
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ transformOrigin: "left", background: gradHRev }}
              className={cx( "h-[6px] w-14 rounded-full bg-gradient-to-l" )}
            />
          </div>
        </>
      )}
    </div>
  );
}
