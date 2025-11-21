import Order from "../models/Order.js";
import { Feedback} from "../models/feedback.model.js";
import sendResponse from "../utils/sendResponse.js";

// Vendor - Get Completed Orders
export const getCompletedOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const completedOrders = await Order.find({
      vendor: vendorId,
      status: "completed",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      "success",
      "Completed orders fetched successfully",
      completedOrders
    );
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    return sendResponse(res, 500, "error", "Server error");
  }
};

//Vendor - Get Feedbacks
export const getVendorFeedbacks = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const feedbacks = await Feedback.find({ vendorId })
      .populate("userId", "name email")
      .populate("orderId", "_id status")
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      "success",
      "Feedbacks fetched successfully",
      feedbacks
    );
  } catch (error) {
    console.error("Error fetching vendor feedbacks:", error);
    return sendResponse(res, 500, "error", "Server error");
  }
};
