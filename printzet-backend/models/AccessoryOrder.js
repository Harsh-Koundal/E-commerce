import mongoose, { Schema } from 'mongoose';

const AccessoryOrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, unique: true, required: true },
  subCategory: { type: String, required: true },
  numCopies: { type: Number, required: true, min: 1 },
  material: { type: String },
  size: { type: String },
  color: { type: String },
  customization: { type: Object },
  additionalFields: { type: Object },
  files: [
    {
      url: { type: String, required: true },
      mimetype: { type: String, required: true },
      public_id: { type: String, required: true },
      originalname: { type: String },
    }
  ],
  totalCost: { type: Number, required: true, min: 0 },
  customerDetails: { // Define the structure for customer details
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'UPI', 'PayPal', 'Bank Transfer'],
    default: 'UPI',
  },
  transactionId: {
    type: String,
    unique: true,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AccessoryOrder = mongoose.model('AccessoryOrder', AccessoryOrderSchema);

export default AccessoryOrder;