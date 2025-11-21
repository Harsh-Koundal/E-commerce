import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";

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
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, email, mobile, address } = req.body;

    const updatedFields = {};
    if (fullName) updatedFields.fullName = fullName;
    if (email) updatedFields.email = email;
    if (mobile) updatedFields.mobile = mobile;
    if (address) updatedFields.address = address; // nested object

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
    const filter = { user: req.user.id };

    // If status is provided (placed, in-print, shipped, delivered, cancelled)
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter);
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
