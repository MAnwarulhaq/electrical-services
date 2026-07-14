const mongoose = require("mongoose");

const serviceAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Area name is required"],
      trim: true,
      unique: true,
    },
    city: {
      type: String,
      default: "Karachi",
      trim: true,
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

module.exports = mongoose.model("ServiceArea", serviceAreaSchema);
