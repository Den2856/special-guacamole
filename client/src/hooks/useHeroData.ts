export type Plant = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
};



export type Review = {
  _id: string;
  userName: string;
  avatarUrl: string;
  rating: number;
  text: string;
};


const API = import.meta.env.VITE_API_URL ?? "";


export async function fetchFeaturedPlants(signal?: AbortSignal): Promise<Plant[]> {
  const res = await fetch(`${API}/api/plants/featured`, { signal });
    if (!res.ok) throw new Error("Failed to load featured plants");
  return res.json();
}


export async function fetchHighlightedReview(signal?: AbortSignal): Promise<Review> {
  const res = await fetch(`${API}/api/reviews/highlight`, { signal });
    if (!res.ok) throw new Error("Failed to load review");
  return res.json();
}