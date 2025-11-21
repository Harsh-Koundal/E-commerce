import sendResponse from "../utils/sendResponse.js";

// Contact Support
export const contactSupport = async (req, res) => {
  try {
    const { issue, orderId } = req.body;

    // In real system, save as support ticket in DB
    return sendResponse(res, 200, "Support ticket created", "success", {
      issue,
      orderId,
    });
  } catch (error) {
    console.error("Support Error:", error);
    return sendResponse(res, 500, "Error creating support ticket", "error");
  }
};
