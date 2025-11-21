import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

const vendorAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    req.vendor = vendor;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default vendorAuth;
