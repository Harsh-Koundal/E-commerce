import express from "express";
import {
  getVendorSettingsById,
  createVendorSettings,
  updateVendorSettings,
  deleteVendorSettings,
} from "../controllers/vendorSettingsController.js";

const router = express.Router();

// GET /vendor-settings/:id - Fetch vendor settings by ID
router.get("/:id", getVendorSettingsById);

// POST /vendor-settings - Create new vendor settings
router.post("/", createVendorSettings);

// PATCH /vendor-settings/:id - Update vendor settings by ID
router.patch("/:id", updateVendorSettings);

// DELETE /vendor-settings/:id - Delete vendor settings by ID
router.delete("/:id", deleteVendorSettings);

export default router;

