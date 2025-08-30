import { Request, Response } from "express";
import Review from "../models/review";

export async function getHighlightedReview(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit || 3);
    const reviews = await Review.find({ highlighted: true }).limit(limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
}

export async function getAllReviews(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit || 6);
    const reviews = await Review.find({}).limit(limit).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
}