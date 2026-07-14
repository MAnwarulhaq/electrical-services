const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const ContactMessage = require("../models/ContactMessage");

// @desc    Get dashboard overview statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [
    totalBookings,
    todaysBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    totalServices,
    unreadMessages,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ createdAt: { $gte: startOfToday, $lte: endOfToday } }),
    Booking.countDocuments({ status: "Pending" }),
    Booking.countDocuments({ status: "Completed" }),
    Booking.countDocuments({ status: "Cancelled" }),
    Service.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
  ]);

  res.json({
    success: true,
    data: {
      totalBookings,
      todaysBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalServices,
      unreadMessages,
    },
  });
});

// @desc    Get monthly bookings chart data (last 6 months)
// @route   GET /api/dashboard/charts/monthly-bookings
// @access  Private
const getMonthlyBookingsChart = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const results = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const data = results.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    bookings: r.count,
  }));

  res.json({ success: true, data });
});

// @desc    Get booking status distribution chart data
// @route   GET /api/dashboard/charts/booking-status
// @access  Private
const getBookingStatusChart = asyncHandler(async (req, res) => {
  const results = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const data = results.map((r) => ({ status: r._id, count: r.count }));
  res.json({ success: true, data });
});

// @desc    Get most popular services chart data (by booking count)
// @route   GET /api/dashboard/charts/popular-services
// @access  Private
const getPopularServicesChart = asyncHandler(async (req, res) => {
  const results = await Booking.aggregate([
    { $group: { _id: "$service", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: "services",
        localField: "_id",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    { $unwind: { path: "$serviceInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        service: { $ifNull: ["$serviceInfo.name", "Unknown Service"] },
        count: 1,
      },
    },
  ]);

  res.json({ success: true, data: results });
});

module.exports = {
  getDashboardStats,
  getMonthlyBookingsChart,
  getBookingStatusChart,
  getPopularServicesChart,
};
