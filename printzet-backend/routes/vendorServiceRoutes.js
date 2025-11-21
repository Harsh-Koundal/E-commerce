import express from "express";
import vendorAuth from "../middleware/authVendor.js";
import { getVendorServices, postVendorService, updateVendorService, deleteVendorService  } from "../controllers/vendorServiceController.js";

const router = express.Router();

// Submit a new service
router.post("/", vendorAuth, postVendorService);

// Get all services submitted by the vendor
router.get("/", vendorAuth, getVendorServices);

// Update a specific service
router.put("/:serviceId", vendorAuth, updateVendorService);

// Delete a specific service
router.delete("/:serviceId", vendorAuth, deleteVendorService);

export default router;
