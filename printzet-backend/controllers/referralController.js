import Referral from "../models/Referral.js";
import LoyaltyPoint from "../models/LoyaltyPoint.js";
import crypto from "crypto";

// Generate referral code
export const generateReferralCode = async (req, res) => {
  try {
    const userId = req.user._id;

    const existing = await Referral.findOne({ user: userId });
    if (existing) return res.json({ code: existing.code });

    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char
    const code = `${req.user.name?.split(" ")[0] || "REF"}-${randomCode}`;

    const referral = new Referral({ user: userId, code });
    await referral.save();

    res.status(201).json({ code });
  } catch (error) {
    console.error("Error generating referral code:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Use referral code
export const useReferralCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    if (!code)
      return res.status(400).json({ message: "Referral code is required" });

    const referral = await Referral.findOne({ code });
    if (!referral)
      return res.status(404).json({ message: "Invalid referral code" });

    // Prevent using own code or multiple uses
    if (referral.user.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You cannot use your own referral code" });
    }
    if (referral.usedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already used this referral code" });
    }

    // Reward both users (optional logic)
    await LoyaltyPoint.findOneAndUpdate(
      { user: referral.user },
      { $inc: { points: 50 } },
      { upsert: true }
    );

    await LoyaltyPoint.findOneAndUpdate(
      { user: userId },
      { $inc: { points: 20 } },
      { upsert: true }
    );

    referral.usedBy.push(userId);
    await referral.save();

    res.status(200).json({ message: "Referral code applied successfully" });
  } catch (error) {
    console.error("Error using referral code:", error);
    res.status(500).json({ message: "Server error" });
  }
};
