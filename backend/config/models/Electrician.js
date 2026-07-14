const mongoose = require("mongoose");

const electricianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Electrician name is required"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    serviceAreas: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ServiceArea",
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "off-duty"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Electrician", electricianSchema);
