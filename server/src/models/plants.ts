import { Schema, model, type HydratedDocument } from "mongoose";
import type { IPlant } from "../types/plant";

export type PlantDoc = HydratedDocument<IPlant>;

const PlantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true },
    subtitle: String,
    description: String,
    price: Number,
    imageUrl: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isFeatured: { type: Boolean, default: false },
    isTrendy: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export default model<IPlant>("Plant", PlantSchema);
