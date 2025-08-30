import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import type { CartItem } from "../context/CartContext";


export default function CartPage() {
  const { cartItems, removeItem, clearCart, increment, decrement, setQty, subtotal, totalQty } = useCart();
  
  const cartCount = cartItems ? cartItems.length : 0;

  const delivery = 0;
  const total = useMemo(() => subtotal + delivery, [subtotal]);

  return (
    <>
      <Header />
      <section className="mx-auto w-[min(1200px,95%)] pt-28 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-emerald-50">Your Cart</h1>
          {cartCount > 0 && (
            <button
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-emerald-50 hover:bg-white/20"
              onClick={clearCart}
            >
              Clear cart
            </button>
          )}
        </div>

        {cartCount === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* items */}
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {cartItems.map((it: CartItem) => (
                  <motion.li
                    key={it.key}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16 }}
                    className="relative overflow-hidden rounded-3xl  bg-white/[0.06] p-4
                               backdrop-blur-xl backdrop-saturate-150
                               shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-4">
                      <div className="overflow-hidden rounded-2xl bg-white/5">
                        <img src={it.imagePath} alt={it.name} className="h-24 w-24 object-contain" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-emerald-50 font-medium">{it.name}</p>
                        {it.variantKey && (
                          <p className="mt-0.5 text-xs text-emerald-200/80">Variant: {it.variantKey}</p>
                        )}

                        {/* qty control */}
                        <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                          <button
                            onClick={() => decrement(it.key)}
                            className="grid h-7 w-7 place-items-center rounded-lg bg-white/0 text-emerald-100 hover:bg-white/10"
                            aria-label="Decrease"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            className="w-10 bg-transparent text-center text-sm text-emerald-50 outline-none"
                            value={it.quantity}
                            onChange={(e) => {
                              const n = Number(e.target.value.replace(/\D/g, "")) || 0;
                              setQty(it.key, n);
                            }}
                          />
                          <button
                            onClick={() => increment(it.key)}
                            className="grid h-7 w-7 place-items-center rounded-lg bg-white/0 text-emerald-100 hover:bg-white/10"
                            aria-label="Increase"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="text-emerald-50">
                          <span className="text-sm opacity-70">$</span>
                          <span className="text-lg font-semibold">
                            {Math.round(it.price * it.quantity)}
                          </span>
                        </p>
                        <button
                          onClick={() => removeItem(it.key)}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-emerald-50 hover:bg-white/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* summary */}
            <motion.aside
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
              className="lg:sticky lg:top-24 h-max rounded-3xl bg-white/[0.06] p-5
                         backdrop-blur-xl backdrop-saturate-150
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <h2 className="text-lg font-semibold text-emerald-50">Summary</h2>
              <div className="mt-4 space-y-2 text-emerald-100">
                <Row label={`Items (${totalQty})`} value={`$ ${Math.round(subtotal)}`} />
                <Row label="Delivery" value="$ 0" />
                <div className="h-px bg-white/10 my-3" />
                <Row label="Total" value={`$ ${Math.round(total)}`} bold />
              </div>

              <button
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/20
                           bg-emerald-400/95 px-4 py-3 text-emerald-900 font-semibold shadow
                           hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400"
                onClick={() => alert("Proceed to checkout")}
              >
                Checkout
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.aside>
          </div>
        )}
      </section>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-semibold" : "opacity-80"}`}>{label}</span>
      <span className={`text-sm ${bold ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid place-items-center rounded-3xl bg-white/[0.06] p-10
                 backdrop-blur-xl backdrop-saturate-150 text-center text-emerald-100"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-900/20">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
      <p className="mt-1 text-sm text-emerald-200/80">
        Explore plants and add your favorites to the cart.
      </p>
      <motion.a
        href="/"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-emerald-50 hover:bg-white/20"
      >
        Start shopping
      </motion.a>
    </motion.div>
  );
}
