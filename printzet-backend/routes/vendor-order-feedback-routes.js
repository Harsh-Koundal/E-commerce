import express from "express";
import vendorAuth from "../middleware/authVendor.js";
import {
  getCompletedOrders,
  getVendorFeedbacks,
} from "../controllers/vendor-order-feedback.js";

const router = express.Router();

// Vendor completed orders
router.get("/orders/completed", vendorAuth, getCompletedOrders);

// Vendor feedbacks
router.get("/feedbacks", vendorAuth, getVendorFeedbacks);

export default router;
