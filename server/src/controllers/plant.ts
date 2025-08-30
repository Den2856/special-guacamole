import { Request, Response } from "express";
import Plant from "../models/plants";

export async function getAllPlants(req: Request, res: Response) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 6);
    const skip = (page - 1) * limit;
    const category = req.query.category;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    const [plants, total] = await Promise.all([
      Plant.find(query).skip(skip).limit(limit),
      Plant.countDocuments(query),
    ]);

    res.json({
      items: plants,
      total,
      page,
      limit,
      hasMore: skip + plants.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load plants" });
  }
}
export async function getFeaturedPlants(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit || 5);
    const plants = await Plant.find({ isFeatured: true }).limit(limit);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Failed to load featured plants" });
  }
}

export async function getTrendyPlants(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit || 5);
    const plants = await Plant.find({ isTrendy: true }).limit(limit);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Failed to load trendy plants" });
  }
}
