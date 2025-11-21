import Commenting from "../models/Commenting.js";
import User from "../models/User.js";
import Issue from "../models/Issue.js";
import sendResponse from "../utils/sendResponse.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔔 Notify all admins when a comment is created
const notifyAdmins = async (comment) => {
  try {
    // Fetch the related issue for details
    const issue = await Issue.findById(comment.issue_id).select("description status priority");
    if (!issue) return;

    const admins = await User.find({ isAdmin: true });
    if (!admins.length) return;

    for (const admin of admins) {
      const acceptLink = `${process.env.FRONTEND_URL}/comments/assign/${comment._id}?adminId=${admin._id}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: "New Task Assignment Available",
        html: `
          <p>Hello ${admin.fullName},</p>
          <p>A new comment has been created on an issue:</p>
          <p><b>Issue:</b> ${issue.description}</p>
          <p><b>Status:</b> ${issue.status}</p>
          <p><b>Priority:</b> ${issue.priority}</p>
          <p><b>Comment:</b> ${comment.message}</p>
          <p>If you want to take this task, please click 
          <a href="${acceptLink}">here</a>.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error("❌ Error notifying admins:", err);
  }
};

// ➕ Add a new comment
export const addComment = async (req, res) => {
  try {
    const comment = await Commenting.create({
      ...req.body,
      created_by: req.userId, // ✅ secure
    });

    await notifyAdmins(comment);

    sendResponse(res, 201, "Comment added and sent to admins", "success", comment);
  } catch (error) {
    sendResponse(res, 400, "Failed to add comment", "error", { error: error.message });
  }
};

// 👨‍💻 Assign comment to an admin (from email link)
export const assignComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { adminId } = req.query;

    const admin = await User.findOne({ _id: adminId, isAdmin: true });
    if (!admin) {
      return sendResponse(res, 403, "Only admins can take tasks", "error");
    }

    const comment = await Commenting.findById(commentId);
    if (!comment) return sendResponse(res, 404, "Comment not found", "error");

    if (comment.assign_to) {
      return sendResponse(res, 400, "Task already assigned", "error");
    }

    comment.assign_to = admin._id;
    await comment.save();

    sendResponse(res, 200, "Task assigned successfully", "success", comment);
  } catch (error) {
    sendResponse(res, 500, "Failed to assign task", "error", { error: error.message });
  }
};

// 📌 Get all comments for an issue
export const getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Commenting.find({ issue_id: req.params.issueId })
      .populate("issue_id", "description status priority")
      .populate("assign_to", "fullName email")
      .populate("created_by", "name email"); // operation member

    if (!comments || comments.length === 0) {
      return sendResponse(res, 404, "No comments found for this issue", "error", []);
    }

    sendResponse(res, 200, "Comments retrieved successfully", "success", comments);
  } catch (error) {
    sendResponse(res, 500, "Failed to fetch comments", "error", { error: error.message });
  }
};

// ❌ Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Commenting.findByIdAndDelete(req.params.id);
    if (!comment) {
      return sendResponse(res, 404, "Comment not found", "error", null);
    }

    sendResponse(res, 200, "Comment deleted successfully", "success", comment);
  } catch (error) {
    sendResponse(res, 500, "Failed to delete comment", "error", { error: error.message });
  }
};

// ✏️ Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Commenting.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!comment) {
      return sendResponse(res, 404, "Comment not found", "error", null);
    }

    sendResponse(res, 200, "Comment updated successfully", "success", comment);
  } catch (error) {
    sendResponse(res, 500, "Failed to update comment", "error", { error: error.message });
  }
};

const commentingController = {
  addComment,
  assignComment,
  getCommentsByIssue,
  deleteComment,
  updateComment,
};

export default commentingController;