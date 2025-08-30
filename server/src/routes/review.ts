import { Router } from "express";
import type { RequestHandler } from "express";
import { getAllReviews, getHighlightedReview } from "../controllers/review";

const reviewRouter = Router();

reviewRouter.get("/highlight", getHighlightedReview as RequestHandler);
reviewRouter.get("/", getAllReviews as RequestHandler)

export default reviewRouter;
