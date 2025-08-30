import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Spinner from "../ui/Spinner";
import SectionHeading from "../ui/SectionH";
import Card from "../ui/Card";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import type { Plant } from "../../hooks/useHeroData";
import type { CartItem } from "../../context/CartContext";

type ListResponse = {
  items: Plant[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

const API = import.meta.env.VITE_API_URL ?? "";

async function fetchPlants(page = 1, limit = 3, signal?: AbortSignal): Promise<ListResponse> {
  const r = await fetch(`${API}/api/plants?page=${page}&limit=${limit}`, { signal });
  if (!r.ok) throw new Error("Failed to load plants");
  return r.json();
}

export default function TopSelling() {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [items, setItems] = useState<Plant[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [, setErr] = useState<string | null>(null);
  const pageSize = 3;

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setInitialLoading(true);
        const data = await fetchPlants(1, pageSize, ac.signal);
        setItems(data.items);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Load error");
      } finally {
        setInitialLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await fetchPlants(next, pageSize);
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage(next);
    } catch (e: any) {
      setErr(e?.message ?? "Load more error");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section id="top-selling" className="relative mx-auto w-[min(1200px,95%)] py-14 sm:py-16">
      <SectionHeading>Our Top Selling</SectionHeading>

      {initialLoading && <Spinner />}

      <AnimatePresence initial={false}>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const cartItem = cartItems.find((item: CartItem) => item.productId === p._id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <Card
                key={p._id}
                plant={p}
                isInCart={quantity > 0}
                quantity={quantity}
                index={i}
                isAuthenticated={user != null}
              />
            );
          })}
        </div>
      </AnimatePresence>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-emerald-100 hover:bg-white/10 disabled:opacity-60"
          >
            {loadingMore ? "Loading..." : "Show more"}
          </button>
        </div>
      )}
    </section>
  );
}
