const express = require("express");
const router = express.Router();

const {
  createBooking,
  trackBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// Admin Middleware
const { protect } = require("../middleware/authMiddleware");

// User Middleware
const { userProtect } = require("../middleware/userAuthMiddleware");

// ====================================
// User Routes
// ====================================

// User must be logged in to create booking
router.post("/", userProtect, createBooking);

// Public booking tracking
router.get("/track/:bookingId", trackBooking);

// ====================================
// Admin Routes
// ====================================

// Get all bookings
router.get("/", protect, getAllBookings);

// Get booking details
router.get("/:id", protect, getBookingById);

// Update booking
router.put("/:id", protect, updateBooking);

// Delete booking
router.delete("/:id", protect, deleteBooking);

module.exports = router;