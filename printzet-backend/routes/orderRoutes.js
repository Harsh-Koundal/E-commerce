import express from "express";
import orderController from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  getInvoice,
  reOrder,
  trackOrder,
  getOrderHistory,
  getOrderDetails,
  getPaymentHistory,
  previewOrder,
  customiseReorder,
  deleteOrder,
} from "../controllers/post-order.controller.js";
import { getUnassignedOrders } from "../controllers/orderController.js";
import { phonePeAuthMiddleware } from "../middleware/phonepeAuthMiddleware.js";
import { assignAgentToOrder } from "../controllers/orderAssignController.js";

const router = express.Router();

  //  CUSTOMER ORDER APIs
router.get("/history", authMiddleware, getOrderHistory);
router.get("/payments/history", authMiddleware, getPaymentHistory);

// LEGACY Upload API
router.post(
  "/upload-files-legacy",
  authMiddleware,
  upload.array("files"),
  orderController.upload_file_legacy
);

// Create Order (Payment First)
router.post(
  "/place-order",
  authMiddleware,
  phonePeAuthMiddleware,
  orderController.place_order
);

// Get all orders of a user
router.get("/", authMiddleware, orderController.getOrder);

  //  DELIVERY / ASSIGNMENT APIs 
// Fetch all unassigned orders (Admin use)
router.get("/unassigned", authMiddleware, getUnassignedOrders);

// Assign delivery agent manually
router.post("/assign/:orderId", authMiddleware, assignAgentToOrder);

// Delivery agent: Get orders assigned to himself
//router.get("/agent/assigned", authMiddleware, getAssignedOrders);

// Delivery agent: Update status of any assigned order
//router.patch("/agent/:id/status", authMiddleware, updateOrderStatus);


  //  OTHER ORDER OPERATIONS
router.get("/:id/tracking", authMiddleware, trackOrder);
router.post("/:id/reorder", authMiddleware, reOrder);
router.post("/:id/customise-reorder", authMiddleware, customiseReorder);
router.get("/:id/preview-order", authMiddleware, previewOrder);
router.get("/:id/invoice", authMiddleware, getInvoice);
router.get("/:id/details", authMiddleware, getOrderDetails);
router.delete("/:id",authMiddleware,deleteOrder);

// MUST BE LAST (dynamic route)
router.get("/:orderId", authMiddleware, orderController.getSingleOrderById);

export default router;