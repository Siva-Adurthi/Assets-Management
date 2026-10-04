import mongoose from "mongoose";

const assetRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, unique: true, trim: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    facultyDepartment: { type: String, required: true, trim: true },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    reason: { type: String, required: true, trim: true },
    requestDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Released"],
      default: "Pending"
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    responseDate: { type: Date, default: null },
    releasedAt: { type: Date, default: null },
    adminRemark: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

assetRequestSchema.index({ facultyId: 1, status: 1 });
assetRequestSchema.index({ assetId: 1, status: 1 });
assetRequestSchema.index({ facultyDepartment: 1, status: 1 });

export default mongoose.model("AssetRequest", assetRequestSchema);
