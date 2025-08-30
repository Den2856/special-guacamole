import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight, Play, ArrowRight, Heart, ShoppingBag, Star } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import UnauthorizedToastHandler from "../ui/Toast";

type Plant = {
  _id: string;
  name: string;
  subtitle?: string;
  price?: number;
  imageUrl: string;
  rating?: number | string;
};

type Review = {
  _id: string;
  userName: string;
  avatarUrl: string;
  rating: number | string;
  text: string;
};

const API = import.meta.env.VITE_API_URL ?? "";

async function fetchFeaturedPlants(signal?: AbortSignal): Promise<Plant[]> {
  const res = await fetch(`${API}/api/plants/featured`, { signal });
  if (!res.ok) throw new Error("Failed to load featured plants");
  return res.json();
}

async function fetchHighlighted(limit = 2, signal?: AbortSignal): Promise<Review[]> {
  const res = await fetch(`${API}/api/reviews/highlight?limit=${limit}`, { signal });
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json();
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function useAutoPlay(max: number, delay = 4200, pauseRef?: React.RefObject<Element | null>) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!max) return;
    let id: number | null = null;
    const start = () =>
      (id = window.setInterval(() => setIndex((i) => (i + 1) % max), delay));
    const stop = () => {
      if (id) window.clearInterval(id);
    };
    start();
    const node = pauseRef?.current;
    if (node) {
      const onEnter = () => stop();
      const onLeave = () => start();
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
      return () => {
        stop();
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      };
    }
    return () => stop();
  }, [max, delay, pauseRef]);
  return [index, setIndex] as const;
}

const TITLE = "Breath Natureal";

