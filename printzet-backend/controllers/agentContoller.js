import Agent from "../models/Agent.js";
import sendResponse from "../utils/sendResponse.js";

export const getOnlineAgents = async (req, res) => {
  try {
    // Sirf online agents fetch karna
    const agents = await Agent.find({ status: "online" }).select("agentId name phone vehicle");

    if (!agents.length) {
      return sendResponse(res, 404, "No online agents available");
    }

    return sendResponse(res, 200, "Online agents fetched successfully", "success", agents);
  } catch (error) {
    return sendResponse(res, 500, "Error fetching online agents", null, error.message);
  }
};
