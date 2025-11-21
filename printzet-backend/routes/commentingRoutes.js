import express from "express";
import commentingController from "../controllers/commentingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add a comment (operation team member)
router.post("/comments", authMiddleware, commentingController.addComment);

// 📌 Get all comments for a specific issue
router.get("/comments/:issueId", authMiddleware, commentingController.getCommentsByIssue);

// ✏️ Update a comment
router.put("/comments/:id", authMiddleware, commentingController.updateComment);

// ❌ Delete a comment
router.delete("/comments/:id", authMiddleware, commentingController.deleteComment);

// 👨‍💻 Assign comment to an admin (via email link)
router.get("/comments/assign/:commentId", commentingController.assignComment);

export default router;