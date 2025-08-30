import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Spinner from "../ui/Spinner";
import SectionHeading from "../ui/SectionH";
import TrendyCard from "../ui/TrendyCard";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import UnauthorizedToastHandler from "../ui/Toast";
import type { Plant } from "../../hooks/useHeroData";  

const API = import.meta.env.VITE_API_URL ?? "";

async function fetchTrendyPlants(limit = 2, signal?: AbortSignal): Promise<Plant[]> {
  const res = await fetch(`${API}/api/plants/trendy?limit=${limit}`, { signal });
  if (!res.ok) throw new Error("Failed to load trendy plants");
  return res.json();
}

export default function TrendyPlants({ limit = 2 }: { limit?: number }) {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setErr] = useState<string | null>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const items = await fetchTrendyPlants(limit, ac.signal);
        setPlants(items);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Load error");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [limit]);

  const handleAddToFavorites = () => {
    if (!user) {
      setMessage("You need to log in to add to favorites!");
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setMessage("Please log in to add items to the cart!");
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <section id="trendy" className="relative mx-auto w-[min(1200px,95%)] py-14 sm:py-16">
      <SectionHeading>Our Trendy Plants</SectionHeading>

      {loading && <Spinner />}

      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {plants.map((p, idx) => {
            if (!p || !p._id) return null;

            const cartItem = cartItems.find((item: { productId: string }) => item.productId === p._id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <TrendyCard
                key={p._id}
                plant={p}
                quantity={quantity}
                isInCart={quantity > 0}
                flip={idx % 2 === 1}
                isAuthenticated={user != null}
                handleAddToFavorites={handleAddToFavorites}
                handleAddToCart={handleAddToCart}
              />
            );
          })}
        </AnimatePresence>
      </div>
      
      {showToast && <UnauthorizedToastHandler message={message} isError={isError} />}
    </section>
  );
}
