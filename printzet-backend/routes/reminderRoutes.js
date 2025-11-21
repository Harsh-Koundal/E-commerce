import { Router } from "express";
import { getReorderRecommendations } from "../controllers/reminderController";
import auth from "../middleware/authMiddleware.js";
const router = Router();

router.get("/recommendations/reorders", auth, getReorderRecommendations);

export default router;
