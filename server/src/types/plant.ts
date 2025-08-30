import { Types } from "mongoose";

export interface IPlant {
  _id?: Types.ObjectId;
  name: string;
  subtitle?: string;
  description?: string;
  price?: number;
  imageUrl: string;
  rating?: number;
  isFeatured?: boolean;
  isTrendy?: boolean;
  category?: string;
}
