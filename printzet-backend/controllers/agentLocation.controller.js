import sendResponse from "../utils/sendResponse.js";
import Agent from "../models/Agent.js";

// Agent updates live location
export const updateLocation = async (req, res) => {
  try {
    const agentId = req.userId;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return sendResponse(res, 400, "Latitude and Longitude required");
    }

    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { location: { lat, lng } },
      { new: true }
    ).select("-password");

    return sendResponse(res, 200, "Location updated successfully", "success", agent);
  } catch (error) {
    return sendResponse(res, 500, "Error updating location", null, error.message);
  }
};
