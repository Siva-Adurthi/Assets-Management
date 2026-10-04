import bcrypt from "bcryptjs";
import User from "../models/User.js";

const buildUserId = async () => {
  const count = await User.countDocuments();
  return `USR${String(count + 1).padStart(3, "0")}`;
};

const normalizeDepartment = value =>
  typeof value === "string" ? value.trim() : "";

const sanitize = user => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "faculty" } = req.body;
    const department = normalizeDepartment(req.body.department);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    if (!["admin", "faculty"].includes(role)) {
      return res.status(400).json({ message: "role must be admin or faculty" });
    }

    if (role === "faculty" && !department) {
      return res.status(400).json({ message: "Department is required for faculty accounts" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      userId: await buildUserId(),
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      role,
      department: role === "faculty" ? department : ""
    });

    res.status(201).json({
      message: `${role === "admin" ? "Admin" : "Faculty"} account created`,
      user: sanitize(user)
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const nextRole = req.body.role ?? user.role;
    if (!["admin", "faculty"].includes(nextRole)) {
      return res.status(400).json({ message: "role must be admin or faculty" });
    }

    if (String(req.user._id) === String(req.params.id) && req.body.role && req.body.role !== user.role) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const department = req.body.department !== undefined
      ? normalizeDepartment(req.body.department)
      : normalizeDepartment(user.department);

    if (nextRole === "faculty" && !department) {
      return res.status(400).json({ message: "Department is required for faculty accounts" });
    }

    user.role = nextRole;
    user.department = nextRole === "faculty" ? department : "";
    await user.save();

    res.json({ message: "User updated successfully", user: sanitize(user) });
  } catch (error) {
    next(error);
  }
};

export const updateRole = updateUser;
