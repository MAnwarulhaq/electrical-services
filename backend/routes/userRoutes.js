const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getMyBookings,
  deleteAccount,
} = require("../controllers/userController");

const { userProtect } = require("../middleware/userAuthMiddleware");
// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private
router.get("/profile", userProtect, getProfile);
router.put("/profile", userProtect, updateProfile);
router.put("/change-password", userProtect, changePassword);
router.get("/bookings", userProtect, getMyBookings);
router.delete("/profile", userProtect, deleteAccount);

module.exports = router;