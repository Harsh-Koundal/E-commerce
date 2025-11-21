import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createSavedDesign,
  getSavedDesigns,
  getSingleSavedDesign,
  updateSavedDesign,
  deleteSavedDesign,
} from "../controllers/savedDesignController.js";

const router = express.Router();

// #swagger.security = [{ "BearerAuth": [] }]
router.post("/", authMiddleware, createSavedDesign);

// #swagger.security = [{ "BearerAuth": [] }]
router.get("/", authMiddleware, getSavedDesigns);

// #swagger.security = [{ "BearerAuth": [] }]
router.get("/:id", authMiddleware, getSingleSavedDesign);

// #swagger.security = [{ "BearerAuth": [] }]
router.put("/:id", authMiddleware, updateSavedDesign);

// #swagger.security = [{ "BearerAuth": [] }]
router.delete("/:id", authMiddleware, deleteSavedDesign);

export default router;
