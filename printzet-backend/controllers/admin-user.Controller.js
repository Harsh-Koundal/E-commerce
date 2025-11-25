import User from "../models/User.js";
import Order from "../models/Order.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcryptjs";

const createAdminUser = async (req, res) => {
  try {
    const { name, email,role, status, joinDate, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, "User with this email already exists", "error");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: name,
      email,
      mobile,
      password: hashedPassword,
      status,
      joinDate,
      role,
      isAdmin:role==="admin"?true:false,
      isEmployee: true,
      isVerified: true,
    });

    await newUser.save();
    //don't set password in response
    newUser.password = undefined;
    return sendResponse(res, 201, "User created successfully", "success", { user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return sendResponse(res, 500, "Internal Server Error", "error");
  }
};

const editAdminUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, mobile, email, role} = req.body;
        const isAdmin = role==="admin"?true:false;
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, "User not found", "error");
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.isAdmin = isAdmin;

        await user.save();

        return sendResponse(res, 200, "Admin user updated successfully", "success");
    }catch(error){
        console.error("Error editing admin user:",error);
        return sendResponse(res, 500, "Internal Server Error", "error");
    }
}

const deleteAdminUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, "User not found", "error");
        }
        await User.deleteOne({ _id: userId });
        return sendResponse(res, 200, "Admin user deleted successfully", "success");
    }
    catch(error){
        console.error("Error deleting admin user:",error);
        return sendResponse(res, 500, "Internal Server Error", "error");
    }
}

const getUserActivityLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, "User not found", "error");
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        return sendResponse(res, 200, "User activity logs fetched successfully", "success", { orders });
    }catch(error){
        console.error("Error fetching user activity logs:",error);
        return sendResponse(res, 500, "Internal Server Error", "error");
    }
}

const getAllEmployees = async (req, res) => {
  try {
    // ✅ Only fetch employees (not admins), and verified users
    const users = await User.find({
      isEmployee: true,
      isAdmin: false,     // strict: employees only, exclude admins
      isVerified: true,   // fixed field name
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, "Employees fetched successfully", "success", { users });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return sendResponse(res, 500, "Internal Server Error", "error");
  }
};

export {
    createAdminUser,
    editAdminUser,
    deleteAdminUser,
    getUserActivityLogs,
    getAllEmployees
}