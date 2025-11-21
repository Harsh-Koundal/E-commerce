import mongoose from "mongoose";

const vendorServiceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    price: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminRemarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("VendorService", vendorServiceSchema);
