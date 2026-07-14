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
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/", createBooking);
router.get("/track/:bookingId", trackBooking);

// Admin
router.get("/", protect, getAllBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
