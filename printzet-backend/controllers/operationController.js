import Operation from "../models/Operation.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createOperation = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    
    const existing = await Operation.findOne({ email });
    if (existing) {
      return sendResponse(res, 400, "Email already exists", "error");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const operation = await Operation.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    sendResponse(res, 201, "Operation member created successfully", "success", {
      id: operation._id,
      name: operation.name,
      email: operation.email,
      phone: operation.phone,
      address: operation.address,
    });
  } catch (error) {
    sendResponse(res, 400, "Error creating operation member", "error", {
      error: error.message,
    });
  }
};

export const getOperations = async (req, res) => {
  try {
    const operations = await Operation.find().select("-password"); // exclude password
    sendResponse(res, 200, "Operation members fetched successfully", "success", operations);
  } catch (error) {
    sendResponse(res, 400, "Error fetching operations", "error", { error: error.message });
  }
};

export const getOperationById = async (req, res) => {
  try {
    const operation = await Operation.findById(req.userId).select("-password");
    if (!operation) return sendResponse(res, 404, "Operation member not found", "error");

    sendResponse(res, 200, "Operation member fetched successfully", "success", operation);
  } catch (error) {
    sendResponse(res, 400, "Error fetching operation member", "error", { error: error.message });
  }
};

export const updateOperation = async (req, res) => {
  try {
    const { password, ...updates } = req.body;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const operation = await Operation.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!operation) return sendResponse(res, 404, "Operation member not found", "error");

    sendResponse(res, 200, "Operation member updated successfully", "success", operation);
  } catch (error) {
    sendResponse(res, 400, "Error updating operation member", "error", { error: error.message });
  }
};

export const deleteOperation = async (req, res) => {
  try {
    const operation = await Operation.findByIdAndDelete(req.userId);
    if (!operation) return sendResponse(res, 404, "Operation member not found", "error");

    sendResponse(res, 200, "Operation member deleted successfully", "success", operation);
  } catch (error) {
    sendResponse(res, 400, "Error deleting operation member", "error", { error: error.message });
  }
};

export const loginOperation = async (req, res) => {
  try {
    const { email, password } = req.body;

    const operation = await Operation.findOne({ email });
    if (!operation) {
      return sendResponse(res, 404, "Invalid email or password", "error");
    }

    const isMatch = await bcrypt.compare(password, operation.password);
    if (!isMatch) {
      return sendResponse(res, 401, "Invalid email or password", "error");
    }

    const token = jwt.sign(
      { id: operation._id, role: "operation" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    sendResponse(res, 200, "Login successful", "success", {
      token,
      operation: {
        id: operation._id,
        name: operation.name,
        email: operation.email,
        phone: operation.phone,
        address: operation.address,
      },
    });
  } catch (error) {
    sendResponse(res, 400, "Error logging in", "error", { error: error.message });
  }
};

const operationController= {
    createOperation,
    getOperations,
    getOperationById,
    deleteOperation,
    updateOperation,
    loginOperation
}

export default operationController;
