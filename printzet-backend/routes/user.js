import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      // return res.status(404).json({ message: "User not found" });
      return sendResponse(res, 404, "User not found", "error");

    }
    sendResponse(res, 200, "User profile fetched", "success", user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    // res.status(500).json({ message: "Server error. Please try again later." });
    sendResponse(res, 500, "Server error while fetching profile", "error", error);

  }
});
// Update user profile
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, mobile, address, oldPassword, newPassword } = req.body;

    const updatedFields = {};
    // Update basic fields
    if (fullName) updatedFields.fullName = fullName.trim();
    if (mobile) updatedFields.mobile = mobile.trim();
    if (address) updatedFields.address = address;

    if (oldPassword && newPassword) {
      const existingUser = await User.findById(req.user.id);
      if (!existingUser) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

      if (oldPassword === newPassword)
        return res.status(400).json({ message: "New password cannot be the same as old password" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.password = hashedPassword;
    }


    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Get order history with optional status filter
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;

    // First get all successful payment records for this user
    const Payment = (await import("../models/payment.model.js")).default;
    const successfulPayments = await Payment.find({
      userId: req.user.id,
      paymentStatus: "SUCCESS"
    }).select("orderId");

    // Extract order IDs from successful payments
    const paidOrderIds = successfulPayments.map(payment => payment.orderId);

    // Build filter for orders with successful payments
    const filter = {
      userId: req.user.id,
      _id: { $in: paidOrderIds }
    };

    // If status is provided (placed, in-print, shipped, delivered, cancelled)
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("categoryId", "name description")
      .populate("vendor", "name email phone address")
      .populate("assignedAgent", "name phone")
      .sort({ createdAt: -1 });

    if (!orders.length) {
      // return res.status(404).json({ message: "No orders found" });
      return sendResponse(res, 404, "No orders found", "error");
    }

    // res.json(orders);
    sendResponse(res, 200, "Order history fetched", "success", orders);

  } catch (error) {
    console.error("Error fetching orders:", error);
    // res.status(500).json({ message: "Server error. Please try again later." });
    sendResponse(res, 500, "Server error while fetching orders", "error", error);

  }
});

export default router;
