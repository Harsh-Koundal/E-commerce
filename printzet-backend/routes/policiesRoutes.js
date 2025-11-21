import policiesController from "../controllers/policiesController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from 'express';

const router= express.Router();

router.post("/create-policies", authMiddleware, policiesController.createPolicy);
router.get("/get-policies", policiesController.getPolicies);
router.get("/get-policies-by-id/:id", policiesController.getPolicyById);
router.delete("/delete-policies/:id", authMiddleware, policiesController.deletePolicy);
router.put("/update-policies/:id", authMiddleware, policiesController.updatePolicy);
router.patch("/toggle-policies/:id", authMiddleware, policiesController.togglePolicyStatus);

export default router;