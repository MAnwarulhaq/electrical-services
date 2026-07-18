const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Booking = require("../models/Booking");

const generateUserToken = require("../utils/generateUserToken");


// ======================================
// Register User
// POST /api/users/register
// Public
// ======================================
const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    mobileNumber,
    password,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !mobileNumber ||
    !password
  ) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const phoneExists = await User.findOne({
    mobileNumber,
  });

  if (phoneExists) {
    res.status(400);
    throw new Error("Mobile number already registered");
  }

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
  });

  const token = generateUserToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: user,
  });
});


// ======================================
// Login User
// POST /api/users/login
// Public
// ======================================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
//   consolo.log("Login request received:", { email, password }); // Debugging line

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const matched = await user.matchPassword(password);

  if (!matched) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateUserToken(user._id);

  res.json({
    success: true,
    token,
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profileImage: user.profileImage,
      address: user.address,
    },
  });
});


// ======================================
// Get Profile
// GET /api/users/profile
// Private
// ======================================
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});


// ======================================
// Update Profile
// PUT /api/users/profile
// Private
// ======================================
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.fullName =
    req.body.fullName || user.fullName;

  user.mobileNumber =
    req.body.mobileNumber ||
    user.mobileNumber;

  user.address =
    req.body.address ??
    user.address;

  user.profileImage =
    req.body.profileImage ??
    user.profileImage;

  if (
    req.body.email &&
    req.body.email !== user.email
  ) {
    const emailExists = await User.findOne({
      email: req.body.email,
      _id: { $ne: user._id },
    });

    if (emailExists) {
      res.status(400);
      throw new Error("Email already exists");
    }

    user.email = req.body.email;
  }

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});


// ======================================
// Change Password
// PUT /api/users/change-password
// Private
// ======================================
const changePassword = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  if (
    !currentPassword ||
    !newPassword
  ) {
    res.status(400);
    throw new Error("Both passwords are required");
  }

  const user = await User.findById(req.user._id).select("+password");

  const matched = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!matched) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;

  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});


// ======================================
// My Bookings
// GET /api/users/bookings
// Private
// ======================================
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  })
    .populate("service", "name")
    .populate("area", "name")
    .populate(
      "assignedElectrician",
      "name mobileNumber"
    )
    .sort({
      createdAt: -1,
    });

  res.json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});


// ======================================
// Delete Account
// DELETE /api/users/profile
// Private
// ======================================
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getMyBookings,
  deleteAccount,
};