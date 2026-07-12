/**
 * Run this script ONCE to create the first admin account.
 * Usage: npm run seed:admin
 *
 * It reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from your .env file.
 * If an admin with that email already exists, it will not create a duplicate.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error(
        "Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in your .env file."
      );
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingAdmin) {
      console.log(`Admin with email "${ADMIN_EMAIL}" already exists. Skipping.`);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("=================================");
    console.log("First admin account created successfully!");
    console.log(`Name:  ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log("Please log in and change the password if needed.");
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
