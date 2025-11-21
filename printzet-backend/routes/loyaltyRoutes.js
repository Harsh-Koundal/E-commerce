import express from "express";
import { getPoints, redeemPoints } from "../controllers/loyaltyController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/points", authMiddleware, getPoints);
router.post("/redeem", authMiddleware, redeemPoints);

export default router;
