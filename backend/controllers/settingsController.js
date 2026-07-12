const asyncHandler = require("express-async-handler");
const Settings = require("../models/Settings");

// @desc    Get public site settings (WhatsApp number, phone, stats, etc.)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json({ success: true, data: settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();

  const updatableFields = [
    "whatsappNumber",
    "companyPhone",
    "companyEmail",
    "companyAddress",
    "businessHours",
    "facebookUrl",
    "instagramUrl",
    "twitterUrl",
    "stats",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  const updatedSettings = await settings.save();
  res.json({ success: true, data: updatedSettings });
});

module.exports = { getSettings, updateSettings };
