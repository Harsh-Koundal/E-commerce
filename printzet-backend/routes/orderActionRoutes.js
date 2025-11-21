import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  editOrder,
  cancelOrder,
  sendOtpForPickup,
  verifyOtpForPickup
} from "../controllers/orderActions.controller.js";

const router = express.Router();

// Edit order before confirmation
router.put("/:id/edit", authMiddleware, editOrder);

//  Cancel order
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Send OTP for pickup
router.post("/:id/send-otp", authMiddleware, sendOtpForPickup);

// Verify OTP & confirm completion
router.post("/:id/verify-otp", authMiddleware, verifyOtpForPickup);

export default router;
