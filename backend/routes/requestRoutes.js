import { Router } from "express";
import {
  approveRequest,
  cancelRequest,
  createRequest,
  getAllRequests,
  getMyRequests,
  rejectRequest,
  releaseRequest
} from "../controllers/requestController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createRequest);
router.get("/mine", protect, getMyRequests);
router.get("/", protect, adminOnly, getAllRequests);
router.put("/:id/approve", protect, adminOnly, approveRequest);
router.put("/:id/reject", protect, adminOnly, rejectRequest);
router.put("/:id/cancel", protect, cancelRequest);
router.put("/:id/release", protect, releaseRequest);

export default router;
