import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  userId: user.userId,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department || ""
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "Name, email, password and department are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const count = await User.countDocuments();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: `USR${String(count + 1).padStart(3, "0")}`,
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role: "faculty",
      department: department.trim()
    });

    const token = signToken(user._id);

    res.status(201).json({
      message: "Faculty registration successful",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
