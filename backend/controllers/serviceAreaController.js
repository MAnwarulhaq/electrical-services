const asyncHandler = require("express-async-handler");
const ServiceArea = require("../models/ServiceArea");

// @desc    Get all active service areas (public)
// @route   GET /api/areas
// @access  Public
const getServiceAreas = asyncHandler(async (req, res) => {
  const areas = await ServiceArea.find({ isActive: true }).sort({
    displayOrder: 1,
    name: 1,
  });
  res.json({ success: true, count: areas.length, data: areas });
});

// @desc    Get all service areas including inactive (admin)
// @route   GET /api/areas/admin/all
// @access  Private
const getAllServiceAreasAdmin = asyncHandler(async (req, res) => {
  const areas = await ServiceArea.find().sort({ displayOrder: 1, name: 1 });
  res.json({ success: true, count: areas.length, data: areas });
});

// @desc    Create a service area
// @route   POST /api/areas
// @access  Private
const createServiceArea = asyncHandler(async (req, res) => {
  const { name, city, displayOrder } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Area name is required");
  }

  const exists = await ServiceArea.findOne({ name: name.trim() });
  if (exists) {
    res.status(400);
    throw new Error("This area already exists");
  }

  const area = await ServiceArea.create({
    name: name.trim(),
    city: city || "Karachi",
    displayOrder: displayOrder || 0,
  });

  res.status(201).json({ success: true, data: area });
});

// @desc    Update a service area
// @route   PUT /api/areas/:id
// @access  Private
const updateServiceArea = asyncHandler(async (req, res) => {
  const area = await ServiceArea.findById(req.params.id);

  if (!area) {
    res.status(404);
    throw new Error("Service area not found");
  }

  const { name, city, isActive, displayOrder } = req.body;

  if (name !== undefined) area.name = name;
  if (city !== undefined) area.city = city;
  if (isActive !== undefined) area.isActive = isActive;
  if (displayOrder !== undefined) area.displayOrder = displayOrder;

  const updatedArea = await area.save();
  res.json({ success: true, data: updatedArea });
});

// @desc    Delete a service area
// @route   DELETE /api/areas/:id
// @access  Private
const deleteServiceArea = asyncHandler(async (req, res) => {
  const area = await ServiceArea.findById(req.params.id);

  if (!area) {
    res.status(404);
    throw new Error("Service area not found");
  }

  await area.deleteOne();
  res.json({ success: true, message: "Service area deleted successfully" });
});

module.exports = {
  getServiceAreas,
  getAllServiceAreasAdmin,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
};
