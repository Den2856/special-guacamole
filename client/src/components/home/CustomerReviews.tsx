import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Spinner from "../ui/Spinner";
import SectionHeading from "../ui/SectionH";

type Review = {
  _id: string;
  rating?: number;
  text?: string;
  content?: string;
  role?: string;
  userName?: string;
  avatarUrl?: string;
};

const API = import.meta.env.VITE_API_URL ?? "";

// Получение всех отзывов
async function fetchReviews(limit = 6, signal?: AbortSignal): Promise<Review[]> {
  const r = await fetch(`${API}/api/reviews?limit=${limit}`, { signal });
  if (!r.ok) throw new Error("Failed to load reviews");
  return r.json();
}

export default function CustomerReviews({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const data = await fetchReviews(limit, ac.signal);
        setItems(data);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Load error");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [limit]);

  return (
    <section id="reviews" className="relative mx-auto w-[min(1200px,95%)] py-14 sm:py-16">
      <SectionHeading>Customer Review</SectionHeading>
      {loading && <Spinner />}

      <AnimatePresence initial={false}>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <ReviewCard key={r._id} review={r} index={i} />
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const name = review.userName ?? "Anonymous";
  const avatar = review.avatarUrl;
  const rating = Math.max(0, Math.min(5, Math.round(review.rating ?? 5)));
  const text = review.content ?? review.text ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-[28px] p-5 -z-1
                 border border-white/10 ring-1 ring-inset ring-white/5
                 bg-gradient-to-br from-white/10 via-white/[0.06] to-white/[0.03]
                 backdrop-blur-xl backdrop-saturate-150
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={`/avatars/${review.avatarUrl}`} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20 text-emerald-200">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-emerald-50 font-semibold leading-tight">{name}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-current text-emerald-400" : "text-emerald-100/40"}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-emerald-100/85 text-sm leading-relaxed">{text}</p>
    </motion.article>
  );
}
