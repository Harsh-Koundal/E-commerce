import express from "express";
import { googleSignUp } from "../controllers/GoogleAuthController.js";

const googleRouter = express.Router();

googleRouter.get("/google", googleSignUp)

export default googleRouter;