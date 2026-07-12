const Booking = require("../models/Booking");

/**
 * Generates a unique, human-friendly booking ID like: ES-20260712-4831
 * Retries in the rare case of a collision.
 */
const generateBookingId = async () => {
  const today = new Date();
  const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(today.getDate()).padStart(2, "0")}`;

  let bookingId;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    bookingId = `ES-${datePart}-${randomPart}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Booking.exists({ bookingId });
    attempts += 1;
  }

  if (exists) {
    throw new Error("Could not generate a unique booking ID, please try again.");
  }

  return bookingId;
};

module.exports = generateBookingId;
