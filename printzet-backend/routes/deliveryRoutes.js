import deliveryController from "../controllers/deliveryController.js";
import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";

const router= express.Router();

router.post("/update-delivery", authMiddleware, deliveryController.updateDeliveryStatus);

export default router;