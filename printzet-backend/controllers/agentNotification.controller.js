import sendResponse from "../utils/sendResponse.js";
import Notification from "../models/Notification.js";

//Fetch agent’s notifications
export const getNotifications = async (req, res) => {
  try {
    const agentId = req.userId;

    const notifications = await Notification.find({ user: agentId })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendResponse(res, 200, "Notifications fetched successfully", "success", notifications);
  } catch (error) {
    return sendResponse(res, 500, "Error fetching notifications", null, error.message);
  }
};
