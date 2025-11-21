import express from "express";
import { category, categoryById } from "../controllers/categoryController.js";

const router = express.Router();

// Fetch all categories
router.get("/", category);

// Fetch a category by ID
router.get("/:id", categoryById);

export default router;
