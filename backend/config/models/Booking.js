const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      required: [true, "Complete address is required"],
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceArea",
      required: [true, "Karachi area is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    problemDescription: {
      type: String,
      default: "",
    },
    serviceType: {
      type: String,
      enum: ["normal", "emergency"],
      default: "normal",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Electrician Assigned",
        "On the Way",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    assignedElectrician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Electrician",
      default: null,
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
