import { Schema, model, type HydratedDocument } from "mongoose";
import type { IReview } from "../types/review";

export type ReviewDoc = HydratedDocument<IReview>;

const ReviewSchema = new Schema<IReview>(
  {
    userName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String, required: true },
    highlighted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IReview>("Review", ReviewSchema);
