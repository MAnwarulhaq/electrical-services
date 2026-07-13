import api from "./api";

export const sendContactMessage = async (contactData) => {
  const { data } = await api.post("/contact", contactData);
  return data;
};