import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
    default: "Bronze",
  },
}, { timestamps: true });

const Loyalty = mongoose.model("Loyalty", loyaltySchema);
export default Loyalty;
