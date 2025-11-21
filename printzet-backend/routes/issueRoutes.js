import issueController from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

// user → can create
router.post("/create-issue", authMiddleware, issueController.createIssue);

// admin/operation only
router.get("/get-issues", authMiddleware, issueController.getIssuesByOperationId);
router.put("/update-issue/:id", authMiddleware, issueController.updateIssue);
router.delete("/delete-issue/:id", authMiddleware, issueController.deleteIssue);

export default router;
