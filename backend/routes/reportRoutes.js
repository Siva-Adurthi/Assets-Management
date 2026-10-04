import { Router } from "express";
import { categoryDistribution, summary } from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/summary", protect, adminOnly, summary);
router.get("/category-distribution", protect, adminOnly, categoryDistribution);

export default router;
