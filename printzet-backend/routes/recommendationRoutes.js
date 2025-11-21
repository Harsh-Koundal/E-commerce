import express from "express";
import { getReorderRecommendations } from "../controllers/recommendationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reorders", authMiddleware, getReorderRecommendations);

export default router;
