import mongoose from "mongoose";

const policiesScheman= new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["User", "Workflow", "Finance"], required: true },
        rules: { type: Object, required: true }, // JSON rules
        status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.model("Policies", policiesScheman);