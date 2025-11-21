import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  categoryType: {
    type: String,
    enum: ["document", "accessory"],
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  // Common fields
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  unitCost: { type: Number, required: true },
  itemCost: { type: Number, required: true, min: 0 },
  addedAt: { type: Date, default: Date.now },

  // Document-specific fields
  numCopies: { type: Number, min: 1 },
  paperType: { type: String },
  binding: { type: String },
  lamination: { type: String },
  printedSides: { type: String },
  totalPages: { type: Number, min: 0 },
  files: [
    {
      url: { type: String },
      public_id: { type: String },
      mimetype: { type: String },
      originalname: { type: String },
    },
  ],

  // Accessory-specific fields
  size: { type: String },
  color: { type: String },
  customizations: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    items: [cartItemSchema],
    totalCost: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error("Either userId or guestId must be provided"));
  }
  next();
});

cartSchema.index({ userId: 1 });
cartSchema.index({ guestId: 1 });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;