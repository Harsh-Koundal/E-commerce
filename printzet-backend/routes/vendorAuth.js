import express from "express";
import dotenv from "dotenv";
import { forgotPassword, resendVerificationEmail, resetPassword, vedorSignup, vendorLogin, verifyVendorEmail } from "../controllers/VendorAuthController.js";


dotenv.config();
const router = express.Router();


// Vendor Signup
router.post("/signup", vedorSignup);

// Email Verification
router.get("/verify-email/:token", verifyVendorEmail);

// Resend Verification
router.post("/resend-verification", resendVerificationEmail);

// Login
router.post("/login", vendorLogin);

// ✅ Forgot Password
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password
router.post("/reset-password/:token", resetPassword);

export default router;
