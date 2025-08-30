import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Copy, Navigation } from "lucide-react";
import UnauthorizedToastHandler from "../ui/Toast";

type Props = {
  address?: string;
  zoom?: number;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function MapBlock({
  address = "299 Green St, San Francisco, CA",
  zoom = 15,
}: Props) {
  const [showToast, setShowToast] = useState<{ message: string; isError: boolean } | null>(null);
  const show = (m: string, isError = false) => {
    setShowToast({ message: m, isError });
    window.setTimeout(() => setShowToast(null), 3000);
  };

  const q = encodeURIComponent(address);
  const mapsEmbed = `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      aria-label="Map"
    >
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-emerald-100">
          <MapPin className="h-4 w-4" />
          {address}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(address).then(
                () => show("Address copied"),
                () => show("Copy failed", true)
              );
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/0 px-3 py-2 text-sm text-emerald-100 transition hover:bg-white/10"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>

          <a
            href={directions}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 shadow-inner shadow-emerald-300/40 transition hover:bg-emerald-500"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </a>
        </div>
      </div>

      {/* map */}
      <div className="relative overflow-hidden rounded-2xl">
        <iframe
          title="Location map"
          src={mapsEmbed}
          className="h-[320px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-emerald-900/0 mix-blend-multiply" />
        <div className="pointer-events-none absolute -inset-8 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(16,185,129,0.18),transparent)]" />
      </div>

      {showToast && (
        <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} />
      )}
    </motion.section>
  );
}
