import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const seed = async () => {
  await connectDB();

  const email = "admin@assetportal.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  const password = await bcrypt.hash("Admin@123", 10);

  await User.create({
    userId: "USR001",
    name: "System Admin",
    email,
    password,
    role: "admin"
  });

  console.log("Admin created:");
  console.log("Email: admin@assetportal.com");
  console.log("Password: Admin@123");
  process.exit(0);
};

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
