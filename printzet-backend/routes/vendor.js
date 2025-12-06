import express from "express";
import vendorAuth from "../middleware/authVendor.js";
import { getVendorOrders, getVendorProfile, getVendorsByPincode, markOrderAsCompleted, updateVendorProfile, approveOrder,rejectOrder,viewOrderDetails } from "../controllers/vendorController.js";


const router = express.Router();

// ✅ GET Vendor Profile
router.get("/profile", vendorAuth, getVendorProfile);

// ✅ PATCH Update Vendor Profile
router.patch("/profile", vendorAuth, updateVendorProfile);

// GET /api/vendor/orders
router.get("/orders", vendorAuth, getVendorOrders);

// GET /api/vendor/vendors?pincode=XXXXX
router.get("/vendors", getVendorsByPincode);

// PATCH /api/vendor/order/:orderId/completed
router.patch("/order/:orderId/completed", vendorAuth, markOrderAsCompleted);

router.patch("/order/:orderId/confirm", vendorAuth, approveOrder);

router.patch("/order/:orderId/reject", vendorAuth, rejectOrder);

router.get("/order/:orderId", vendorAuth, viewOrderDetails);

export default router;
