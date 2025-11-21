import express from "express";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { getOrderById, homeroute, placeOrder, uploadFile } from "../controllers/accessoryorderController.js";
dotenv.config();

const router = express.Router();

// File upload route (remains the same)
router.post("/upload-files", authMiddleware, upload.array("files"), uploadFile);

// Order creation route with customer and vendor details
router.post("/place-order", authMiddleware, upload.array("files"), placeOrder);

// Get accessory orders for a user (remains the same)
router.get("/", authMiddleware, homeroute);

// Get a single accessory order by ID (remains the same)
router.get("/:orderId", authMiddleware, getOrderById);

export default router;