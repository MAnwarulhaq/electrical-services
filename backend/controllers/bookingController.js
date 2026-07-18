const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const ServiceArea = require("../models/ServiceArea");
const generateBookingId = require("../utils/generateBookingId");

// @desc    Create a new booking (public)
// @route   POST /api/bookings
// @access  Public
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)

const createBooking = asyncHandler(async (req, res) => {
  console.log("===== CREATE BOOKING =====");
  console.log("Authenticated User:", req.user);

  // Check authenticated user
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const {
    fullName,
    mobileNumber,
    whatsappNumber,
    email,
    address,
    area,
    service,
    preferredDate,
    preferredTime,
    problemDescription,
    serviceType,
  } = req.body;

  // Validation
  if (
    !fullName ||
    !mobileNumber ||
    !whatsappNumber ||
    !address ||
    !area ||
    !service ||
    !preferredDate ||
    !preferredTime
  ) {
    res.status(400);
    throw new Error("Please fill all required booking fields");
  }

  // Check service exists
  const serviceExists = await Service.findById(service);

  if (!serviceExists) {
    res.status(404);
    throw new Error("Selected service not found");
  }

  // Check area exists
  const areaExists = await ServiceArea.findById(area);

  if (!areaExists) {
    res.status(404);
    throw new Error("Selected area not found");
  }

  // Generate booking id
  const bookingId = await generateBookingId();

  // Create booking
  const booking = await Booking.create({
    user: req.user._id,

    bookingId,

    fullName,
    mobileNumber,
    whatsappNumber,
    email: email || "",

    address,

    area,
    service,

    preferredDate,
    preferredTime,

    problemDescription: problemDescription || "",

    serviceType:
      serviceType === "emergency"
        ? "emergency"
        : "normal",
  });

  // Populate response
  const populatedBooking = await Booking.findById(booking._id)
    .populate("service", "name startingPrice")
    .populate("area", "name")
    .populate("user", "fullName email mobileNumber");

  console.log("Generated Booking ID:", bookingId);
  console.log("Populated Booking:", populatedBooking);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: populatedBooking,
  });
});


// @desc    Track a booking by Booking ID (public, limited info)
// @route   GET /api/bookings/track/:bookingId
// @access  Public
const trackBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    bookingId: req.params.bookingId,
  })
    .populate("service", "name")
    .populate("area", "name")
    .populate("assignedElectrician", "name mobileNumber availabilityStatus");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found. Please check your Booking ID.");
  }

  // Only return non-sensitive info for public tracking
  res.json({
    success: true,
    data: {
      bookingId: booking.bookingId,
      customerName: booking.fullName,
      service: booking.service?.name,
      area: booking.area?.name,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      status: booking.status,
      serviceType: booking.serviceType,
      assignedElectrician: booking.assignedElectrician
        ? {
          name: booking.assignedElectrician.name,
          status: booking.assignedElectrician.availabilityStatus,
        }
        : null,
      createdAt: booking.createdAt,
    },
  });
});

// @desc    Get all bookings with filters (admin)
// @route   GET /api/bookings
// @access  Private
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, area, service, date, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (area) filter.area = area;
  if (service) filter.service = service;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.preferredDate = { $gte: start, $lte: end };
  }
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { mobileNumber: { $regex: search, $options: "i" } },
      { bookingId: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate("service", "name startingPrice")
      .populate("area", "name")
      .populate("assignedElectrician", "name mobileNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: bookings.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: bookings,
  });
});

// @desc    Get single booking details (admin)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("service", "name startingPrice")
    .populate("area", "name")
    .populate("assignedElectrician", "name mobileNumber whatsappNumber");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  res.json({ success: true, data: booking });
});

// @desc    Update booking status, assigned electrician, or admin notes
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const { status, assignedElectrician, adminNotes } = req.body;

  if (status !== undefined) booking.status = status;
  if (assignedElectrician !== undefined) booking.assignedElectrician = assignedElectrician;
  if (adminNotes !== undefined) booking.adminNotes = adminNotes;

  const updatedBooking = await booking.save();
  const populated = await Booking.findById(updatedBooking._id)
    .populate("service", "name")
    .populate("area", "name")
    .populate("assignedElectrician", "name mobileNumber");

  res.json({ success: true, data: populated });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  await booking.deleteOne();
  res.json({ success: true, message: "Booking deleted successfully" });
});

module.exports = {
  createBooking,
  trackBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
