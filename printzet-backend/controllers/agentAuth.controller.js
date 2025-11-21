// agentAuth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Agent from "../models/Agent.js";
import User from "../models/User.js";
import sendResponse from "../utils/sendResponse.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ _id: id, id, role: "agent" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ==========================
// Register Agent
// ==========================
export const registerAgent = async (req, res) => {
  try {
    const { name, phone, password, vehicle } = req.body;

    // 1️⃣ Check if agent already exists
    const existingAgent = await Agent.findOne({ phone });
    if (existingAgent) {
      return sendResponse(res, 400, "Agent already exists", "error");
    }

    // 2️⃣ Create Agent
    const agent = await Agent.create({
  name,
  phone,
  password,
  vehicle,
  agentId: uuidv4(), // generates unique id
});

    // 3️⃣ Ensure User entry exists for middleware
    let user = await User.findById(agent._id);
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        _id: agent._id, // same _id as Agent
        fullName: agent.name,
        mobile: agent.phone,
        email: `${agent.phone}@agent.printzet.com`, // dummy email to satisfy schema
        password: hashedPassword,
        type: "agent",
      });
    }

    return sendResponse(res, 201, "Agent registered successfully", "success", {
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        status: agent.status,
      },
    });
  } catch (error) {
    console.error("Register Agent Error:", error);
    return sendResponse(res, 500, "Error registering agent", "error", error.message);
  }
};

// ==========================
// Login Agent
// ==========================
export const loginAgent = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const agent = await Agent.findOne({ phone });
    if (!agent || !(await agent.matchPassword(password))) {
      return sendResponse(res, 401, "Invalid phone or password", "error");
    }

    // Ensure User entry exists for middleware
    let user = await User.findById(agent._id);
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        _id: agent._id,
        fullName: agent.name,
        mobile: agent.phone,
        email: `${agent.phone}@agent.printzet.com`, // dummy email
        password: hashedPassword,
        type: "agent",
      });
    }

    // Generate JWT
    const token = generateToken(agent._id);

    return sendResponse(res, 200, "Login successful", "success", {
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        status: agent.status,
      },
    });
  } catch (error) {
    console.error("Login Agent Error:", error);
    return sendResponse(res, 500, "Error during login", "error", error.message);
  }
};

// ==========================
// Logout Agent
// ==========================
export const logoutAgent = async (req, res) => {
  return sendResponse(res, 200, "Logged out successfully", "success");
};