export default function Hero() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<{ message: string; isError: boolean } | null>(null);

  // helper: автоскрытие через 4s
  const show = (message: string, isError = false) => {
    setShowToast({ message, isError });
    window.setTimeout(() => setShowToast(null), 4000);
  };

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const [p, r] = await Promise.all([
          fetchFeaturedPlants(ac.signal),
          fetchHighlighted(2, ac.signal),
        ]);
        setPlants(p);
        setReviews(r);
      } catch {
        /* ignore errors */
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const [activePlant, setActivePlant] = useAutoPlay(Math.max(plants.length, 1), 4200, cardRef);
  const [activeReview] = useAutoPlay(Math.max(reviews.length, 1), 6000);

  const plant = plants[activePlant];
  const review = reviews[activeReview];

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useTransform(mvX, [-20, 20], [8, -8]);
  const rotateY = useTransform(mvY, [-20, 20], [-8, 8]);

  const onTilt = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mvX.set(clamp((y - 0.5) * 40, -20, 20));
    mvY.set(clamp((x - 0.5) * 40, -20, 20));
  };
  const resetTilt = () => {
    mvX.set(0);
    mvY.set(0);
  };

  const { user } = useAuth();
  const { addToCart, addItem } = useCart() as any;
  const { toggleFavorite, isFavorite } = useFavorites();

  const addPlantToCart = () => {
    if (!user) {
      show("Please log in to add items to the cart.", true);
      return;
    }
    if (plant) {
      const payload = {
        id: plant._id,
        name: plant.name,
        price: plant.price ?? 0,
        imagePath: `/plants/${plant.imageUrl}`,
        quantity: 1,
        type: "plant",
      };
      if (typeof addToCart === "function") addToCart(payload);
      else if (typeof addItem === "function") addItem(payload);
      show(`${plant.name} added to the cart!`);
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      show("Please log in to add favorites.", true);
      return;
    }
    if (plant) {
      const wasFav = isFavorite(plant._id);
      toggleFavorite(plant);
      const action = wasFav ? "removed from" : "added to";
      show(`${plant.name} ${action} favorites!`);
    }
  };

  const fav = isFavorite(plant?._id);

  const chars = useMemo(() => TITLE.split("").map((c, i) => ({ c, i })), []);

  return (
    <section id="hero" className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-16">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f1d14]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_65%_55%,rgba(255,255,255,0.08),transparent)]" />
      </div>

      <div className="mx-auto grid w-[min(1200px,100%)] items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Block */}
        <div>
          <h1 className="mb-3 font-semibold tracking-tight text-emerald-50 [text-wrap:balance] text-[clamp(36px,6.5vw,72px)] leading-[1.05]">
            {chars.map(({ c, i }) => (
              <motion.span
                key={i}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.02 * i, duration: 0.5, ease: "easeOut" }}
                className={c === " " ? "inline-block w-2" : "inline-block"}
              >
                {c}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="max-w-xl text-[13.5px] text-emerald-200/85 sm:text-[15px]"
          >
            Discover the beauty of nature with our carefully curated selection of indoor plants. Perfect for bringing life to your home or office. Start your journey to a greener, healthier space today with Planto.
          </motion.p>

          <div className="mt-6 flex items-center gap-4">
            <motion.a
              href="#trendy"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-emerald-100 shadow-inner shadow-white/5 backdrop-blur transition hover:bg-white/10"
            >
              Explore
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 text-emerald-100/90"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition group-hover:bg-white/10">
                <Play className="h-4 w-4" />
              </span>
              <span className="text-sm">Live Demo…</span>
            </motion.button>
          </div>

          {/* Reviews */}
          {review && (
            <div className="mt-6 lg:top-6">
              <div className="min-h-[120px] w-full max-w-[420px]">
                <AnimatePresence mode="wait" initial={false}>
                  {review && (
                    <motion.div
                      key={`${review._id}-${activeReview}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-emerald-100 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -18, scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 130, damping: 16 }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`/avatars/${review.avatarUrl}`}
                          alt={review.userName}
                          className="h-10 w-10 rounded-full ring-2 ring-white/20 object-fit"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium">
                            {review.userName}
                          </p>
                          <Stars value={review.rating} />
                        </div>
                      </div>
                      <p className="mt-3 line-clamp-3 text-xs text-emerald-200/85">
                        {review.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Right: Featured Plant Card */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-black/25 blur-2xl" />
          <motion.div
            ref={cardRef}
            onMouseMove={onTilt}
            onMouseLeave={resetTilt}
            style={{ rotateX, rotateY }}
            className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur"
          >
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <button
                onClick={handleToggleFavorite}
                aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur text-emerald-50 hover:bg-white/20"
              >
                <Heart
                  className={`h-5 w-5 ${fav ? "text-emerald-400" : "text-emerald-100/80"}`}
                  fill={fav ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={addPlantToCart}
                aria-label="Add to cart"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur text-emerald-50 hover:bg-white/20"
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
              <AnimatePresence initial={false} mode="popLayout">
                {!!plant && !loading && (
                  <motion.img
                    key={plant._id}
                    src={`/plants/${plant.imageUrl}`}
                    alt={plant.name}
                    className="absolute inset-0 -top-48 m-auto h-[78%] w-auto object-contain drop-shadow-[0_50px_70px_rgba(0,0,0,0.55)]"
                    initial={{ opacity: 0, y: 22, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                )}
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 space-y-2 p-4">
                <p className="text-[11px] uppercase tracking-wider text-emerald-200/70">Trendy House Plant</p>
                <h3 className="text-lg font-semibold text-emerald-50">{plant?.name ?? "Loading…"}</h3>
                <div className="flex items-center justify-between">
                  <a href="#top-selling" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-emerald-100 backdrop-blur transition hover:bg-white/10">
                    Buy Now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <ChevronRight className="h-5 w-5 text-emerald-200/70" />
                </div>
              </div>
            </div>

            {/* pagination dots */}
            <div className="mt-3 flex justify-center gap-2">
              {plants.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePlant(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activePlant ? "w-6 bg-emerald-400" : "w-2 bg-emerald-300/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast — рендерится через портал в body и всегда поверх */}
      {showToast && ( <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} /> )}
    </section>
  );
}

function Stars({ value = 0 }: { value?: number | string }) {
  const full = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < full ? "text-emerald-400" : "text-emerald-300/40"}`}
          fill={i < full ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}
