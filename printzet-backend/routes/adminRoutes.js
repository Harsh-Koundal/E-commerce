// adminRoutes.js (Backend)
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { assignVendorToOrder, getAccessoryOrderById, getAllAccessoryOrders, getAllOrders, getAllUsers, getAllVendors, getOrderById, updateUserAddress } from "../controllers/adminController.js";

import { createServiceCategory, getAllServiceCategories, getServiceCategoryById, updateServiceCategory, deleteServiceCategory } from "../controllers/serviceCategory.controller.js";
import { documentUpload } from "../middleware/multer.middleware.js";

import { createAdminUser, editAdminUser, deleteAdminUser, getUserActivityLogs, getAllEmployees } from "../controllers/admin-user.Controller.js";
import deliveryController from "../controllers/deliveryController.js";

import { getAllTransactions, createPayout, processRefund } from "../controllers/transactionController.js";
import { assign } from "nodemailer/lib/shared/index.js";

const router = express.Router();


// ✅ GET all users (Admin Only)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// ✅ GET all document printing orders (Admin Only)
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.post("/orders/:id/assign-vendor", authMiddleware, adminMiddleware, assignVendorToOrder);



// ✅ GET all accessory printing orders (Admin Only)
router.get("/accessory-orders", authMiddleware, adminMiddleware, getAllAccessoryOrders);

// ✅ Update user address
router.put("/update-address", updateUserAddress);

// ✅ Update document printing order status and total cost (Admin Only)
router.put("/orders/:orderId", authMiddleware, adminMiddleware, getOrderById);

// ✅ Update accessory printing order status and total cost (Admin Only)
router.put("/accessory-orders/:orderId", authMiddleware, adminMiddleware, getAccessoryOrderById);

router.get("/vendors", getAllVendors);

//service category routes
router.post("/service-category", authMiddleware, adminMiddleware, documentUpload.single("image") , createServiceCategory);
router.get("/service-categories",authMiddleware, adminMiddleware, getAllServiceCategories);
router.get("/service-category/:id",authMiddleware, adminMiddleware, getServiceCategoryById);
router.put("/service-category/:id",authMiddleware, adminMiddleware, updateServiceCategory);
router.delete("/service-category/:id",authMiddleware, adminMiddleware, deleteServiceCategory);
  

//User Management Routes
// ✅ Create a new admin user (Admin Only)
router.get("/operation/users", authMiddleware, adminMiddleware, getAllEmployees);
router.post("/operation/users", authMiddleware, adminMiddleware, createAdminUser);

// ✅ Edit an existing admin user (Admin Only)
router.put("/operation/users/:userId", authMiddleware, adminMiddleware, editAdminUser);

// ✅ Delete an admin user (Admin Only)
router.delete("/operation/users/:userId", authMiddleware, adminMiddleware, deleteAdminUser);

// ✅ Get user activity logs (Admin Only)
router.get("/user-logs/:userId", authMiddleware, adminMiddleware, getUserActivityLogs);

//Finance Management Routes
router.get("/finance/transactions",authMiddleware, adminMiddleware, getAllTransactions)
router.post("/finance/payouts",authMiddleware, adminMiddleware, createPayout)
router.post("/finance/refunds",authMiddleware, adminMiddleware, processRefund)


//Delivery Management Routes
// Assign Delivery
router.post("/delivery/assign",authMiddleware, adminMiddleware, deliveryController.assignDelivery);

// fetch Delivery Partner Details
router.get("/delivery/partners", authMiddleware, adminMiddleware,deliveryController.getNearbyDeliveryPartners);

// fetch Delivery Details
router.get("/delivery/details/:id", authMiddleware, adminMiddleware,deliveryController.getDeliveries);

// Monitor Delivery's
router.get("/delivery/progress/details",authMiddleware, adminMiddleware, deliveryController.getInProgressDeliveries);

// update Delivery
router.put("/update-status/:id",authMiddleware, adminMiddleware, deliveryController.updateDeliveryStatus);


export default router;