import api from "./api";

export const getServices = async (params = {}) => {
  const { data } = await api.get("/services", { params });
  return data;
};

export const getServiceBySlug = async (slug) => {
  const { data } = await api.get(`/services/${slug}`);
  return data;
};