import Order from "../models/Order.js";
import Vendor from "../models/Vendor.js";
import AccessoryOrder from "../models/AccessoryOrder.js";
import sendResponse from "../utils/sendResponse.js";

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select("-password");
    if (!vendor) {
      // return res.status(404).json({ message: "Vendor not found" });
      return sendResponse(res,404,"error","Vendor not Found");
    }
    // res.json({ vendor });
    sendResponse(res,200,"success","Vendor profile fetched",vendor)
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    // res.status(500).json({ message: "Server Error" });
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

    // res.json({
    //   message: "Profile updated successfully",
    //   vendor: updatedVendor,
    // });
    sendResponse(res,200,"success","Profile updated successfully",updatedVendor)
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    // res.status(500).json({ message: "Server Error" });
    sendResponse(res,500,"error","Server Error")
  }
}

const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const orders = await Order.find({ vendor: vendorId })
      .populate("userId categoryId")
      .sort({ createdAt: -1 });

    const accessoryOrders = await AccessoryOrder.find({ vendor: vendorId })
      .populate("userId")
      .sort({ createdAt: -1 });

    // res.json({ orders, accessoryOrders });
    sendResponse(res,200,"success","Order fetched", { orders, accessoryOrders })
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    // res.status(500).json({ message: "Server Error" });
    sendResponse(res,500,"error","Server Error")
  }
}

const getVendorsByPincode = async (req, res) => {
  const { pincode } = req.query;

  if (!pincode) {
    // return res.status(400).json({ error: "Pincode is required" });
    return sendResponse(res, 400, "warning", "Pincode is required");
  }

  try {
    const vendors = await Vendor.find({
      serviceablePincodes: pincode,
    }).select("-password");

    if (!vendors || vendors.length === 0) {
      // return res
      //   .status(200)
      //   .json({ message: "No vendors found for this pincode", vendors: [] });
      return sendResponse(res, 200, "info", "No vendors found for this pincode", []);
    }

    // res.json({ vendors });
    sendResponse(res, 200, "success", "Vendors fetched", vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    // res.status(500).json({ error: "Failed to fetch vendors" });
    sendResponse(res, 500, "error", "Failed to fetch vendors");
  }
}

const viewOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("userId vendor categoryId");  

    if (!order) {
      // return res.status(404).json({ message: "Order not found" });
      return sendResponse(res, 404, "error", "Order not found");
    }
    
    return sendResponse(res, 200, "success", "Order details fetched", order);
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
      // return res.status(404).json({ message: "Order not found" });
      return sendResponse(res, 404, "error", "Order not found");
    }

    if (order.vendor.toString() !== req.vendor._id.toString()) {
      // return res
      //   .status(403)
      //   .json({
      //     message: "You are not authorized to mark this order as completed",
      //   });
      return sendResponse(
        res,
        403,
        "warning",
        "You are not authorized to mark this order as completed"
      );
    }

    order.status = "completed";
    await order.save();

    // res.json({ message: "Order marked as completed", order });
    sendResponse(res, 200, "success", "Order marked as completed", order);
  } catch (err) {
    console.error("Error marking order as completed:", err);
    // res.status(500).json({ message: "Server Error" });
    sendResponse(res, 500, "error", "Server Error");
  }
}

const approveOrder = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Order.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.vendorStatus = accepted;
    await service.save();

    return sendResponse(res, 200, "Service accepted", "success", service);
  } catch (error) {
    console.error("Approve service error:", error);
    return sendResponse(res, 500, "Internal Server Error", "error");
  }
}

const rejectOrder = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Order.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    service.vendorStatus = rejected;
    await service.save();
    return sendResponse(res, 200, "Service rejected", "success", service);
  } catch (error) {
    console.error("Reject service error:", error);
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