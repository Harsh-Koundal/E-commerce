import Loyalty from "../models/Loyalty.js";
import sendResponse from "../utils/sendResponse.js";

// ✅ Add or Update Loyalty Points
export const addOrUpdateLoyalty = async (req, res) => {
  try {
    const { userId, points, level } = req.body;

    let loyalty = await Loyalty.findOne({ userId });

    if (loyalty) {
      loyalty.points = points ?? loyalty.points;
      loyalty.level = level ?? loyalty.level;
      await loyalty.save();
    } else {
      loyalty = await Loyalty.create({ userId, points, level });
    }

    return sendResponse(res, 200, "success", "Loyalty updated successfully", loyalty);
  } catch (error) {
    return sendResponse(res, 500, "error", error.message);
  }
};

// ✅ Get Loyalty by UserId
export const getLoyaltyByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loyalty = await Loyalty.findOne({ userId }).populate("userId", "fullName email");

    if (!loyalty) return sendResponse(res, 404, "error", "Loyalty not found");

    return sendResponse(res, 200, "success", "Loyalty fetched", loyalty);
  } catch (error) {
    return sendResponse(res, 500, "error", error.message);
  }
};

// ✅ Get All Loyalty Records (Admin only)
export const getAllLoyalty = async (req, res) => {
  try {
    const loyaltyList = await Loyalty.find().populate("userId", "fullName email");
    return sendResponse(res, 200, "success", "All loyalty records fetched", loyaltyList);
  } catch (error) {
    return sendResponse(res, 500, "error", error.message);
  }
};

// ✅ Delete Loyalty for a user
export const deleteLoyalty = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await Loyalty.findOneAndDelete({ userId });

    if (!deleted) return sendResponse(res, 404, "error", "No loyalty record found");

    return sendResponse(res, 200, "success", "Loyalty deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, "error", error.message);
  }
};
