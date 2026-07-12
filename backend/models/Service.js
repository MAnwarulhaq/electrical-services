const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 200,
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
    },
    whatsIncluded: {
      type: [String],
      default: [],
    },
    icon: {
      type: String, // react-icon name, e.g. "FaBolt"
      default: "FaBolt",
    },
    image: {
      type: String, // uploaded image path or URL
      default: "",
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: 0,
    },
    estimatedTime: {
      type: String, // e.g. "30-60 mins"
      required: [true, "Estimated time is required"],
    },
    availableAreas: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ServiceArea",
      default: [],
    },
    category: {
      type: String,
      enum: ["residential", "commercial", "emergency"],
      default: "residential",
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ name: "text", shortDescription: "text" });

module.exports = mongoose.model("Service", serviceSchema);
