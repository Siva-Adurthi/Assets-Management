import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "faculty"], default: "faculty" },
    department: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

userSchema.index({ department: 1, role: 1 });

export default mongoose.model("User", userSchema);
