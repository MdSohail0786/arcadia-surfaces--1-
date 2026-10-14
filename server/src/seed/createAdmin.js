import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("[create-admin] ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`[create-admin] User already exists for ${email} — no changes made.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await User.hashPassword(password);
  await User.create({
    name: "Site Admin",
    email: email.toLowerCase(),
    passwordHash,
    role: "admin",
  });

  console.log(`[create-admin] Admin user created for ${email}.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[create-admin] failed:", err);
  process.exit(1);
});
