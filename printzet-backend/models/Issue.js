import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    issue_type: {
      type: String,
      enum: ["delivery", "payment", "product", "other"], // example
      required: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["active", "resolved","open"],
      default: "open"
    },
    assign_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Issue", issueSchema);