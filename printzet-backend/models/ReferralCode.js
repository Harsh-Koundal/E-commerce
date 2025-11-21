const mongoose = require("mongoose");
const referralSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  code: { type: String, unique: true },
});
module.exports = mongoose.model("ReferralCode", referralSchema);
