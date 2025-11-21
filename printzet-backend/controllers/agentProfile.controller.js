import Agent from "../models/Agent.js";
import sendResponse from "../utils/sendResponse.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id);
    if (!agent) return sendResponse(res, 404, "Agent not found", "error");
    return sendResponse(res, 200, "Profile fetched", "success", agent);
  } catch (error) {
    console.error("Profile Error:", error);
    return sendResponse(res, 500, "Error fetching profile", "error");
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.user.id, req.body, { new: true });
    return sendResponse(res, 200, "Profile updated", "success", agent);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return sendResponse(res, 500, "Error updating profile", "error");
  }
};

// Availability
export const updateAvailability = async (req, res) => {
  try {
    const { status } = req.body;
    await Agent.findByIdAndUpdate(req.user.id, { status });
    return sendResponse(res, 200, `Agent is now ${status}`, "success");
  } catch (error) {
    console.error("Availability Error:", error);
    return sendResponse(res, 500, "Error updating availability", "error");
  }
};
