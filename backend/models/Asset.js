import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetId: { type: String, unique: true, trim: true },
    assetName: { type: String, required: true, trim: true },
    assetCategory: {
      type: String,
      enum: [
        "Computers",
        "Projectors",
        "Printers",
        "Laboratory Equipment",
        "Furniture",
        "UPS Systems",
        "Networking Devices",
        "Monitors",
        "Storage Devices",
        "Other"
      ],
      required: true
    },
    assetNumber: { type: String, required: true, unique: true, trim: true },
    purchaseDate: { type: Date, required: true },
    assetCondition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "Damaged"],
      required: true
    },
    assetStatus: {
      type: String,
      enum: ["Available", "In Use", "Under Maintenance", "Reserved", "Damaged", "Retired"],
      default: "Available"
    },
    department: { type: String, default: "Unassigned", trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    imageUrl: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

assetSchema.index({
  assetName: "text",
  assetNumber: "text",
  assetCategory: "text",
  department: "text"
});

export default mongoose.model("Asset", assetSchema);
