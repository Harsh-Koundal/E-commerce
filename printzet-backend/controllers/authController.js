import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs"; 
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sendResponse from "../utils/sendResponse.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    // console.log("✅ Email transporter is ready");
  }
});

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // if (!user) return res.status(404).json({ message: "User not found" });
    if (!user) return sendResponse(res, 404, "User not found", "error");


    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.tokenExpiry = Date.now() + 3600000; // 1-hour expiry

    await user.save();
    
    console.log("✅ Stored Token in DB:", resetToken); // <--- LOG TOKEN SAVED IN DB
    console.log("⏳ Token Expiry:", new Date(user.tokenExpiry).toLocaleString());

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Error sending email:", err);
        // return res.status(500).json({ message: "Error sending email" });
        return sendResponse(res, 500, "Error sending email", "error");

      }
      console.log("📧 Reset email sent:", info.response);
      // res.json({ message: "Password reset email sent" });
      sendResponse(res, 200, "Password reset email sent", "success");

    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    // res.status(500).json({ message: "Server error" });
    sendResponse(res,500,"Server error", "error",error)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("🔹 Received Token:", token);
    console.log("🔹 Received New Password:", newPassword);

    if (!token || !newPassword) {
      // return res.status(400).json({ message: "Token and new password are required" });
      return sendResponse(res, 400, "Token and new password are required", "error");

    }

    // Debug: Fetch all users with resetToken
    const allUsers = await User.find({}, { email: 1, resetToken: 1, tokenExpiry: 1 });
    console.log("📌 All Users with Tokens:", allUsers);

    // Find user by token & check expiry
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

    console.log("🔹 Found User:", user ? user.email : "No user found");

    if (!user) {
      // return res.status(400).json({ message: "Invalid or expired token" });
      return sendResponse(res, 400, "Invalid or expired token", "error");

    }

    console.log("✅ Valid Token. Proceeding to reset password.");

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successfully!");
    // res.json({ message: "Password reset successful! You can now login." });
    sendResponse(res, 200, "Password reset successful! You can now login.", "success");


  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    // res.status(500).json({ message: "Server error" });
    sendResponse(res, 500, "Server error", "error", error);

  }
}

export { forgotPassword, resetPassword };