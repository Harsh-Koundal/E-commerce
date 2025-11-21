import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";
import otpGenerator from "otp-generator";

// Edit Order
export const editOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendResponse(res, 404, "error", "Order not found");

    if (order.status !== "pending") {
      return sendResponse(res, 400, "error", "Order cannot be edited after confirmation");
    }

    Object.assign(order, req.body);
    await order.save();

    return sendResponse(res, 200, "success", "Order updated successfully", order);
  } catch (error) {
    return sendResponse(res, 500, "error", "Server error", error.message);
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendResponse(res, 404, "error", "Order not found");

    if (["completed", "in-progress","cancelled"].includes(order.status)) {
      return sendResponse(res, 400, "error", "Order cannot be cancelled now");
    }

    order.status = "cancelled";
    await order.save();

    return sendResponse(res, 200, "success", "Order cancelled successfully", order);
  } catch (error) {
    return sendResponse(res, 500, "error", "Server error", error.message);
  }
};

// Send OTP for Pickup
export const sendOtpForPickup = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendResponse(res, 404, "error", "Order not found");

    if (order.status !== "in-progress") {
      return sendResponse(res, 400, "error", "OTP can only be sent when order is ready for pickup");
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    order.otp = otp;
    order.otpExpiry = Date.now() + 5 * 60 * 1000;
    await order.save();

    // TODO: integrate with email/SMS provider
    console.log(`OTP for Order ${order._id}: ${otp}`);

    return sendResponse(res, 200, "success", "OTP sent successfully", { orderId: order._id });
  } catch (error) {
    return sendResponse(res, 500, "error", "Server error", error.message);
  }
};

// Verify OTP & Confirm Completion
export const verifyOtpForPickup = async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return sendResponse(res, 404, "error", "Order not found");

    if (order.status !== "in-progress") {
      return sendResponse(res, 400, "error", "Order is not ready for pickup");
    }

    if (!order.otp || order.otpExpiry < Date.now()) {
      return sendResponse(res, 400, "error", "OTP expired or not generated");
    }

    if (order.otp !== otp) {
      return sendResponse(res, 400, "error", "Invalid OTP");
    }

    order.status = "completed";
    order.otp = null;
    order.otpExpiry = null;
    await order.save();

    return sendResponse(res, 200, "success", "Order pickup confirmed successfully", order);
  } catch (error) {
    return sendResponse(res, 500, "error", "Server error", error.message);
  }
};
