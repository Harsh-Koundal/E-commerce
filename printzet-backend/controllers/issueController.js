import Issue from "../models/Issue.js";
import Operation from "../models/Operation.js";
import User from "../models/User.js";
import sendResponse from "../utils/sendResponse.js";

let lastAssignedIndex = 0;

// 🔒 helper to check admin/operation
const checkAdminOrOperation = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user) {
    sendResponse(res, 401, "Unauthorized", "error");
    return null;
  }

  if (user.isAdmin) return { role: "admin", user };
  
  const operationMember = await Operation.findOne({ userId });
  if (operationMember) return { role: "operation", user: operationMember };

  sendResponse(res, 403, "Access denied", "error");
  return null;
};

// ✅ Create Issue (accessible by users)
export const createIssue = async (req, res) => {
  try {
    const operations = await Operation.find();
    if (!operations || operations.length === 0) {
      return sendResponse(res, 400, "No operation team available", "error");
    }

    // Round robin assignment
    const assignedMember = operations[lastAssignedIndex % operations.length];
    lastAssignedIndex++;

    const issue = await Issue.create({
      ...req.body,
      assign_to: assignedMember._id,
    });

    sendResponse(res, 201, "Issue successfully submitted & assigned", "success", issue);
  } catch (error) {
    sendResponse(res, 400, "Error creating issue", "error", { error: error.message });
  }
};

// ✅ Get issues by logged-in operation or admin
export const getIssuesByOperationId = async (req, res) => {
  try {
    const roleCheck = await checkAdminOrOperation(req.userId, res);
    if (!roleCheck) return;

    let issues;
    if (roleCheck.role === "admin") {
      issues = await Issue.find()
        .populate("order_id")
        .populate("assign_to", "name email");
    } else {
      issues = await Issue.find({ assign_to: roleCheck.user._id })
        .populate("order_id")
        .populate("assign_to", "name email");
    }

    if (!issues || issues.length === 0) {
      return sendResponse(res, 404, "No issues found", "error");
    }

    sendResponse(res, 200, "Issues fetched successfully", "success", issues);
  } catch (error) {
    sendResponse(res, 500, "Error fetching issues", "error", { error: error.message });
  }
};

// ✅ Update issue (only admin/assigned operation)
export const updateIssue = async (req, res) => {
  try {
    const roleCheck = await checkAdminOrOperation(req.userId, res);
    if (!roleCheck) return;

    const { id } = req.params;
    let issue = await Issue.findById(id);
    if (!issue) return sendResponse(res, 404, "Issue Not Found", "error");

    if (roleCheck.role === "operation" && issue.assign_to.toString() !== roleCheck.user._id.toString()) {
      return sendResponse(res, 403, "Not authorized to update this issue", "error");
    }

    issue = await Issue.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    sendResponse(res, 200, "Issue Updated Successfully", "success", issue);
  } catch (error) {
    sendResponse(res, 400, "Error updating issue", "error", { error: error.message });
  }
};

// ✅ Delete issue (only admin/assigned operation)
export const deleteIssue = async (req, res) => {
  try {
    const roleCheck = await checkAdminOrOperation(req.userId, res);
    if (!roleCheck) return;

    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return sendResponse(res, 404, "Issue Not Found", "error");

    if (roleCheck.role === "operation" && issue.assign_to.toString() !== roleCheck.user._id.toString()) {
      return sendResponse(res, 403, "Not authorized to delete this issue", "error");
    }

    await Issue.findByIdAndDelete(id);
    sendResponse(res, 200, "Issue deleted successfully", "success");
  } catch (error) {
    sendResponse(res, 400, "Error deleting issue", "error", { error: error.message });
  }
};

const issueController = {
  createIssue,
  getIssuesByOperationId,
  updateIssue,
  deleteIssue,
};

export default issueController;