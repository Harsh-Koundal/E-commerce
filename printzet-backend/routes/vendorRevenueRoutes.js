import express from "express";
import { getVendorRevenue } from "../controllers/vendorRevenueController.js";
import vendorAuth from "../middleware/authVendor.js";

const router = express.Router();

// Vendor Revenue APIs
router.get("/summary", vendorAuth, getVendorRevenue);

export default router;
