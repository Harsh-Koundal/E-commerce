import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import sendResponse from "../utils/sendResponse.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("Email transporter error:", error);
});

// Generate token
const generateVerificationToken = () => crypto.randomBytes(20).toString("hex");

// Send verification email
const sendVerificationEmail = async (vendor, token) => {
  const link = `${process.env.FRONTEND_URL}/vendor/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: vendor.email,
    subject: "Verify your vendor account",
    html: `<p>Please click <a href="${link}">here</a> to verify your vendor account.</p>`,
  };
  return transporter.sendMail(mailOptions);
};

const vedorSignup = async (req, res) => {
  try {
    const {
      // support both legacy and new field names
      name,
      businessName,
      email,
      password,
      phone,
      pressName,
      websiteUrl,
      address,
      vendorAddress,
      serviceablePincodes,
      bankingDetails,
      companyInfo,
    } = req.body;

    const existing = await Vendor.findOne({ email });
    if (existing)
      return sendResponse(res, 400, "warning", "Vendor already exists");
      // return res.status(400).json({ message: "Vendor already exists" });


    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const newVendor = new Vendor({
      // Handle Names: Keep OLD and add NEW
      name: name, // Legacy field
      businessName: businessName, // New field

      email,
      password: hashedPassword,
      phone,

      // Handle Press/Website: Keep OLD and add NEW
      pressName: pressName, // Legacy field
      websiteUrl: websiteUrl, // New field

      // Handle Address: Keep OLD and add NEW
      address: address, // Legacy field (String)
      vendorAddress: vendorAddress, // New field (Object)

      serviceablePincodes,
      bankingDetails,
      companyInfo,
      isVerified: false,
      verificationToken,
    });

    await newVendor.save();
    await sendVerificationEmail(newVendor, verificationToken);

    // res.status(201).json({ message: "Vendor registered successfully. Please verify your email." });
    sendResponse(
      res,
      201,
      "success",
      "Vendor registered successfully. Please verify your email.",
      { id: newVendor._id }
    );
  } catch (err) {
    console.error("Vendor signup error:", err);
    // res.status(500).json({ error: err.message });
    sendResponse(res, 500, "error", "Server error")
  }
}

const verifyVendorEmail = async (req, res) => {
  const token = req.params.token;

  try {
    const vendor = await Vendor.findOne({ verificationToken: token });

    if (!vendor)
      return sendResponse(res, 400, "warning", "Invalid or expired token");

    if (vendor.isVerified)
      return sendResponse(res, 200, "info", "Vendor already verified");

    vendor.isVerified = true;
    vendor.verificationToken = undefined;
    await vendor.save();

      // return res.status(200).json({ message: "Vendor email verified successfully" });
      sendResponse(res, 200, "success", "Email verified successfully");
    

    // return res.status(400).json({ message: "Invalid or expired token" });
  } catch (error) {
    console.error("Vendor email verification error:", error);
    // return res.status(500).json({ message: "Server error" });
    sendResponse(res, 500, "error", "Server error");
  }
}

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      // return res.status(400).json({ message: "Vendor not found." });
      return sendResponse(res, 404, "warning", "Vendor not found");
    }

    if (vendor.isVerified) {
      // return res.status(400).json({ message: "Vendor is already verified." });
      return sendResponse(res, 400, "info", "Vendor already verified");
    }

    const newToken = generateVerificationToken();
    vendor.verificationToken = newToken;
    await vendor.save();

    await sendVerificationEmail(vendor, newToken);

    // res.status(200).json({ message: "Verification email resent successfully." });
    sendResponse(res, 200, "success", "Verification email resent");
  } catch (error) {
    console.error("Error resending verification email:", error);
    // res.status(500).json({ message: "Server error." });
    sendResponse(res, 500, "error", "Server error");
  }
}

const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return sendResponse(res, 400, "Vendor not found", "error");

    if (!vendor.isVerified) {
      // return res.status(400).json({ message: "Please verify your email before logging in." });
      return sendResponse(res, 400, "warning", "Please verify your email");
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return sendResponse(res, 400, "Invalid credentials", "error");

    const token = jwt.sign({ id: vendor._id }, JWT_SECRET, { expiresIn: "7d" });

    // res.json({
    //   message: "Login successful",
    //   token,
    //   vendor: {
    //     id: vendor._id,
    //     name: vendor.name,
    //     email: vendor.email,
    //     pressName: vendor.pressName,
    //     address: vendor.address,
    //     serviceablePincodes: vendor.serviceablePincodes,
    //   },
    // });
    sendResponse(res, 200, "Login successful", "success", {
      token,
      vendor: {
        id: vendor._id,
        // Legacy Fields - return exact values
        name: vendor.name,
        pressName: vendor.pressName,
        address: vendor.address,
        // New Fields - return exact values
        businessName: vendor.businessName,
        websiteUrl: vendor.websiteUrl,
        vendorAddress: vendor.vendorAddress,
        // Other fields
        email: vendor.email,
        serviceablePincodes: vendor.serviceablePincodes,
        bankingDetails: vendor.bankingDetails,
        companyInfo: vendor.companyInfo,
      },
    });
  } catch (err) {
    console.error("Vendor login error:", err);
    // res.status(500).json({ error: err.message });
    sendResponse(res, 500, "error", "Server error");
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return sendResponse(res, 404, "warning", "Vendor not found");

    const resetToken = generateVerificationToken();
    vendor.verificationToken = resetToken;
    vendor.tokenExpiry = Date.now() + 3600000; // 1 hour
    await vendor.save();

    const resetLink = `${process.env.FRONTEND_URL}/vendor/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendor.email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    // res.status(200).json({ message: "Password reset email sent." });
    sendResponse(res, 200, "success", "Password reset email sent");
  } catch (error) {
    console.error("Forgot password error:", error);
    // res.status(500).json({ message: "Server error" });
    sendResponse(res, 500, "error", "Server error");
  }
}

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const vendor = await Vendor.findOne({
      verificationToken: token,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!vendor) {
      return sendResponse(res, 400, "warning", "Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    vendor.password = hashed;
    vendor.verificationToken = undefined;
    vendor.tokenExpiry = undefined;
    await vendor.save();

    // res.status(200).json({ message: "Password reset successful." });
    sendResponse(res, 200, "success", "Password reset successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    // res.status(500).json({ message: "Server error" });
    sendResponse(res, 500, "error", "Server error");
  }
}

export {
    vedorSignup,
    verifyVendorEmail,
    resendVerificationEmail,
    vendorLogin,
    forgotPassword,
    resetPassword
}