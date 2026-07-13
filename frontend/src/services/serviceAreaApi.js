import api from "./api";

export const getServiceAreas = async () => {
  const { data } = await api.get("/areas");
  return data;
};