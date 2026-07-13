require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await Admin.findOne({
      email: "admin@electricalservices.pk",
    });

    if (!admin) {
      console.log("Admin not found");
      process.exit(1);
    }

    // Plain password assign karein.
    // Admin model ka pre-save middleware ise hash karega.
    admin.password = "Admin@123";
    admin.isActive = true;

    await admin.save();

    console.log("Password reset successfully");
    console.log("Email: admin@electricalservices.pk");
    console.log("Password: Admin@123");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();