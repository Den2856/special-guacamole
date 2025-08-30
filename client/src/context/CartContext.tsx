import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";

type AddItemInput = {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  imagePath: string;
  quantity?: number;
  variantKey?: string;
  type?: string;
};

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  imagePath: string;
  quantity: number;
  variantKey?: string;
  type?: string;
};

type State = { items: CartItem[] };

type Action =
  | { type: "ADD"; payload: AddItemInput }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; qty: number }
  | { type: "INCREMENT"; key: string }
  | { type: "DECREMENT"; key: string }
  | { type: "CLEAR" };

const LS_KEY = "planto:cart:v1";

function makeKey(productId: string, variantKey?: string) {
  return `${productId}${variantKey ? `::${variantKey}` : ""}`;
}

function loadInitialState(): State {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return { items: Array.isArray(parsed) ? parsed : [] };
  } catch {
    return { items: [] };
  }
}

// Reducer for handling cart actions
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const productId = action.payload.productId || action.payload.id;
      if (!productId) return state;

      const qty = Math.max(1, Math.floor(action.payload.quantity ?? 1));
      const key = makeKey(productId, action.payload.variantKey);

      const exists = state.items.find((i) => i.key === key);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }

      const next: CartItem = {
        key,
        productId,
        name: action.payload.name,
        price: action.payload.price,
        imagePath: action.payload.imagePath,
        quantity: qty,
        variantKey: action.payload.variantKey,
        type: action.payload.type,
      };
      return { items: [next, ...state.items] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.key !== action.key) };

    case "SET_QTY": {
      const qty = Math.max(0, Math.floor(action.qty));
      if (qty === 0) {
        return { items: state.items.filter((i) => i.key !== action.key) };
      }
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, quantity: qty } : i
        ),
      };
    }

    case "INCREMENT": {
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }

    case "DECREMENT": {
      return {
        items: state.items.map((i) =>
          i.key === action.key && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<any>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as State, loadInitialState);

  const removeFromCart = (productId: string) => {
    const key = makeKey(productId);
    dispatch({ type: "REMOVE", key });
  };

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  const addToCart = (item: CartItem) => dispatch({ type: "ADD", payload: item });
  const removeItem = (key: string) => dispatch({ type: "REMOVE", key });
  const setQty = (key: string, qty: number) => dispatch({ type: "SET_QTY", qty, key });
  const increment = (key: string) => dispatch({ type: "INCREMENT", key });
  const decrement = (key: string) => dispatch({ type: "DECREMENT", key });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + i.price * i.quantity, 0),
    [state.items]
  );
  const totalQty = useMemo(
    () => state.items.reduce((s, i) => s + i.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      cartItems: state.items,
      addToCart,
      removeItem,
      removeFromCart,
      setQty,
      increment,
      decrement,
      clearCart,
      subtotal,
      totalQty,
    }),
    [state.items, subtotal, totalQty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
