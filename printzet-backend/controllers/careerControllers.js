import sendResponse from "../utils/sendResponse.js";
import Career from "../models/Career.js";

export const getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    sendResponse(res, 200, "success", "Careers fetched successfully", careers);
  } catch (error) {
    sendResponse(res, 500, "error", "Failed to fetch careers");
  }
};

export const applyForCareer = async (req, res) => {
  const { name, email, phone, position } = req.body;

  if (!name || !email || !phone || !position || !req.file) {
    return sendResponse(res, 400, "warning", "All fields are required including resume");
  }

  try {
    const resumeUrl = req.file.path; // Cloudinary URL

    const application = new Career({
      name,
      email,
      phone,
      position,
      resume: resumeUrl,
    });

    await application.save();

    sendResponse(res, 201, "success", "Application submitted successfully", application);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "error", "Something went wrong");
  }
};

