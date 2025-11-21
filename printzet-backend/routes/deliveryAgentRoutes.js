import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerAgent,
  loginAgent,
  logoutAgent,
} from "../controllers/agentAuth.controller.js";
import {
  getProfile,
  updateProfile,
  updateAvailability,
} from "../controllers/agentProfile.controller.js";
import {
  getAssignedOrders,
  updateOrderStatus,
} from "../controllers/agentOrders.controller.js";
import { updateLocation } from "../controllers/agentLocation.controller.js";
import { getEarnings } from "../controllers/agentEarnings.controller.js";
import { getNotifications } from "../controllers/agentNotification.controller.js";
import { contactSupport } from "../controllers/agentSupport.controller.js";

const router = express.Router();

// Auth
router.post("/auth/register", registerAgent);
router.post("/auth/login", loginAgent);
router.post("/auth/logout", authMiddleware, logoutAgent);

// Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/availability", authMiddleware, updateAvailability);

// Orders
router.get("/orders/assigned", authMiddleware, getAssignedOrders);
router.patch("/orders/:id/status", authMiddleware, updateOrderStatus);

// Location
router.post("/location", authMiddleware, updateLocation);

// Earnings
router.get("/earnings", authMiddleware, getEarnings);

// Notifications
router.get("/notifications", authMiddleware, getNotifications);

// Support
router.post("/support/request", authMiddleware, contactSupport);

export default router;
