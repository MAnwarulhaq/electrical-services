import api from "./api";

// Public - Send contact message
export const sendContactMessage = async (contactData) => {
  const response = await api.post("/contact", contactData);
  return response.data;
};

// Admin - Get all contact messages
export const getContactMessages = async (isRead) => {
  const params = {};

  if (isRead !== undefined && isRead !== "all") {
    params.isRead = isRead;
  }

  const response = await api.get("/contact", {
    params,
  });

  return response.data;
};

// Admin - Toggle message read/unread
export const toggleMessageRead = async (id) => {
  const response = await api.patch(`/contact/${id}/read`);
  return response.data;
};

// Admin - Delete contact message
export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};