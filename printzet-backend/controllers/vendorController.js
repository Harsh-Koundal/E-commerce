import Order from "../models/Order.js";
import Vendor from "../models/Vendor.js";
import AccessoryOrder from "../models/AccessoryOrder.js";
import sendResponse from "../utils/sendResponse.js";

const sanitizeOrder = (order) => ({
  orderId: order._id,
  vendor: order.vendor,
  status: order.status,
  totalCost: order.totalCost,
  vendorStatus: order.vendorStatus,
  userId: order.userId,
  categoryId: order.categoryId,
  paperType: order.paperType,
  printQuality: order.printQuality,
  binding: order.binding,
  lamination: order.lamination,
  printedSides: order.printedSides,
  files: order.files,
  numCopies: order.numCopies,
  colorType: order.colorType,
  totalPages: order.totalPages,
  refundDetails: order.refundDetails,
  paymentMethod: order.paymentMethod,
  transactionId: order.transactionId,
  createdAt: order.createdAt
});

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select("-password");
    if (!vendor) {
      return sendResponse(res,404,"error","Vendor not Found");
    }
    sendResponse(res,200,"success","Vendor profile fetched",vendor)
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    sendResponse(res,500,"error","Server Error")
  }
}

const updateVendorProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "pressName",
      "address",
      "serviceablePincodes",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    sendResponse(res,200,"success","Profile updated successfully",updatedVendor)
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    sendResponse(res,500,"error","Server Error")
  }
}

const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;
    const { showAll = false } = req.query; // Default to paid-only (YOUR task)

    let orders;

    if (showAll) {
      // Other requirement: Show all orders (backward compatibility)
      orders = await Order.find({ vendor: vendorId })
        .populate("userId")
        .sort({ createdAt: -1 });
    } else {
      // YOUR TASK: Show only paid orders (default behavior)
      const Payment = (await import("../models/payment.model.js")).default;
      const successfulPayments = await Payment.find({
        paymentStatus: "SUCCESS"
      }).select("orderId");

      const paidOrderIds = successfulPayments.map(payment => payment.orderId);

      orders = await Order.find({
        vendor: vendorId,
        _id: { $in: paidOrderIds }
      })
        .populate("userId categoryId")
        .sort({ createdAt: -1 });
    }

    const accessoryOrders = await AccessoryOrder.find({ vendor: vendorId })
      .populate("userId")
      .sort({ createdAt: -1 });

    sendResponse(res,200,"success","Order fetched", { 
      orders: orders.map(sanitizeOrder), 
      accessoryOrders,
      filter: showAll ? "all_orders" : "paid_orders_only"
    })
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    sendResponse(res,500,"error","Server Error")
  }
}

const getVendorsByPincode = async (req, res) => {
  const { pincode } = req.query;

  if (!pincode) {
    return sendResponse(res, 400, "warning", "Pincode is required");
  }

  try {
    const vendors = await Vendor.find({
      serviceablePincodes: pincode,
    }).select("-password");

    if (!vendors || vendors.length === 0) {
      return sendResponse(res, 200, "info", "No vendors found for this pincode", []);
    }

    sendResponse(res, 200, "success", "Vendors fetched", vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    sendResponse(res, 500, "error", "Failed to fetch vendors");
  }
}

const viewOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId vendor");  

    if (!order) {
      return sendResponse(res, 404, "error", "Order not found");
    }
    
    return sendResponse(res, 200, "success", "Order details fetched", {order: order.map(sanitizeOrder)});
  } catch (err) {
    console.error("Error fetching order details:", err);
    return sendResponse(res, 500, "error", "Server Error");
  }
}

const markOrderAsCompleted = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return sendResponse(res, 404, "error", "Order not found");
    }

    if (order.vendor.toString() !== req.vendor._id.toString()) {
      return sendResponse(
        res,
        403,
        "warning",
        "You are not authorized to mark this order as completed"
      );
    }

    order.status = "completed";
    await order.save();

    sendResponse(res, 200, "success", "Order marked as completed", {order: order.map(sanitizeOrder)});
  } catch (err) {
    console.error("Error marking order as completed:", err);
    sendResponse(res, 500, "error", "Server Error");
  }
}

const approveOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).select("vendorStatus");
    
    if (!order) {
      return res.status(404).json({ message: "Service not found" });
    }

    order.vendorStatus = "confirmed";
    await order.save();
    return sendResponse(res, 200, "Service accepted", "success", order);
  } catch (error) {
    console.error("Approve order error:", error);
    return sendResponse(res, 500, "Internal Server Error", "error");
  }
}

const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).select("vendorStatus");
    
    if (!order) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    order.vendorStatus = "rejected";
    await order.save();
    return sendResponse(res, 200, "Service rejected", "success", {order});
  } catch (error) {
    console.error("Reject order error:", error);
    return sendResponse(res, 500, "Internal Server Error", "error");
  }
}

export {
    getVendorProfile,
    updateVendorProfile,
    getVendorOrders,    
    getVendorsByPincode,
    markOrderAsCompleted,
    viewOrderDetails,
    approveOrder,
    rejectOrder
}