import fs from "fs";
import path from "path";
import Asset from "../models/Asset.js";
import Department from "../models/Department.js";

const buildAssetId = async () => {
  const count = await Asset.countDocuments();
  return `AST${String(count + 1).padStart(3, "0")}`;
};

const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(process.cwd(), imageUrl.replace(/^\//, ""));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

export const getAssets = async (req, res, next) => {
  try {
    const { search, category, department, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { assetName: { $regex: search, $options: "i" } },
        { assetNumber: { $regex: search, $options: "i" } },
        { assetCategory: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } }
      ];
    }
    if (category && category !== "All Categories") filter.assetCategory = category;
    if (department && department !== "All Departments") filter.department = department;
    if (status && status !== "All Status") filter.assetStatus = status;

    const assets = await Asset.find(filter)
      .populate("assignedTo", "userId name email")
      .sort({ createdAt: -1 });

    res.json({ count: assets.length, assets });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedTo", "userId name email");
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req, res, next) => {
  try {
    const {
      assetName, assetCategory, assetNumber, purchaseDate,
      assetCondition, assetStatus, department, description
    } = req.body;

    if (!assetName || !assetCategory || !assetNumber || !purchaseDate || !assetCondition) {
      return res.status(400).json({
        message: "assetName, assetCategory, assetNumber, purchaseDate and assetCondition are required"
      });
    }

    if (Number.isNaN(new Date(purchaseDate).getTime())) {
      return res.status(400).json({ message: "purchaseDate must be a valid date" });
    }

    const duplicate = await Asset.findOne({ assetNumber });
    if (duplicate) return res.status(409).json({ message: "Asset number already exists" });

    const asset = await Asset.create({
      assetId: await buildAssetId(),
      assetName,
      assetCategory,
      assetNumber,
      purchaseDate,
      assetCondition,
      assetStatus: assetStatus || "Available",
      department: department || "Unassigned",
      description: description || "",
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    res.status(201).json({ message: "Asset created successfully", asset });
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const previousStatus = asset.assetStatus;
    const previousImage = asset.imageUrl;
    const updateData = { ...req.body };

    if (updateData.purchaseDate && Number.isNaN(new Date(updateData.purchaseDate).getTime())) {
      return res.status(400).json({ message: "purchaseDate must be a valid date" });
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    Object.assign(asset, updateData);

    // An asset that is not in use should not keep a faculty assignment.
    if (asset.assetStatus !== "In Use" && previousStatus === "In Use") {
      asset.assignedTo = null;
    }

    await asset.save();

    if (req.file && previousImage) deleteImageFile(previousImage);

    res.json({ message: "Asset updated successfully", asset });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    await Department.updateMany(
      { assetId: asset.assetId },
      { $set: { assetId: "" } }
    );

    deleteImageFile(asset.imageUrl);

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const assignAsset = async (req, res, next) => {
  try {
    const { departmentName, allocationDate } = req.body;
    if (!departmentName) return res.status(400).json({ message: "departmentName is required" });

    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    asset.department = departmentName;
    asset.assetStatus = "In Use";
    await asset.save();

    const department = await Department.findOne({ departmentName });
    if (department) {
      department.assetId = asset.assetId;
      department.allocationDate = allocationDate || new Date();
      await department.save();
    }

    res.json({ message: "Asset assigned successfully", asset });
  } catch (error) {
    next(error);
  }
};
