import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    message: String,
},{timestamps: true})

export const Support = mongoose.model("Support", supportSchema)

