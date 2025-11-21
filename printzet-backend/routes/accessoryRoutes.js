import express from "express";
import { getAccessoryCategory } from "../controllers/accessoryController.js";

const router = express.Router();

// Fetch accessory category and its subcategories
router.get("/accessory-printing", getAccessoryCategory);

export default router;
  