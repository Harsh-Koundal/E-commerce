import Policies from "../models/Policies.js";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";

const checkAdmin = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user || !user.isAdmin) {
    sendResponse(res, 403, "Only admins can perform this action", "error");
    return false;
  }
  return true;
};

const createPolicy = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId, res))) return;
    const policy = await Policies.create({
      ...req.body,
      created_by: req.userId || null,
    });

    sendResponse(res, 201, "Policy created successfully", "success", policy);
  } catch (error) {
    sendResponse(res, 400, "Error creating policy", "error", { error: error.message });
  }
};

const getPolicies = async (req, res) => {
  try {
    const policies = await Policies.find().populate("created_by", "name email");
    sendResponse(res, 200, "Policies fetched successfully", "success", policies);
  } catch (error) {
    sendResponse(res, 400, "Error fetching policies", "error", { error: error.message });
  }
};


const getPolicyById = async (req, res) => {
  try {
    const policy = await Policies.findById(req.params.id).populate("created_by", "name email");

    if (!policy) {
      return sendResponse(res, 404, "Policy not found", "error");
    }

    sendResponse(res, 200, "Policy fetched successfully", "success", policy);
  } catch (error) {
    sendResponse(res, 400, "Error fetching policy", "error", { error: error.message });
  }
};


const updatePolicy = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId, res))) return;
    const policy = await Policies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!policy) {
      return sendResponse(res, 404, "Policy not found", "error");
    }

    sendResponse(res, 200, "Policy updated successfully", "success", policy);
  } catch (error) {
    sendResponse(res, 400, "Error updating policy", "error", { error: error.message });
  }
};


const deletePolicy = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId, res))) return;
    const policy = await Policies.findByIdAndDelete(req.params.id);

    if (!policy) {
      return sendResponse(res, 404, "Policy not found", "error");
    }

    sendResponse(res, 200, "Policy deleted successfully", "success", policy);
  } catch (error) {
    sendResponse(res, 400, "Error deleting policy", "error", { error: error.message });
  }
};


const togglePolicyStatus = async (req, res) => {
  try {
    if (!(await checkAdmin(req.userId, res))) return;
    const policy = await Policies.findById(req.params.id);

    if (!policy) {
      return sendResponse(res, 404, "Policy not found", "error");
    }

    policy.status = policy.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await policy.save();

    sendResponse(res, 200, "Policy status updated successfully", "success", policy);
  } catch (error) {
    sendResponse(res, 400, "Error updating policy status", "error", { error: error.message });
  }
};

const policiesController= {
    createPolicy,
    getPolicies,
    getPolicyById,
    deletePolicy,
    updatePolicy,
    togglePolicyStatus
}

export default policiesController;