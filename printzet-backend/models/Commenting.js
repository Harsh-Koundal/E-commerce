import mongoose from 'mongoose';

const commentingSchema = new mongoose.Schema(
  {
    issue_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Issue", 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["active", "resolved"], 
      default: "active" 
    },
    assign_to: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"   // could still be a user/admin who gets assigned
    },
    created_by: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Operation",  // ✅ operation member writing the comment
      required: true 
    }
  },
  { timestamps: true }
);


export default mongoose.model("Commenting", commentingSchema);