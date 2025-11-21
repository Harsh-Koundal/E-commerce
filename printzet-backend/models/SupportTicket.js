import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userModel",
      required: true
    },
    userModel: {
      type: String,
      enum: ["Customer", "Agent"],
      required: true
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
