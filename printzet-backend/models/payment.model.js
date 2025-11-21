import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["CUSTOMER_PAYMENT", "VENDOR_PAYMENT", "REFUND", "SETTLEMENT"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },

    // For linking transaction
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

    // Payment details
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "UPI", "PAYPAL", "BANK_TRANSFER", "CASH"],
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    transactionId: { type: String, unique: true }, // from gateway
    gatewayResponse: { type: mongoose.Schema.Types.Mixed }, // store full response

    // Settlement tracking
    settlement: {
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
      settledAmount: { type: Number, default: 0 },
      settlementDate: { type: Date },
      referenceId: { type: String }, // Bank/UPI ref no.
    },

    // Refund details
    refund: {
      isRefunded: { type: Boolean, default: false },
      refundAmount: { type: Number },
      refundDate: { type: Date },
      reason: { type: String },
      referenceId: { type: String }, // refund ref ID
    },

    currency: { type: String, default: "INR" },
    metadata: { type: mongoose.Schema.Types.Mixed }, // any extra data
  },
  { timestamps: true }
);

export default mongoose.model("Payment", transactionSchema);