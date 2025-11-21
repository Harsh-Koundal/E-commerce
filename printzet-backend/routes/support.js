import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSupport, postSupport } from "../controllers/supportController.js";

const router = express.Router();

// Get all tickets for the logged-in user
router.get("/support/tickets", authMiddleware, getSupport);

// Create a new support ticket
router.post("/support/tickets", authMiddleware, postSupport);

export default router;
