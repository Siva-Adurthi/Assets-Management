import { Router } from "express";
import {
  assignAsset, createAsset, deleteAsset, getAssetById, getAssets, updateAsset
} from "../controllers/assetController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { uploadAssetImage } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", protect, getAssets);
router.get("/:id", protect, getAssetById);
router.post("/", protect, adminOnly, uploadAssetImage.single("image"), createAsset);
router.put("/:id", protect, adminOnly, uploadAssetImage.single("image"), updateAsset);
router.delete("/:id", protect, adminOnly, deleteAsset);
router.put("/:id/assign", protect, adminOnly, assignAsset);

export default router;
