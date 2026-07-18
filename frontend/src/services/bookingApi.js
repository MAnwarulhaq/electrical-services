import api from "./api";

// Create Booking
export const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);
  return data;
};

// Track Booking
export const trackBooking = async (bookingId) => {
  const { data } = await api.get(`/bookings/track/${bookingId}`);
  return data;
};

// Get All Bookings (Admin)
export const getBookings = async () => {
  const { data } = await api.get("/bookings");
  return data;
};

// Get Single Booking
export const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

// Update Booking Status
export const updateBookingStatus = async (id, status) => {
  const { data } = await api.put(`/bookings/${id}/status`, {
    status,
  });
  return data;
};

// Delete Booking
export const deleteBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};