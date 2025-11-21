import express from "express";
import upload from "../middleware/upload.js";
import { getAllCareers, applyForCareer } from "../controllers/careerControllers.js";

const router = express.Router();

router.get("/", getAllCareers);
router.post("/apply", upload.single("resume"), applyForCareer);

export default router;
