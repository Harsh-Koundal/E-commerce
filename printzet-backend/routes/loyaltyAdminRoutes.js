import express from "express";
import {
  addOrUpdateLoyalty,
  getLoyaltyByUser,
  getAllLoyalty,
  deleteLoyalty,
} from "../controllers/loyaltyAdminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin APIs for Loyalty
router.post("/", authMiddleware, adminMiddleware, addOrUpdateLoyalty);
router.get("/", authMiddleware, adminMiddleware, getAllLoyalty);
router.get("/:userId", authMiddleware, adminMiddleware, getLoyaltyByUser);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteLoyalty);

export default router;
