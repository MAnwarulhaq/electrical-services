const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getMonthlyBookingsChart,
  getBookingStatusChart,
  getPopularServicesChart,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/charts/monthly-bookings", getMonthlyBookingsChart);
router.get("/charts/booking-status", getBookingStatusChart);
router.get("/charts/popular-services", getPopularServicesChart);

module.exports = router;
