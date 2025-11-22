import express from "express";
import { getAccessoryCategory, getClothingCategory } from "../controllers/accessoryController.js";

const router = express.Router();

// Fetch accessory category and its subcategories
router.get("/accessory-printing", getAccessoryCategory);
router.get("/clothing-printing", getClothingCategory)

export default router;
  