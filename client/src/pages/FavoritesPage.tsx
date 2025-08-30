import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart, addItem } = (useCart() as any);

  const toCart = (p: any) => {
    const payload = {
      id: p._id,
      name: p.name,
      price: p.price ?? 0,
      imagePath: `/plants/${p.imageUrl}`,
      quantity: 1,
      type: "plant",
    };
    if (typeof addToCart === "function") addToCart(payload);
    else if (typeof addItem === "function") addItem(payload);
  };

  return (
    <>
      <Header />
      <section className="mx-auto w-[min(1200px,95%)] pt-28 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-emerald-50">Favorites</h1>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-emerald-50 hover:bg-white/20"
            >
              Clear all
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {favorites.map((p) => (
                <motion.article
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  className="relative overflow-hidden rounded-3xl bg-white/[0.06] p-4 backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_60px_rgba(0,0,0,0.35)]"
                >
                  <img
                    src={`/plants/${p.imageUrl}`}
                    alt={p.name}
                    className="mx-auto h-44 w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)]"
                  />
                  <h3 className="mt-3 line-clamp-1 text-emerald-50 font-semibold">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-emerald-200/85">{p.description}</p>
                  <p className="mt-2 text-emerald-50">
                    <span className="opacity-80">$</span>{" "}
                    <span className="text-lg font-semibold">{p.price ?? "—"}</span>
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => toCart(p)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-emerald-50 hover:bg-white/20"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to cart
                    </button>
                    <button
                      onClick={() => removeFavorite(p._id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/0 px-3 py-2 text-emerald-100 hover:bg-white/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Heart className="h-4 w-4" />
                  </span>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  );
}

function Empty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid place-items-center rounded-3xl bg-white/[0.06] p-10 backdrop-blur-xl backdrop-saturate-150 text-center text-emerald-100"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-900/20">
        <Heart className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">No favorites yet</h2>
      <p className="mt-1 text-sm text-emerald-200/80">Tap the heart on any plant to save it here.</p>
    </motion.div>
  );
}
