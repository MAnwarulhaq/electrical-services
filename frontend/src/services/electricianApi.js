import api from "./api";

// Get all electricians
export const getElectricians = async () => {
  const response = await api.get("/electricians");
  return response.data;
};

// Get single electrician
export const getElectricianById = async (id) => {
  const response = await api.get(`/electricians/${id}`);
  return response.data;
};

// Create electrician
export const createElectrician = async (formData) => {
  const response = await api.post("/electricians", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Update electrician
export const updateElectrician = async (id, formData) => {
  const response = await api.put(`/electricians/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Update electrician availability/status
export const updateElectricianStatus = async (id, data) => {
  const response = await api.put(`/electricians/${id}`, data);
  return response.data;
};

// Delete electrician
export const deleteElectrician = async (id) => {
  const response = await api.delete(`/electricians/${id}`);
  return response.data;
};