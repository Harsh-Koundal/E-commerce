import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  resume: { type: String, required: true }, // ✅ make sure this field matches controller
  appliedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Career", careerSchema);
