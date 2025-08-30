import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import UnauthorizedToastHandler from "../ui/Toast";
import type { Plant } from "../../hooks/useHeroData";
import { useState } from "react";

type PlantCardProps = {
  plant: Plant;
  isInCart: boolean;
  quantity: number;
  index?: number;
  isAuthenticated: boolean;
};

export default function PlantCard({ plant, isInCart, quantity, index = 0, isAuthenticated }: PlantCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(plant._id);

  const { addToCart, setQty, increment, decrement, removeFromCart } = useCart();

  const [showToast, setShowToast] = useState<{ message: string; isError: boolean } | null>(null);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowToast({ message: "Please log in to add items to the cart.", isError: true });
      setTimeout(() => setShowToast(null), 4000);
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
    setShowToast({ message: `${plant.name} added to the cart!`, isError: false });
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleChangeQuantity = (newQuantity: number) => {
    setQty(plant._id, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      removeFromCart(plant._id);
      setShowToast({ message: `${plant.name} removed from the cart.`, isError: false });
      setTimeout(() => setShowToast(null), 4000);
    } else {
      decrement(plant._id);
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      setShowToast({ message: "Please log in to add to favorites.", isError: true });
      setTimeout(() => setShowToast(null), 4000);
      return;
    }
    toggleFavorite(plant);
    const action = fav ? "removed from" : "added to";
    setShowToast({ message: `${plant.name} ${action} favorites!`, isError: false });
    setTimeout(() => setShowToast(null), 4000);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ type: "spring", stiffness: 160, damping: 20, delay: index * 0.03 }}
        className="group relative overflow-hidden rounded-[28px] p-4
                   border border-white/10 ring-1 ring-inset ring-white/5
                   bg-gradient-to-br from-white/10 via-white/[0.06] to-white/[0.03]
                   backdrop-blur-xl backdrop-saturate-150
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.35)]"
      >
        {/* Favorite button */}
        <div className="absolute right-3 top-3 z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/10 text-emerald-50 hover:bg-white/20"
          >
            <Heart className={`h-5 w-5 ${fav ? "text-emerald-400" : "text-emerald-100/80"}`} fill={fav ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Image */}
        <motion.div
          className="relative grid place-items-center pt-4"
          whileHover={{ scale: 1.02, rotate: 0.5, y: -2 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.img
            src={`/plants/${plant.imageUrl}`}
            alt={plant.name}
            className="h-40 w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          />
        </motion.div>

        <div className="mt-4">
          <h3 className="text-emerald-50 text-lg font-semibold">{plant.name}</h3>
          <p className="mt-1 text-[13px] text-emerald-100/80 line-clamp-2">
            {plant.description ?? "Perfect for home & office decor."}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-emerald-50 font-semibold">
              $ {typeof plant.price === "number" ? Math.round(plant.price) : "—"}
            </span>

            {isInCart ? (
              <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  onClick={handleDecrement}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/0 text-emerald-100 hover:bg-white/10"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  className="w-10 bg-transparent text-center text-sm text-emerald-50 outline-none"
                  value={quantity}
                  onChange={(e) => {
                    const n = Number(e.target.value.replace(/\D/g, "")) || 0;
                    handleChangeQuantity(n);
                  }}
                />
                <button
                  onClick={() => increment(plant._id)}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/0 text-emerald-100 hover:bg-white/10"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-emerald-50 hover:bg-white/10"
              >
                <ShoppingBag className="h-5 w-5 opacity-90" />
              </button>
            )}
          </div>
        </div>
      </motion.article>


      {showToast && ( <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} /> )}
    </>
  );
}
