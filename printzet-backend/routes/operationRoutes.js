import operationController from "../controllers/operationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from 'express';

const router= express.Router();

router.post("/create-operation", operationController.createOperation);
router.get("/get-operation", operationController.getOperations);
router.get("/get-id-operation", authMiddleware, operationController.getOperationById);
router.post("/login-operation", operationController.loginOperation);
router.delete("/delete-operation", authMiddleware, operationController.deleteOperation);
router.patch("/update-operation", authMiddleware, operationController.updateOperation);

export default router;