require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Admin.deleteOne({
      email: "admin@electricalservices.pk",
    });

    await Admin.create({
      name: "Super Admin",
      email: "admin@electricalservices.pk",
      password: "Admin@123",
      role: "superadmin",
      isActive: true,
    });

    console.log("Admin recreated successfully");
    console.log("Email: admin@electricalservices.pk");
    console.log("Password: Admin@123");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetAdmin();