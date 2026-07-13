import api from "./api";

export const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);
  return data;
};

export const trackBooking = async (bookingId) => {
  const { data } = await api.get(
    `/bookings/track/${encodeURIComponent(bookingId)}`
  );

  return data;
};