const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc    Login admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  // Clean input
  email = email?.trim().toLowerCase();
  password = password?.trim();

  console.log("Login request email:", email);

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Password is select:false in Admin model,
  // so explicitly include it for authentication
  const admin = await Admin.findOne({ email }).select("+password");

  console.log(
    "Admin found:",
    admin ? admin.email : "No admin found"
  );

  if (!admin || !admin.isActive) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await admin.matchPassword(password);

  console.log("Admin active:", admin.isActive);
  console.log("Password matched:", isMatch);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Successful login
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

// @desc    Get logged-in admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});

module.exports = {
  loginAdmin,
  getAdminProfile,
};