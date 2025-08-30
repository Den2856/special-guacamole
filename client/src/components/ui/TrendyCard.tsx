import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import UnauthorizedToastHandler from "../ui/Toast";
import type { Plant } from "../../hooks/useHeroData";

type TrendyCardProps = {
  plant: Plant;
  flip?: boolean;
  quantity: number;
  isInCart: boolean;
  isAuthenticated: boolean;
  handleAddToFavorites: () => void;
  handleAddToCart: () => void;
};

export default function TrendyCard({ plant, flip, quantity, isAuthenticated, handleAddToFavorites, handleAddToCart, }: TrendyCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, increment, decrement, removeFromCart } = useCart();

  const [showToast, setShowToast] = useState<{ message: string; isError: boolean } | null>(null);
  const fav = plant?._id && isFavorite(plant._id);

  const show = (message: string, isError = false) => {
    setShowToast({ message, isError });
    window.setTimeout(() => setShowToast(null), 4000);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeFromCart(plant._id);
      show(`${plant.name} removed from the cart.`);
    } else {
      decrement(plant._id);
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      try { handleAddToFavorites?.(); } catch {}
      show("Please log in to add to favorites.", true);
      return;
    }
    toggleFavorite(plant);
    const action = fav ? "removed from" : "added to";
    show(`${plant.name} ${action} favorites!`);
  };

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      try { handleAddToCart?.(); } catch {}
      show("Please log in to add items to the cart.", true);
      return;
    }
    const payload = {
      id: plant._id,
      name: plant.name,
      price: plant.price ?? 0,
      imagePath: `/plants/${plant.imageUrl}`,
      quantity: 1,
      type: "plant",
    };
    addToCart(payload);
    show(`${plant.name} added to the cart!`);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative overflow-hidden rounded-[38px] p-4 sm:p-6 border border-white/15 ring-1 ring-inset ring-white/10 bg-gradient-to-br from-white/12 via-white/[0.08] to-white/[0.04] bg-clip-padding backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_60px_rgba(0,0,0,0.35)]"
      >
        {/* Favorite Button */}
        <div className="absolute right-4 top-4 z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur text-emerald-50 hover:bg-white/20"
          >
            <Heart
              className={`h-5 w-5 transition ${fav ? "text-emerald-400" : "text-emerald-100/80"}`}
              fill={fav ? "currentColor" : "none"}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className={`relative grid items-center gap-4 sm:gap-6 ${flip ? "md:grid-cols-[1fr_1.1fr]" : "md:grid-cols-[1.1fr_1fr]"}`}>
          {/* Image */}
          <motion.div
            className={`order-1 ${flip ? "md:order-2" : ""} grid place-items-center`}
            whileHover={{ rotate: flip ? -4.5 : 4.5, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 160, damping: 12 }}
          >
            <motion.img
              src={`/plants/${plant.imageUrl}`}
              alt={plant.name}
              className="h-96 w-auto sm:h-64 md:h-72 object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* Text Block */}
          <div className={`order-2 ${flip ? "md:order-1" : ""} px-2 sm:px-3`}>
            <p className="text-[24px] uppercase text-emerald-200/90">{"For Fresh Decs Ai Plat"}</p>
            <h3 className="mt-1 text-lg font-semibold text-emerald-50 sm:text-xl">{plant.name}</h3>
            <p className="mt-2 max-w-prose text-[14px] text-emerald-100/90 sm:text-[18px]">{plant.description}</p>
            <p className="mt-4 text-emerald-50">
              <span className="text-2xl opacity-80">$</span>
              <span className="text-2xl font-semibold">
                {typeof plant.price === "number" ? Math.round(plant.price) : "—"}
              </span>
            </p>

            <div className="mt-4 flex items-center gap-3">
              <motion.a
                href="#explore"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-md text-emerald-100 backdrop-blur transition hover:bg-white/10"
              >
                Explore
                <ArrowRight className="h-4 w-4" />
              </motion.a>

              {quantity > 0 ? (
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={handleDecrement}
                    className="inline-flex items-center justify-center p-2 text-emerald-50 hover:bg-white/10"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-emerald-50">{quantity}</span>
                  <button
                    onClick={() => increment(plant._id)}
                    className="inline-flex items-center justify-center p-2 text-emerald-50 hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/0 p-2 text-emerald-100 hover:bg-white/10"
                >
                  <ShoppingBag className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>

      {showToast && ( <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} /> )}
    </>
  );
}
