import mongoose from 'mongoose';

const issueSchema= new mongoose.Schema(
    {
        type: { type: String },
        description: { type: String },
        resolved: { type: String, default: false }
    },
    {
        timestamps: true
    }
)

const deliverySchema= new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        status: { type: String },
        deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deliveryAddress: {
            address: String,
            city: String,
            state: String,
            pincode: String,
        },
        estimatedDeliveryTime: { type: String },
        issue: [issueSchema],
        trackingId: { type: String },
        proofOfDelivery: {
            type: String, // store URL to signature/photo or OTP
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Delivery", deliverySchema);