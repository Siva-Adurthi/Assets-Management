import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  getPublicDepartments,
  updateDepartment
} from "../controllers/departmentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/public", getPublicDepartments);
router.get("/", protect, getDepartments);
router.post("/", protect, adminOnly, createDepartment);
router.put("/:id", protect, adminOnly, updateDepartment);
router.delete("/:id", protect, adminOnly, deleteDepartment);

export default router;
