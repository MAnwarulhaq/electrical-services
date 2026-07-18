import api from "./api";

export const sendContactMessage = (data) => {
  return api.post("/contact", data);
};

export const getContactMessages = () => {
  return api.get("/contact");
};

export const toggleMessageRead = (id) => {
  return api.patch(`/contact/${id}/read`);
};

export const deleteContactMessage = (id) => {
  return api.delete(`/contact/${id}`);
};

export const replyToContactMessage = (id, data) => {
  return api.post(`/contact/${id}/reply`, data);
};