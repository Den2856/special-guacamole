import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export type FavPlant = {
  _id: string;
  name: string;
  subtitle?: string;
  description?: string;
  price?: number;
  imageUrl: string;
  rating?: number | string;
};

type Ctx = {
  favorites: FavPlant[];
  isFavorite: (id?: string) => boolean;
  toggleFavorite: (plant: FavPlant) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<Ctx | null>(null);
const LS_KEY = "planto:favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavPlant[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as FavPlant[]) : [];
    } catch {
      return [];
    }
  });

  const { user } = useAuth();  

  useEffect(() => {
    if (!user) {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id?: string) => (id ? favorites.some((f) => f._id === id) : false);

  const toggleFavorite = (p: FavPlant) =>
    setFavorites((arr) => (arr.some((x) => x._id === p._id) ? arr.filter((x) => x._id !== p._id) : [p, ...arr]));

  const removeFavorite = (id: string) =>
    setFavorites((arr) => arr.filter((x) => x._id !== id));

  const clearFavorites = () => setFavorites([]);

  const value = useMemo<Ctx>(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
