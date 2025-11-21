import bcrypt from "bcryptjs";
import User from "../models/User.js";

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await User.create({
        fullName: "Admin",
        email: "admin@example.com",
        mobile: "9999999999",
        password: hashedPassword,
        isVerified: true,
        isAdmin: true,
      });
      console.log("Admin user created!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

export default createAdminUser;
