import { Router } from "express";
import { getFeaturedPlants, getTrendyPlants, getAllPlants } from "../controllers/plant";

const router = Router();

router.get("/trendy", getTrendyPlants); 
router.get("/featured", getFeaturedPlants);
router.get("/", getAllPlants);

export default router;