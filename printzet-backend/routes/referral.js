import express from "express";
import {
  generateReferralCode,
  useReferralCode,
} from "../controllers/referralController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-code", authMiddleware, generateReferralCode);
router.post("/use-code", authMiddleware, useReferralCode);

export default router;
