const asyncHandler = require("express-async-handler");
const Service = require("../models/Service");
const slugify = require("../utils/slugify");

// @desc    Get all active services (public)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const { category, popular, emergency } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (popular === "true") filter.isPopular = true;
  if (emergency === "true") filter.isEmergency = true;

  const services = await Service.find(filter)
    .populate("availableAreas", "name")
    .sort({ displayOrder: 1, createdAt: -1 });

  res.json({ success: true, count: services.length, data: services });
});

// @desc    Get single service by slug (public)
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("availableAreas", "name");

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  res.json({ success: true, data: service });
});

// @desc    Get ALL services including inactive (admin)
// @route   GET /api/services/admin/all
// @access  Private
const getAllServicesAdmin = asyncHandler(async (req, res) => {
  const services = await Service.find()
    .populate("availableAreas", "name")
    .sort({ displayOrder: 1, createdAt: -1 });

  res.json({ success: true, count: services.length, data: services });
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const {
    name,
    shortDescription,
    fullDescription,
    whatsIncluded,
    icon,
    startingPrice,
    estimatedTime,
    availableAreas,
    category,
    isEmergency,
    isPopular,
    displayOrder,
  } = req.body;

  if (!name || !shortDescription || !fullDescription || !startingPrice || !estimatedTime) {
    res.status(400);
    throw new Error("Please fill all required service fields");
  }

  let slug = slugify(name);
  const slugExists = await Service.findOne({ slug });
  if (slugExists) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";

  const service = await Service.create({
    name,
    slug,
    shortDescription,
    fullDescription,
    whatsIncluded: whatsIncluded || [],
    icon,
    image,
    startingPrice,
    estimatedTime,
    availableAreas: availableAreas || [],
    category,
    isEmergency: isEmergency || false,
    isPopular: isPopular || false,
    displayOrder: displayOrder || 0,
  });

  res.status(201).json({ success: true, data: service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  const updatableFields = [
    "name",
    "shortDescription",
    "fullDescription",
    "whatsIncluded",
    "icon",
    "startingPrice",
    "estimatedTime",
    "availableAreas",
    "category",
    "isEmergency",
    "isPopular",
    "isActive",
    "displayOrder",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      service[field] = req.body[field];
    }
  });

  // If name changed, regenerate slug
  if (req.body.name && req.body.name !== service.name) {
    let newSlug = slugify(req.body.name);
    const slugExists = await Service.findOne({
      slug: newSlug,
      _id: { $ne: service._id },
    });
    if (slugExists) {
      newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
    }
    service.slug = newSlug;
  }

  if (req.file) {
    service.image = `/uploads/${req.file.filename}`;
  }

  const updatedService = await service.save();
  res.json({ success: true, data: updatedService });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  await service.deleteOne();
  res.json({ success: true, message: "Service deleted successfully" });
});

// @desc    Toggle service active/inactive
// @route   PATCH /api/services/:id/toggle
// @access  Private
const toggleServiceStatus = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  service.isActive = !service.isActive;
  await service.save();

  res.json({ success: true, data: service });
});

module.exports = {
  getServices,
  getServiceBySlug,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
};
