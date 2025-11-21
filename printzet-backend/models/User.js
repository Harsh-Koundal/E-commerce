import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isEmployee: { type: Boolean, default: false },
    type: { type: String },
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    resetToken: String,
    tokenExpiry: Date,

    // ✅ Array of addresses
    address: [addressSchema],

    // ✅ Preferences for theme/UI
    preferences: {
      theme: { type: String, default: "light" },
      ui: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
