const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      default: "923001234567",
    },
    companyPhone: {
      type: String,
      default: "+923001234567",
    },
    companyEmail: {
      type: String,
      default: "info@electricalservices.pk",
    },
    companyAddress: {
      type: String,
      default: "Karachi, Pakistan",
    },
    businessHours: {
      type: String,
      default: "Mon - Sun: 8:00 AM - 10:00 PM",
    },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    stats: {
      happyCustomers: { type: Number, default: 5000 },
      completedJobs: { type: Number, default: 8000 },
      yearsOfExperience: { type: Number, default: 10 },
      areasCovered: { type: Number, default: 20 },
    },
  },
  { timestamps: true }
);

// Ensure only a single settings document ever exists
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
