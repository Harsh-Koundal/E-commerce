import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    },
    files: [
        {
        url: { type: String, required: true },
        originalname: { type: String },
        }
    ],
    settings: {
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
        numCopies: {
            type: Number,
            min: 1,
        },
        colorType: {
            type: String,
            enum: ["blackWhite", "color"],
        },
    }
}, { timestamps: true });

export const Document = mongoose.model("Document", documentSchema)