import Department from "../models/Department.js";

const buildDepartmentId = async () => {
  const count = await Department.countDocuments();
  return `DEPT${String(count + 1).padStart(3, "0")}`;
};

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ departmentName: 1 });
    res.json({ count: departments.length, departments });
  } catch (error) {
    next(error);
  }
};

export const getPublicDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .select("_id departmentName")
      .sort({ departmentName: 1 });
    res.json({ count: departments.length, departments });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { departmentName, HODName, assetId, allocationDate } = req.body;

    if (!departmentName || !HODName) {
      return res.status(400).json({
        message: "departmentName and HODName are required"
      });
    }

    const duplicate = await Department.findOne({ departmentName });
    if (duplicate) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      departmentId: await buildDepartmentId(),
      departmentName,
      HODName,
      assetId: assetId || "",
      allocationDate: allocationDate || new Date()
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department updated successfully", department });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (department.departmentName) {
      const Asset = (await import("../models/Asset.js")).default;
      await Asset.updateMany(
        { department: department.departmentName },
        { $set: { department: "Unassigned", assetStatus: "Available", assignedTo: null } }
      );

      const User = (await import("../models/User.js")).default;
      await User.updateMany(
        { department: department.departmentName, role: "faculty" },
        { $set: { department: "" } }
      );
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};
