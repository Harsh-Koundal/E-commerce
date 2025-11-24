import express from "express";
import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import sendResponse from "../utils/sendResponse.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ---------------------- Email Config ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Email transporter error:", error);
  }
});

// ---------------------- Helpers ----------------------
const generateVerificationToken = () => crypto.randomBytes(20).toString("hex");

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify your email",
    html: `<p>Please click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };
  return transporter.sendMail(mailOptions);
};

// ---------------------- Signup ----------------------
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return sendResponse(
        res,
        400,
        existingUser.email === email ? "Email already exists" : "Mobile number already exists",
        "error"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      verificationToken,
      isAdmin: false,
      isVerified: false,
    });
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    return sendResponse(res, 201, "Signup successful. Please check your mail to verify.");
  } catch (error) {
    console.error("Signup failed:", error);
    if (error.code === 11000) {
      const field = error.keyPattern?.mobile ? "Mobile number" : "Email";
      return sendResponse(res, 400, `${field} already exists`, "error");
    }
    return sendResponse(res, 500, "Signup failed", "error", error);
  }
});

// ---------------------- Email Verification ----------------------
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return sendResponse(res, 400, "Invalid or expired token", "error");
    }

    if (user.isVerified) {
      return sendResponse(res, 200, "User already verified");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return sendResponse(res, 200, "Email verified successfully");
  } catch (error) {
    console.error("Email verification error:", error);
    return sendResponse(res, 500, "Server error", "error", error);
  }
});

// ---------------------- Login ----------------------
router.post("/login", async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!user) return sendResponse(res, 400, "User not found", "error");

    if (!user.isVerified) {
      return sendResponse(res, 400, "Please verify your email before logging in.", "error");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendResponse(res, 400, "Invalid credentials", "error");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return sendResponse(res, 200, "Login successful", "success", {
      token,
      user: {
        _id: user._id, 
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Login failed:", error);
    return sendResponse(res, 500, "Login failed", "error", error);
  }
});

// ---------------------- Logout ----------------------
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    return sendResponse(res, 200, "Logged out successfully", "success");
  } catch (error) {
    return sendResponse(res, 500, "Logout failed", "error", error);
  }
});

// ---------------------- Get Profile ----------------------
router.get("/user/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -verificationToken");
    if (!user) return sendResponse(res, 404, "User not found", "error");
    return sendResponse(res, 200, "Profile fetched successfully", "success", user);
  } catch (error) {
    return sendResponse(res, 500, "Error fetching profile", "error", error);
  }
});

// ---------------------- Update Profile ----------------------
router.put("/user/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, mobile, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found", "error");

    user.fullName = fullName || user.fullName;
    user.mobile = mobile || user.mobile;
    user.email = email || user.email;
    await user.save();

    return sendResponse(res, 200, "Profile updated", "success", user);
  } catch (error) {
    return sendResponse(res, 500, "Error updating profile", "error", error);
  }
});

// ---------------------- Address: GET ----------------------
router.get("/user/address", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("address");
    if (!user || !user.address) {
      return sendResponse(res, 404, "Address not found", "error");
    }
    return sendResponse(res, 200, "Address fetched", "success", user.address);
  } catch (error) {
    return sendResponse(res, 500, "Server error", "error", error);
  }
});

// ---------------------- Address: POST (Add/Update) ----------------------
router.post("/user/address", authMiddleware, async (req, res) => {
  const { address, city, state, pincode, latitude, longitude } = req.body;

  if (!address || !city || !state || !pincode) {
    return sendResponse(res, 400, "All fields are required.", "error");
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found.", "error");

    user.address.push({ address, city, state, pincode, latitude, longitude });
    await user.save();

    return sendResponse(res, 200, "Address updated successfully.", "success", user);
  } catch (error) {
    console.error("❌ Error updating address:", error);
    return sendResponse(res, 500, "Internal Server Error", "error", error);
  }
});

// ---------------------- Address: DELETE ----------------------
router.delete("/user/address/:index", authMiddleware, async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.address || index >= user.address.length) {
      return sendResponse(res, 404, "Address not found", "error");
    }

    user.address.splice(index, 1);
    await user.save();

    return sendResponse(res, 200, "Address removed", "success", user.address);
  } catch (error) {
    return sendResponse(res, 500, "Server error", "error", error);
  }
});

// ---------------------- Preferences: GET ----------------------
router.get("/user/preferences", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("preferences");
    if (!user) return sendResponse(res, 404, "User not found", "error");
    return sendResponse(res, 200, "Preferences fetched", "success", user.preferences || {});
  } catch (error) {
    return sendResponse(res, 500, "Error fetching preferences", "error", error);
  }
});

// ---------------------- Preferences: PUT ----------------------
router.put("/user/preferences", authMiddleware, async (req, res) => {
  try {
    const { theme, ui } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return sendResponse(res, 404, "User not found", "error");

    if (theme !== undefined) {
      user.preferences.theme = theme;
    }
    if (ui !== undefined) {
      user.preferences.ui = ui;
    }

    await user.save();
    return sendResponse(res, 200, "Preferences updated", "success", user.preferences);
  } catch (error) {
    return sendResponse(res, 500, "Error updating preferences", "error", error);
  }
});

export default router;
