import express from "express";
import { getPriceEstimate } from "../controllers/priceController.js";

const router = express.Router();
router.post("/estimate", getPriceEstimate);

export default router;
