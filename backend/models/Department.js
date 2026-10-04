import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      unique: true,
      trim: true
    },
    departmentName: {
      type: String,
      required: true,
      trim: true
    },
    HODName: {
      type: String,
      required: true,
      trim: true
    },
    assetId: {
      type: String,
      default: "",
      trim: true
    },
    allocationDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
