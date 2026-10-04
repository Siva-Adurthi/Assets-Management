import { Router } from "express";
import { createUser, getUsers, updateUser } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.patch("/:id", protect, adminOnly, updateUser);
router.patch("/:id/role", protect, adminOnly, updateUser);

export default router;
