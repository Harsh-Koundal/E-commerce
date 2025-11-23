import express from "express";
import orderController from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { getUnassignedOrders } from "../controllers/orderController.js";
import {  getInvoice,
  reOrder,
  trackOrder,
  getOrderHistory,
  getOrderDetails,
  getPaymentHistory,
  previewOrder,
  customiseReorder
} from "../controllers/post-order.controller.js";
import { phonePeAuthMiddleware } from "../middleware/phonepeAuthMiddleware.js";

const router = express.Router();

router.get("/history", authMiddleware, getOrderHistory); // Past orders
router.get("/payments/history", authMiddleware, getPaymentHistory); // Past payments

router.post(
  "/upload-files",
  authMiddleware,
  orderController.upload_files
);


// Order creation route - using new process-first approach
router.post(
  "/place-order",
  authMiddleware,
  phonePeAuthMiddleware,
  orderController.place_order
);

// Get orders for a user
router.get("/", authMiddleware, orderController.getOrder);

// Get a single order by ID
router.get("/:orderId", authMiddleware, orderController.getSingleOrderById);

// Route to get order tracking information
router.get("/:id/tracking", authMiddleware, trackOrder);

// Route to reorder an existing order
router.post("/:id/reorder", authMiddleware, reOrder);

// Route to customise and reorder an existing order
router.post("/:id/customise-reorder", authMiddleware, customiseReorder);

// Route to preview an order before placing it
router.get("/:id/preview-order", authMiddleware, previewOrder);

// Route to get invoice for an order
router.get("/:id/invoice", authMiddleware, getInvoice);

router.get("/:id/details", authMiddleware, getOrderDetails); // Specific order
router.get("/unassigned", authMiddleware, getUnassignedOrders);

export default router;