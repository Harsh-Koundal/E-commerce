import User from "../models/User.js";                // Import User model
import sendResponse from "../utils/sendResponse.js"; // Import response helpe


// Middleware to check admin role
export const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            // return res.status(403).json({ message: "Access denied. Admins only." });
            return sendResponse(res, 403, "Access denied. Admins only.", "error");
        }
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        // res.status(500).json({ message: "Server error", error: error.message });
        return sendResponse(res, 500, "Server error", "error", error.message);
    }
};
