require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected DB:", mongoose.connection.name);

    const email = "admin@electricalservices.pk";
    const newPassword = "Admin@123";

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Admin not found");
      return;
    }

    // Model pre-save hook plain password ko hash karega
    admin.password = newPassword;
    admin.isActive = true;

    await admin.save();

    // Database se password dobara load karo
    const updatedAdmin = await Admin.findOne({ email }).select("+password");

    const passwordMatches = await bcrypt.compare(
      newPassword,
      updatedAdmin.password
    );

    console.log("Email:", updatedAdmin.email);
    console.log("Active:", updatedAdmin.isActive);
    console.log("Password verification:", passwordMatches);
  } catch (error) {
    console.error("Reset error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

resetAdminPassword();