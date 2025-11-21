// routes/estimateRoutes.js

import express from "express";
import { getDeliveryEstimate } from "../controllers/estimateController.js";

const router = express.Router();

router.get("/estimate", getDeliveryEstimate);

export default router;
