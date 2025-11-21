// models/Referral.js
import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One referral code per user
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Referral", referralSchema);
