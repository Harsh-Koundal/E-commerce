import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";


export const getAllOrders = async (req, res) => {
  try {
    // First get all successful payment records
    const Payment = (await import("../models/payment.model.js")).default;
    const successfulPayments = await Payment.find({ 
      paymentStatus: "SUCCESS" 
    }).select("orderId");
    
    // Extract order IDs from successful payments
    const paidOrderIds = successfulPayments.map(payment => payment.orderId);
    
    // Find orders that have successful payments
    const orders = await Order.find({ 
      _id: { $in: paidOrderIds }
    }).populate("user", "name email");
    
    return sendResponse(res, 200, "Orders fetched successfully", "success", orders);
  } catch (error) {
    return sendResponse(res, 500, "Failed to fetch orders", "error", {error: error.message});
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendResponse(res, 404, "Order not found", "error");
    }

    order.status = status;
    await order.save();

    return sendResponse(res, 200, "Order status updated successfully", "success", order);
  } catch (error) {
    return sendResponse(res, 500, "Failed to update order status", "error", {error: error.message});
  }
};


export const processRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return sendResponse(res, 404, "Order not found", "error");
    }

    if (order.status !== "completed" && order.status !== "failed") {
      return sendResponse(res, 400, "Refund allowed only after order completion or failure", "error");
    }

    order.status = "refunded";
    order.refundDetails = {
      reason,
      processed: true,
      processedAt: new Date(),
    };

    await order.save();

    return sendResponse(res, 200, "Refund processed successfully", "success", order);
  } catch (error) {
    return sendResponse(res, 500, "Failed to process refund", "error", {error: error.message});
  }
};
