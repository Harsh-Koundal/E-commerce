import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAllOrders, updateOrderStatus, processRefund } from "../controllers/adminOrderController.js";

const router = express.Router();


router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.post("/:orderId/refund", authMiddleware, adminMiddleware, processRefund);

export default router;
