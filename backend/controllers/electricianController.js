const asyncHandler = require("express-async-handler");
const Electrician = require("../models/Electrician");

// @desc    Get all electricians (admin)
// @route   GET /api/electricians
// @access  Private
const getElectricians = asyncHandler(async (req, res) => {
  const electricians = await Electrician.find()
    .populate("serviceAreas", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: electricians.length, data: electricians });
});

// @desc    Get single electrician
// @route   GET /api/electricians/:id
// @access  Private
const getElectricianById = asyncHandler(async (req, res) => {
  const electrician = await Electrician.findById(req.params.id).populate(
    "serviceAreas",
    "name"
  );

  if (!electrician) {
    res.status(404);
    throw new Error("Electrician not found");
  }

  res.json({ success: true, data: electrician });
});

// @desc    Create electrician
// @route   POST /api/electricians
// @access  Private
const createElectrician = asyncHandler(async (req, res) => {
  const {
    name,
    mobileNumber,
    whatsappNumber,
    specialization,
    serviceAreas,
    yearsOfExperience,
  } = req.body;

  if (!name || !mobileNumber || !whatsappNumber) {
    res.status(400);
    throw new Error("Name, mobile number, and WhatsApp number are required");
  }

  const photo = req.file ? `/uploads/${req.file.filename}` : "";

  const electrician = await Electrician.create({
    name,
    mobileNumber,
    whatsappNumber,
    specialization: specialization || [],
    serviceAreas: serviceAreas || [],
    yearsOfExperience: yearsOfExperience || 0,
    photo,
  });

  res.status(201).json({ success: true, data: electrician });
});

// @desc    Update electrician
// @route   PUT /api/electricians/:id
// @access  Private
const updateElectrician = asyncHandler(async (req, res) => {
  const electrician = await Electrician.findById(req.params.id);

  if (!electrician) {
    res.status(404);
    throw new Error("Electrician not found");
  }

  const updatableFields = [
    "name",
    "mobileNumber",
    "whatsappNumber",
    "specialization",
    "serviceAreas",
    "availabilityStatus",
    "isActive",
    "yearsOfExperience",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      electrician[field] = req.body[field];
    }
  });

  if (req.file) {
    electrician.photo = `/uploads/${req.file.filename}`;
  }

  const updatedElectrician = await electrician.save();
  res.json({ success: true, data: updatedElectrician });
});

// @desc    Delete electrician
// @route   DELETE /api/electricians/:id
// @access  Private
const deleteElectrician = asyncHandler(async (req, res) => {
  const electrician = await Electrician.findById(req.params.id);

  if (!electrician) {
    res.status(404);
    throw new Error("Electrician not found");
  }

  await electrician.deleteOne();
  res.json({ success: true, message: "Electrician deleted successfully" });
});

module.exports = {
  getElectricians,
  getElectricianById,
  createElectrician,
  updateElectrician,
  deleteElectrician,
};
