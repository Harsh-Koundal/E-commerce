import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subCategory: {
            type: String,
            required: true,
        },
        customerDetails: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        paperType: {
            type: String,
            default: "Normal",
        },
        printQuality: {
            type: String,
            default: "Standard",
        },
        binding: {
            type: String,
            default: "No Binding",
        },
        lamination: {
            type: String,
            default: "None",
        },
        printedSides: {
            type: String,
            default: "SingleSide",
        },
        files: [
            {
              url: { type: String, required: true },
              public_id: { type: String, required: true },
              pageCount: { type: Number, default: 0 },
              mimetype: { type: String, required: true },
              originalname: { type: String }, 
            },
          ],
        numCopies: {
            type: Number,
            required: true,
            min: 1,
        },
        colorType: {
            type: String,
            enum: ["blackWhite", "color"],
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
            min: 0,
        },
        totalCost: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            // enum: ['pending', 'completed', 'failed'],
            enum:['pending', 'approved','rejected','in-progress','completed','failed','refunded','cancelled',"picked_up", "on_the_way", "delivered","assigned"],
            default: 'pending',
        },
        refundDetails:{
            reason:{ type: String},
            processed:{type: Boolean, default: false},
            processedAt:{type: Date}
        },        
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: false,
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
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        vendorStatus:{
            type: String,
            enum: ['confirmed', 'accepted', 'rejected','pending'],
            default: 'pending',
        },
        assignedAgent: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Agent", 
            required: false 
        },
        //otp verification
        otp: { type: String },
        otpExpiry: { type: Date },
    }, 
    

    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
