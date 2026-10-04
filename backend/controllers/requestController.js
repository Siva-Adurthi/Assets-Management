import Asset from "../models/Asset.js";
import AssetRequest from "../models/AssetRequest.js";

const buildRequestId = async () => {
  const count = await AssetRequest.countDocuments();
  return `REQ${String(count + 1).padStart(3, "0")}`;
};

const populateRequest = request => request.populate([
  { path: "facultyId", select: "userId name email role department" },
  { path: "assetId", select: "assetName assetNumber assetCategory assetStatus imageUrl department assignedTo" },
  { path: "approvedBy", select: "userId name email" }
]);

export const createRequest = async (req, res, next) => {
  try {
    const { assetId, reason } = req.body;
    const facultyDepartment = req.user.department?.trim();

    if (!assetId || !reason?.trim()) {
      return res.status(400).json({ message: "assetId and reason are required" });
    }

    if (!facultyDepartment) {
      return res.status(400).json({
        message: "Your account has no department. Ask an admin to assign your department first."
      });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (asset.assetStatus !== "Available" || asset.assignedTo) {
      return res.status(409).json({ message: "This asset is no longer available" });
    }

    const pending = await AssetRequest.findOne({ assetId, status: "Pending" });
    if (pending) {
      return res.status(409).json({ message: "This asset already has a pending request" });
    }

    const existingByFaculty = await AssetRequest.findOne({
      facultyId: req.user._id,
      assetId,
      status: { $in: ["Pending", "Approved"] }
    });
    if (existingByFaculty) {
      return res.status(409).json({ message: "You already have an active request for this asset" });
    }

    const request = await AssetRequest.create({
      requestId: await buildRequestId(),
      facultyId: req.user._id,
      facultyDepartment,
      assetId,
      reason: reason.trim()
    });

    const populated = await populateRequest(request);
    res.status(201).json({ message: "Asset request submitted", request: populated });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await AssetRequest.find({ facultyId: req.user._id })
      .populate("facultyId", "userId name email department")
      .populate("assetId", "assetName assetNumber assetCategory assetStatus imageUrl department assignedTo")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

export const getAllRequests = async (req, res, next) => {
  try {
    const filter = req.query.status && req.query.status !== "All"
      ? { status: req.query.status }
      : {};

    const requests = await AssetRequest.find(filter)
      .populate("facultyId", "userId name email role department")
      .populate("assetId", "assetName assetNumber assetCategory assetStatus imageUrl department assignedTo")
      .populate("approvedBy", "userId name email")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const request = await AssetRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "Pending") {
      return res.status(409).json({ message: `Request is already ${request.status.toLowerCase()}` });
    }

    const asset = await Asset.findById(request.assetId);
    if (!asset) return res.status(404).json({ message: "Requested asset no longer exists" });
    if (asset.assetStatus !== "Available" || asset.assignedTo) {
      return res.status(409).json({ message: "Asset is no longer available for approval" });
    }

    const { adminRemark = "" } = req.body;

    asset.assetStatus = "In Use";
    asset.assignedTo = request.facultyId;
    await asset.save();

    try {
      request.status = "Approved";
      request.approvedBy = req.user._id;
      request.responseDate = new Date();
      request.adminRemark = String(adminRemark).trim();
      request.releasedAt = null;
      await request.save();
    } catch (saveError) {
      asset.assetStatus = "Available";
      asset.assignedTo = null;
      await asset.save();
      throw saveError;
    }

    const populated = await populateRequest(request);
    res.json({ message: "Request approved and asset assigned", request: populated });
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const request = await AssetRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "Pending") {
      return res.status(409).json({ message: `Request is already ${request.status.toLowerCase()}` });
    }

    const { adminRemark = "" } = req.body;
    request.status = "Rejected";
    request.approvedBy = req.user._id;
    request.responseDate = new Date();
    request.adminRemark = String(adminRemark).trim();
    await request.save();

    const populated = await populateRequest(request);
    res.json({ message: "Request rejected", request: populated });
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (req, res, next) => {
  try {
    const request = await AssetRequest.findOne({
      _id: req.params.id,
      facultyId: req.user._id
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "Pending") {
      return res.status(409).json({ message: "Only pending requests can be cancelled" });
    }

    request.status = "Cancelled";
    await request.save();
    res.json({ message: "Request cancelled", request });
  } catch (error) {
    next(error);
  }
};

export const releaseRequest = async (req, res, next) => {
  try {
    const request = await AssetRequest.findOne({
      _id: req.params.id,
      facultyId: req.user._id,
      status: "Approved"
    });

    if (!request) {
      return res.status(404).json({ message: "Approved asset request not found" });
    }

    const asset = await Asset.findById(request.assetId);
    if (!asset) {
      return res.status(404).json({ message: "Assigned asset no longer exists" });
    }

    if (!asset.assignedTo || String(asset.assignedTo) !== String(req.user._id)) {
      return res.status(409).json({
        message: "This asset is not currently assigned to your account"
      });
    }

    asset.assetStatus = "Available";
    asset.assignedTo = null;
    await asset.save();

    request.status = "Released";
    request.releasedAt = new Date();
    await request.save();

    const populated = await populateRequest(request);
    res.json({
      message: "Asset released successfully and is available again",
      request: populated
    });
  } catch (error) {
    next(error);
  }
};
