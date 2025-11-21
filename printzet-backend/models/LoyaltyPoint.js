// models/LoyaltyPoint.js
import { Schema, model } from "mongoose";
const loyaltySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  points: { type: Number, default: 0 },
});
export default model("LoyaltyPoint", loyaltySchema);


export async function findOne(query) {
  return await LoyaltyPoint.findOne(query);
}

export async function findOneAndUpdate(query, update, options) {
  return await LoyaltyPoint.findOneAndUpdate(query, update, options);
}