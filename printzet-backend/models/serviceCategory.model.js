import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        mimetype: { type: String},
        originalname: { type: String }, 
    },
    paperSize:{
        type: String,
    },
    tShirtSizes:{
        type: [String],
    },
    costperCopy:{
        type: mongoose.Schema.Types.Mixed,
    },
}, { timestamps: true });

export const Service = mongoose.model("Service", ServiceSchema)